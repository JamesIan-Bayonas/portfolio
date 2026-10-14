import type { Project } from "./projects"
import { sourceReferences } from "./sourceReferences.ts"
import { testEvidence } from "./testEvidence.ts"
import { projectEvolution } from "./projectEvolution.ts"

export function translateDormFix(project: Project): Project {
  return {
    ...project,
    title: "Magkaugnay na gawain para sa landlord at tenant.",
    context: "Pangkatang capstone",
    role: "Developer ng mga feature",
    description:
      "Ipinanukala ng aking kaklase ang capstone na ito; ako ang nag-implement ng mga feature bilang bahagi ng pangkat. Iniuugnay ng DormFix ang pag-apruba sa tenant, pagtatalaga ng kuwarto, pagsusuri ng resibo, maintenance, at messaging.",
    versionLabel: "Naunang disenyo gamit ang OCR at lokal na model",
    versionSummary:
      "Sinusundan ng case study ang naunang Tesseract, Ollama, Zod-defined response format, at SQL Server na disenyo. Gumagamit ng Gemini at PostgreSQL ang mga mas bagong rebisyon; makikita sa timeline ang mga pagbabagong ito.",
    imageAlt: "Dashboard ng DormFix para sa landlord at pamamahala ng property",
    imageCaption:
      "Pinagsasama ng landlord overview ang occupancy ng kuwarto, maintenance alert, at kamakailang gawain ng tenant at payment upang makita kung ano ang dapat asikasuhin.",
    caseStudy: {
      problem:
        "Mahirap sundan sa manual na logbook at magkakahiwalay na mensahe ang pag-apruba sa tenant, kapasidad ng kuwarto, isinumiteng bayad, at hindi pa naaayos na repair. Kailangan ng landlord at tenant ng magkakatugmang pananaw sa mga gawaing ito.",
      contribution:
        "Ipinanukala ng aking kaklase ang capstone; ako ang nag-implement ng mga feature bilang bahagi ng pangkat.",
      audience: "Mga landlord · tenant",
      architecture: [
        { name: "Interface", detail: "React / mga view ayon sa tungkulin" },
        { name: "API", detail: "Express / TypeScript" },
        { name: "Pagsusuri ng resibo", detail: "Tesseract → Ollama → Zod" },
        { name: "Data at event", detail: "MSSQL / Socket.io" },
      ],
      workflow: [
        {
          title: "Iugnay at aprubahan",
          detail:
            "Nagpaparehistro ang tenant gamit ang landlord identifier at naghihintay ng pag-apruba.",
        },
        {
          title: "Magtalaga ng kuwarto",
          detail:
            "Sinusuri ang kapasidad ng kuwarto sa loob ng database transaction bago magtalaga.",
        },
        {
          title: "Suriin ang bayad",
          detail:
            "Kinukuha ng OCR ang teksto sa resibo; ginagawa ng lokal na model ang structured field para sa pagsusuri ng halaga at petsa.",
        },
        {
          title: "Ayusin ang mga problema",
          detail:
            "Kinakategorya ang maintenance description at sinusuri ang urgency, habang pinag-uugnay ng messaging ang tenant at landlord.",
        },
      ],
      challenge:
        "Magkakaiba ang format ng payment screenshot at maaaring mali ang halaga o luma ang petsa.",
      approach:
        "Ihiwalay ang OCR at lokal na model parsing sa business check. Gumamit ng Zod-defined response format, saka ihambing ang extracted field sa isinumiteng payment detail. Hindi hiwalay na bina-validate ng sinuring parser ang parsed JSON nito.",
      tradeoff:
        "Walang hosted-model API fee ang naunang lokal na pipeline, ngunit kailangan nito ng server compute. Hindi ginagarantiya ng hiniling na response shape ang tamang extraction; kailangan pa rin ang business check at pagsusuri ng landlord.",
    },
  }
}
const sources = [
  {
    title: "Mula teksto ng resibo patungo sa structured field",
    description:
      "Kinukuha ng Tesseract ang teksto sa resibo, saka ipinapadala ito sa lokal na Ollama model kasama ang Zod-defined response format para sa payment field.",
    context:
      "Ito ang naunang lokal na pipeline na inilalarawan ng case study. Gemini na ang ginagamit ng kasalukuyang service; hindi hiwalay na bina-validate ng Zod response format na ito ang parsed JSON sa runtime.",
  },
  {
    title: "Pagsusuri ng halaga at petsa",
    description:
      "Naglalagay ng flag ang payment controller para sa resibong lampas pitong araw, hindi tugmang nonzero na halaga, at nabigong analysis. Itinatala nito ang resulta para sa pagsusuri ng landlord.",
    context:
      "Ginagamit ng mas bagong bersiyong ito ang kasalukuyang analysis service. Hiwalay ang mga check na ito sa naunang parsing implementation sa itaas.",
  },
]
export const filipinoDormFixSources = sourceReferences.dormfix.map(
  (record, index) => ({ ...record, ...sources[index] }),
)
export const filipinoDormFixTests = testEvidence.dormfix.map(
  (record, index) => ({
    ...record,
    ...[
      {
        title: "Hiwalay pa rin ang landlord review matapos ang scan",
        scenario:
          "Tumatanggap ang payment presentation helper ng pending, anomalous, verified, at unknown na status, kasama ang scan response.",
        expectedOutcome:
          "Ang pending ay naghihintay ng landlord review; ang verified ay na-verify ng landlord. Nananatiling unknown ang kulang na scan data, at string warning lamang ang pinananatili.",
        scopeDetail:
          "DormFix client unit test para sa status at response helper. Hindi saklaw ang OCR, model accuracy, at server approval rule.",
      },
      {
        title: "Saklaw ng receipt flag ang hangganan at kulang na field",
        scenario:
          "Umaabot ang sample receipt sa pitong-araw na hangganan, lumalampas dito, o kulang ang halaga, edad, o reference data.",
        expectedOutcome:
          "Walang age flag sa pitong araw; mayroon sa walong araw. Humihingi ng review ang bawat kulang na field, at dalawang flag ang sabay na problema sa halaga at edad.",
        scopeDetail:
          "Sinusuri ang fixed receipt walkthrough logic ng portfolio. Walang OCR o inference na pinapatakbo at walang payment update.",
      },
    ][index],
  }),
)
export const filipinoDormFixMilestones = projectEvolution.dormfix.map(
  (record, index) => ({
    ...record,
    ...[
      {
        title: "Kunin muna ang teksto bago ang model parsing",
        change:
          "Pinalitan ang direktang receipt-image input sa lokal na model ng Tesseract text extraction na sinusundan ng Ollama parsing.",
        reason:
          "Bigyan ng magkahiwalay na pananagutan ang text extraction at structured payment-field parsing.",
        outcome:
          "OCR text ang tinatanggap ng model kasama ang Zod-defined response format. Parehong nananatiling operational dependency ang OCR at lokal na model.",
      },
      {
        title: "Ilipat sa Gemini ang receipt at maintenance parsing",
        change:
          "Pinalitan ang lokal na Ollama client at response format ng Gemini call at provider response schema para sa payment at maintenance analysis.",
        reason:
          "Panatilihin ang structured analysis habang binabago kung saan tumatakbo ang model inference.",
        outcome:
          "Sa rebisyong ito, Tesseract pa rin ang receipt extraction. Kailangan na ng Gemini API key at access sa hosted service ang parsing; naunang disenyo ang lokal na pipeline sa case study.",
      },
      {
        title: "Ihanda ang PostgreSQL storage at deployment configuration",
        change:
          "Inilipat ang SQL Server data access sa PostgreSQL, nagdagdag ng Supabase schema file, Render deployment configuration, at database integration test.",
        reason:
          "Iangkop ang umiiral na workflow at transaction handling sa bagong database at hosting configuration.",
        outcome:
          "Gumagamit na ang mga repository ng PostgreSQL query at shared transaction helper. May kasamang schema at deployment work ang migration; hindi pinatutunayan ng commit na ito ang matagumpay na release.",
      },
    ][index],
  }),
)
