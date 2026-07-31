import { useState, type FormEvent } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { KeyRound, ArrowLeft, CheckCircle2, AlertTriangle } from 'lucide-react';
import { authService } from '@/services/authService';
import { useSEO } from '@/hooks/useSEO';

/**
 * Écran « choisir un nouveau mot de passe ».
 *
 * Le jeton arrive dans l'URL (`?token=…`), envoyé par email. Il n'est
 * jamais stocké côté navigateur : il transite dans le corps de la requête
 * puis disparaît avec la navigation.
 *
 * Contrairement à l'écran précédent, les erreurs sont ici explicites
 * (« lien expiré », « lien déjà utilisé ») : la personne détient déjà le
 * lien, lui expliquer le problème est utile et ne révèle rien.
 */

/** Règle unique, alignée sur la validation Zod du backend. */
const LONGUEUR_MINIMALE = 8;

export default function ResetPassword() {
  useSEO({
    title: 'Nouveau mot de passe | Milna Gourmet',
    description: 'Choisissez un nouveau mot de passe pour votre compte Milna Gourmet.',
    noIndex: true,
  });

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') ?? '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [envoi, setEnvoi] = useState(false);
  const [succes, setSucces] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  // Validation locale : évite un aller-retour réseau pour une erreur
  // que le navigateur peut détecter seul. Le backend revalide de toute
  // façon — une validation front n'est jamais une garantie de sécurité.
  const tropCourt = password.length > 0 && password.length < LONGUEUR_MINIMALE;
  const differents = confirmPassword.length > 0 && password !== confirmPassword;
  const formulaireValide =
    password.length >= LONGUEUR_MINIMALE && password === confirmPassword;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErreur(null);
    setEnvoi(true);

    try {
      await authService.resetPassword({ token, password, confirmPassword });
      setSucces(true);
      // Redirection différée : laisse le temps de lire la confirmation.
      setTimeout(() => navigate('/'), 3000);
    } catch (error) {
      setErreur(
        error instanceof Error
          ? error.message
          : 'Impossible de réinitialiser le mot de passe. Réessayez.'
      );
    } finally {
      setEnvoi(false);
    }
  };

  // Lien tronqué ou ouvert sans paramètre : inutile d'afficher le formulaire.
  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="w-full max-w-md space-y-5 rounded-xl border border-border bg-card p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-7 w-7 text-destructive" />
          </div>
          <h1 className="text-xl font-semibold text-foreground">Lien invalide</h1>
          <p className="text-sm text-muted-foreground">
            Ce lien de réinitialisation est incomplet. Demandez-en un nouveau.
          </p>
          <Link
            to="/mot-de-passe-oublie"
            className="inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Demander un nouveau lien
          </Link>
        </div>
      </div>
    );
  }

  if (succes) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="w-full max-w-md space-y-5 rounded-xl border border-border bg-card p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle2 className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-xl font-semibold text-foreground">Mot de passe modifié</h1>
          <p className="text-sm text-muted-foreground">
            Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
            Toutes vos sessions ouvertes ont été déconnectées.
          </p>
          <Link
            to="/"
            className="inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
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
            <KeyRound className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-xl font-semibold text-foreground">Nouveau mot de passe</h1>
          <p className="text-sm text-muted-foreground">
            Choisissez un mot de passe d'au moins {LONGUEUR_MINIMALE} caractères.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="password" className="text-sm font-medium text-foreground">
              Nouveau mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
            {tropCourt && (
              <p className="text-xs text-destructive">
                Le mot de passe doit contenir au moins {LONGUEUR_MINIMALE} caractères.
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
              Confirmer le mot de passe
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
            {differents && (
              <p className="text-xs text-destructive">
                Les deux mots de passe ne correspondent pas.
              </p>
            )}
          </div>

          {erreur && (
            <div role="alert" className="space-y-2 rounded-md bg-destructive/10 p-3">
              <p className="text-sm text-destructive">{erreur}</p>
              <Link
                to="/mot-de-passe-oublie"
                className="text-xs font-medium text-primary hover:underline"
              >
                Demander un nouveau lien
              </Link>
            </div>
          )}

          <button
            type="submit"
            disabled={envoi || !formulaireValide}
            className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {envoi ? 'Enregistrement…' : 'Enregistrer le nouveau mot de passe'}
          </button>
        </form>

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
