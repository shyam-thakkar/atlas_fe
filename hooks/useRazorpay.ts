import { useState, useCallback } from 'react';
import { paymentService, VerifyPaymentPayload } from '@/lib/payment-service';
import { useAuth } from '@/context/AuthContext';
import { PaymentStatus } from '@/components/payment/PaymentStatusModal';

interface UseRazorpayResult {
    initiatePayment: (planType: string) => Promise<void>;
    isLoading: boolean;
    paymentStatus: PaymentStatus;
    paymentMessage: string;
    resetStatus: () => void;
}

export const useRazorpay = (): UseRazorpayResult => {
    const [isLoading, setIsLoading] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');
    const [paymentMessage, setPaymentMessage] = useState('');
    const { user, refreshUser } = useAuth();

    const resetStatus = useCallback(() => {
        setPaymentStatus('idle');
        setPaymentMessage('');
    }, []);

    const initiatePayment = useCallback(async (planType: string) => {
        setIsLoading(true);
        setPaymentStatus('idle');
        setPaymentMessage('');
        
        try {
            // 1. Create Order
            const order = await paymentService.createOrder(planType);

            // 2. Initialize Razorpay
            const options: RazorpayOptions = {
                key: order.key,
                amount: order.amount,
                currency: order.currency,
                name: 'AIFolio',
                description: 'Upgrade Plan',
                order_id: order.order_id,
                prefill: {
                    name: user?.name || '',
                    email: user?.email || '',
                },
                handler: async (response: RazorpayPaymentResponse) => {
                    try {
                        // 3. Verify Payment
                        const payload: VerifyPaymentPayload = {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        };
                        await paymentService.verifyPayment(payload);
                        
                        // 4. Refresh User Profile
                        await refreshUser();
                        
                        setPaymentStatus('success');
                        setPaymentMessage('Your payment was successful!');
                    } catch (error) {
                        console.error('Payment verification failed:', error);
                        setPaymentStatus('error');
                        setPaymentMessage('Payment verification failed. Please contact support.');
                    }
                },
                theme: {
                    color: '#7C3AED', // Violet-600
                },
                modal: {
                    ondismiss: () => {
                        console.log('Payment cancelled');
                        setPaymentStatus('cancelled');
                        setPaymentMessage('Payment cancelled by user.');
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', (response: any) => {
                console.error('Payment failed:', response.error);
                setPaymentStatus('error');
                setPaymentMessage(`Payment failed: ${response.error.description}`);
            });
            rzp.open();
        } catch (error) {
            console.error('Failed to initiate payment:', error);
            setPaymentStatus('error');
            setPaymentMessage('Failed to initiate payment. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    return { initiatePayment, isLoading, paymentStatus, paymentMessage, resetStatus };
};
