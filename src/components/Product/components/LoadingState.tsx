import React from 'react';

export function LoadingState() {
  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 animate-fade-in" />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-background rounded-2xl max-w-md w-full p-8 border border-border">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Chargement des options...</p>
          </div>
        </div>
      </div>
    </>
  );
}