/**
 * Editorial cluster added October 2026: malls, society maps, cities and
 * land-measurement guides. Each article is written answer-first (AEO), uses
 * real headings, comparison tables and FAQs, and links into the matching
 * live pages (malls, maps, city hubs, tools) to build the topical network.
 *
 * Body blocks support a small markdown subset rendered by <ArticleBody>:
 *   "## Heading" / "### Heading", "- item" lists, "1. item" lists,
 *   "> tip" callouts, "| a | b |" tables, **bold** and [label](/href) links.
 *
 * Mall and DHA facts are generated from the same datasets that power the
 * /malls and /maps pages, so an article can never contradict the directory.
 * Existing (already indexed) articles live in seed-content.ts / seed-data.ts
 * and are intentionally left untouched.
 */
import { MALLS, type Mall } from "@/lib/malls";
import { DHA_SOCIETY_MAPS } from "@/lib/map-library";

export type BlogFaq = { question: string; answer: string };

export type BlogPost2026 = {
  slug: string;
  title: string;
  /** Optional SEO title when it should differ from the on-page H1. */
  seoTitle?: string;
  category: "Malls" | "Maps" | "Cities" | "Guides";
  excerpt: string;
  body: string[];
  author: string;
  readMinutes: number;
  tags: string[];
  cover: string;
  links: { label: string; href: string }[];
  publishedAt: string;
  updatedAt: string;
  keyTakeaways: string[];
  faqs: BlogFaq[];
};

const AUTHOR = "Properties Pak Research";

/* ------------------------------------------------------------------ */
/* Helpers that turn the mall / map datasets into article blocks       */
/* ------------------------------------------------------------------ */

function mallFacts(mall: Mall) {
  const facts = [
    mall.status === "open" ? (mall.opened ? `opened ${mall.opened}` : "open") : mall.expected || "upcoming",
    mall.developer,
    mall.sizeLabel,
    mall.storesLabel,
  ].filter(Boolean);
  return facts.join(" · ");
}

function mallBullet(mall: Mall) {
  return `- **[${mall.name}](/malls/${mall.slug})** — ${mall.area}. ${mallFacts(mall)}. ${mall.description}`;
}

function mallsIn(cities: string[], status: Mall["status"]) {
  return MALLS.filter((mall) => cities.includes(mall.city) && mall.status === status);
}

function bulletBlock(malls: Mall[]) {
  return malls.map(mallBullet).join("\n");
}

function sizedMallTable() {
  const sized = MALLS.filter((mall) => mall.status === "open" && mall.sizeLabel && /sq ft/.test(mall.sizeLabel));
  const value = (label: string) => {
    const match = label.replace(/,/g, "").match(/([\d.]+)\s*(million)?/i);
    if (!match) return 0;
    return parseFloat(match[1]) * (match[2] ? 1_000_000 : 1);
  };
  const rows = sized
    .sort((a, b) => value(b.sizeLabel!) - value(a.sizeLabel!))
    .map((mall, index) => `| ${index + 1} | [${mall.name}](/malls/${mall.slug}) | ${mall.city} | ${mall.sizeLabel} | ${mall.opened ?? "—"} |`);
  return ["| # | Mall | City | Reported size | Opened |", "| --- | --- | --- | --- | --- |", ...rows].join("\n");
}

function dhaTable(city: string) {
  const rows = DHA_SOCIETY_MAPS.filter((society) => society.city === city).map(
    (society) =>
      `| [${society.name}](/maps/dha-societies/${society.slug}) | ${society.blocks > 0 ? society.blocks : "—"} | ${society.image ? "HD map available" : "Map being prepared"} |`,
  );
  return ["| Society / phase | Blocks / sectors on map | Map status |", "| --- | --- | --- |", ...rows].join("\n");
}

const openMallCount = MALLS.filter((mall) => mall.status === "open").length;
const upcomingMalls = MALLS.filter((mall) => mall.status === "upcoming");
const mallCities = Array.from(new Set(MALLS.map((mall) => mall.city)));
const dhaLahore = DHA_SOCIETY_MAPS.filter((society) => society.city === "Lahore");
const dhaIslamabad = DHA_SOCIETY_MAPS.filter((society) => society.city === "Islamabad");

/* ------------------------------------------------------------------ */
/* Articles                                                            */
/* ------------------------------------------------------------------ */

export const BLOG_POSTS_2026: BlogPost2026[] = [
  /* ============================ MALLS ============================ */
  {
    slug: "biggest-shopping-malls-in-pakistan",
    title: "Biggest Shopping Malls in Pakistan (2026): Size, City and What's Inside",
    category: "Malls",
    excerpt:
      "LuckyOne in Karachi, Emporium and Dolmen Mall in Lahore, Northwalk and Packages Mall — Pakistan's largest malls ranked by reported size, with what each offers and what they mean for nearby property.",
    body: [
      "## Short answer: which is the biggest mall in Pakistan?",
      "By reported built-up area, **[LuckyOne Mall](/malls/luckyone-mall-karachi)** on Rashid Minhas Road, Karachi is the biggest shopping mall in Pakistan at roughly 3.4 million sq ft. In Lahore, **[Emporium Mall](/malls/emporium-mall-lahore)** in Johar Town (≈ 2.7 million sq ft) is the largest by total area, while **[Dolmen Mall Lahore](/malls/dolmen-mall-lahore)** in DHA Phase 6 (opened December 2024) is reported as the largest by gross leasable retail area.",
      "> Size figures are the widely published developer and press numbers. Malls measure differently — some quote total built-up area including hotels, parking and offices, others quote only leasable retail space — so treat the ranking as indicative rather than exact.",
      "## Pakistan's largest malls by reported size",
      sizedMallTable(),
      "## What makes a mall 'big' in Pakistan?",
      "Pakistan's mega-malls are mixed-use destinations rather than pure shopping centres. The largest ones combine several of the following, which is why their reported areas are so high:",
      "- **Anchor retail and international brands** on multiple levels around a central atrium.\n- **Food courts and family entertainment** — cinemas, indoor play zones and, in some cases, ice rinks or theme-park style attractions.\n- **Hotels, offices or apartments** in the same complex (Emporium has a five-star hotel; several Karachi and Islamabad malls sit under office or residential towers).\n- **Multi-level parking**, which can account for a large share of built-up area.",
      "## The big malls city by city",
      "### Karachi",
      "Karachi has the largest single mall (LuckyOne) and the densest mall network, from the Dolmen chain (Clifton, Tariq Road, Hyderi) to [The Northwalk](/malls/northwalk-mall-karachi) in North Nazimabad. Read the full [Karachi shopping malls guide](/blog/shopping-malls-in-karachi-guide).",
      "### Lahore",
      "Lahore's three heavyweights — Emporium, Packages Mall and the new Dolmen Mall in DHA Phase 6 — sit in very different neighbourhoods (Johar Town, Walton Road and DHA), which spreads retail demand across the city. See the [Lahore shopping malls guide](/blog/best-shopping-malls-in-lahore).",
      "### Islamabad and Rawalpindi",
      "[The Centaurus](/malls/centaurus-mall-islamabad) in F-8 and [Giga Mall](/malls/giga-mall-islamabad) on GT Road (DHA Phase 2) are the twin cities' anchors, with large new projects under construction. See the [Islamabad & Rawalpindi malls guide](/blog/shopping-malls-in-islamabad-rawalpindi).",
      "## Why mall size matters for property buyers",
      "A large, well-occupied mall changes the micro-market around it: it brings footfall, jobs and road upgrades, and it usually lifts demand for rental apartments and commercial space within a short drive. It can also bring traffic congestion on event days. Our analysis of [how malls affect nearby property prices](/blog/shopping-malls-property-value-pakistan) covers both sides.",
      `Properties Pak's [mall directory](/malls) currently tracks ${openMallCount} open malls and ${upcomingMalls.length} announced or under-construction projects across ${mallCities.length} cities.`,
    ],
    author: AUTHOR,
    readMinutes: 7,
    tags: ["Shopping Malls", "Karachi", "Lahore", "Islamabad", "Commercial Property"],
    cover: "/images/malls/luckyone-mall-karachi.jpg",
    links: [
      { label: "All shopping malls in Pakistan", href: "/malls" },
      { label: "LuckyOne Mall Karachi", href: "/malls/luckyone-mall-karachi" },
      { label: "Emporium Mall Lahore", href: "/malls/emporium-mall-lahore" },
      { label: "Dolmen Mall Lahore", href: "/malls/dolmen-mall-lahore" },
      { label: "Commercial property in Karachi", href: "/commercial-property-in-karachi" },
      { label: "Commercial property in Lahore", href: "/commercial-property-in-lahore" },
    ],
    publishedAt: "2026-10-17T23:51:00+05:00",
    updatedAt: "2026-10-17T23:51:00+05:00",
    keyTakeaways: [
      "LuckyOne Mall, Karachi (≈ 3.4 million sq ft) is reported as Pakistan's largest mall.",
      "Emporium Mall (≈ 2.7 million sq ft) is Lahore's largest by total area; Dolmen Mall Lahore (2024) is reported as the largest by leasable retail area.",
      "Mall sizes are measured differently (built-up vs leasable), so rankings are indicative.",
      "Large, well-occupied malls usually lift rental and commercial demand nearby.",
    ],
    faqs: [
      {
        question: "Which is the biggest mall in Pakistan?",
        answer:
          "LuckyOne Mall on Rashid Minhas Road, Karachi is generally reported as the biggest mall in Pakistan, at roughly 3.4 million square feet of built-up area.",
      },
      {
        question: "Which is the biggest mall in Lahore?",
        answer:
          "Emporium Mall in Johar Town is Lahore's largest mall by total area (about 2.7 million sq ft). Dolmen Mall Lahore in DHA Phase 6, opened in December 2024, is reported as the largest by gross leasable retail area.",
      },
      {
        question: "Which is the biggest mall in Islamabad?",
        answer:
          "The Centaurus in F-8 and Giga Mall on GT Road (DHA Phase 2) are the two largest operating malls in the Islamabad–Rawalpindi area, with several larger projects such as Mall of Islamabad under construction.",
      },
      {
        question: "Do big malls increase nearby property prices?",
        answer:
          "Usually they increase demand for rental apartments and commercial space nearby because of footfall, jobs and road upgrades, but the effect depends on occupancy, access and parking. Compare asking prices before and after a mall opens rather than relying on marketing claims.",
      },
    ],
  },
  {
    slug: "best-shopping-malls-in-lahore",
    title: "Best Shopping Malls in Lahore (2026 Guide by Area)",
    category: "Malls",
    excerpt:
      "Emporium, Packages Mall, Dolmen Mall DHA, Mall of Lahore, Fortress Square and more — every major Lahore mall by neighbourhood, with opening year, developer and what the area means for property.",
    body: [
      "## Lahore's best malls at a glance",
      "If you only have time for one: **[Emporium Mall](/malls/emporium-mall-lahore)** in Johar Town is the biggest, **[Dolmen Mall Lahore](/malls/dolmen-mall-lahore)** in DHA Phase 6 is the newest flagship (December 2024), and **[Packages Mall](/malls/packages-mall-lahore)** on Walton Road is the most central large mall for Gulberg, Cantt and Model Town.",
      "## Open malls in Lahore",
      bulletBlock(mallsIn(["Lahore"], "open")),
      "## Upcoming and under-construction malls in Lahore",
      bulletBlock(mallsIn(["Lahore"], "upcoming")),
      "> Upcoming project dates are indicative. Developers revise timelines; confirm approvals and construction progress before buying any shop or apartment off-plan.",
      "## Malls by area: what it means for property",
      "| Area | Main malls | Property angle |\n| --- | --- | --- |\n| Johar Town / Expo Centre | Emporium Mall | Strong rental demand for apartments and family homes; busy commercial strips |\n| Gulberg / M.M. Alam Road | Xinhua Mall, Gulberg Galleria, Siddiq Trade Center, Vogue Towers | Prime commercial and office market; high land values |\n| Walton Road / Cantt | Packages Mall (Walton Road), Mall of Lahore and Fortress Square (Cantt) | Central access from Gulberg, Cantt and Model Town |\n| DHA Phase 6 / Ring Road | Dolmen Mall Lahore, Avenue Mall (Main Boulevard DHA) | New retail anchor for DHA's eastern phases |\n| Raiwind Road / Bahria / Ferozepur Road | Jasmine Grand Mall, Orchard Mall, upcoming Prime Mall Al Kabir, Icon Mall and Lahore Sky Mall | Value housing belt with growing community retail |",
      "## Buying near a Lahore mall: three checks",
      "1. **Walk the traffic.** Visit on a weekend evening — mall traffic on Main Boulevard Gulberg or near the Expo Centre can define daily life on adjacent streets.\n2. **Compare rents, not just prices.** A mall's strongest effect is usually on rental demand; check rents for apartments within 2–3 km on [property for rent in Lahore](/property-for-rent-in-lahore).\n3. **Verify the society.** For plots near new malls on Raiwind Road or Ring Road, confirm the housing scheme's approval and see its layout on our [society maps](/maps).",
      "## Related reading",
      "Compare Lahore's malls with the rest of the country in [biggest shopping malls in Pakistan](/blog/biggest-shopping-malls-in-pakistan), or explore [best areas to buy property in Lahore](/blog/best-areas-to-buy-property-in-lahore).",
    ],
    author: AUTHOR,
    readMinutes: 8,
    tags: ["Shopping Malls", "Lahore", "Commercial Property", "DHA Lahore"],
    cover: "/images/malls/emporium-mall-lahore.jpg",
    links: [
      { label: "Lahore city guide", href: "/city/lahore" },
      { label: "Property for sale in Lahore", href: "/property-for-sale-in-lahore" },
      { label: "Commercial property in Lahore", href: "/commercial-property-in-lahore" },
      { label: "Towns & societies in Lahore", href: "/towns/lahore" },
      { label: "All malls in Pakistan", href: "/malls" },
    ],
    publishedAt: "2026-10-17T23:39:00+05:00",
    updatedAt: "2026-10-17T23:39:00+05:00",
    keyTakeaways: [
      "Emporium Mall (Johar Town) is Lahore's largest mall; Dolmen Mall in DHA Phase 6 is the newest flagship (December 2024).",
      "Packages Mall on Walton Road is the most central large mall for Gulberg, Cantt and Model Town.",
      "Gulberg's malls sit in Lahore's prime commercial belt; Raiwind Road malls serve the value housing belt.",
      "Near any mall, compare rental demand and weekend traffic before you buy.",
    ],
    faqs: [
      {
        question: "Which is the best mall in Lahore?",
        answer:
          "Emporium Mall in Johar Town is the largest and most complete (retail, food court, cinema and a five-star hotel). Dolmen Mall in DHA Phase 6 is the newest flagship, and Packages Mall on Walton Road is the most central large mall.",
      },
      {
        question: "Which is the newest mall in Lahore?",
        answer: "Dolmen Mall Lahore in DHA Phase 6 opened in December 2024 and is the newest major mall in the city.",
      },
      {
        question: "How many malls are there in Lahore?",
        answer: `The Properties Pak mall directory lists ${mallsIn(["Lahore"], "open").length} open malls in Lahore and ${mallsIn(["Lahore"], "upcoming").length} announced or under-construction projects.`,
      },
      {
        question: "Is it a good idea to buy an apartment near a Lahore mall?",
        answer:
          "It can be for rental income, because malls create jobs and footfall, but check weekend traffic, parking and the building's approvals, and compare rents within 2–3 km before deciding.",
      },
    ],
  },
  {
    slug: "shopping-malls-in-karachi-guide",
    title: "Shopping Malls in Karachi: Complete 2026 Guide",
    category: "Malls",
    excerpt:
      "From LuckyOne — Pakistan's largest mall — to Dolmen City, Ocean Mall, The Northwalk and Saddar's classic centres: every major Karachi mall by area, with facts and property insights.",
    body: [
      "## Karachi's malls at a glance",
      "Karachi has Pakistan's largest mall, **[LuckyOne](/malls/luckyone-mall-karachi)** (≈ 3.4 million sq ft, Federal B Area), and the country's longest-running modern mall brand, Dolmen, whose [Tariq Road](/malls/dolmen-mall-tariq-road-karachi) branch opened in 2001 and [Clifton](/malls/dolmen-mall-clifton-karachi) flagship in 2011. North Nazimabad's Hyderi area has become a mall cluster of its own.",
      "## Open malls in Karachi",
      bulletBlock(mallsIn(["Karachi"], "open")),
      "## Karachi's mall clusters",
      "| Cluster | Malls | Who it serves |\n| --- | --- | --- |\n| Clifton / Marine Drive | Dolmen City, Ocean Mall, Park Towers, The Forum | DHA, Clifton and Bath Island households; tourists |\n| Rashid Minhas Road | LuckyOne, Millennium Mall, RJ Mall | Gulshan, Gulistan-e-Jauhar, FB Area |\n| Hyderi / North Nazimabad | Dolmen Hyderi, The Northwalk, Saima Paari | North Karachi and Nazimabad families |\n| Saddar / I.I. Chundrigar | Atrium, Star City, Emerald Tower | Office workers and central city shoppers |",
      "## What Karachi's malls mean for property",
      "- **Clifton and DHA**: malls reinforce already-premium apartment demand; sea-facing towers command the highest rents.\n- **Rashid Minhas Road**: LuckyOne made this corridor a regional destination, supporting rental demand in Gulshan-e-Iqbal and Gulistan-e-Jauhar apartments.\n- **North Nazimabad**: the Hyderi mall cluster keeps family-home demand strong in an established, well-connected area.",
      "Karachi measures plots in **square yards** rather than marla. If you are comparing a 240 sq yd house in Karachi with a 10 marla house in Lahore, use our [marla, kanal and square feet guide](/blog/marla-kanal-square-feet-guide) or the [area converter](/tools/area-converter).",
      "## Related reading",
      "Browse [property for sale in Karachi](/property-for-sale-in-karachi), read [best areas to buy property in Karachi](/blog/best-areas-to-buy-property-in-karachi), or compare with [Pakistan's biggest malls](/blog/biggest-shopping-malls-in-pakistan).",
    ],
    author: AUTHOR,
    readMinutes: 7,
    tags: ["Shopping Malls", "Karachi", "Commercial Property", "Clifton"],
    cover: "/images/malls/dolmen-mall-clifton-karachi.jpg",
    links: [
      { label: "Karachi city guide", href: "/city/karachi" },
      { label: "Property for sale in Karachi", href: "/property-for-sale-in-karachi" },
      { label: "Property for rent in Karachi", href: "/property-for-rent-in-karachi" },
      { label: "Commercial property in Karachi", href: "/commercial-property-in-karachi" },
      { label: "All malls in Pakistan", href: "/malls" },
    ],
    publishedAt: "2026-10-17T23:35:00+05:00",
    updatedAt: "2026-10-17T23:35:00+05:00",
    keyTakeaways: [
      "LuckyOne (Federal B Area) is Karachi's — and Pakistan's — largest mall.",
      "Dolmen Tariq Road (2001) and Dolmen City Clifton (2011) pioneered modern malls in Karachi.",
      "Hyderi, North Nazimabad is a mall cluster with Dolmen Hyderi, The Northwalk and Saima Paari.",
      "Karachi plots are measured in square yards, not marla.",
    ],
    faqs: [
      {
        question: "Which is the biggest mall in Karachi?",
        answer: "LuckyOne Mall on Rashid Minhas Road, Federal B Area is Karachi's biggest mall, at roughly 3.4 million sq ft.",
      },
      {
        question: "Which are the best malls in Clifton, Karachi?",
        answer:
          "Dolmen City (Dolmen Mall Clifton) on Marine Drive is the flagship, alongside Ocean Mall in Clifton Block 9, Park Towers on Shahrah-e-Firdousi and The Forum on Khayaban-e-Jami.",
      },
      {
        question: "Which malls are in North Nazimabad?",
        answer: "The Hyderi area of North Nazimabad has Dolmen Mall Hyderi, The Northwalk (opened 2021) and Saima Paari Mall.",
      },
    ],
  },
  {
    slug: "shopping-malls-in-islamabad-rawalpindi",
    title: "Shopping Malls in Islamabad and Rawalpindi (2026 Guide)",
    category: "Malls",
    excerpt:
      "The Centaurus, Giga Mall, Safa Gold, Amazon Mall and Olympus — plus Mall of Islamabad, J7 Emporium and other projects under construction in the twin cities.",
    body: [
      "## Twin cities' malls at a glance",
      "**[The Centaurus](/malls/centaurus-mall-islamabad)** on Jinnah Avenue, F-8 (opened 2013) is Islamabad's best-known mall, while **[Giga Mall](/malls/giga-mall-islamabad)** on GT Road in DHA Phase 2 (opened 2016) anchors the Rawalpindi side of the capital. Sector markazes such as F-7 and F-11 host smaller malls, and several large projects are under construction.",
      "## Open malls",
      bulletBlock(mallsIn(["Islamabad", "Rawalpindi"], "open")),
      "## Under construction and announced",
      bulletBlock(mallsIn(["Islamabad", "Rawalpindi"], "upcoming")),
      "> Off-plan shops and apartments in mall projects carry delivery risk. Check the developer's track record, the approval status with the relevant authority and the payment plan's link to construction milestones.",
      "## What the malls mean for property in the twin cities",
      "- **F-8 / Blue Area**: The Centaurus and the planned Mall of Islamabad sit in the capital's prime commercial spine, supporting office and high-end apartment demand.\n- **GT Road / DHA Phase 2**: Giga Mall and Amazon Mall serve DHA Islamabad and Bahria Town; see the [DHA Islamabad map guide](/blog/dha-islamabad-map-guide) to locate phases.\n- **B-17 and the M-1 corridor**: upcoming projects such as J7 Emporium and Paradise Mall point to retail following new housing west and north of the city.",
      "## Related reading",
      "Compare investment options in [property investment in Islamabad](/blog/property-investment-islamabad-guide), browse [property for sale in Islamabad](/property-for-sale-in-islamabad) or see every mall in the [directory](/malls).",
    ],
    author: AUTHOR,
    readMinutes: 6,
    tags: ["Shopping Malls", "Islamabad", "Rawalpindi", "DHA Islamabad"],
    cover: "/images/malls/centaurus-mall-islamabad.jpg",
    links: [
      { label: "Islamabad city guide", href: "/city/islamabad" },
      { label: "Rawalpindi city guide", href: "/city/rawalpindi" },
      { label: "Property for sale in Islamabad", href: "/property-for-sale-in-islamabad" },
      { label: "Commercial property in Islamabad", href: "/commercial-property-in-islamabad" },
      { label: "All malls in Pakistan", href: "/malls" },
    ],
    publishedAt: "2026-10-17T23:31:00+05:00",
    updatedAt: "2026-10-17T23:31:00+05:00",
    keyTakeaways: [
      "The Centaurus (F-8, 2013) and Giga Mall (GT Road, DHA Phase 2, 2016) are the twin cities' anchor malls.",
      "Mall of Islamabad (Blue Area) and J7 Emporium (B-17) are among the large projects under construction.",
      "Retail is following new housing along GT Road, B-17 and the M-1 corridor.",
    ],
    faqs: [
      {
        question: "Which is the biggest mall in Islamabad?",
        answer:
          "The Centaurus in F-8 and Giga Mall on GT Road (DHA Phase 2) are the largest operating malls in the Islamabad–Rawalpindi area.",
      },
      {
        question: "Which new malls are coming to Islamabad?",
        answer:
          "Projects listed as under construction or announced include Mall of Islamabad (Blue Area), J7 Emporium (B-17), Magnus Mall (Gulberg Greens), Paradise Mall (New City Paradise) and Giga Boutique Mall next to Giga Mall.",
      },
      {
        question: "Which mall is near DHA Islamabad?",
        answer: "Giga Mall and Amazon Mall are both on GT Road beside DHA Phase 2 Islamabad.",
      },
    ],
  },
  {
    slug: "upcoming-shopping-malls-in-pakistan",
    title: "Upcoming Shopping Malls in Pakistan (2026): Projects Under Construction",
    category: "Malls",
    excerpt:
      "Every announced and under-construction mall project we track — Lahore Sky Mall, Mall of Islamabad, J7 Emporium, Grand Central Faisalabad and more — with a checklist before buying a shop off-plan.",
    body: [
      "## Short answer",
      `Properties Pak currently tracks ${upcomingMalls.length} announced or under-construction mall projects in ${Array.from(new Set(upcomingMalls.map((mall) => mall.city))).join(", ")}. Dates are indicative — developers revise them — so each project is listed with its stated status rather than a promised opening date.`,
      "## Upcoming malls by city",
      ...Array.from(new Set(upcomingMalls.map((mall) => mall.city))).flatMap((city) => [
        `### ${city}`,
        bulletBlock(upcomingMalls.filter((mall) => mall.city === city)),
      ]),
      "## Before you buy a shop or apartment in an upcoming mall",
      "1. **Approvals first.** Ask for the building-plan approval and NOC from the relevant development authority, and check that the plot's land use allows commercial construction.\n2. **Track record.** Visit the developer's completed projects and ask existing buyers about delivery.\n3. **Payment linked to progress.** Prefer plans where instalments follow documented construction milestones, not just calendar dates.\n4. **Exit and rental assumptions.** Model realistic rent and vacancy with the [rental yield calculator](/tools/rental-yield-calculator) instead of relying on brochure returns.\n5. **Documents in writing.** Allotment letter, payment schedule, unit size and possession terms should all be in the signed agreement — see the [property documentation checklist](/blog/property-documentation-checklist-pakistan).",
      "> No mall project should be sold to you with a 'guaranteed' return. Treat any such promise as a warning sign.",
      "## Related reading",
      "See which malls are already operating in [biggest shopping malls in Pakistan](/blog/biggest-shopping-malls-in-pakistan), or read [commercial property investment in Pakistan](/blog/commercial-property-investment-pakistan).",
    ],
    author: AUTHOR,
    readMinutes: 6,
    tags: ["Shopping Malls", "New Projects", "Commercial Property", "Investment"],
    cover: "/images/malls/mall-upcoming-render.jpg",
    links: [
      { label: "All malls in Pakistan", href: "/malls" },
      { label: "New projects", href: "/projects" },
      { label: "Rental yield calculator", href: "/tools/rental-yield-calculator" },
      { label: "ROI calculator", href: "/tools/roi-calculator" },
    ],
    publishedAt: "2026-10-17T23:19:00+05:00",
    updatedAt: "2026-10-17T23:19:00+05:00",
    keyTakeaways: [
      `${upcomingMalls.length} mall projects are tracked as announced or under construction.`,
      "Opening dates are indicative; confirm approvals and construction progress yourself.",
      "Prefer payment plans tied to documented construction milestones.",
      "Treat any 'guaranteed return' on a mall shop as a warning sign.",
    ],
    faqs: [
      {
        question: "Which new malls are being built in Lahore?",
        answer: `Projects tracked in Lahore include ${mallsIn(["Lahore"], "upcoming").map((mall) => mall.name).join(", ")}.`,
      },
      {
        question: "Is buying a shop in an under-construction mall a good investment?",
        answer:
          "It can be, but it carries delivery and vacancy risk. Verify approvals, the developer's track record and a milestone-linked payment plan, and model realistic rent before committing.",
      },
    ],
  },
  {
    slug: "shopping-malls-property-value-pakistan",
    title: "Do Shopping Malls Increase Property Value in Pakistan?",
    category: "Malls",
    excerpt:
      "How a new mall changes nearby house prices, apartment rents and commercial demand in Pakistani cities — the benefits, the traffic trade-off, and how to check the effect yourself.",
    body: [
      "## Short answer",
      "Usually yes for **rental demand and commercial space** within a short drive, and often for **apartment values**; the effect on quiet family housing directly beside a mall can be mixed because of traffic and noise. The impact depends on whether the mall is well occupied, how it connects to main roads and whether parking spills into residential streets.",
      "## Why malls move nearby demand",
      "- **Jobs and footfall**: a large mall can employ thousands of people, many of whom rent nearby.\n- **Infrastructure**: developers and authorities often upgrade roads, signals and utilities around big malls.\n- **Amenity value**: groceries, cinemas, dining and banking within a short drive are a selling point for families and tenants.\n- **Commercial spillover**: offices, clinics, gyms and restaurants cluster around successful malls.",
      "## The trade-offs",
      "- **Traffic** on weekends and holidays, especially on single access roads.\n- **Parking spillover** into adjacent streets.\n- **Noise and late hours** for houses directly on the mall's frontage.\n- **Oversupply risk** when several malls open in the same area, or when a mall struggles to fill shops.",
      "## How to check the effect yourself",
      "1. Compare asking prices and rents for the same property type **before and after** the mall's opening year using listings and the [Pakistan Property Price Index](/pakistan-property-price-index).\n2. Visit at **peak time** (Saturday evening) and note travel time to your street.\n3. Look at **occupancy**: a mall full of operating brands is a stronger signal than one with many empty units.\n4. Prefer properties **one or two streets back** from the main road — close enough for convenience, far enough from traffic.",
      "## Examples from the directory",
      "Lahore's [Emporium Mall](/malls/emporium-mall-lahore) turned the Johar Town–Expo Centre belt into a busy commercial and rental area; Karachi's [LuckyOne](/malls/luckyone-mall-karachi) made Rashid Minhas Road a regional destination; Islamabad's [Giga Mall](/malls/giga-mall-islamabad) gives DHA Phase 2 residents a major retail anchor on GT Road. Use these as starting points for your own price comparison rather than as a guarantee.",
      "## Related reading",
      "Read [commercial property investment in Pakistan](/blog/commercial-property-investment-pakistan), [house vs plot investment](/blog/house-vs-plot-investment-pakistan) and our [rental property guide](/blog/rental-property-guide-pakistan).",
    ],
    author: AUTHOR,
    readMinutes: 6,
    tags: ["Shopping Malls", "Investment", "Rental Yield", "Commercial Property"],
    cover: "/images/malls/mall-exterior-night.jpg",
    links: [
      { label: "Pakistan Property Price Index", href: "/pakistan-property-price-index" },
      { label: "Rental yield calculator", href: "/tools/rental-yield-calculator" },
      { label: "Investment projection calculator", href: "/tools/investment-calculator" },
      { label: "All malls in Pakistan", href: "/malls" },
    ],
    publishedAt: "2026-10-17T23:15:00+05:00",
    updatedAt: "2026-10-17T23:15:00+05:00",
    keyTakeaways: [
      "Malls usually lift rental and commercial demand within a short drive.",
      "Houses directly on a mall's frontage can suffer from traffic, parking and noise.",
      "Check occupancy, peak-time traffic and before/after prices yourself.",
      "One or two streets back from the main road is often the sweet spot.",
    ],
    faqs: [
      {
        question: "Does living near a mall increase house value in Pakistan?",
        answer:
          "Often it increases rental demand and apartment values nearby, but houses directly beside a mall can be affected by traffic and noise. The net effect depends on the mall's occupancy and road access.",
      },
      {
        question: "Is a shop in a mall a good investment in Pakistan?",
        answer:
          "Shops in well-occupied, established malls can produce steady rent; shops in new or half-empty malls carry vacancy risk. Model rent and vacancy with a rental yield calculator before buying.",
      },
    ],
  },

  /* ============================ MAPS ============================ */
  {
    slug: "how-to-read-housing-society-map-pakistan",
    title: "How to Read a Housing Society Map in Pakistan (Plots, Blocks and Sectors)",
    category: "Maps",
    excerpt:
      "Plot numbers, blocks, sectors, road widths, corner and park-facing plots, commercial zones and possession status — a step-by-step guide to reading any society master plan before you buy.",
    body: [
      "## Short answer",
      "A housing society map (master plan) shows how the scheme is divided into **phases, sectors or blocks**, and within them **numbered plots** of standard sizes, with roads, parks, mosques, schools and commercial areas marked. To read it, locate the block, find the plot number, then check the plot's size, road width, orientation and what sits next to it.",
      "## Step-by-step: reading a society map",
      "1. **Find the legend.** It explains colours for residential, commercial, parks, graveyards, schools, utilities and future or unacquired land.\n2. **Locate the phase and block/sector.** Large schemes are split into phases (e.g. DHA Phase 6) and then blocks or sectors (A, B, C…). The same plot number can exist in several blocks, so the block is part of the address.\n3. **Find the plot number.** Plot numbers usually run in sequence along a street; corner plots often carry a separate mark.\n4. **Check the plot size.** Maps label sizes (5 marla, 10 marla, 1 kanal, or square yards in Karachi). Confirm which marla definition the society uses — see the [marla, kanal and square feet guide](/blog/marla-kanal-square-feet-guide).\n5. **Read the road width.** Wider roads (e.g. 60–100 ft boulevards) mean better access but more traffic; 30–40 ft streets are quieter.\n6. **Note the surroundings.** Park-facing and corner plots usually carry a premium; plots beside grid stations, nullahs or graveyards are often cheaper.\n7. **Check status.** Some areas on a master plan may be undeveloped, under acquisition or 'future' land. Confirm possession status with the society.",
      "## Common terms on Pakistani society maps",
      "| Term | What it means |\n| --- | --- |\n| Phase | A large development stage of the scheme, often with its own possession timeline |\n| Block / Sector | A sub-division inside a phase, named by letters or numbers |\n| Corner plot | A plot on two roads — more light and access, usually priced higher |\n| Park-facing | Fronts a park or green belt — usually priced higher |\n| Main boulevard | Primary wide road; good for commercial, busier for homes |\n| Possession | The society has handed over the plot for construction |\n| File / affidavit | A paper entitlement before a specific plot is allotted — higher risk |\n| Ballot | The draw that converts files into specific plot numbers |",
      "## Where to see HD society maps",
      "Properties Pak hosts [57+ downloadable society PDF maps](/maps), [HD maps of 37 DHA societies](/maps/dha-societies) and zoomable plot-level maps of [Bahria Town Lahore](/maps/bahria-town-lahore-map), [Bahria Orchard](/maps/bahria-orchard-lahore-map), [LDA Avenue 1](/maps/lda-avenue-map), [Lake City](/maps/lake-city-map) and [Al Kabir Town](/maps/al-kabir-town-map).",
      "> A map shows the plan, not the legal position. Before paying, confirm the plot's allotment, dues and transfer history in writing with the society office.",
      "## Using the map in a real deal",
      "- Ask the seller for the **exact plot number and block**, then find it on the map yourself.\n- Visit the plot and match the **physical location** (corners, roads, park) to the map.\n- Ask the society for a **site plan or demarcation** of that specific plot.\n- Check the plot is not affected by a **road widening, grid station or revised layout**.",
      "## Related reading",
      "Start with the [DHA Lahore phases map guide](/blog/dha-lahore-phases-map-guide) or the [DHA Islamabad map guide](/blog/dha-islamabad-map-guide).",
    ],
    author: AUTHOR,
    readMinutes: 7,
    tags: ["Society Maps", "Plots", "Buying Guide", "DHA", "Bahria Town"],
    cover: "/images/blog/society-map-cover.webp",
    links: [
      { label: "Society PDF maps", href: "/maps" },
      { label: "DHA societies HD maps", href: "/maps/dha-societies" },
      { label: "Bahria Town Lahore map", href: "/maps/bahria-town-lahore-map" },
      { label: "Lake City Lahore map", href: "/maps/lake-city-map" },
      { label: "Plot size calculator", href: "/tools/plot-size-calculator" },
    ],
    publishedAt: "2026-10-17T23:43:00+05:00",
    updatedAt: "2026-10-17T23:43:00+05:00",
    keyTakeaways: [
      "A society map divides the scheme into phases, blocks/sectors and numbered plots.",
      "Always read plot number together with block and phase — numbers repeat across blocks.",
      "Corner and park-facing plots usually carry a premium; check road width and surroundings.",
      "A map shows the plan, not legal title — verify allotment and dues with the society.",
    ],
    faqs: [
      {
        question: "How do I find my plot on a society map?",
        answer:
          "Identify the phase and block or sector first, then follow the street numbering to the plot number. Because plot numbers repeat across blocks, always use phase + block + plot number together.",
      },
      {
        question: "What is the difference between a block and a sector?",
        answer:
          "Both are sub-divisions of a housing scheme. Some societies call them blocks (e.g. Block A), others sectors (e.g. Sector C); they serve the same purpose on the map.",
      },
      {
        question: "Why are corner plots more expensive?",
        answer: "Corner plots face two roads, so they get more light, ventilation and access, and allow more design flexibility. Societies often charge an extra premium for them too.",
      },
      {
        question: "Where can I download society maps in Pakistan?",
        answer:
          "Properties Pak offers 57+ downloadable society PDF maps at propertiespak.com/maps and HD maps of 37 DHA societies at propertiespak.com/maps/dha-societies.",
      },
    ],
  },
  {
    slug: "dha-lahore-phases-map-guide",
    title: "DHA Lahore Map Guide: Phases 1 to 13 Explained",
    category: "Maps",
    excerpt: `A phase-by-phase guide to DHA Lahore — Phase 1 to Phase 13 (DHA City), Phase 8 extensions, Phase 9 Prism and Town, and Rahbar — with block counts and links to all ${dhaLahore.length} HD maps.`,
    body: [
      "## Short answer",
      "DHA Lahore is organised into numbered phases. The **older phases (1–6)** are mostly built and populated, **Phases 7–9** are in active construction with newer blocks, and **Phases 10–13** (including Rahbar, EME and DHA City) are the newest expansion areas. Each phase is split into lettered blocks or sectors, and plot addresses always include phase + block + plot number.",
      "## All DHA Lahore phases with HD maps",
      dhaTable("Lahore"),
      "## How the phases differ",
      "- **Phases 1–4**: established, close to Cantt and the city; mostly constructed houses and mature commercial areas.\n- **Phases 5–6**: highly sought-after family areas; Phase 6 now has [Dolmen Mall Lahore](/malls/dolmen-mall-lahore) nearby.\n- **Phase 7**: large, still building up; popular for long-term plot holding.\n- **Phase 8** and its extensions (**Ex Air Avenue, Ex Park View, Ivy Green**): close to the airport and Ring Road, with a mix of possession status.\n- **Phase 9 Prism and Phase 9 Town**: Prism is a large new phase; Phase 9 Town is a smaller, more affordable area with 5 and 10 marla homes.\n- **Phases 10–13 (incl. Rahbar, EME, DHA City)**: newest areas — check possession and development status block by block.",
      "> Possession and development status changes block by block. Use the map to locate a plot, then confirm its status and dues with the DHA office before paying.",
      "## How to use the HD maps",
      "Open any phase from the table to see its sectors, then zoom in to read plot numbers. You can switch between the HD layout and satellite imagery to compare the plan with what is actually built. For the full list including Islamabad, Karachi and other cities, see [all DHA society maps](/maps/dha-societies).",
      "## Related reading",
      "Learn the basics in [how to read a housing society map](/blog/how-to-read-housing-society-map-pakistan), compare [DHA vs Bahria Town](/blog/dha-vs-bahria-town-comparison), or browse [property for sale in DHA Lahore](/property-for-sale/dha-lahore).",
    ],
    author: AUTHOR,
    readMinutes: 6,
    tags: ["Society Maps", "DHA Lahore", "Lahore", "Plots"],
    cover: "/images/blog/society-map-cover.webp",
    links: [
      { label: "DHA Lahore maps", href: "/maps/dha-societies?city=Lahore" },
      { label: "Property for sale in DHA Lahore", href: "/property-for-sale/dha-lahore" },
      { label: "DHA Lahore Phase 6 map", href: "/maps/dha-societies/phase-6-lahore" },
      { label: "Lahore city guide", href: "/city/lahore" },
      { label: "Society PDF maps", href: "/maps" },
    ],
    publishedAt: "2026-10-17T23:27:00+05:00",
    updatedAt: "2026-10-17T23:27:00+05:00",
    keyTakeaways: [
      `Properties Pak hosts HD maps for ${dhaLahore.length} DHA Lahore phases and extensions.`,
      "Phases 1–6 are mostly built; Phases 7–9 are building up; Phases 10–13 are the newest.",
      "Addresses always need phase + block + plot number.",
      "Confirm possession and dues with DHA before paying — maps show the plan, not status.",
    ],
    faqs: [
      {
        question: "How many phases does DHA Lahore have?",
        answer:
          "DHA Lahore runs from Phase 1 to Phase 13 (DHA City), plus extensions such as Phase 8 Ex Air Avenue, Ex Park View and Ivy Green, and Phase 9 Prism and Phase 9 Town.",
      },
      {
        question: "Where can I see the DHA Lahore map with plot numbers?",
        answer: "Open any phase at propertiespak.com/maps/dha-societies?city=Lahore and zoom in to read sector and plot numbers on the HD map.",
      },
      {
        question: "Which DHA Lahore phase is best to buy in?",
        answer:
          "It depends on budget and timeline: Phases 1–6 suit buyers who want built, established areas; Phases 7–9 suit medium-term holders; Phases 10–13 are the newest and need careful checks on possession and development status.",
      },
    ],
  },
  {
    slug: "dha-islamabad-map-guide",
    title: "DHA Islamabad Map Guide: Phases 1 to 7, Valley, Margalla and River View",
    category: "Maps",
    excerpt: `Phase-by-phase guide to DHA Islamabad–Rawalpindi — Phases 1 to 6, DHA Valley, Emaar Canyon Views, Margalla Enclave and Orchard, River View — with links to all ${dhaIslamabad.length} HD maps.`,
    body: [
      "## Short answer",
      "DHA Islamabad sits along GT Road and the Islamabad Expressway between Islamabad and Rawalpindi. **Phases 1 and 2** are the most established, **Phases 3–6** are newer or still developing, **Phase 7 (DHA Valley)** is a separate large scheme, and projects such as **Emaar Canyon Views, Margalla Enclave, Margalla Orchard and River View** are distinct communities within or beside DHA.",
      "## All DHA Islamabad maps",
      dhaTable("Islamabad"),
      "## Getting your bearings",
      "- **Phase 2** sits on GT Road with [Giga Mall](/malls/giga-mall-islamabad) and [Amazon Mall](/malls/amazon-mall-islamabad) at its gate — it is the phase most buyers know first.\n- **Phase 1** is close to the Islamabad Expressway and Defence Road.\n- **Phases 3–6** extend further out; development and possession vary sector by sector.\n- **DHA Valley (Phase 7)** is a large, separately planned area — check development status carefully.",
      "> Maps help you locate a sector and plot. Development, possession and dues must be confirmed with DHA Islamabad–Rawalpindi before any payment.",
      "## Related reading",
      "Read [how to read a housing society map](/blog/how-to-read-housing-society-map-pakistan), [Bahria Town vs DHA Islamabad](/blog/bahria-town-vs-dha-islamabad) and [property investment in Islamabad](/blog/property-investment-islamabad-guide).",
    ],
    author: AUTHOR,
    readMinutes: 5,
    tags: ["Society Maps", "DHA Islamabad", "Islamabad", "Rawalpindi"],
    cover: "/images/blog/society-map-cover.webp",
    links: [
      { label: "DHA Islamabad maps", href: "/maps/dha-societies?city=Islamabad" },
      { label: "DHA Phase 2 Islamabad map", href: "/maps/dha-societies/phase-2-islamabad" },
      { label: "Property for sale in DHA Islamabad", href: "/property-for-sale/dha-islamabad" },
      { label: "Islamabad city guide", href: "/city/islamabad" },
    ],
    publishedAt: "2026-10-17T23:23:00+05:00",
    updatedAt: "2026-10-17T23:23:00+05:00",
    keyTakeaways: [
      `HD maps cover ${dhaIslamabad.length} DHA Islamabad phases and communities.`,
      "Phases 1–2 are the most established; Phase 2 sits on GT Road beside Giga Mall.",
      "DHA Valley, Emaar Canyon Views, Margalla and River View are distinct communities.",
      "Confirm development and possession sector by sector.",
    ],
    faqs: [
      {
        question: "How many phases does DHA Islamabad have?",
        answer:
          "DHA Islamabad–Rawalpindi has Phases 1 to 6 plus Phase 7 (DHA Valley), with additional communities such as Emaar Canyon Views, DHA Margalla Enclave, Margalla Orchard and River View North and South.",
      },
      {
        question: "Which mall is in DHA Phase 2 Islamabad?",
        answer: "Giga Mall (World Trade Center) and Amazon Mall are on GT Road at DHA Phase 2 Islamabad.",
      },
    ],
  },

  /* ============================ GUIDES ============================ */
  {
    slug: "marla-kanal-square-feet-guide",
    title: "Marla, Kanal, Square Feet and Square Yards: Pakistan Land Measurement Guide",
    category: "Guides",
    excerpt:
      "1 marla = 225 or 272.25 sq ft? How many marla in a kanal, square yards in a marla, and kanals in an acre — with conversion tables and the rule societies actually use.",
    body: [
      "## Short answer",
      "- **1 marla = 225 sq ft** in most housing societies (DHA, Bahria Town, LDA schemes), or **272.25 sq ft** in traditional Punjab revenue records.\n- **1 kanal = 20 marla** = 4,500 sq ft (225-based) or 5,445 sq ft (272.25-based).\n- **1 square yard (gaz) = 9 sq ft.**\n- **1 acre = 8 kanal = 160 marla** = 43,560 sq ft.",
      "## Why are there two marla sizes?",
      "Pakistan's land records historically use a marla of **272.25 sq ft** (30.25 square yards). Most modern housing societies standardised on a rounder **225 sq ft** marla (25 square yards). Both are in daily use, so the same '10 marla' plot can mean 2,250 sq ft in one society and 2,722.5 sq ft elsewhere. Always ask which definition applies before comparing prices.",
      "## Conversion table",
      "| Unit | 225 sq ft marla | 272.25 sq ft marla |\n| --- | --- | --- |\n| 1 marla | 225 sq ft · 25 sq yd | 272.25 sq ft · 30.25 sq yd |\n| 3 marla | 675 sq ft | 816.75 sq ft |\n| 5 marla | 1,125 sq ft · 125 sq yd | 1,361.25 sq ft · 151.25 sq yd |\n| 7 marla | 1,575 sq ft | 1,905.75 sq ft |\n| 10 marla | 2,250 sq ft · 250 sq yd | 2,722.5 sq ft · 302.5 sq yd |\n| 1 kanal (20 marla) | 4,500 sq ft · 500 sq yd | 5,445 sq ft · 605 sq yd |\n| 2 kanal | 9,000 sq ft · 1,000 sq yd | 10,890 sq ft · 1,210 sq yd |",
      "## Karachi uses square yards",
      "In Karachi, plots are quoted in **square yards**: 120, 240, 500 and 1,000 sq yd are common sizes. A 240 sq yd plot is 2,160 sq ft — slightly under a 10 marla (225) plot. A 500 sq yd plot equals exactly 1 kanal on the 225 sq ft definition.",
      "## Acres, kanals and murabba (agricultural land)",
      "For agricultural land: **1 acre = 8 kanal = 160 marla** (on the 272.25 sq ft marla, which is what revenue records use), and a **murabba** (square) is traditionally 25 acres.",
      "## Do it instantly",
      "Use the [area unit converter](/tools/area-converter) to switch between marla, kanal, square feet, square yards, square metres and acres with either marla definition, or the [plot size calculator](/tools/plot-size-calculator) to turn dimensions (e.g. 25×45 ft) into marla and price.",
      "> Common plot dimensions: 5 marla ≈ 25×45 ft, 10 marla ≈ 35×65 ft, 1 kanal ≈ 50×90 ft on the 225 sq ft marla. Societies vary, so check the allotment documents.",
      "## Related reading",
      "Read [how to read a housing society map](/blog/how-to-read-housing-society-map-pakistan), the [construction cost guide](/blog/construction-cost-guide-pakistan) and [house vs plot investment](/blog/house-vs-plot-investment-pakistan).",
    ],
    author: AUTHOR,
    readMinutes: 6,
    tags: ["Marla", "Kanal", "Land Measurement", "Plots", "Buying Guide"],
    cover: "/images/blog/plot-measurement-cover.webp",
    links: [
      { label: "Area unit converter", href: "/tools/area-converter" },
      { label: "Plot size & price calculator", href: "/tools/plot-size-calculator" },
      { label: "5 marla plots for sale in Lahore", href: "/5-marla-plot-for-sale-in-lahore" },
      { label: "10 marla houses for sale in Lahore", href: "/10-marla-house-for-sale-in-lahore" },
      { label: "1 kanal houses for sale in Islamabad", href: "/1-kanal-house-for-sale-in-islamabad" },
    ],
    publishedAt: "2026-10-17T23:47:00+05:00",
    updatedAt: "2026-10-17T23:47:00+05:00",
    keyTakeaways: [
      "1 marla = 225 sq ft in most societies, 272.25 sq ft in revenue records.",
      "1 kanal = 20 marla; 1 acre = 8 kanal = 160 marla.",
      "1 square yard = 9 sq ft; Karachi plots are quoted in square yards.",
      "Always confirm which marla definition a plot uses before comparing prices.",
    ],
    faqs: [
      { question: "How many square feet are in 1 marla?", answer: "1 marla is 225 sq ft in most housing societies and 272.25 sq ft in traditional Punjab revenue records." },
      { question: "How many marla are in 1 kanal?", answer: "1 kanal = 20 marla. That is 4,500 sq ft on the 225 sq ft marla or 5,445 sq ft on the 272.25 sq ft marla." },
      { question: "How many square feet are in 1 kanal?", answer: "1 kanal is 4,500 sq ft (225 sq ft marla) or 5,445 sq ft (272.25 sq ft marla)." },
      { question: "How many kanal are in 1 acre?", answer: "1 acre = 8 kanal = 160 marla = 43,560 sq ft." },
      { question: "How many square yards are in 1 marla?", answer: "1 marla is 25 square yards (225 sq ft marla) or 30.25 square yards (272.25 sq ft marla)." },
      { question: "How many square feet is a 5 marla house?", answer: "A 5 marla plot is 1,125 sq ft on the 225 sq ft marla, or 1,361.25 sq ft on the 272.25 sq ft marla. Covered area of a house depends on the number of storeys." },
    ],
  },
  {
    slug: "overseas-pakistanis-property-buying-guide",
    title: "Buying Property in Pakistan from Abroad: A Guide for Overseas Pakistanis",
    category: "Guides",
    excerpt:
      "How overseas Pakistanis can shortlist, verify, pay for and transfer property in Pakistan remotely — power of attorney, Roshan Digital Account, video viewings and the checks you should never skip.",
    body: [
      "## Short answer",
      "You can buy property in Pakistan while living abroad by shortlisting online, verifying the plot or house through a trusted local representative and the society office, paying through formal banking channels (such as a Roshan Digital Account), and completing the transfer either in person on a visit or through a properly executed **power of attorney**.",
      "## Step 1: Shortlist remotely",
      "- Search live listings by city and size on [Properties Pak](/properties) and filter for verified dealers.\n- Study the society layout on our [maps](/maps) and the area's amenities (schools, hospitals, [malls](/malls)).\n- Ask for a **live video walk-through** of the property and the street — not just photos.",
      "## Step 2: Verify before any token",
      "1. Get the **exact plot number, block and phase** and the seller's CNIC copy.\n2. Ask the society for **ownership and dues confirmation** in writing.\n3. Check the **chain of title** — every previous transfer letter or registry.\n4. For constructed houses, check the **approved building plan** and completion certificate.\n5. Follow our full [property documentation checklist](/blog/property-documentation-checklist-pakistan).",
      "## Step 3: Pay through formal channels",
      "Send money through banking channels so the trail is documented — a **Roshan Digital Account (RDA)** is designed for non-resident Pakistanis and supports property investment in Pakistan. Avoid cash or informal transfers; pay tokens and instalments against signed documents only.",
      "## Step 4: Transfer — in person or by power of attorney",
      "- **In person**: plan the transfer around a visit; both parties attend the society or registrar office.\n- **Power of attorney (POA)**: appoint a trusted family member. A POA executed abroad is usually attested by the Pakistani embassy or consulate. Keep its scope specific to the property and transaction.",
      "> Never give a broad, open-ended power of attorney to a dealer or a person you have not known for years. Most overseas property frauds start with a POA or an unverified file.",
      "## Taxes and filer status",
      "Being a tax filer generally lowers withholding taxes on property purchase and sale in Pakistan. Rules change in each budget, so estimate with the [property tax calculator](/tools/property-tax-calculator) and read the [FBR property tax guide](/blog/fbr-property-tax-guide-pakistan).",
      "## Financing options",
      "Some banks offer home financing to non-resident Pakistanis, including Islamic options; compare instalments with the [Islamic home financing calculator](/tools/islamic-financing-calculator) and the [mortgage calculator](/tools/mortgage-calculator).",
      "## Talk to the desk",
      "Our [international desk](/contact) can share verified listings, arrange video viewings and connect you with verified dealers in Lahore, Islamabad and Karachi.",
    ],
    author: AUTHOR,
    readMinutes: 7,
    tags: ["Overseas Pakistanis", "Buying Guide", "Documentation", "Legal"],
    cover: "/images/blog/overseas-buyer-cover.webp",
    links: [
      { label: "Verified dealers", href: "/dealers" },
      { label: "Property documentation checklist", href: "/blog/property-documentation-checklist-pakistan" },
      { label: "Property tax calculator", href: "/tools/property-tax-calculator" },
      { label: "Islamic home financing calculator", href: "/tools/islamic-financing-calculator" },
      { label: "Contact the international desk", href: "/contact" },
    ],
    publishedAt: "2026-10-17T23:11:00+05:00",
    updatedAt: "2026-10-17T23:11:00+05:00",
    keyTakeaways: [
      "Shortlist online, but verify ownership and dues with the society in writing.",
      "Pay only through formal banking channels such as a Roshan Digital Account.",
      "Use a specific, embassy-attested power of attorney given to someone you trust.",
      "Filer status usually lowers withholding taxes — check the current budget rules.",
    ],
    faqs: [
      {
        question: "Can overseas Pakistanis buy property in Pakistan?",
        answer:
          "Yes. Overseas Pakistanis can buy property in Pakistan in their own name, paying through formal banking channels and completing the transfer in person or through a power of attorney.",
      },
      {
        question: "Can I buy property in Pakistan through a Roshan Digital Account?",
        answer: "Yes. The Roshan Digital Account is designed for non-resident Pakistanis and supports investment in property in Pakistan through formal banking channels.",
      },
      {
        question: "How do I transfer property in Pakistan while abroad?",
        answer:
          "Either attend the transfer in person during a visit, or appoint a trusted person through a power of attorney attested by the Pakistani embassy or consulate, limited to the specific property and transaction.",
      },
    ],
  },

  /* ============================ CITIES ============================ */
  {
    slug: "best-cities-to-invest-in-property-pakistan",
    title: "Best Cities to Invest in Property in Pakistan (2026)",
    category: "Cities",
    excerpt:
      "Lahore, Islamabad, Karachi, Rawalpindi, Faisalabad, Multan, Gujranwala and Peshawar compared — demand drivers, typical buyers, societies to research and where to start your search.",
    body: [
      "## Short answer",
      "For most buyers, **Lahore, Islamabad–Rawalpindi and Karachi** are the deepest, most liquid property markets in Pakistan. **Faisalabad, Multan, Gujranwala and Peshawar** offer lower entry prices and growing planned societies, but with thinner resale markets. The 'best' city depends on whether you want rental income, long-term capital growth or a home to live in.",
      "## City comparison at a glance",
      "| City | Market depth | Typical strengths | Start here |\n| --- | --- | --- | --- |\n| Lahore | Very deep | Planned societies (DHA, Bahria, LDA), strong end-user demand | [Lahore hub](/city/lahore) |\n| Islamabad | Deep | Planned sectors, government and corporate demand, apartments | [Islamabad hub](/city/islamabad) |\n| Karachi | Very deep | Largest city, apartments and commercial, sea-facing premium | [Karachi hub](/city/karachi) |\n| Rawalpindi | Deep | Twin-city access, Bahria Town and DHA, value vs Islamabad | [Rawalpindi hub](/city/rawalpindi) |\n| Faisalabad | Medium | Industrial base, new societies, lower entry prices | [Faisalabad hub](/city/faisalabad) |\n| Multan | Medium | DHA Multan and planned schemes, regional hub | [Multan hub](/city/multan) |\n| Gujranwala | Medium | Industrial city, DHA Gujranwala, GT Road access | [Gujranwala hub](/city/gujranwala) |\n| Peshawar | Medium | Regional capital, DHA Peshawar, Hayatabad | [Peshawar hub](/city/peshawar) |",
      "## Lahore",
      "Pakistan's most active housing market for planned societies. Research DHA Lahore (see the [phases map guide](/blog/dha-lahore-phases-map-guide)), Bahria Town, Lake City and LDA schemes. Strong retail anchors include [Emporium and Dolmen Mall](/blog/best-shopping-malls-in-lahore). Browse [towns & societies in Lahore](/towns/lahore).",
      "## Islamabad and Rawalpindi",
      "Islamabad's CDA sectors are supply-constrained, which keeps prices firm; Rawalpindi offers better value with twin-city access. Research DHA Islamabad ([map guide](/blog/dha-islamabad-map-guide)), Bahria Town and the B-17 / M-1 corridor. See [towns in Islamabad](/towns/islamabad) and [Rawalpindi](/towns/rawalpindi).",
      "## Karachi",
      "The largest city, with deep apartment and commercial markets; DHA Karachi, Clifton and Bahria Town Karachi are the main planned options, and plots are measured in square yards. See [towns in Karachi](/towns/karachi) and the [Karachi malls guide](/blog/shopping-malls-in-karachi-guide).",
      "## Faisalabad, Multan, Gujranwala and Peshawar",
      "Lower entry prices and growing planned societies make these cities attractive for first-time and long-term buyers. Liquidity is lower, so buy in established or well-approved schemes and plan for a longer holding period. Explore [Faisalabad](/towns/faisalabad), [Multan](/towns/multan), [Gujranwala](/towns/gujranwala) and [Peshawar](/towns/peshawar) societies.",
      "## How to choose",
      "1. **Define the goal**: rental income (apartments near jobs and malls), capital growth (plots in developing phases) or end use (built homes in established areas).\n2. **Check liquidity**: how many similar listings sell or rent each month in that area.\n3. **Verify the scheme**: approvals, possession and dues — see [how to read a society map](/blog/how-to-read-housing-society-map-pakistan).\n4. **Run the numbers** with the [investment calculator](/tools/investment-calculator) and [rental yield calculator](/tools/rental-yield-calculator).\n5. **Compare prices** across cities with the [Pakistan Property Price Index](/pakistan-property-price-index).",
      "> No city or society guarantees returns. Treat projections as scenarios and keep a margin for delays, taxes and vacancy.",
    ],
    author: AUTHOR,
    readMinutes: 8,
    tags: ["Investment", "Lahore", "Islamabad", "Karachi", "Rawalpindi", "Cities"],
    cover: "/images/cities/lahore-hd.webp",
    links: [
      { label: "Pakistan Property Price Index", href: "/pakistan-property-price-index" },
      { label: "Property for sale in Lahore", href: "/property-for-sale-in-lahore" },
      { label: "Property for sale in Islamabad", href: "/property-for-sale-in-islamabad" },
      { label: "Property for sale in Karachi", href: "/property-for-sale-in-karachi" },
      { label: "Investment projection calculator", href: "/tools/investment-calculator" },
      { label: "Towns & societies", href: "/towns" },
    ],
    publishedAt: "2026-10-17T23:55:00+05:00",
    updatedAt: "2026-10-17T23:55:00+05:00",
    keyTakeaways: [
      "Lahore, Islamabad–Rawalpindi and Karachi are Pakistan's deepest, most liquid property markets.",
      "Faisalabad, Multan, Gujranwala and Peshawar offer lower entry prices but thinner resale markets.",
      "Choose by goal: rental income, capital growth or end use.",
      "Verify the scheme and model returns conservatively — nothing is guaranteed.",
    ],
    faqs: [
      {
        question: "Which city is best for property investment in Pakistan?",
        answer:
          "Lahore, Islamabad–Rawalpindi and Karachi have the deepest markets and easiest resale. The best choice depends on your goal: rental income, long-term growth or a home to live in.",
      },
      {
        question: "Is Lahore or Islamabad better for property investment?",
        answer:
          "Lahore offers more planned-society choice and volume; Islamabad's sectors are supply-constrained, which keeps prices firm. Rawalpindi offers twin-city access at lower prices than Islamabad.",
      },
      {
        question: "Which cities have the cheapest property in Pakistan?",
        answer:
          "Among the cities Properties Pak covers, Faisalabad, Multan, Gujranwala and Peshawar generally have lower entry prices than Lahore, Islamabad and Karachi, with thinner resale markets.",
      },
    ],
  },
];

export const BLOG_POSTS_2026_BY_SLUG = new Map(BLOG_POSTS_2026.map((post) => [post.slug, post]));

/** Answer-first extras (key takeaways, FAQs, last-updated) for an article, when it has them. */
export function getBlogExtras(slug: string) {
  const post = BLOG_POSTS_2026_BY_SLUG.get(slug);
  if (!post) return null;
  return { keyTakeaways: post.keyTakeaways, faqs: post.faqs, updatedAt: post.updatedAt, seoTitle: post.seoTitle };
}
