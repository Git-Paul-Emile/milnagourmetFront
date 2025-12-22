import React from 'react';
import { Shield } from 'lucide-react';
import { ADMIN_LOGIN_CONSTANTS } from '@/constants/adminLogin';

export function AdminLoginHeader() {
  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
        <Shield className="h-8 w-8 text-primary-foreground" />
      </div>
      <h1 className="text-3xl font-bold text-foreground mb-2">{ADMIN_LOGIN_CONSTANTS.TITLE}</h1>
      <p className="text-muted-foreground">{ADMIN_LOGIN_CONSTANTS.SUBTITLE}</p>
    </div>
  );
}