// Google OAuth using redirect flow (NO fetch - avoids CORS)
export const googleAuth = {
    // Redirect to backend OAuth endpoint
    initiateLogin: () => {
        const backendUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!backendUrl) {
            throw new Error('NEXT_PUBLIC_API_URL is not defined');
        }
        // Full page redirect - NO CORS issues
        window.location.href = `${backendUrl}/api/auth/google/`;
    }
};
