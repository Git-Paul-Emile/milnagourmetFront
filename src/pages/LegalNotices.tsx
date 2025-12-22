import React from 'react';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { ScrollToTop } from '@/components/Layout/ScrollToTop';

const LegalNotices = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-center">Mentions Légales</h1>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Éditeur du site</h2>
            <div className="mb-4">
              <p><strong>Milna Gourmet</strong></p>
              <p>Adresse : Kalikack, Libreville, Gabon</p>
              <p>Téléphone : +24106610304</p>
              <p>Email : business.libreville23@gmail.com</p>
              {/* <p>SIRET : [Numéro SIRET]</p>
              <p>Capital social : [Montant du capital social] €</p> */}
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Directeur de la publication</h2>
            <p className="mb-4">
              [Nom du directeur de la publication]
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Hébergement</h2>
            <div className="mb-4">
              <p><strong>[Nom de l'hébergeur]</strong></p>
              <p>Adresse : [Adresse de l'hébergeur]</p>
              <p>Téléphone : [Numéro de téléphone de l'hébergeur]</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Propriété intellectuelle</h2>
            <p className="mb-4">
              L'ensemble du contenu de ce site (textes, images, graphismes, logos, icônes, sons, logiciels)
              est protégé par le droit d'auteur. Toute reproduction, distribution, modification ou exploitation
              sans autorisation préalable est strictement interdite.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Données personnelles</h2>
            <p className="mb-4">
              Conformément à la loi Informatique et Libertés du 6 janvier 1978 modifiée,
              vous disposez d'un droit d'accès, de rectification et de suppression des données
              vous concernant. Pour exercer ce droit, contactez-nous à l'adresse indiquée ci-dessus.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Cookies</h2>
            <p className="mb-4">
              Ce site utilise des cookies pour améliorer l'expérience utilisateur.
              En naviguant sur ce site, vous acceptez l'utilisation de cookies.
              Vous pouvez désactiver les cookies dans les paramètres de votre navigateur.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Responsabilité</h2>
            <p className="mb-4">
              Milna Gourmet s'efforce d'assurer l'exactitude des informations diffusées sur ce site,
              mais ne peut garantir l'absence d'erreurs. L'utilisateur utilise ce site sous sa seule responsabilité.
            </p>
            <p className="mb-4">
              Milna Gourmet ne saurait être tenu responsable des dommages directs ou indirects
              résultant de l'utilisation de ce site.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Liens externes</h2>
            <p className="mb-4">
              Ce site peut contenir des liens vers d'autres sites. Milna Gourmet n'exerce aucun contrôle
              sur ces sites externes et décline toute responsabilité quant à leur contenu.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Droit applicable</h2>
            <p className="mb-4">
              Le présent site est soumis au droit gabonais. Tout litige relatif à l'utilisation
              de ce site sera de la compétence exclusive des tribunaux gabonais.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Contact</h2>
            <p className="mb-4">
              Pour toute question concernant ces mentions légales,
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

export default LegalNotices;