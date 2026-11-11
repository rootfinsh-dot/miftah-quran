# SEO et préparation AdSense

- [x] Ajouter les pages éditoriales manquantes (about, methodologie, contact, privacy, terms) et les relier au footer.
- [x] Corriger l'URL du site (miftah-quran.lovable.app) dans site.ts, le sitemap et robots.txt.
- [x] Ajouter un sitemap.xml et le référencer dans robots.txt.
- [x] Brancher les traductions éditoriales dans le dictionnaire i18n (editorial.ts chargé).
- [x] Ajouter une page « Soutenir » (dons + abonnement + partage) avec montants cliquables et providers configurables (PayPal, Buy Me a Coffee, Ko-fi, Tipeee, Stripe, RedotPay).
- [x] Préparer l'intégration AdSense : script + slot + consentement (advertising.ts / advertising.tsx / privacy-settings.tsx).
- [x] Préparer les paiements : config provider (RedotPay / Stripe) + page /paiement distinguant l'accès gratuit (FREE, sans paiement) des abonnements payants.
- [x] Compléter les traductions (8 langues) du footer, des dons, du consentement, des tarifs et des fonctionnalités des plans.
- [ ] Créer les comptes provider : compte dons (ex. PayPal) → renseigner DONATE_PROVIDER/DONATE_ACCOUNT dans src/lib/site.ts.
- [ ] Ouvrir la candidature Google AdSense → après approbation, renseigner publisherId + approved/cmpCertified dans src/lib/advertising.ts et brancher une CMP certifiée.
- [ ] Créer le compte RedotPay (ou Stripe) → renseigner apiKey + enabled dans src/lib/payments.ts et brancher le checkout réel + webhook d'activation du plan.
- [ ] Vérifier les cinq outils, les langues et les affichages mobile/desktop.
- [ ] Lancer npm run dev / npm run build pour valider la compilation, puis pousser sur GitHub (sync Lovable).