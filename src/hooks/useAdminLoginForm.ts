import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AdminLoginFormData } from '@/types/adminLogin';
import { ADMIN_LOGIN_CONSTANTS } from '@/constants/adminLogin';

interface FieldErrors {
  telephone?: string;
  password?: string;
}

export function useAdminLoginForm() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<AdminLoginFormData>({
    telephone: '',
    password: ''
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const validateForm = (): boolean => {
    const errors: FieldErrors = {};

    if (!formData.telephone.trim()) {
      errors.telephone = 'Le téléphone est requis';
    }

    if (!formData.password.trim()) {
      errors.password = 'Le mot de passe est requis';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    if (!validateForm()) {
      return;
    }

    try {
      await login({
        telephone: formData.telephone,
        password: formData.password
      });
      navigate('/dashboard');
    } catch (err: unknown) {
      // For backend errors, set global error or parse if possible
      const message = err instanceof Error ? err.message : ADMIN_LOGIN_CONSTANTS.ERROR_DEFAULT_MESSAGE;
      // Could parse message to set field errors, but for now set global
      setFieldErrors({ telephone: message }); // or password, but since it's login, maybe global
    }
  };

  const handleInputChange = (field: keyof AdminLoginFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setFieldErrors(prev => ({ ...prev, [field]: '' }));
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return {
    formData,
    fieldErrors,
    showPassword,
    isLoading,
    handleSubmit,
    handleInputChange,
    toggleShowPassword,
  };
}