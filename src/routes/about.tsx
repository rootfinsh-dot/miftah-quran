import { createFileRoute } from "@tanstack/react-router";

import { EditorialPage } from "@/components/editorial-page";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/about")({
  head: ({ match }) => pageHead("/about", match.search.lang, true),
  component: () => <EditorialPage page="about" title="À propos de Miftah" />,
});