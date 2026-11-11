import { createFileRoute } from "@tanstack/react-router";

import { EditorialPage } from "@/components/editorial-page";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/methodologie")({
  head: () => pageHead("/methodologie", "fr"),
  component: () => <EditorialPage page="methodologie" title="Méthodologie et sources" />,
});