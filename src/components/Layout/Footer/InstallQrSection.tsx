import { Smartphone } from 'lucide-react';

/**
 * QR code d'installation, affiché sur grand écran uniquement : sur
 * ordinateur aucune invite d'installation n'apparaît, le visiteur scanne
 * avec son téléphone et arrive directement sur l'invite (`/?installer=1`).
 */
export function InstallQrSection() {
  return (
    <div className="hidden lg:flex items-center gap-3 rounded-xl bg-white/95 p-3 shadow-lg">
      <img
        src="/images/qrcode-installation.svg"
        alt="QR code pour installer l'application Milna Gourmet sur votre téléphone"
        width={96}
        height={96}
        loading="lazy"
        className="h-24 w-24"
      />
      <div className="max-w-[9rem] text-left">
        <p className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
          <Smartphone className="h-4 w-4 text-primary" aria-hidden="true" />
          L'app sur mobile
        </p>
        <p className="mt-1 text-xs leading-snug text-muted-foreground">
          Scannez pour installer Milna Gourmet sur votre téléphone.
        </p>
      </div>
    </div>
  );
}
