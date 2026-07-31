import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { authService } from '@/services/authService';
import { useSEO } from '@/hooks/useSEO';

/**
 * Écran « mot de passe oublié ».
 *
 * POINT DE SÉCURITÉ CENTRAL : quel que soit le résultat côté serveur,
 * cet écran affiche TOUJOURS le même message de confirmation. Afficher
 * « adresse inconnue » transformerait le formulaire en outil permettant
 * de savoir qui possède un compte (énumération de comptes).
 *
 * Le bouton reste donc « réussi » même pour une adresse inexistante : ce
 * n'est pas un bug, c'est le comportement attendu.
 */
export default function ForgotPassword() {
  useSEO({
    title: 'Mot de passe oublié | Milna Gourmet',
    description: 'Réinitialisez le mot de passe de votre compte Milna Gourmet.',
    noIndex: true,
  });

  const [email, setEmail] = useState('');
  const [envoi, setEnvoi] = useState(false);
  const [envoye, setEnvoye] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErreur(null);
    setEnvoi(true);

    try {
      await authService.forgotPassword(email.trim().toLowerCase());
      setEnvoye(true);
    } catch (error) {
      // Seules les vraies erreurs techniques (réseau, 429, 500) sont
      // montrées : un compte introuvable renvoie un 200.
      setErreur(
        error instanceof Error
          ? error.message
          : "Impossible d'envoyer la demande. Réessayez dans un instant."
      );
    } finally {
      setEnvoi(false);
    }
  };

  if (envoye) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="w-full max-w-md space-y-5 rounded-xl border border-border bg-card p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle2 className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-xl font-semibold text-foreground">Vérifiez votre boîte mail</h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Si un compte est associé à <strong>{email}</strong>, un email de
            réinitialisation vient d'être envoyé. Le lien est valable 30 minutes.
          </p>
          <p className="text-xs text-muted-foreground">
            Pensez à consulter vos indésirables si vous ne le voyez pas.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6 rounded-xl border border-border bg-card p-8">
        <div className="space-y-2 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-xl font-semibold text-foreground">Mot de passe oublié</h1>
          <p className="text-sm text-muted-foreground">
            Saisissez l'adresse email associée à votre compte. Nous vous
            enverrons un lien pour choisir un nouveau mot de passe.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              Adresse email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="vous@exemple.com"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          {erreur && (
            <p role="alert" className="text-sm text-destructive">
              {erreur}
            </p>
          )}

          <button
            type="submit"
            disabled={envoi || !email.trim()}
            className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {envoi ? 'Envoi en cours…' : 'Envoyer le lien de réinitialisation'}
          </button>
        </form>

        <p className="text-center text-xs text-muted-foreground">
          Aucune adresse email sur votre compte ? Contactez-nous par WhatsApp
          et nous vous aiderons à récupérer votre accès.
        </p>

        <Link
          to="/"
          className="flex items-center justify-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}
