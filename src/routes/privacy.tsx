import { createFileRoute } from "@tanstack/react-router";

import { EditorialPage } from "@/components/editorial-page";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/privacy")({
  head: ({ match }) => pageHead("/privacy", match.search.lang, true),
  component: () => <EditorialPage page="privacy" title="Politique de confidentialité" />,
});