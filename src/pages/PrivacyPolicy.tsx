import React from 'react';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { ScrollToTop } from '@/components/Layout/ScrollToTop';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-center">Politique de Confidentialité</h1>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className="mb-4">
              Chez Milna Gourmet, nous nous engageons à protéger votre vie privée et vos données personnelles.
              Cette politique de confidentialité explique comment nous collectons, utilisons et protégeons vos informations.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Informations que nous collectons</h2>
            <p className="mb-4">Nous pouvons collecter les types d'informations suivants :</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Informations d'identification personnelle (nom, adresse e-mail, numéro de téléphone)</li>
              <li>Informations de livraison (adresse de livraison)</li>
              {/* <li>Informations de paiement (traitées de manière sécurisée par nos partenaires)</li> */}
              <li>Historique des commandes et préférences</li>
              <li>Données de navigation sur notre site web</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Comment nous utilisons vos informations</h2>
            <p className="mb-4">Vos informations sont utilisées pour :</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Traiter vos commandes et livraisons</li>
              <li>Vous contacter concernant vos commandes</li>
              <li>Améliorer nos services et produits</li>
              {/* <li>Vous envoyer des communications marketing (avec votre consentement)</li> 
              <li>Respecter nos obligations légales</li>*/}
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Partage des informations</h2>
            <p className="mb-4">
              Nous ne vendons, n'échangeons ni ne louons vos informations personnelles à des tiers,
              sauf dans les cas suivants :
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Avec des prestataires de services pour traiter vos commandes</li>
              <li>Lorsque requis par la loi</li>
              <li>Avec votre consentement explicite</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Sécurité des données</h2>
            <p className="mb-4">
              Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos données personnelles
              contre l'accès non autorisé, la modification, la divulgation ou la destruction.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Cookies</h2>
            <p className="mb-4">
              Notre site utilise des cookies pour améliorer votre expérience utilisateur.
              Vous pouvez contrôler l'utilisation des cookies via les paramètres de votre navigateur.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Vos droits</h2>
            <p className="mb-4">Vous avez le droit de :</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Accéder à vos données personnelles</li>
              <li>Rectifier vos données inexactes</li>
              <li>Demander la suppression de vos données</li>
              <li>Vous opposer au traitement de vos données</li>
              <li>Demander la portabilité de vos données</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Contact</h2>
            <p className="mb-4">
              Pour toute question concernant cette politique de confidentialité,
              contactez-nous à l'adresse suivante : business.libreville23@gmail.com
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Modifications</h2>
            <p className="mb-4">
              Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment.
              Les modifications seront publiées sur cette page.
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

export default PrivacyPolicy;