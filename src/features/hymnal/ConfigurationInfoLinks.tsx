import { Info, Scale, ShieldCheck } from "lucide-react";
import { appInfo } from "@/lib/app-info";
import { InfoLinkRow } from "./InfoLinkRow";

export function ConfigurationInfoLinks() {
  return (
    <nav className="space-y-2" aria-label="Información y enlaces legales">
      <InfoLinkRow href={appInfo.aboutPath} label="Acerca de" icon={Info} />
      <InfoLinkRow href={appInfo.legal.termsPath} label="Términos de uso" icon={Scale} />
      <InfoLinkRow href={appInfo.legal.privacyPath} label="Política de privacidad" icon={ShieldCheck} />
    </nav>
  );
}
