import { Mail, ExternalLink } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { EDITORIAL } from "@/lib/editorial";
import { useT } from "@/lib/i18n";
import { CONTACT_EMAIL } from "@/lib/site";
import { Button } from "@/components/ui/button";

export function EditorialPage({ page, title }: { page: string; title: string }) {
  const t = useT();
  return <article className="mx-auto max-w-4xl px-5 py-12 sm:py-16">
    <p className="text-xs uppercase tracking-[0.2em] text-gold">Miftah</p>
    <h1 className="mt-3 text-4xl font-semibold text-primary-deep">{t(title)}</h1>
    <div className="gold-rule mt-5 w-20" />
    {(EDITORIAL[page] ?? []).map((section) => <section key={section.title} className="mt-10 border-b border-border pb-8">
      <h2 className="text-2xl font-semibold text-primary-deep">{t(section.title)}</h2>
      {section.paragraphs.map((paragraph) => <p key={paragraph} className="mt-4 text-base leading-7 text-muted-foreground">{t(paragraph)}</p>)}
    </section>)}
    {page === "methodologie" && <section className="mt-8"><h2 className="text-2xl font-semibold text-primary-deep">{t("Références")}</h2><ul className="mt-4 space-y-3">
      {([ ["AlQuran Cloud — API", "https://alquran.cloud/api"], ["AlQuran Cloud — conditions", "https://alquran.cloud/terms-and-conditions"], ["AlQuran Cloud — sources", "https://alquran.cloud/contributors"] ] as const).map(([label, href]) => <li key={href}><a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary underline underline-offset-4">{t(label)}<ExternalLink className="size-3" /></a></li>)}
    </ul></section>}
    <div className="mt-10 flex flex-wrap items-center gap-4">
      <Button asChild variant="outline"><a href={`mailto:${CONTACT_EMAIL}`}><Mail />{CONTACT_EMAIL}</a></Button>
      <Button asChild variant="link"><Link to="/methodologie">{t("Méthodologie et sources")}</Link></Button>
    </div>
  </article>;
}