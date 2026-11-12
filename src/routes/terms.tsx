import { createFileRoute } from "@tanstack/react-router";

import { EditorialPage } from "@/components/editorial-page";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/terms")({
  head: ({ match }) => pageHead("/terms", match.search.lang, true),
  component: () => <EditorialPage page="terms" title="Conditions d'utilisation" />,
});