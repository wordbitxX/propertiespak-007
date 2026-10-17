"use client";

import { useLanguage } from "@/components/language-provider";

/**
 * Renders a shared-UI string in the visitor's chosen language. Server
 * components can drop this in for headings/copy so the Urdu toggle covers
 * them too; listing data and user content are never passed through here.
 */
export function TranslatedText({ text }: { text: string }) {
  const { t } = useLanguage();
  return <>{t(text)}</>;
}
