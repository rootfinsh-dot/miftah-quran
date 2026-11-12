import { createFileRoute } from "@tanstack/react-router";

import { EditorialPage } from "@/components/editorial-page";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/contact")({
  head: ({ match }) => pageHead("/contact", match.search.lang, true),
  component: () => <EditorialPage page="contact" title="Contacter Miftah" />,
});