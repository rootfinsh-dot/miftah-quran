import type { Dict } from "@/lib/i18n";
import { common } from "./common";
import { index } from "./home";
import { comptage } from "./comptage";
import { statistiques } from "./statistiques";
import { motifs } from "./motifs";
import { gematrie } from "./gematrie";
import { fourchette } from "./fourchette";
import { editorial } from "./editorial";
import { pricing } from "./pricing";
import { siteInterface } from "./site-interface";

export const DICTIONARY: Dict = {
  ...common,
  ...index,
  ...comptage,
  ...statistiques,
  ...motifs,
  ...gematrie,
  ...fourchette,
  ...editorial,
  ...pricing,
  ...siteInterface,
};
