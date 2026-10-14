import { reflections } from "./reflections.ts"

export const reflectionPages = [
  {
    path: "/reflections/",
    title: "Reflections | James Ian Bayonas",
    description:
      "Reflections on contribution, collaboration, and explaining engineering decisions through James Ian Bayonas's documented projects.",
  },
  {
    path: "/fil/reflections/",
    title: "Mga Pagninilay | James Ian Bayonas",
    description:
      "Mga pagninilay tungkol sa ambag, pagtutulungan, at pagpapaliwanag ng mga desisyon sa engineering mula sa mga proyekto ni James Ian Bayonas.",
  },
  ...reflections.flatMap((reflection) => [
    {
      path: reflection.path,
      title: `${reflection.title} | James Ian Bayonas`,
      description: reflection.summary,
    },
    {
      path: `/fil${reflection.path}`,
      title: `${reflection.filipino.title} | James Ian Bayonas`,
      description: reflection.filipino.summary,
    },
  ]),
]
