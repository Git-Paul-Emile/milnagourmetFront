import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ADMIN_LOGIN_CONSTANTS } from '@/constants/adminLogin';

export function AdminLoginFooter() {
  const navigate = useNavigate();

  return (
    <>
      {/* Back to site */}
      <div className="mt-6 text-center">
        <button
          onClick={() => navigate('/')}
          className="text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          {ADMIN_LOGIN_CONSTANTS.BACK_TO_SITE_TEXT}
        </button>
      </div>

      {/* Footer */}
      <div className="text-center mt-8">
        <p className="text-xs text-muted-foreground">
          {ADMIN_LOGIN_CONSTANTS.FOOTER_TEXT}
        </p>
      </div>
    </>
  );
}