import { createFileRoute } from "@tanstack/react-router";

import { EditorialPage } from "@/components/editorial-page";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/terms")({
  head: () => pageHead("/terms", "fr"),
  component: () => <EditorialPage page="terms" title="Conditions d'utilisation" />,
});