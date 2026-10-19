import { QrCode, Download, Globe, Percent } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { StatCard } from './StatCard';
import { usePwaStats } from '../hooks/usePwaStats';

/** Installations de l'application, séparées selon l'arrivée via QR code ou non. */
export function PwaInstallStats() {
  const { data, isLoading, isError, refetch } = usePwaStats();

  return (
    <section aria-labelledby="titre-stats-pwa">
      <h3 id="titre-stats-pwa" className="text-lg font-semibold mb-4">Installations de l'application</h3>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-28 rounded-lg" />)}
        </div>
      )}

      {isError && (
        <div className="flex items-center justify-between rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm">
          <span>Impossible de charger les statistiques d'installation.</span>
          <button
            type="button"
            onClick={() => void refetch()}
            className="rounded-md bg-button px-3 py-1.5 font-medium text-button-foreground hover:bg-button-hover"
          >
            Réessayer
          </button>
        </div>
      )}

      {data && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Scans du QR code" value={data.scansQrCode} icon={QrCode} color="hover:shadow-blue-500/10" />
            <StatCard title="Installées via QR code" value={data.installationsQrCode} icon={Download} color="hover:shadow-green-500/10" />
            <StatCard title="Installées sans QR code" value={data.installationsDirectes} icon={Globe} color="hover:shadow-indigo-500/10" />
            <StatCard
              title="Scans convertis en installation"
              value={data.scansQrCode > 0 ? `${Math.round((data.installationsQrCode / data.scansQrCode) * 100)} %` : '—'}
              icon={Percent}
              color="hover:shadow-purple-500/10"
            />
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Par appareil : {data.installationsParPlateforme.android} Android · {data.installationsParPlateforme.ios} iPhone/iPad · {data.installationsParPlateforme.autre} autre
          </p>
        </>
      )}
    </section>
  );
}
