import { useAuth } from '../contexts/AuthContext';

// Helper hook for getting auth headers
export const useAuthHeaders = () => {
    const { token } = useAuth();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};