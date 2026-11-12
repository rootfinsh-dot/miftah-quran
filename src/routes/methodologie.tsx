import { createFileRoute } from "@tanstack/react-router";

import { EditorialPage } from "@/components/editorial-page";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/methodologie")({
  head: ({ match }) => pageHead("/methodologie", match.search.lang, true),
  component: () => <EditorialPage page="methodologie" title="Méthodologie et sources" />,
});