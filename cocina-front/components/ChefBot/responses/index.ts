import type { ResponseData } from "./types";
import { esData } from "./es";
import { enData } from "./en";
import { frData } from "./fr";

const localeMap: Record<string, ResponseData> = {
  es: esData,
  en: enData,
  fr: frData,
};

export function getResponseData(locale: string): ResponseData {
  return localeMap[locale] ?? esData;
}
