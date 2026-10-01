import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useNavigate,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { I18nProvider, LANGUAGES, useI18n, useT, type Lang } from "../lib/i18n";
import { useUser } from "../lib/auth";
import { supabase } from "@/integrations/supabase/client";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page introuvable</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Cette page n'existe pas ou a été déplacée.
        </p>
        <div className="mt-6">
          <Link to="/" className="btn-emerald inline-flex px-4 py-2 text-sm font-medium">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Cette page n'a pas pu s'afficher
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Une erreur est survenue. Vous pouvez réessayer ou revenir à l'accueil.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="btn-emerald px-4 py-2 text-sm font-medium"
          >
            Réessayer
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary"
          >
            Accueil
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Miftah — analyse mathématique du Coran" },
      {
        name: "description",
        content:
          "Comptages, statistiques, motifs numériques et valeurs abjad du texte coranique.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Cormorant+Garamond:wght@500;600;700&family=Karla:wght@400;500;600&display=swap",
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

const NAV = [
  { to: "/comptage", label: "Comptage" },
  { to: "/statistiques", label: "Statistiques" },
  { to: "/motifs", label: "Motifs numériques" },
  { to: "/gematrie", label: "Gématrie" },
  { to: "/fourchette", label: "Fourchette" },
] as const;

function LanguageSelect() {
  const { lang, setLang } = useI18n();
  return (
    <select
      aria-label="Langue"
      value={lang}
      onChange={(e) => setLang(e.target.value as Lang)}
      className="rounded-md border border-border bg-card px-2 py-1.5 text-sm text-primary-deep"
    >
      {LANGUAGES.map((l) => (
        <option key={l.code} value={l.code}>
          {l.label}
        </option>
      ))}
    </select>
  );
}

function AccountButton() {
  const t = useT();
  const { user } = useUser();
  const navigate = useNavigate();
  const qc = useQueryClient();
  if (!user)
    return (
      <Link to="/auth" className="btn-emerald px-3 py-1.5 text-sm font-medium">
        {t("Connexion")}
      </Link>
    );
  return (
    <>
      <Link to="/dashboard" className="btn-emerald px-3 py-1.5 text-sm font-medium">
        {t("Mon espace")}
      </Link>
      <button
        onClick={async () => {
          await qc.cancelQueries();
          qc.clear();
          await supabase.auth.signOut();
          navigate({ to: "/auth", replace: true });
        }}
        className="rounded-md px-3 py-1.5 text-muted-foreground hover:bg-secondary"
      >
        {t("Déconnexion")}
      </button>
    </>
  );
}

function SiteHeader() {
  const t = useT();
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-4">
        <Link to="/" className="flex items-baseline gap-2">
          <span className="font-display text-2xl font-semibold text-primary-deep">Miftah</span>
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {t("analyse du Coran")}
          </span>
        </Link>
        <nav className="flex flex-wrap items-center gap-1 text-sm">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-primary-deep"
              activeProps={{ className: "bg-secondary text-primary-deep font-semibold" }}
            >
              {t(item.label)}
            </Link>
          ))}
          <Link to="/pricing" className="rounded-md px-3 py-1.5 text-muted-foreground hover:bg-secondary hover:text-primary-deep" activeProps={{ className: "bg-secondary text-primary-deep font-semibold" }}>
            {t("Tarifs")}
          </Link>
          <AccountButton />
          <LanguageSelect />
        </nav>
      </div>
    </header>
  );
}

function SiteFooter() {
  const t = useT();
  return (
    <footer className="mt-20 border-t border-border/70 bg-card/60">
      <div className="mx-auto max-w-6xl px-5 py-8 text-sm text-muted-foreground">
        <div className="gold-rule mb-5 w-16" />
        <p>
          {t(
            "Texte arabe : recension Uthmani. Traduction française : Muhammad Hamidullah. Les résultats sont calculés à la volée et dépendent des règles de comptage choisies.",
          )}
        </p>
      </div>
    </footer>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1">
          {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
          <Outlet />
        </main>
        <SiteFooter />
      </div>
      </I18nProvider>
    </QueryClientProvider>
  );
}
