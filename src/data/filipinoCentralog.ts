import type { Project } from "./projects"
import { sourceReferences } from "./sourceReferences.ts"
import { testEvidence } from "./testEvidence.ts"
import { projectEvolution } from "./projectEvolution.ts"

export function translateCentraLog(project: Project): Project {
  return {
    ...project,
    title: "Pag-uugnay ng custody, maintenance, at halaga ng kagamitan.",
    context: "Proyekto sa paaralan",
    role: "Nag-iisang developer",
    description:
      "Isang system para sa lifecycle ng kagamitan, maramihang paglilipat, tala ng maintenance, pagkalkula ng depreciation, at pag-print ng property tag.",
    versionLabel: "Sinuring asset service at mga valuation strategy",
    versionSummary:
      "Ang mga source reference ay tumutukoy sa asset service at valuation strategy sa mga tiyak na commit. Hiwalay na gumagamit ng sample data ang calculator at lifecycle walkthrough ng portfolio.",
    imageAlt:
      "Dashboard ng CentraLog para sa pamamahala at halaga ng kagamitan",
    imageCaption:
      "Magkakasamang makikita sa asset register ang pagkakakilanlan, lokasyon, halaga, at maintenance status ng kagamitan upang makatulong sa pagsusuri ng inventory at lifecycle.",
    caseStudy: {
      problem:
        "Kailangang malaman ng institusyon kung nasaan ang kagamitan, sino ang may pananagutan dito, at kung ginagamit o inaayos ito. Iniuugnay ng CentraLog ang pisikal na pagsubaybay sa pagkalkula ng halaga gamit ang kasaysayan ng maintenance.",
      contribution:
        "Binuo ko ang CentraLog nang mag-isa bilang proyekto sa paaralan. Ako ang nag-implement ng asset lifecycle, backend service, frontend workflow, at mga valuation strategy.",
      audience:
        "Mga kawani ng inventory · manager · accountant · administrator",
      architecture: [
        { name: "Interface", detail: "React / TypeScript" },
        { name: "API", detail: "ASP.NET Core / JWT" },
        { name: "Domain", detail: "Mga depreciation strategy / worker" },
        { name: "Imbakan", detail: "EF Core / MySQL o MariaDB" },
      ],
      workflow: [
        {
          title: "Itala at i-activate",
          detail:
            "Gumawa ng asset record at ilipat ito mula procurement patungo sa aktibong kagamitan.",
        },
        {
          title: "Ilipat nang may tala",
          detail:
            "Ina-update ng maramihang paglilipat ang lokasyon at custodian habang nagdadagdag ng audit entry sa loob ng transaction.",
        },
        {
          title: "Subaybayan ang maintenance",
          detail:
            "Itala ang panahon ng repair at gumamit ng periodic worker upang mag-flag ng service threshold.",
        },
        {
          title: "Kalkulahin at mag-ulat",
          detail:
            "Gamitin ang straight-line o double-declining valuation ayon sa maintenance-adjustment policy ng application, saka mag-print ng report o property tag.",
        },
      ],
      challenge:
        "Maaaring hindi na tumugma ang nakaimbak na halaga sa kasaysayan ng maintenance kapag nagbago ang mga tala.",
      approach:
        "Gumamit ng mga napagpapalit na depreciation strategy upang kalkulahin ang halaga mula sa asset at maintenance record kapag binabasa ito. Pagsamahin ang pagbabago sa maraming asset at audit entry sa loob ng EF Core transaction.",
      tradeoff:
        "May dagdag na computation ang pagkalkula kapag binabasa ang tala, ngunit hindi na kailangan ng hiwalay na cached valuation. Ang panahon ng repair ay sinusunod ayon sa tahasang downtime-adjustment policy ng application.",
    },
  }
}
const sourceCopy = [
  {
    title: "Straight-line na pagkalkula ng halaga",
    description:
      "Ibinabawas ng strategy ang naitalang araw ng maintenance mula sa lumipas na panahon, kinakalkula ang buwanang depreciation, at nililimitahan ang rounded result sa salvage value.",
  },
  {
    title: "Double-declining na pagkalkula ng halaga",
    description:
      "Gumagamit ang napagpapalit na strategy ng pababang factor para sa natitirang halaga batay sa aktibong buwan. Pareho nitong sinusunod ang maintenance-day adjustment at salvage-value floor.",
  },
  {
    title: "Paglilipat ng asset na may audit entry",
    description:
      "Ina-update ng bulk transfer ang kuwarto at custodian kasama ang audit record sa loob ng EF Core transaction. Tinatanggihan nito ang asset na nasa maintenance o disposed na.",
  },
]
export const filipinoCentraLogSources = sourceReferences.centralog.map(
  (record, index) => ({ ...record, ...sourceCopy[index] }),
)
export const filipinoCentraLogTests = testEvidence.centralog.map(
  (record, index) => ({
    ...record,
    ...[
      {
        title: "Hindi maaaring ilipat ang disposed na asset",
        scenario:
          "Nagpapadala ang authenticated manager ng bulk transfer para sa asset na disposed sa test database.",
        expectedOutcome:
          "Nagbabalik ang transfer endpoint ng HTTP 422 (Unprocessable Entity).",
        scopeDetail:
          "ASP.NET Core integration test gamit ang hiwalay na MySQL database. Response status ang sinusuri; hindi nito ina-assert ang rollback o nilalaman ng audit record.",
      },
      {
        title: "Pansamantalang humihinto ang sample valuation habang inaayos",
        scenario:
          "Kinakalkula ng dalawang valuation strategy ang sample value bago, habang, at matapos ang naitalang panahon ng repair.",
        expectedOutcome:
          "Nananatili sa repair-start amount ang halaga habang inaayos. Bumaba ito kapag nagpatuloy ang aktibong panahon, at mas mataas kaysa sa kalkulasyong walang repair adjustment.",
        scopeDetail:
          "Sinusuri ang portfolio calculator gamit ang fixed sample input. Hindi nito pinapatakbo ang C# strategy ng CentraLog o kumokonekta sa asset ledger.",
      },
    ][index],
  }),
)
export const filipinoCentraLogMilestones = projectEvolution.centralog.map(
  (record, index) => ({
    ...record,
    ...[
      {
        title: "Magdagdag ng napagpapalit na valuation strategy",
        change:
          "Idinagdag ang straight-line at double-declining strategy class, na pinipili gamit ang enum.",
        reason:
          "Bigyan ng sariling implementation ang bawat formula gamit ang asset at maintenance input.",
        outcome:
          "Parehong ibinabawas ang naitalang repair time at sinusunod ang salvage-value floor. Tahasang application policy ang maintenance adjustment.",
      },
      {
        title: "Kalkulahin ayon sa hangganan ng araw sa kalendaryo",
        change:
          "Ginawang petsa ang evaluation, asset-start, at maintenance timestamp upang palitan ang fractional elapsed day ng buong araw.",
        reason:
          "Iwasan ang pagbabago ng ipinapakitang halaga bawat segundo kapag hindi nagbago ang mga tala.",
        outcome:
          "Araw ang precision ng kalkulasyon. Ipinagpapalit ang sub-day na pagbabago para sa pare-parehong resulta sa bawat araw.",
      },
      {
        title: "Ihiwalay ang procurement total sa depreciated value",
        change:
          "Ginawang kabuuan ng naitalang procurement cost ang inventory dashboard total sa halip na calculated depreciated value. Nagdagdag din ng unit test.",
        reason:
          "Ibase ang inventory summary sa naitalang halaga ng pagbili habang nananatili sa financial ledger ang valuation na nagbabago sa panahon.",
        outcome:
          "Nakabatay ang dashboard total sa procurement record. Magkaibang tanong sa pag-uulat ang sinasagot ng dalawang total.",
      },
    ][index],
  }),
)
