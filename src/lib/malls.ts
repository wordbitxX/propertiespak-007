/**
 * Pakistan shopping mall directory — open malls and publicly announced
 * upcoming projects, curated as a static dataset so every entry gets a
 * stable, indexable page (`/malls/<slug>`) without a database migration.
 *
 * Facts are limited to widely published figures (developer/press reports);
 * anything uncertain is left out rather than guessed. Upcoming projects are
 * labelled as announced/under construction and their dates are indicative —
 * developers revise them, and the pages say so.
 */

export type MallStatus = "open" | "upcoming";

export type Mall = {
  slug: string;
  name: string;
  city: string;
  /** Matches a `/city/<slug>` hub when the marketplace covers that city. */
  citySlug?: string;
  area: string;
  status: MallStatus;
  opened?: string;
  expected?: string;
  developer?: string;
  sizeLabel?: string;
  storesLabel?: string;
  description: string;
  highlights: string[];
  featured?: boolean;
};

export const MALLS: Mall[] = [
  /* ---------------- Lahore ---------------- */
  {
    slug: "emporium-mall-lahore",
    name: "Emporium Mall",
    city: "Lahore",
    citySlug: "lahore",
    area: "Johar Town, next to Lahore Expo Centre",
    status: "open",
    opened: "2016",
    developer: "Nishat Group",
    sizeLabel: "≈ 2.7 million sq ft",
    storesLabel: "200+ stores",
    description:
      "Lahore's flagship mega-mall in Johar Town: an 11-storey retail, dining and entertainment destination beside the Expo Centre, with a five-star hotel in the same complex.",
    highlights: ["Cinema & large food court", "International & local flagship brands", "Five-star hotel in the complex"],
    featured: true,
  },
  {
    slug: "packages-mall-lahore",
    name: "Packages Mall",
    city: "Lahore",
    citySlug: "lahore",
    area: "Walton Road, Gulberg edge",
    status: "open",
    opened: "2017",
    developer: "Packages Group",
    sizeLabel: "≈ 1.2 million sq ft",
    storesLabel: "200+ stores",
    description:
      "Packages Group's family-oriented mall on Walton Road, known for wide corridors, a large hypermarket anchor, multiplex cinema and one of Lahore's busiest food floors.",
    highlights: ["Hypermarket anchor", "Multiplex cinema", "Family dining floor"],
    featured: true,
  },
  {
    slug: "dolmen-mall-lahore",
    name: "Dolmen Mall Lahore",
    city: "Lahore",
    citySlug: "lahore",
    area: "DHA Phase 6, near Ring Road & airport corridor",
    status: "open",
    opened: "December 2024",
    developer: "Dolmen Group",
    sizeLabel: "≈ 2 million sq ft · largest GLA in Pakistan",
    storesLabel: "150+ stores",
    description:
      "Dolmen Group's first Punjab mall and Pakistan's largest by gross leasable area: three retail levels with international first-to-Pakistan brands, hypermarket, themed food streets and a Sindbad amusement park.",
    highlights: ["Largest GLA in the country", "First-to-Pakistan international brands", "2,000-car parking"],
    featured: true,
  },
  {
    slug: "mall-of-lahore",
    name: "Mall of Lahore",
    city: "Lahore",
    citySlug: "lahore",
    area: "Park Lane Tower, Cantt (near Mall Road)",
    status: "open",
    opened: "2015",
    developer: "Bahria Town (Park Lane)",
    sizeLabel: "≈ 650,000 sq ft",
    description:
      "A Cantt-side retail and corporate address combining shopping floors with offices and serviced apartments, anchored by the Green Valley hypermarket.",
    highlights: ["Retail + offices + apartments", "Hypermarket anchor", "Cantt / Mall Road catchment"],
  },
  {
    slug: "fortress-square-mall-lahore",
    name: "Fortress Square Mall",
    city: "Lahore",
    citySlug: "lahore",
    area: "Fortress Stadium, Cantt",
    status: "open",
    opened: "2014",
    description:
      "Five-storey mall inside the Fortress Stadium complex with 100+ outlets, cinema and a rooftop food court — a long-standing family leisure stop in Cantt.",
    highlights: ["100+ outlets", "Cinema", "Rooftop food court"],
  },
  {
    slug: "amanah-mall-lahore",
    name: "Amanah Mall",
    city: "Lahore",
    citySlug: "lahore",
    area: "Model Town Link Road",
    status: "open",
    description:
      "Model Town's entertainment-led mall with a trampoline park, VR attractions, cinema and multi-level parking serving the Model Town–Faisal Town belt.",
    highlights: ["Trampoline & VR parks", "Cinema", "Multi-basement parking"],
  },
  {
    slug: "avenue-mall-lahore",
    name: "Avenue Mall",
    city: "Lahore",
    citySlug: "lahore",
    area: "Main Boulevard, DHA Lahore",
    status: "open",
    description:
      "A ten-floor vertical mall on DHA's Main Boulevard — often cited as Lahore's tallest mall — mixing fashion, electronics and dining across compact stacked floors.",
    highlights: ["10 floors", "DHA Main Boulevard address", "Fashion & electronics mix"],
  },
  {
    slug: "xinhua-mall-lahore",
    name: "Xinhua Mall",
    city: "Lahore",
    citySlug: "lahore",
    area: "Gulberg III, near M.M. Alam Road catchment",
    status: "open",
    description:
      "A Gulberg fashion mall in Lahore's premium shopping district, popular for bridal, designer and occasion-wear boutiques near M.M. Alam Road.",
    highlights: ["Designer & bridal boutiques", "Gulberg premium district", "Food & coffee spots"],
  },
  {
    slug: "gulberg-galleria-lahore",
    name: "Gulberg Galleria",
    city: "Lahore",
    citySlug: "lahore",
    area: "Main Boulevard, Gulberg",
    status: "open",
    description:
      "A boutique-scale galleria on Gulberg's Main Boulevard with curated fashion, beauty and café tenants serving the central Lahore shopper.",
    highlights: ["Boutique brand mix", "Main Boulevard frontage", "Café culture"],
  },
  {
    slug: "siddiq-trade-center-lahore",
    name: "Siddiq Trade Center",
    city: "Lahore",
    citySlug: "lahore",
    area: "Main Boulevard, Gulberg",
    status: "open",
    description:
      "One of Gulberg's original shopping-and-office towers on Main Boulevard — a landmark mid-size centre for mobile, electronics and fashion retail.",
    highlights: ["Gulberg landmark", "Electronics & mobile market", "Retail + offices"],
  },
  {
    slug: "jasmine-grand-mall-lahore",
    name: "Jasmine Grand Mall",
    city: "Lahore",
    citySlug: "lahore",
    area: "Sector E, Bahria Town Lahore",
    status: "open",
    developer: "Q-Links",
    description:
      "Bahria Town Lahore's grand mall in Sector E with retail floors, a large food court and rooftop dining serving the whole Bahria–Raiwind corridor.",
    highlights: ["Bahria Town's main mall", "Rooftop dining", "Food court & brands"],
  },
  {
    slug: "pace-shopping-mall-lahore",
    name: "Pace Shopping Mall",
    city: "Lahore",
    citySlug: "lahore",
    area: "Gulberg / Model Town (Pace network)",
    status: "open",
    description:
      "Part of the long-running Pace retail network in Lahore, a value-fashion and family shopping staple across the city's central districts.",
    highlights: ["Value fashion", "Family shopping", "Central locations"],
  },
  {
    slug: "vogue-towers-lahore",
    name: "Vogue Towers",
    city: "Lahore",
    citySlug: "lahore",
    area: "M.M. Alam Road, Gulberg",
    status: "open",
    description:
      "A fashion-tower format on M.M. Alam Road focused on designer labels, beauty and lifestyle retail in Lahore's most premium shopping street.",
    highlights: ["M.M. Alam Road", "Designer labels", "Beauty & lifestyle"],
  },
  {
    slug: "lahore-sky-mall",
    name: "Lahore Sky Mall",
    city: "Lahore",
    citySlug: "lahore",
    area: "Ferozepur Road",
    status: "upcoming",
    expected: "Under construction",
    developer: "OZ Developers",
    description:
      "A large under-construction mall project on Ferozepur Road marketed as Punjab's tallest mall development, with three basement levels and a full retail, food and entertainment programme. Opening timelines are developer-announced and may change.",
    highlights: ["Under construction", "Ferozepur Road frontage", "Retail + food + entertainment"],
    featured: true,
  },
  {
    slug: "icon-mall-towers-lahore",
    name: "Icon Mall & Towers",
    city: "Lahore",
    citySlug: "lahore",
    area: "Ring Road Interchange, Bahria Town entrance",
    status: "upcoming",
    expected: "Under development",
    description:
      "A twin-tower mixed-use project at the entrance of Bahria Town Lahore combining 150+ commercial outlets with furnished apartments above — marketed among Lahore's largest upcoming retail destinations.",
    highlights: ["150+ outlets planned", "Twin-tower mixed use", "Ring Road interchange site"],
  },

  /* ---------------- Karachi ---------------- */
  {
    slug: "luckyone-mall-karachi",
    name: "LuckyOne Mall",
    city: "Karachi",
    citySlug: "karachi",
    area: "Rashid Minhas Road, Federal B Area",
    status: "open",
    opened: "2017",
    developer: "Yunus Brothers Group (Lucky Landmark)",
    sizeLabel: "≈ 3.4 million sq ft — Pakistan's largest mall",
    storesLabel: "200+ stores",
    description:
      "Pakistan's largest shopping mall: a 3.4 million sq ft destination on Rashid Minhas Road with 200+ stores, a huge atrium food court, indoor theme park and hypermarket anchor.",
    highlights: ["Largest mall in Pakistan", "Indoor theme park", "Hypermarket anchor"],
    featured: true,
  },
  {
    slug: "dolmen-mall-clifton-karachi",
    name: "Dolmen Mall Clifton",
    city: "Karachi",
    citySlug: "karachi",
    area: "Dolmen City, Marine Drive, Clifton",
    status: "open",
    opened: "2011",
    developer: "Dolmen Group",
    description:
      "Karachi's premium sea-facing mall at Dolmen City, Clifton — international brands, a large food court with sea views and the Harbour Front office towers in the same complex.",
    highlights: ["Sea-facing food court", "Premium international brands", "Dolmen City complex"],
    featured: true,
  },
  {
    slug: "dolmen-mall-tariq-road-karachi",
    name: "Dolmen Mall Tariq Road",
    city: "Karachi",
    citySlug: "karachi",
    area: "Tariq Road",
    status: "open",
    opened: "2001",
    developer: "Dolmen Group",
    description:
      "Among Pakistan's first modern mall formats, Dolmen Tariq Road remains a six-floor, 300-outlet staple on Karachi's busiest traditional shopping street.",
    highlights: ["300 outlets", "Tariq Road shopping belt", "Six retail floors"],
  },
  {
    slug: "dolmen-mall-hyderi-karachi",
    name: "Dolmen Mall Hyderi",
    city: "Karachi",
    citySlug: "karachi",
    area: "Hyderi, North Nazimabad",
    status: "open",
    developer: "Dolmen Group",
    description:
      "The Hyderi landmark for North Nazimabad: a multi-floor Dolmen mall serving central Karachi's dense residential catchments with fashion, food and everyday retail.",
    highlights: ["North Nazimabad anchor", "Fashion & food floors", "Dense local catchment"],
  },
  {
    slug: "ocean-mall-tower-karachi",
    name: "Ocean Mall & Tower",
    city: "Karachi",
    citySlug: "karachi",
    area: "Khayaban-e-Iqbal, Clifton Block 9",
    status: "open",
    description:
      "A Clifton high-rise combining a multi-level shopping mall with office floors above — retail, dining and a cinema serving the Clifton–DHA corridor.",
    highlights: ["Mall + office tower", "Cinema", "Clifton location"],
  },
  {
    slug: "northwalk-mall-karachi",
    name: "The Northwalk Mall",
    city: "Karachi",
    citySlug: "karachi",
    area: "Hyderi, North Nazimabad",
    status: "open",
    opened: "2021",
    sizeLabel: "≈ 1.5 million sq ft",
    description:
      "One of Karachi's largest newer malls by area, a 1.5 million sq ft retail destination serving North Nazimabad and the wider central-north Karachi market.",
    highlights: ["1.5M sq ft scale", "New-generation format", "Central Karachi catchment"],
  },
  {
    slug: "park-towers-karachi",
    name: "Park Towers",
    city: "Karachi",
    citySlug: "karachi",
    area: "Shahrah-e-Firdousi, Clifton",
    status: "open",
    description:
      "An early Clifton mall landmark combining retail floors with residential towers, still a steady mid-size shopping stop between Clifton Bridge and the sea.",
    highlights: ["Clifton landmark", "Retail + residences", "Mid-size format"],
  },
  {
    slug: "atrium-mall-karachi",
    name: "Atrium Mall",
    city: "Karachi",
    citySlug: "karachi",
    area: "Zaibunnisa Street, Saddar",
    status: "open",
    description:
      "Saddar's central mall on Zaibunnisa Street, best known for its multiplex cinema and electronics-to-fashion tenant mix in Karachi's downtown core.",
    highlights: ["Multiplex cinema", "Saddar downtown", "Electronics & fashion"],
  },
  {
    slug: "millennium-mall-karachi",
    name: "Millennium Mall",
    city: "Karachi",
    citySlug: "karachi",
    area: "Rashid Minhas Road, Gulistan-e-Jauhar",
    status: "open",
    description:
      "A Rashid Minhas Road staple for the Jauhar–Gulshan belt with family retail, food and entertainment floors serving Karachi's north-east corridor.",
    highlights: ["Rashid Minhas Road", "Family retail", "Jauhar catchment"],
  },
  {
    slug: "rj-shopping-mall-karachi",
    name: "RJ Shopping Mall",
    city: "Karachi",
    citySlug: "karachi",
    area: "Rashid Minhas Road, near Millennium Mall",
    status: "open",
    description:
      "A value-focused multi-floor shopping mall on the Rashid Minhas corridor, popular for mobile, electronics and budget fashion in Gulistan-e-Jauhar.",
    highlights: ["Value retail", "Mobile & electronics", "Jauhar corridor"],
  },
  {
    slug: "star-city-mall-karachi",
    name: "Star City Mall",
    city: "Karachi",
    citySlug: "karachi",
    area: "Abdullah Haroon Road, Saddar",
    status: "open",
    description:
      "A Saddar electronics-and-mobile destination mall, one of Karachi's recognised hubs for phones, accessories and IT retail.",
    highlights: ["Mobile & IT hub", "Saddar location", "Wholesale-retail mix"],
  },
  {
    slug: "saima-paari-mall-karachi",
    name: "Saima Paari Mall",
    city: "Karachi",
    citySlug: "karachi",
    area: "Hyderi, North Nazimabad",
    status: "open",
    description:
      "A Hyderi market-area mall serving North Nazimabad's everyday shopping: fashion, footwear and household retail at mid-market prices.",
    highlights: ["Hyderi market belt", "Everyday fashion", "Mid-market prices"],
  },
  {
    slug: "the-forum-mall-karachi",
    name: "The Forum",
    city: "Karachi",
    citySlug: "karachi",
    area: "Khayaban-e-Jami, Clifton",
    status: "open",
    description:
      "A compact premium Clifton centre combining boutique retail with corporate offices — a quieter, business-led address near the Clifton commercial belt.",
    highlights: ["Boutique retail", "Corporate offices", "Clifton address"],
  },
  {
    slug: "emerald-tower-karachi",
    name: "Emerald Tower",
    city: "Karachi",
    citySlug: "karachi",
    area: "II Chundrigar Road",
    status: "open",
    description:
      "A shopping-and-office tower on II Chundrigar Road, Karachi's financial street, with retail floors serving the downtown corporate crowd.",
    highlights: ["Financial district", "Retail + offices", "Downtown crowd"],
  },
  {
    slug: "square-one-mall-karachi",
    name: "Square One Mall",
    city: "Karachi",
    citySlug: "karachi",
    area: "Near National Stadium, Gulshan-e-Iqbal",
    status: "open",
    description:
      "A family mall near the National Stadium serving Gulshan-e-Iqbal with fashion, food and entertainment for Karachi's eastern districts.",
    highlights: ["National Stadium area", "Family retail", "Gulshan catchment"],
  },

  /* ---------------- Islamabad ---------------- */
  {
    slug: "centaurus-mall-islamabad",
    name: "The Centaurus Mall",
    city: "Islamabad",
    citySlug: "islamabad",
    area: "Jinnah Avenue, F-8",
    status: "open",
    opened: "2013",
    developer: "Pak Gulf Construction",
    description:
      "Islamabad's landmark mixed-use complex: a four-storey mall beneath residential and office towers and the Mövenpick hotel, with 250+ brands, Fun City and a multiplex on Jinnah Avenue.",
    highlights: ["Islamabad's landmark mall", "250+ brands", "Hotel & towers complex"],
    featured: true,
  },
  {
    slug: "giga-mall-islamabad",
    name: "Giga Mall (World Trade Center)",
    city: "Islamabad",
    citySlug: "islamabad",
    area: "GT Road, DHA Phase 2",
    status: "open",
    opened: "2016",
    developer: "Giga Group",
    description:
      "The World Trade Center's retail heart on GT Road, DHA Phase 2: 150+ stores, Cinepax cinema, food court and family entertainment for the DHA–Bahria twin-city corridor.",
    highlights: ["World Trade Center", "Cinepax cinema", "DHA Phase 2 anchor"],
    featured: true,
  },
  {
    slug: "safa-gold-mall-islamabad",
    name: "Safa Gold Mall",
    city: "Islamabad",
    citySlug: "islamabad",
    area: "College Road, F-7 Markaz",
    status: "open",
    description:
      "F-7's premium compact mall: fashion, beauty, cafés and a rooftop dining strip in Islamabad's most established markaz catchment.",
    highlights: ["F-7 Markaz", "Rooftop dining", "Premium compact format"],
  },
  {
    slug: "amazon-mall-islamabad",
    name: "Amazon Mall",
    city: "Islamabad",
    citySlug: "islamabad",
    area: "GT Road, near DHA Phase 2 gate",
    status: "open",
    description:
      "A themed GT Road mall serving the DHA–Bahria corridor with fashion outlets, food and family retail in a rainforest-inspired interior.",
    highlights: ["Themed interiors", "GT Road frontage", "Outlet brands"],
  },
  {
    slug: "olympus-mall-islamabad",
    name: "The Olympus Mall",
    city: "Islamabad",
    citySlug: "islamabad",
    area: "F-11 Markaz",
    status: "open",
    description:
      "F-11 Markaz's modern mall address with fashion, grocery and dining serving the F-10/F-11 residential sectors of Islamabad.",
    highlights: ["F-11 Markaz", "Grocery anchor", "Sector catchment"],
  },
  {
    slug: "mall-of-islamabad",
    name: "Mall of Islamabad",
    city: "Islamabad",
    citySlug: "islamabad",
    area: "Jinnah Avenue, Blue Area",
    status: "upcoming",
    expected: "Under construction",
    developer: "Bahria Town",
    description:
      "A 25-storey mixed-use tower under construction on Jinnah Avenue, Blue Area, combining a retail mall with apartments and offices, rooftop dining and a sky pool. Timelines are developer-announced and may change.",
    highlights: ["Blue Area address", "Mall + residences + offices", "Rooftop facilities"],
    featured: true,
  },
  {
    slug: "j7-emporium-islamabad",
    name: "J7 Emporium",
    city: "Islamabad",
    citySlug: "islamabad",
    area: "B-17, Multi Gardens",
    status: "upcoming",
    expected: "Under construction",
    developer: "J7 Group",
    description:
      "A large mall-and-hotel project under construction in B-17 Multi Gardens, planned as the sector's main retail destination for the Margalla-side growth corridor.",
    highlights: ["B-17 anchor project", "Mall + hotel", "Growth corridor"],
  },
  {
    slug: "magnus-mall-islamabad",
    name: "The Magnus Mall",
    city: "Islamabad",
    citySlug: "islamabad",
    area: "Gulberg Greens",
    status: "upcoming",
    expected: "Announced / under development",
    description:
      "An announced large-format mall project in Gulberg Greens, Islamabad's fast-growing Expressway-side district of new mid-rise developments.",
    highlights: ["Gulberg Greens", "Large-format plan", "Expressway corridor"],
  },
  {
    slug: "paradise-mall-islamabad",
    name: "Paradise Mall (New City Paradise)",
    city: "Islamabad",
    citySlug: "islamabad",
    area: "New City Paradise, near Wah / M-1 corridor",
    status: "upcoming",
    expected: "Under construction",
    description:
      "A very large mixed-use mall project reported under construction in New City Paradise near Islamabad, planned with retail, hotel and residential components. Scale and timelines are developer-reported and may change.",
    highlights: ["Mixed-use mega project", "Under construction", "M-1 corridor"],
  },

  /* ---------------- Faisalabad ---------------- */
  {
    slug: "sitara-mall-faisalabad",
    name: "Sitara Mall",
    city: "Faisalabad",
    citySlug: "faisalabad",
    area: "Satiana Road",
    status: "open",
    description:
      "One of Faisalabad's best-known malls on Satiana Road: multi-floor fashion, family retail and food serving the city's main commercial belt.",
    highlights: ["Satiana Road", "Fashion floors", "Family retail"],
  },
  {
    slug: "boulevard-shopping-mall-faisalabad",
    name: "The Boulevard Shopping Mall",
    city: "Faisalabad",
    citySlug: "faisalabad",
    area: "Main Boulevard, Gulberg III",
    status: "open",
    description:
      "A Gulberg III boulevard mall with brand outlets, food and family shopping for Faisalabad's central districts.",
    highlights: ["Gulberg III", "Brand outlets", "Central location"],
  },
  {
    slug: "lyallpur-galleria-faisalabad",
    name: "Lyallpur Galleria",
    city: "Faisalabad",
    citySlug: "faisalabad",
    area: "Samundri Road / Canal Road belt",
    status: "open",
    description:
      "A premium-leaning galleria in Faisalabad known for textile and fashion retail — fitting for Pakistan's textile capital — plus dining and family shopping.",
    highlights: ["Textile & fashion focus", "Premium galleria format", "Dining options"],
  },
  {
    slug: "misaq-ul-mall-faisalabad",
    name: "Misaq-ul-Mall",
    city: "Faisalabad",
    citySlug: "faisalabad",
    area: "Sheikhupura Road",
    status: "open",
    description:
      "A Sheikhupura Road shopping destination with fashion, electronics and everyday retail for Faisalabad's northern districts.",
    highlights: ["Sheikhupura Road", "Everyday retail", "Northern catchment"],
  },
  {
    slug: "grand-central-mall-faisalabad",
    name: "The Grand Central Mall",
    city: "Faisalabad",
    citySlug: "faisalabad",
    area: "Canal Road",
    status: "upcoming",
    expected: "Under construction",
    description:
      "A very large under-construction mixed-use project on Canal Road — reported at around 3.4 million sq ft with retail, offices and residences — set to become Faisalabad's biggest mall. Timelines may change.",
    highlights: ["≈3.4M sq ft reported", "Canal Road site", "Retail + offices + residences"],
    featured: true,
  },

  /* ---------------- Multan ---------------- */
  {
    slug: "mall-of-multan",
    name: "Mall of Multan",
    city: "Multan",
    citySlug: "multan",
    area: "Bosan Road",
    status: "open",
    developer: "AAM Developers",
    description:
      "Bosan Road's flagship mall for Multan with a supermarket anchor, cinema and family retail serving the Bosan Road–Gulgasht growth belt.",
    highlights: ["Bosan Road anchor", "Cinema", "Supermarket"],
  },
  {
    slug: "united-mall-gulgasht-multan",
    name: "United Mall Gulgasht",
    city: "Multan",
    citySlug: "multan",
    area: "Gulgasht Colony",
    status: "upcoming",
    expected: "Partially operational · apartments to follow",
    description:
      "A mixed-use Gulgasht project whose retail floors have begun opening in phases, with residential possession announced to follow — Multan's newest mall-format addition.",
    highlights: ["Phased opening", "Retail + apartments", "Gulgasht Colony"],
  },

  /* ---------------- Gujranwala ---------------- */
  {
    slug: "kings-mall-gujranwala",
    name: "Kings Mall",
    city: "Gujranwala",
    citySlug: "gujranwala",
    area: "Main GT Road",
    status: "open",
    description:
      "Gujranwala's best-known mall address on GT Road with fashion brands, food court and family entertainment for the city's main corridor.",
    highlights: ["GT Road frontage", "Food court", "Brand outlets"],
  },
  {
    slug: "mall-of-gujranwala",
    name: "Mall of Gujranwala",
    city: "Gujranwala",
    citySlug: "gujranwala",
    area: "Gujranwala Cantt / GT Road belt",
    status: "open",
    description:
      "A family shopping mall serving the Cantt and GT Road catchments of Gujranwala with multi-floor retail and dining.",
    highlights: ["Cantt catchment", "Family retail", "Multi-floor format"],
  },
  {
    slug: "prisma-mall-gujranwala",
    name: "Prisma Mall",
    city: "Gujranwala",
    citySlug: "gujranwala",
    area: "Satellite Town belt",
    status: "open",
    description:
      "A neighbourhood-scale mall in Gujranwala's Satellite Town side with everyday fashion, grocery and food options.",
    highlights: ["Neighbourhood format", "Everyday shopping", "Satellite Town side"],
  },

  /* ---------------- Peshawar ---------------- */
  {
    slug: "deans-shopping-mall-peshawar",
    name: "Deans Shopping Mall",
    city: "Peshawar",
    citySlug: "peshawar",
    area: "Peshawar Cantt, Saddar",
    status: "open",
    description:
      "Deans Trade Center in Saddar Cantt is Peshawar's classic mall address: multi-floor fashion, mobile and family retail in the city's commercial heart.",
    highlights: ["Saddar Cantt", "Classic mall address", "Mobile & fashion"],
  },
  {
    slug: "091-mall-peshawar",
    name: "091 Mall",
    city: "Peshawar",
    citySlug: "peshawar",
    area: "University Road",
    status: "open",
    description:
      "A University Road mall serving Peshawar's university belt with brand outlets, food and family shopping near Hayatabad's edge.",
    highlights: ["University Road", "Brand outlets", "Hayatabad side"],
  },
  {
    slug: "florenze-mall-peshawar",
    name: "Florenza Mall",
    city: "Peshawar",
    citySlug: "peshawar",
    area: "Main University Road / Tehkal belt",
    status: "open",
    description:
      "A newer mall-format centre on Peshawar's University Road corridor with fashion, dining and everyday retail.",
    highlights: ["Newer format", "Dining options", "University Road"],
  },

  /* ---------------- Hyderabad, Quetta, Sialkot, Sargodha ---------------- */
  {
    slug: "boulevard-mall-hyderabad",
    name: "Boulevard Mall",
    city: "Hyderabad",
    area: "Auto Bhan Road, Latifabad",
    status: "open",
    description:
      "Hyderabad's main modern mall on Auto Bhan Road: brand outlets, food court and family entertainment for the Latifabad catchment. Properties Pak's full city hub for Hyderabad is coming as inventory grows.",
    highlights: ["Auto Bhan Road", "Food court", "Latifabad catchment"],
  },
  {
    slug: "emerald-mall-hyderabad",
    name: "Emerald Mall",
    city: "Hyderabad",
    area: "Qasimabad",
    status: "open",
    description:
      "A Qasimabad shopping centre serving Hyderabad's western districts with fashion, grocery and everyday retail.",
    highlights: ["Qasimabad", "Everyday retail", "Grocery anchor"],
  },
  {
    slug: "millennium-mall-quetta",
    name: "Millennium Mall",
    city: "Quetta",
    area: "Shahrah-e-Iqbal",
    status: "open",
    description:
      "Quetta's first international-standard mall format: multi-floor brand retail, food and family shopping in the provincial capital.",
    highlights: ["Quetta's flagship format", "Brand retail", "Family shopping"],
  },
  {
    slug: "gold-city-mall-quetta",
    name: "Gold City Mall",
    city: "Quetta",
    area: "M.A. Jinnah Road",
    status: "open",
    description:
      "A Jinnah Road shopping centre in central Quetta with fashion, mobile and everyday retail for the downtown market.",
    highlights: ["Jinnah Road", "Downtown market", "Mobile & fashion"],
  },
  {
    slug: "mall-of-sialkot",
    name: "Mall of Sialkot",
    city: "Sialkot",
    area: "Aziz Bhatti Shaheed Road, Cantt",
    status: "open",
    description:
      "Sialkot Cantt's recognised mall address with brand outlets, food and family retail serving the export city's shoppers.",
    highlights: ["Cantt location", "Brand outlets", "Family retail"],
  },
  {
    slug: "burj-ismail-mall-sargodha",
    name: "Burj Ismail Mall",
    city: "Sargodha",
    area: "University Road",
    status: "open",
    description:
      "Sargodha's prominent mall tower on University Road with multi-floor fashion and family shopping.",
    highlights: ["University Road", "Mall tower format", "Fashion floors"],
  },
  {
    slug: "mall-of-sargodha",
    name: "Mall of Sargodha",
    city: "Sargodha",
    area: "Main Boulevard belt",
    status: "upcoming",
    expected: "Under construction",
    description:
      "A mall project under construction in Sargodha, set to add a modern branded retail format to the city's growing boulevard corridor. Timelines may change.",
    highlights: ["Under construction", "Modern format planned", "Boulevard corridor"],
  },
];

export function getAllMalls(): Mall[] {
  return MALLS;
}

export function getMallBySlug(slug: string): Mall | undefined {
  return MALLS.find((mall) => mall.slug === slug);
}

export function getAllMallSlugs(): string[] {
  return MALLS.map((mall) => mall.slug);
}

export function getMallCities(): { city: string; citySlug?: string; total: number; open: number; upcoming: number }[] {
  const byCity = new Map<string, { city: string; citySlug?: string; total: number; open: number; upcoming: number }>();
  for (const mall of MALLS) {
    const entry = byCity.get(mall.city) ?? { city: mall.city, citySlug: mall.citySlug, total: 0, open: 0, upcoming: 0 };
    entry.total += 1;
    if (mall.status === "open") entry.open += 1;
    else entry.upcoming += 1;
    byCity.set(mall.city, entry);
  }
  return [...byCity.values()].sort((a, b) => b.total - a.total);
}

export function mallDirectionsUrl(mall: Pick<Mall, "name" | "city" | "area">): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${mall.name} ${mall.area} ${mall.city} Pakistan`)}`;
}
