import axios from 'axios';

export default function handleAxiosError(error: unknown) {
    if (axios.isAxiosError(error)) {
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
            console.error('Headers:', error.response.headers);
        } else if (error.request) {
            console.error('No response received:', error.request);
        } else {
            console.error('Non-Axios error:', error);
        }
    }
}