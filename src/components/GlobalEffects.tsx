import React from 'react';
import { useTheme } from '@/hooks/useTheme';
import ChristmasSnow from './ChristmasSnow';

export function GlobalEffects() {
  const { theme } = useTheme();
  const isChristmasTheme = theme?.name === 'Noël';

  return (
    <>
      {isChristmasTheme && <ChristmasSnow />}
    </>
  );
}