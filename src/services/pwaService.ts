import { httpClient } from './httpClient';

export type PwaEventType = 'SCAN' | 'INSTALLATION';
export type PwaSource = 'QRCODE' | 'DIRECT';
export type PwaPlateforme = 'ios' | 'android' | 'autre';

export interface PwaEvent {
  appareilId: string;
  type: PwaEventType;
  source: PwaSource;
  plateforme: PwaPlateforme;
}

export interface PwaStats {
  scansQrCode: number;
  installationsQrCode: number;
  installationsDirectes: number;
  installationsParPlateforme: Record<PwaPlateforme, number>;
}

export const pwaService = {
  async enregistrerEvenement(evenement: PwaEvent) {
    return httpClient.post('/api/pwa/events', evenement);
  },

  async getStats(): Promise<PwaStats> {
    const response = await httpClient.get<PwaStats>('/api/pwa/stats');
    return response.data as PwaStats;
  },
};
