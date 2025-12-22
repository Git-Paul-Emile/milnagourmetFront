import React from 'react';

export function FooterSkeleton() {
  return (
    <footer className="bg-muted/50 border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="h-6 bg-gray-300 rounded w-32"></div>
              <div className="h-4 bg-gray-300 rounded w-48"></div>
              <div className="h-4 bg-gray-300 rounded w-40"></div>
            </div>
            <div className="space-y-4">
              <div className="h-6 bg-gray-300 rounded w-24"></div>
              <div className="h-4 bg-gray-300 rounded w-36"></div>
              <div className="h-4 bg-gray-300 rounded w-32"></div>
            </div>
            <div className="space-y-4">
              <div className="h-6 bg-gray-300 rounded w-28"></div>
              <div className="h-4 bg-gray-300 rounded w-44"></div>
              <div className="h-4 bg-gray-300 rounded w-38"></div>
            </div>
            <div className="space-y-4">
              <div className="h-6 bg-gray-300 rounded w-20"></div>
              <div className="h-4 bg-gray-300 rounded w-30"></div>
              <div className="h-4 bg-gray-300 rounded w-26"></div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}