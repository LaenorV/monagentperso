import { fr, type Dictionary, type QField } from "./fr";
import { en } from "./en";
import type { Locale } from "../config";

export type { Dictionary, QField };

export const dictionaries: Record<Locale, Dictionary> = { fr, en };
