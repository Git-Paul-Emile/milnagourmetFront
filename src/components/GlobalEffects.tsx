import React from 'react';
import { useTheme } from '@/hooks/useTheme';
import ChristmasSnow from './ChristmasSnow';
import NewYearEffects from './NewYearEffects';

export function GlobalEffects() {
  const { theme } = useTheme();
  const isChristmasTheme = theme?.name === 'Noël';
  const isNewYearTheme = theme?.name === 'Nouvel An';

  return (
    <>
      {isChristmasTheme && <ChristmasSnow />}
      {isNewYearTheme && <NewYearEffects />}
    </>
  );
}