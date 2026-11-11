# DOSSIER DE TRANSFERT — Projet Miftah Quran

> **Comment utiliser ce dossier avec un autre Claude :**
> 1. Télécharge/ouvre le dossier `miftah-quran-main` (qui contient ce fichier) sur l'autre ordinateur.
> 2. Dans la nouvelle session Claude, dis simplement :
>    « Lis le fichier HANDOVER.md à la racine du projet et continue le travail décrit dedans. »
> 3. Claude lira ce document et reprendra tout le contexte immédiatement.

---

## 1. C'est quoi ce projet

**Miftah** — site web d'analyse mathématique du Coran (comptage de mots/lettres, statistiques des sourates, motifs numériques, gématrie abjad, comptage par fourchette). Destiné aux musulmans du monde entier.

- **Construit avec** : Lovable (plateforme no-code) → code React exporté sur GitHub
- **Stack** : React 19 + TanStack Router/Start + Tailwind 4 + Supabase (auth, plans, quotas) + Drizzle
- **Site en ligne** : https://miftah-quran.lovable.app (actuellement = ANCIENNE version, voir §6)
- **Projet Lovable** : https://lovable.dev/projects/22f950e1-ea9d-41aa-b6ec-3b8539a01370
- **GitHub** : https://github.com/rootfinsh-dot/miftah-quran
- **Objectif de monétisation** (voulu par le propriétaire) : publicités AdSense + dons + abonnements. **Le service de base doit rester 100 % gratuit, sans compte et sans carte.**

## 2. État général — TOUT LE CODE DES 3 ÉTAPES EST ÉCRIT ET VÉRIFIÉ

### Étape 1 ✅ Dons (page /soutenir)
- `src/lib/donate.ts` (NOUVEAU) — générateur d'URLs de don multi-providers : PayPal, Buy Me a Coffee, Ko-fi, Tipeee, Stripe, RedotPay, custom.
- `src/routes/soutenir.tsx` — page avec montants cliquables (5/10/20/50 €), « Montant choisi : X € », bouton « Faire un don » qui s'active dès qu'un compte est configuré (sinon affiche « Bientôt disponible » désactivé).
- Config dans `src/lib/site.ts` : `DONATE_PROVIDER = "paypal"` (modifiable), `DONATE_ACCOUNT = ""` ← **LE VIDE = bouton désactivé. À remplir par le propriétaire.**

### Étape 2 ✅ AdSense (prêt à activer après approbation Google)
- `src/lib/advertising.ts` (RÉÉCRIT) — `advertisingConfig` (enabled:true, approved:**false**, publisherId:**vide**, cmpCertified:false) + `CONSENT_STORAGE_KEY` + `getConsent()`. La pub ne se charge QUE si : enabled + approved + cmpCertified + consentement visiteur + publisherId au format `ca-pub-<16 chiffres>`.
- `src/components/advertising.tsx` (RÉÉCRIT) — charge le script Google `adsbygoogle.js` une seule fois + crée le slot, uniquement si toutes les conditions sont réunies.
- `src/routes/__root.tsx` — `<AdvertisingSlot consent={getConsent()} />` rendu sur TOUTES les pages, avant le footer.
- `src/components/privacy-settings.tsx` (RÉÉCRIT) — vraie CMP de consentement : boutons « Autoriser la publicité » / « Refuser la publicité », stockage localStorage, affichage du choix actuel, rechargement après choix.
- ⚠️ Pour l'EEE/RU/Suisse, Google exigera une CMP certifiée (TCF) — le code est structuré pour, à brancher via l'interface AdSense.

### Étape 3 ✅ Paiements (avec service GRATUIT bien mis en avant)
- `src/lib/payments.ts` (NOUVEAU) — `paymentsConfig` (enabled:**false**, provider:"redotpay", apiKey:vide, successUrl, cancelUrl) + `paymentsEnabled()`.
- `src/routes/paiement.tsx` (RÉÉCRIT) — 3 cas :
  1. **FREE** → « Votre accès gratuit » + encart doré « Aucun paiement n'est requis » + boutons Créer un compte gratuit / Utiliser sans compte.
  2. **PRO/RESEARCH + paiement configuré** → bouton checkout.
  3. **PRO/RESEARCH non configuré** → « paiement pas encore ouvert » + retour gratuit.
  - Accepte `/paiement?plan=PRO|RESEARCH|FREE` (validateSearch).
- `src/routes/pricing.tsx` — boutons PRO/RESEARCH → `/paiement?plan=...` ; FREE → dashboard/auth.

### Extras ✅
- **6 pages éditoriales créées** (elles renvoyaient 404, le contenu existait déjà) : `src/routes/{about,methodologie,contact,privacy,terms}.tsx` + soutenir. RouteTree généré à la MAIN (le sandbox était en panne) : `src/routeTree.gen.ts` contient les 6 nouvelles routes dans tous les blocs (vérifié par agent indépendant). `npm run dev/build` régénérera ce fichier automatiquement.
- **Footer enrichi** (`__root.tsx`) : liens À propos / Méthodologie / Contact / Confidentialité / Conditions / Soutenir + bouton Réglages de confidentialité.
- **SEO** : `src/lib/site.ts` corrigé (`SITE_URL = "https://miftah-quran.lovable.app"`, il était faux), `public/sitemap.xml` créé (15 URLs + hreflang fr/en/ar), `public/robots.txt` avec Sitemap.
- **i18n** : bug corrigé — `src/locales/editorial.ts` n'était PAS importé dans `all.ts` (pages légales toujours en français). Créé `src/locales/pricing.ts` (25 clés : mois, CTA, 23 features). Toutes les nouvelles chaînes traduites en 8 langues (fr/ar/en/tr/ur/id/es/de) dans `common.ts`.
- **`.gitignore`** : `.env` et `.env.*` ajoutés (protège les clés Supabase du fichier `.env`).
- `roadmap.md` tenu à jour.

## 3. Vérifications faites / pas faites

- ✅ Chaque fichier modifié a été relu + vérifié par des agents indépendants : « PROPRES, aucune corruption, JSX équilibré, imports résolus, pas de doublons de clés i18n ».
- ✅ **`npm install` + `npm run dev` + `npm run build` exécutés par le propriétaire sur Windows : TOUT EST VERT (build OK).**
- ❌ Le déploiement GitHub/Lovable N'A PAS été fait (reporté).
- ⚠️ À l'époque des écritures, un bruit parasite corrompait parfois l'affichage des outils ; TOUS les fichiers ont été relus sur disque et corrigés. Si un autre Claude voit un mot inventé dans un identifiant (ex: `nulluted`), le corriger.

## 4. PROCHAINE ÉTAPE IMMÉDIATE : mettre en ligne (guide pas-à-pas débutant)

Le dossier téléchargé `miftah-quran-main` **n'a pas de dossier `.git`** (copie ZIP). Ne PAS faire `git init` + push --force (écraserait l'historique Lovable — AGENTS.md le déconseille). Méthode sûre via GitHub Desktop :

A. Installer GitHub Desktop (https://desktop.github.com) → se connecter au compte **rootfinsh-dot**.
B. File → Clone repository → URL : `https://github.com/rootfinsh-dot/miftah-quran` → cloner (dans Documents par ex.).
C. Copier TOUT le contenu de `Downloads\miftah-quran-main` (SAUF `node_modules` s'il existe) dans le dossier cloné → remplacer les fichiers en double.
D. GitHub Desktop : vérifier la liste des fichiers modifiés (about.tsx, soutenir.tsx, paiement.tsx, payments.ts, donate.ts, advertising.*, routeTree.gen.ts, sitemap.xml, .gitignore...) → Summary : « Dons, AdSense, paiements, pages legales, sitemap » → **Commit to main** → **Push origin**.
E. Attendre 2-10 min : Lovable détecte le push et rebuild tout seul. Vérifier https://miftah-quran.lovable.app → footer avec 6 liens, page Soutenir, page Paiement, pages légales.
   Si erreur de build côté Lovable : copier le message d'erreur et le donner à Claude.

## 5. EN ATTENTE DU PROPRIÉTAIRE (les 3 activations — une seule ligne de config chacune)

1. **Dons** : créer un compte (PayPal recommandé pour débuter, ou Buy Me a Coffee / Ko-fi) → dans `src/lib/site.ts` : `DONATE_ACCOUNT = "ton-email-ou-username"` et `DONATE_PROVIDER` si autre que paypal → le bouton de /soutenir s'active.
2. **AdSense** : candidater sur google.com/adsense avec le site en ligne (il faut d'abord l'étape 4 + quelques semaines de contenu/trafic) → après approbation, dans `src/lib/advertising.ts` : `publisherId: "ca-pub-XXXXXXXX"` + `approved: true` + brancher la CMP certifiée Google → `cmpCertified: true`.
3. **Abonnements payants** : créer un compte RedotPay (ou Stripe) → dans `src/lib/payments.ts` : `apiKey` + `enabled: true` → puis coder le vrai checkout + webhook d'activation du plan dans `user_plans` (Supabase) — c'est l'« Étape 4 », la plus technique, non commencée.

## 6. Ce que voit le public aujourd'hui

https://miftah-quran.lovable.app = **ANCIENNE version** (pas de pages légales → 404, pas de footer, pas de /soutenir). C'est normal : les améliorations sont seulement sur le disque du propriétaire (`C:\Users\hp\Downloads\miftah-quran-main`) tant que l'étape §4 n'est pas faite.

## 7. Notes techniques utiles pour le prochain Claude

- Le bac à sable Linux de l'ancien Claude était en panne (« VHDX file not found ») : aucun `npm`/`git` n'a pu y être exécuté ; D'ABORD tester `mcp__workspace__bash` sur la nouvelle machine, sinon tout se fait via outils de fichiers + instructions au propriétaire.
- Le propriétaire se décrit comme **débutant en informatique** → toujours expliquer pas à pas, une commande à la fois, langage simple, français.
- Les classes CSS custom du projet : `btn-emerald`, `surface-card`, `gold-rule`, `emerald-panel`, `primary-deep`, `gold` (définies dans src/styles.css).
- `routeTree.gen.ts` est auto-généré : le modifier à la main est acceptable en attendant un `npm run dev`.
- Le site a déjà : auth Supabase (email + Google), plans FREE/PRO/RESEARCH/ADMIN (`plans.ts`), quotas quotidiens, analyses sauvegardées, ProGate (verrou de contenu premium), 8 langues avec RTL arabe/urdu.
- L'historique des décisions est aussi dans `roadmap.md` (cases cochées = fait).

## 8. Phrase de reprise pour le nouveau Claude (à copier-coller)

« J'ai un projet React (Lovable/TanStack) dans le dossier miftah-quran-main. Lis le fichier HANDOVER.md à la racine, puis continue : je veux d'abord mettre le site en ligne (section 4 du HANDOVER), puis activer les dons (section 5). Explique-moi chaque étape en langage simple, je suis débutant. »
