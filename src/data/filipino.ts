import { professionalProfile } from "./professionalProfile.ts"

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

const periods = (value: string) =>
  value
    .replace("present", "kasalukuyan")
    .replace("Expected", "Inaasahang")
    .replace("August", "Agosto")
export const filipinoProfile = {
  ...professionalProfile,
  education: {
    ...professionalProfile.education,
    expectedCompletion: periods(
      professionalProfile.education.expectedCompletion,
    ),
  },
  currentFocus:
    "Pinauunlad ko ang portfolio na ito upang masuri ng mga bisita ang aking mga system, masundan ang mga halimbawang daloy, at makita ang code at mga test na sumusuporta sa mga desisyon sa engineering.",
  journey: professionalProfile.journey.map((item, index) => ({
    ...item,
    period: periods(item.period),
    ...[
      {
        title: "Mga workflow sa negosyo at pangkatang capstone",
        detail:
          "Kasama sa mga proyekto ko mula 2025 ang PharmaLink at DormFix. Sarili kong proyekto sa paaralan ang PharmaLink; ipinanukala ng aking kaklase ang DormFix, at nag-implement ako ng mga feature bilang bahagi ng capstone team.",
      },
      {
        title: "Pamamahala ng asset at lokal na pangisdaan",
        detail:
          "Sarili kong proyekto sa paaralan ang CentraLog. Sinimulan ko ang IsdaLog nang mapansin kong kulang ang transparency sa kalakalan ng pangisdaan sa aming lugar.",
      },
      {
        title: "BS Information Technology",
        detail:
          "Nag-aaral ako sa Dipolog Medical Center Incorporated sa Dipolog City. Inaasahan kong matatapos ang aking pag-aaral sa Agosto 2027.",
      },
    ][index],
  })),
  learningThemes: professionalProfile.learningThemes.map((item, index) => ({
    ...item,
    ...[
      {
        title: "Maaasahang mga tala",
        detail:
          "Mga transaction, pagbabago sa custody, kinakalkulang halaga, at kasaysayan ng adjustment sa aking mga proyekto.",
        label: "Basahin ang mga tala sa engineering (English)",
      },
      {
        title: "Malinaw na mga interface",
        detail:
          "Responsive na layout, accessible na pakikipag-ugnayan, at mga workflow na malinaw na nagpapakita ng mahahalagang pagbabago sa estado.",
        label: "Subukan ang mga halimbawang workflow (English)",
      },
      {
        title: "Engineering na maaaring suriin",
        detail:
          "Pagpapaliwanag ng mga desisyon gamit ang source reference, mga test scenario, at kasaysayan ng proyekto.",
        label: "Tuklasin ang mga proyekto",
      },
    ][index],
  })),
  workAreas: professionalProfile.workAreas.map((item, index) => ({
    ...item,
    ...[
      {
        title: "Full-stack na application para sa negosyo",
        detail:
          "Pag-usapan ang isang web application na nag-uugnay sa mga tungkulin ng staff, tala, dashboard, at malinaw na workflow.",
      },
      {
        title: "Mga API at daloy ng data",
        detail:
          "Pag-usapan kung paano dapat magkaugnay ang mga tala, pahintulot, audit history, at pagkalkula sa iyong system.",
      },
      {
        title: "Pagpapahusay sa umiiral na system",
        detail:
          "Pag-usapan ang isang interface, workflow, o integration na nangangailangan ng mas malinaw na kilos, mas mahusay na validation, o mas kapaki-pakinabang na karanasan.",
      },
    ][index],
  })),
  process: professionalProfile.process.map((item, index) => ({
    ...item,
    ...[
      {
        title: "Ilarawan ang problema",
        detail:
          "Ibahagi kung sino ang gagamit ng system, anong workflow ang kailangan, at anong mga limitasyon ang mahalaga.",
      },
      {
        title: "Tukuyin ang kapaki-pakinabang na saklaw",
        detail:
          "Tukuyin ang mga tala, tungkulin, interface, at mga sitwasyong maaaring magdulot ng pagkabigo.",
      },
      {
        title: "Suriin ang implementasyon",
        detail:
          "Gumamit ng mga gumaganang halimbawa, malinaw na trade-off, at angkop na pagsusuri upang pag-usapan ang resulta.",
      },
    ][index],
  })),
}

export const filipinoProfessionalPages = {
  "/about/": {
    label: "TUNGKOL / PAGLALAKBAY",
    title: "Natututo sa mga system na binubuo ko.",
    summary:
      "Ako si James Ian Bayonas, isang junior full-stack developer at mag-aaral ng BS Information Technology sa Dipolog City, Pilipinas. Pinag-uugnay ng aking mga proyekto ang interface, API, at mga tala sa magkakaugnay na workflow.",
  },
  "/now/": {
    label: "KASALUKUYANG GAWAIN",
    title: "Ang pinagtutuunan ko ngayon.",
    summary: filipinoProfile.currentFocus,
  },
  "/work-with-me/": {
    label: "PAANO AKO MAKAKATULONG",
    title: "Pag-usapan natin ang system na kailangan mo.",
    summary:
      "Tuklasin ang mga uri ng gawain sa aking mga proyekto, pagkatapos ay ilarawan ang gusto mong buuin, pagbutihin, o pag-usapan na oportunidad. Maaaring magsilbing panimulang halimbawa ang isang kaugnay na case study.",
  },
}
