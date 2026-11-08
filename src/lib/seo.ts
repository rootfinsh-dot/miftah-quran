import { localizedURL, seoLanguage, SEO_LANGUAGES } from "./site";

type Copy = Record<"fr" | "en" | "ar", [string, string]>;
export const PAGE_META: Record<string, Copy> = {
  "/": { fr: ["Miftah — analyse mathématique du Coran", "Explorez cinq outils de comptage, statistiques, motifs numériques, abjad et plages de versets, avec des méthodes transparentes."], en: ["Miftah — mathematical Quran analysis", "Explore five tools for counting, surah statistics, numeric patterns, abjad and verse ranges, with transparent methods."], ar: ["مفتاح — التحليل الرياضي للقرآن", "استكشف خمس أدوات للعدّ وإحصاءات السور والأنماط العددية وحساب الجُمَّل ونطاقات الآيات بمنهجية واضحة."] },
  "/comptage": { fr: ["Comptage des mots et lettres du Coran — Miftah", "Recherchez un mot ou une lettre arabe et examinez ses occurrences par sourate et par verset."], en: ["Quran word and letter counting — Miftah", "Search an Arabic word or letter and examine its occurrences by surah and verse."], ar: ["عدّ كلمات القرآن وحروفه — مفتاح", "ابحث عن كلمة أو حرف عربي واطّلع على مواضع ظهوره بحسب السورة والآية."] },
  "/statistiques": { fr: ["Statistiques des sourates — Miftah", "Comparez les versets, mots, lettres et valeurs abjad des 114 sourates selon les conventions de Miftah."], en: ["Surah statistics — Miftah", "Compare verses, words, letters and abjad values across the 114 surahs using Miftah's counting conventions."], ar: ["إحصاءات السور — مفتاح", "قارن الآيات والكلمات والحروف وقيم حساب الجُمَّل في السور الـ114 وفق قواعد العدّ في مفتاح."] },
  "/motifs": { fr: ["Motifs numériques et divisibilité — Miftah", "Testez la divisibilité et les correspondances arithmétiques du Coran sans conclusions religieuses ou scientifiques automatiques."], en: ["Numeric patterns and divisibility — Miftah", "Test Quran divisibility and arithmetic relationships without automatic religious or scientific conclusions."], ar: ["الأنماط العددية وقابلية القسمة — مفتاح", "اختبر قابلية القسمة والعلاقات الحسابية في القرآن دون استنتاجات دينية أو علمية تلقائية."] },
  "/gematrie": { fr: ["Gématrie et calcul abjad — Miftah", "Calculez la valeur abjad d'un texte arabe ou d'un verset avec le détail de chaque lettre."], en: ["Gematria and abjad calculator — Miftah", "Calculate the abjad value of Arabic text or a verse with a letter-by-letter breakdown."], ar: ["حاسبة الجُمَّل وأبجد — مفتاح", "احسب قيمة نص عربي أو آية بحساب الجُمَّل مع تفصيل قيمة كل حرف."] },
  "/fourchette": { fr: ["Compter une plage de versets — Miftah", "Choisissez les sourates et versets de départ et d'arrivée pour compter une plage inclusive et lire les versets."], en: ["Verse range counting — Miftah", "Choose starting and ending surahs and verses to count an inclusive range and read its verses."], ar: ["عدّ نطاق من الآيات — مفتاح", "اختر سورتي وآيتي البداية والنهاية لعدّ نطاق شامل للطرفين وقراءة آياته."] },
  "/pricing": { fr: ["Tarifs Free, Pro et Research — Miftah", "Consultez les offres et les tarifs provisoires de Miftah. Les paiements ne sont pas encore ouverts."], en: ["Free, Pro and Research pricing — Miftah", "View Miftah's plans and provisional prices. Payments are not yet available."], ar: ["أسعار Free وPro وResearch — مفتاح", "اطّلع على باقات مفتاح وأسعارها المؤقتة. الدفع غير متاح بعد."] },
  "/about": { fr: ["À propos de Miftah", "Découvrez le projet éducatif indépendant Miftah et ses outils d'analyse quantitative du Coran."], en: ["About Miftah", "Learn about Miftah, an independent educational project for quantitative Quran analysis."], ar: ["عن مفتاح", "تعرّف على مفتاح، المشروع التعليمي المستقل للتحليل الكمي للقرآن."] },
  "/methodologie": { fr: ["Méthodologie et sources — Miftah", "Normalisation arabe, comptage inclusif, valeurs abjad, sources et limites des calculs de Miftah."], en: ["Methodology and sources — Miftah", "Arabic normalization, inclusive counting, abjad values, sources and limitations of Miftah's calculations."], ar: ["المنهجية والمصادر — مفتاح", "توحيد النص العربي والعدّ الشامل وقيم أبجد ومصادر حسابات مفتاح وحدودها."] },
  "/contact": { fr: ["Contacter Miftah", "Contactez Miftah pour une question, un signalement de texte ou une demande concernant vos données."], en: ["Contact Miftah", "Contact Miftah with questions, text corrections or requests concerning your personal data."], ar: ["تواصل مع مفتاح", "تواصل مع مفتاح للأسئلة والإبلاغ عن النصوص والطلبات المتعلقة ببياناتك الشخصية."] },
  "/privacy": { fr: ["Politique de confidentialité — Miftah", "Données de compte, stockage local, services tiers et préparation publicitaire de Miftah."], en: ["Privacy policy — Miftah", "Miftah account data, local storage, third-party services and advertising preparation."], ar: ["سياسة الخصوصية — مفتاح", "بيانات الحساب والتخزين المحلي والخدمات الخارجية والاستعداد للإعلانات في مفتاح."] },
  "/terms": { fr: ["Conditions d'utilisation — Miftah", "Conditions d'utilisation du projet éducatif Miftah, limites des calculs et respect des sources."], en: ["Terms of use — Miftah", "Terms for the Miftah educational project, calculation limitations and respect for sources."], ar: ["شروط الاستخدام — مفتاح", "شروط مشروع مفتاح التعليمي وحدود الحسابات واحترام المصادر."] },
  "/auth": { fr: ["Connexion et inscription — Miftah", "Connectez-vous ou créez votre compte Miftah."], en: ["Sign in and sign up — Miftah", "Sign in or create your Miftah account."], ar: ["تسجيل الدخول وإنشاء حساب — مفتاح", "سجّل الدخول أو أنشئ حسابك في مفتاح."] },
  "/reset-password": { fr: ["Nouveau mot de passe — Miftah", "Réinitialisez le mot de passe de votre compte."], en: ["Reset password — Miftah", "Reset your account password."], ar: ["إعادة تعيين كلمة المرور — مفتاح", "أعد تعيين كلمة مرور حسابك."] },
  "/paiement": { fr: ["Paiement non disponible — Miftah", "Les abonnements payants ne sont pas encore ouverts."], en: ["Payments unavailable — Miftah", "Paid subscriptions are not yet available."], ar: ["الدفع غير متاح — مفتاح", "الاشتراكات المدفوعة غير متاحة بعد."] },
  "/dashboard": { fr: ["Mon espace — Miftah", "Votre compte et vos analyses sauvegardées."], en: ["My workspace — Miftah", "Your account and saved analyses."], ar: ["مساحتي — مفتاح", "حسابك وتحليلاتك المحفوظة."] },
  "/profil": { fr: ["Mon profil — Miftah", "Gérez votre profil personnel."], en: ["My profile — Miftah", "Manage your personal profile."], ar: ["ملفي الشخصي — مفتاح", "أدر ملفك الشخصي."] },
  "/subscription": { fr: ["Mon abonnement — Miftah", "Consultez le statut de votre abonnement."], en: ["My subscription — Miftah", "View your subscription status."], ar: ["اشتراكي — مفتاح", "اطّلع على حالة اشتراكك."] },
};

export function pageHead(path: string, language: unknown, indexable = true) {
  const lang = seoLanguage(language);
  const copy = PAGE_META[path];
  if (!copy) throw new Error(`Missing page metadata: ${path}`);
  const [title, description] = copy[lang];
  return {
    meta: [
      { title }, { name: "description", content: description },
      { property: "og:title", content: title }, { property: "og:description", content: description },
      { property: "og:type", content: "website" }, { property: "og:url", content: localizedURL(path, lang) },
      { property: "og:locale", content: lang === "ar" ? "ar_AR" : lang === "en" ? "en_US" : "fr_FR" },
      { name: "twitter:card", content: "summary_large_image" },
      ...(!indexable ? [{ name: "robots", content: "noindex, follow" }] : []),
    ],
    links: [
      { rel: "canonical", href: localizedURL(path, lang) },
      ...(indexable ? SEO_LANGUAGES.map((code) => ({ rel: "alternate", hrefLang: code, href: localizedURL(path, code) })) : []),
      ...(indexable ? [{ rel: "alternate", hrefLang: "x-default", href: localizedURL(path, "fr") }] : []),
    ],
  };
}