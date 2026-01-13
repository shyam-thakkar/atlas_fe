import { apiRequest } from './api';

export interface CreateOrderResponse {
    order_id: string;
    amount: number;
    currency: string;
    key: string;
}

export interface VerifyPaymentPayload {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}

export const paymentService = {
    async createOrder(planType: string): Promise<CreateOrderResponse> {
        return apiRequest<CreateOrderResponse>('/api/payments/create-order/', {
            method: 'POST',
            body: { plan_type: planType },
        });
    },

    async verifyPayment(payload: VerifyPaymentPayload): Promise<any> {
        return apiRequest('/api/payments/verify/', {
            method: 'POST',
            body: payload,
        });
    },
};
