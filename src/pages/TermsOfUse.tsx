import React from 'react';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { ScrollToTop } from '@/components/Layout/ScrollToTop';

const TermsOfUse = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-center">Conditions d'Utilisation</h1>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptation des conditions</h2>
            <p className="mb-4">
              En accédant et en utilisant le site web de Milna Gourmet, vous acceptez d'être lié par
              les présentes conditions d'utilisation. Si vous n'acceptez pas ces conditions,
              veuillez ne pas utiliser ce site.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Description du service</h2>
            <p className="mb-4">
              Milna Gourmet est une plateforme de commerce électronique spécialisée dans la vente
              de produits gourmets, notamment des yaourts et créations culinaires. Nous offrons
              des services de livraison et de commande en ligne.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Conditions d'utilisation du site</h2>
            <p className="mb-4">Vous vous engagez à :</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Fournir des informations exactes et à jour lors de votre inscription</li>
              <li>Maintenir la confidentialité de votre mot de passe</li>
              <li>Utiliser le site uniquement à des fins légales</li>
              <li>Ne pas perturber ou endommager le fonctionnement du site</li>
              <li>Respecter les droits de propriété intellectuelle</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Commandes et paiements</h2>
            <p className="mb-4">
              Toutes les commandes sont soumises à acceptation et disponibilité.
              Les prix sont indiqués en CFA TTC. Le paiement s'effectue à la livraison ou en ligne de manière sécurisée.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Livraison</h2>
            <p className="mb-4">
              Nous nous efforçons de livrer vos commandes dans les délais indiqués.
              Les frais de livraison sont calculés selon la zone de livraison et le montant de la commande.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Droit de rétractation</h2>
            <p className="mb-4">
              Conformément à la réglementation en vigueur, le droit de rétractation ne s’applique pas aux produits alimentaires périssables, notamment les yaourts (Gourmets), fabriqués à la commande.

Une fois la commande validée et la production lancée, aucune annulation ou remboursement ne pourra être effectué.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Responsabilité</h2>
            <p className="mb-4">
              Milna Gourmet ne peut être tenu responsable des dommages indirects ou imprévisibles.
              Notre responsabilité est limitée au montant de la commande en cas de problème.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Propriété intellectuelle</h2>
            <p className="mb-4">
              Tout le contenu du site (textes, images, logos) est protégé par le droit d'auteur.
              Toute reproduction sans autorisation préalable est interdite.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Modification des conditions</h2>
            <p className="mb-4">
              Nous nous réservons le droit de modifier ces conditions d'utilisation à tout moment.
              Les modifications seront publiées sur cette page.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Loi applicable</h2>
            <p className="mb-4">
              Ces conditions sont régies par le droit gabonais. Tout litige sera soumis
              aux tribunaux compétents gabonais.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Contact</h2>
            <p className="mb-4">
              Pour toute question concernant ces conditions d'utilisation,
              contactez-nous à l'adresse suivante : business.libreville23@gmail.com
            </p>
          </section>

          <p className="text-sm text-gray-600 mt-8">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </p>
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default TermsOfUse;