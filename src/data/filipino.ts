import { professionalContent } from "./professionalProfile.ts"

export const filipinoProjectCopy: Record<string, {
  summary: string
  version: string
}> = {
  isdalog: {
    summary:
      "Binuo ko ang IsdaLog bilang sariling proyekto matapos mapansin ang kakulangan ng transparency sa kalakalan ng pangisdaan sa aming lugar. Iniuugnay nito ang pagtatala ng huli, bidding, pagsubaybay sa delivery, at settlement ng bayad.",
    version:
      "Ipinapakita ng walkthrough ang dokumentadong 97/3 na hatian. Ang nakaugnay na order controller ay nagbibigay ng halaga sa mangingisda at rider, ngunit walang tahasang pag-credit sa bahagi ng platform.",
  },
  dormfix: {
    summary:
      "Ipinanukala ng aking kaklase ang capstone na ito; ako ang nag-implement ng mga feature bilang bahagi ng pangkat. Pinag-uugnay ng DormFix ang pag-apruba sa tenant, pagtatalaga ng kuwarto, pagsusuri ng resibo, maintenance, at messaging.",
    version:
      "Ang paliwanag ay tungkol sa naunang OCR, lokal na Ollama, Zod-defined response format, at SQL Server na disenyo. Gumagamit ng Gemini at PostgreSQL ang mga mas bagong rebisyon; makikita ang mga pagbabago sa timeline ng proyekto.",
  },
  centralog: {
    summary:
      "Sarili kong proyekto sa paaralan ang CentraLog. Iniuugnay nito ang pagtatalaga at paglilipat ng asset, maintenance, at pagkalkula ng halaga upang masundan ang pisikal at pinansyal na kasaysayan ng kagamitan.",
    version:
      "Ang paliwanag ay nakabatay sa sinuring asset service at mga depreciation strategy. Hiwalay ang mga halimbawang simulation sa live na application at sa aktuwal na mga tala ng asset.",
  },
  pharmalink: {
    summary:
      "Sarili kong proyekto sa paaralan ang PharmaLink. Pinagsasama nito ang mga benta at inventory ng botika, na may role-based access at mga adjustment na nagpapanatili ng orihinal na tala.",
    version:
      "Ang backend na disenyo ay mula sa dokumentasyon. Ang direktang sinuring code ay para sa client-side adjustment at mga API contract; hiwalay dito ang halimbawang simulation ng portfolio.",
  },
}

export const filipinoProfile = professionalContent.fil.profile
export const filipinoProfessionalPages = professionalContent.fil.pages
