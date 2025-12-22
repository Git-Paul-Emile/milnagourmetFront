import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AdminLoginFormData } from '@/types/adminLogin';
import { ADMIN_LOGIN_CONSTANTS } from '@/constants/adminLogin';

export function useAdminLoginForm() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<AdminLoginFormData>({
    telephone: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login({
        telephone: formData.telephone,
        password: formData.password
      });
      navigate('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : ADMIN_LOGIN_CONSTANTS.ERROR_DEFAULT_MESSAGE);
    }
  };

  const handleInputChange = (field: keyof AdminLoginFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return {
    formData,
    error,
    showPassword,
    isLoading,
    handleSubmit,
    handleInputChange,
    toggleShowPassword,
  };
}