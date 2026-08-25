/* =========================================================
   Site content. Edit here — every page reads from this file.
   ========================================================= */

const ENTRIES = [
  {
    id: "kunlun",
    cat: "work",
    title: "Smart Community Behavior Analysis",
    org: "Kunlun Digital Intelligence",
    date: "Sep 2025 — Jun 2026",
    role: "Data Analytics & User Researcher",
    summary:
      "Built the research structure behind a smart-community behavior analysis project, and kept the data honest enough to act on.",
    body: [
      "Designed the research structure for a smart-community user behavior analysis project and coordinated data collection strategies with both technical and operational stakeholders.",
      "Integrated psychological principles with data organization methods to refine user segmentation logic and improve the consistency of collected data, so downstream analysis and decision-making rested on something stable.",
      "Participated in regular team discussions and iterative feedback cycles, keeping research goals aligned with real operational needs rather than an idealized plan."
    ],
    tags: ["Behavioral Data", "Segmentation", "Stakeholder Coordination", "Field Research"]
  },
  {
    id: "wordplay-emoji",
    cat: "research",
    title: "Crowdsourced Emoji Descriptions for Accessible, Multilingual Search",
    org: "Wordplay Research Studio \u00b7 UW iSchool",
    date: "Jan \u2014 Mar 2025",
    role: "Research & Design Proposal Lead",
    advisor: "Prof. Amy J. Ko",
    collab: "with Monica Xu",
    summary:
      "Unicode describes \uD83D\uDE2D as \u201cloudly crying face.\u201d A screen reader user needs \u201csad.\u201d We designed a game to crowdsource the difference \u2014 in every language.",
    about: {
      text:
        "Wordplay is a free programming-learning platform for multilingual K-12 students, led by Amy J. Ko, associate dean at the UW-Seattle iSchool. It aims to build an inclusive and accessible coding classroom.",
      links: [
        { label: "wordplay.dev", url: "https://wordplay.dev/" },
        { label: "Prof. Amy J. Ko", url: "https://faculty.washington.edu/ajko/" }
      ],
      fig: { src: "assets/img/wordplay-home.jpg", cap: "Wordplay \u2014 accessible, multilingual, creative coding." }
    },
    sections: [
      {
        h: "The problem",
        p: [
          "Wordplay is a justice-centered platform for teaching K-12 students to code, and it uses emoji throughout its interface \u2014 as icons, as user avatars, and as parts of the programming language itself. But standard Unicode emoji descriptions are appearance-based and English-centric: \uD83D\uDE2D is described as \u201cloudly crying face\u201d rather than something more useful, like \u201csad.\u201d",
          "That breaks two things at once. Screen reader users get descriptions that are slow to parse, and search results shift depending on which word someone happens to type \u2014 \u201csmile\u201d and \u201chappy\u201d return different sets. No comprehensive, accessible, multilingual dataset of emoji descriptions existed to fix it."
        ]
      },
      {
        h: "Research process",
        p: [
          "I led the research phase, synthesizing literature across three areas to ground the design: accessibility barriers for blind programmers (screen readers process information linearly, which makes concise descriptions essential), computational approaches to emoji emotion classification (Ekman\u2019s six basic emotions, Plutchik\u2019s expanded model), and psycholinguistic norms for how people actually perceive emoji meaning across cultures.",
          "I brought those threads together to argue for an emotion-first, taxonomy-based approach \u2014 while naming its limits honestly: not every emoji conveys an emotion (\uD83C\uDF4E), and some carry subcultural meanings no emotion framework captures (\uD83C\uDF46, \uD83D\uDC80)."
        ]
      },
      {
        h: "Design proposal",
        p: [
          "Building on that research, I co-authored a formal proposal for a \u201cFun Emoji Quiz\u201d \u2014 a game that crowdsources high-quality, culturally grounded descriptions through play instead of top-down labeling. The design decisions I contributed:"
        ],
        list: [
          "A four-tier taxonomy for what makes a good description \u2014 emotional, conceptual/object-based, cultural/subcultural, and identity/representation-based \u2014 so one emoji can hold several valid, context-dependent descriptions.",
          "A mechanic built on Chinese and Japanese four-character idioms, where each logographic character maps cleanly onto a single emoji. Intuitive for a K-12 multilingual audience, and especially rich in Mandarin, where homonyms open up wordplay.",
          "A validation loop for alphabet-based languages: high-frequency descriptions collected from logographic-language users become multiple-choice options for English and Spanish speakers, so the dataset can scale past Chinese and Japanese.",
          "The data pipeline itself \u2014 how frequency analysis, error clustering, and cross-linguistic variance mapping turn raw guesses into a structured, taxonomy-based description repository."
        ],
        fig: {
          src: "assets/img/wordplay-quiz.jpg",
          cap: "The ESP-style game prototype \u2014 a Spanish validation round built from descriptions collected in Chinese and Japanese."
        }
      },
      {
        h: "Outcome & reflection",
        p: [
          "Our faculty advisor judged the research depth as meeting the bar for course credit, and used the proposal to identify the open design questions standing between the concept and a buildable feature: where quiz content originates, how correctness is validated at scale, and whether emoji-sequence guesses reliably reflect single-emoji meaning.",
          "I don\u2019t read that as a limitation. Mapping the design space and stress-testing its core assumptions was the job; the questions we surfaced became the roadmap for the next phase."
        ]
      }
    ],
    tags: ["Literature Synthesis", "Research Proposal Writing", "Taxonomy Design", "Cross-cultural Research", "Accessibility Research", "Stakeholder Communication"]
  },
  {
    id: "wordplay-color",
    cat: "research",
    title: "Localized Color Descriptions for Screen Reader Accessibility",
    org: "Wordplay Research Studio \u00b7 UW iSchool",
    date: "Jul 2023 \u2014 Mar 2025",
    role: "Independent Design Proposal",
    advisor: "Prof. Amy J. Ko",
    summary:
      "A screen reader that reads out raw LCH coordinates is precise and useless. I went looking for where the color words actually sit.",
    about: {
      text:
        "Wordplay is a free programming-learning platform for multilingual K-12 students, led by Amy J. Ko, associate dean at the UW-Seattle iSchool. It aims to build an inclusive and accessible coding classroom.",
      links: [
        { label: "wordplay.dev", url: "https://wordplay.dev/" },
        { label: "Prof. Amy J. Ko", url: "https://faculty.washington.edu/ajko/" }
      ],
      fig: { src: "assets/img/wordplay-home.jpg", cap: "Wordplay \u2014 accessible, multilingual, creative coding." }
    },
    sections: [
      {
        h: "The problem",
        p: [
          "Wordplay\u2019s screen reader described colors using raw LCH color-space coordinates \u2014 precise, and meaningless to a blind or low-vision user trying to grasp which color has been selected. The team needed a way to translate those coordinates into natural color words, consistently, across every language Wordplay supports."
        ]
      },
      {
        h: "Research process",
        p: [
          "I led the literature review, grounding the design in established color science. Starting from Berlin and Kay\u2019s foundational work on Basic Color Terms and the World Color Survey \u2014 which sampled color-naming behavior across 110 languages using standardized Munsell chips \u2014 I found strong evidence that color categorization is not purely language-specific: naming patterns cluster around 11 universally recognized categories (black, white, gray, red, yellow, green, blue, brown, purple, pink, orange), later confirmed for Mandarin specifically by Hsieh et al.\u2019s 2020 cluster analysis of Taiwanese participants.",
          "I also surfaced where the science gets harder. Boundary colors resist clean categorization across cultures \u2014 Japanese \u9752 (ao) has historically spanned both blue and green, and its meaning still shifts with context today. Any design built on fixed category boundaries would have to account for real linguistic ambiguity rather than assigning every color one \u201ccorrect\u201d label."
        ]
      },
      {
        h: "Navigating an open research gap",
        p: [
          "The core challenge was translating focal colors \u2014 the World Color Survey\u2019s term for a category\u2019s best representative example \u2014 into concrete HCL coordinates the system could use. No literature I found provided that mapping directly.",
          "Rather than stall, I proposed a workaround: use Adobe\u2019s color palette, precisely calibrated and built for a global user base, as a proxy reference for focal colors, converting its RGB/CMYK values into HCL as a starting point. I also identified the survey\u2019s own foci.txt and chip.txt datasets as a path to deriving focal coordinates rigorously from the original data, and proposed a threshold-based method in HCL space for classifying ambiguous boundary colors."
        ]
      },
      {
        h: "Outcome",
        p: [
          "The research fed directly into the team\u2019s design specification for locale-aware color descriptions, moving the project from \u201cwe have a problem\u201d to \u201chere is where the category boundaries should sit, and why.\u201d It carried on into the broader Unicode glyph accessibility initiative I kept working on with the same research group."
        ]
      }
    ],
    tags: ["Academic Literature Review", "Psycholinguistic Synthesis", "Color Science", "HCL / LCH", "Accessibility Research", "Technical Communication"]
  },
  {
    id: "caregiver",
    cat: "research",
    title: "Caregiver Stress Levels",
    org: "Stress & Coping Lab · UW School of Medicine",
    date: "Sep 2024 — Jan 2025",
    role: "Research Assistant",
    advisor: "Prof. Peter P. Vitaliano",
    summary:
      "Which pressures actually predict a caregiver's well-being — and what the numbers say we owe them.",
    body: [
      "Analyzed the impact of socioeconomic and emotional factors on caregivers' well-being.",
      "Integrated findings across demographic and psychological variables to identify the key predictors of caregiver well-being.",
      "Collected, cleaned, and processed caregiver data in Excel and R, applying correlation and multiple regression analyses to verify the caregiver stress formula.",
      "Identified significant associations between financial strain, perceived support, and stress outcomes, providing empirical evidence for targeted mental health interventions."
    ],
    result:
      "Recognized caregivers as a vulnerable group in need of greater psychological support and resource allocation; deepened my skills in data integration, statistical interpretation, and evidence-based reasoning.",
    tags: ["R", "Excel", "Multiple Regression", "Correlation", "Health Psychology"]
  },
  {
    id: "housefinder",
    cat: "project",
    title: "House-finding Web Application",
    org: "INFO 360 Design Methods · Group Leader",
    date: "Sep 2024 — Dec 2024",
    role: "Group Leader",
    advisor: "Prof. Melroy D'Souza",
    summary:
      "A housing search built for students who have three days, one budget, and no car.",
    body: [
      "Led a 5-member team designing a house-finding web application for UW students, focused on making the search faster and more accessible.",
      "Conducted user interviews, surveys, and competitive analysis to identify key requirements and prioritize the platform's functions.",
      "Designed the complete interface prototype in Figma — navigation flow, wireframes, and visual components — and produced a promotional video showcasing the final design.",
      "Ran weekly meetings to coordinate communication, assign tasks, and keep the project on its milestones."
    ],
    tags: ["Figma", "Interviews", "Survey", "Competitive Analysis", "Team Lead"]
  },
  {
    id: "gamefinder",
    cat: "project",
    title: "Client-side Game-Finding Website",
    org: "Client-side Web Development",
    date: "Mar 2024 — Jun 2024",
    role: "Group Member",
    advisor: "Prof. Tim Clarckson",
    summary:
      "Filter, review, and a daily random pick — a small site for people who own too many games to choose from.",
    body: [
      "Developed a game-finding website in HTML, CSS, and JavaScript.",
      "Implemented Firebase hosting to serve the static site, progressive web app, and single-page application builds.",
      "Conducted market research across 4 competitors, which shaped the feature set: game filtering, uploading reviews, a daily random game, and the interface around them."
    ],
    tags: ["HTML", "CSS", "JavaScript", "Firebase", "Market Research"]
  },
  {
    id: "crime-la",
    cat: "project",
    title: "Crime Data Analysis for the Los Angeles Police Department",
    org: "Foundational Skills for Data Science",
    date: "Jan 2023 — Mar 2023",
    role: "Group Member",
    advisor: "Prof. Ott Toomet",
    summary:
      "Where crime concentrates, when it peaks, and whether support resources are anywhere near the people who need them.",
    body: [
      "Analyzed Los Angeles crime data alongside the distribution of crime prevention and support centers to identify the most targeted demographic groups, applying correlation and multiple regression analyses in R.",
      "Visualized the data with ggplot2 and tidyverse to compare areas by crime volume, the cost of commonly occurring crimes, peak hours, sex, and race."
    ],
    result:
      "Recommended more community policing in the 77th Street Area, especially around 12 p.m., and better-placed mental health and crime prevention support for the most targeted group — Hispanic residents, ages 25–35, male.",
    tags: ["R", "ggplot2", "tidyverse", "Regression", "Data Visualization"]
  },
  {
    id: "illustrator",
    cat: "creative",
    title: "Freelance Illustrator",
    org: "Huajia · Mihuashi",
    date: "Dec 2020 — Present",
    role: "Commissioned Digital Illustration",
    summary:
      "Five years of drawing other people's characters until they look the way those people always imagined them.",
    body: [
      "Created commissioned digital illustrations for original characters through the Huajia and Mihuashi platforms.",
      "Collaborated with clients to refine character design, composition, and visual tone, delivering finished artwork that matches each client's creative vision.",
      "Managed the full pipeline independently: brief, sketch, revision rounds, delivery, and file handoff."
    ],
    tags: ["Paint Tool SAI", "UDM Paint", "Character Design", "Client Work"]
  },
  {
    id: "merch",
    cat: "creative",
    title: "OC Merchandise Design",
    org: "Independent \u00b7 OC Goods",
    date: "Dec 2020 \u2014 Present",
    role: "Designer",
    summary:
      "I don\u2019t only draw my original characters \u2014 I turn them into objects you can hold, and I stay in it through the manufacturing.",
    about: {
      text:
        "Designed in Adobe Illustrator and Photoshop, with materials and construction considered from the first sketch, then produced in direct coordination with manufacturers \u2014 mockups, prototype samples, and print corrections \u2014 so each character ends up with a distinct, tangible product identity."
    },
    sections: [
      {
        h: "The character",
        p: [
          "The piece below is built around Mingche Shan, a genetically synthesized experimental subject whose defining trait is how strangely he processes and understands emotion. That premise sets the visual direction: clinical, technological, medical.",
          "Some earlier design work I had done for him \u2014 an experimental blood pack, complete with handling warnings and a track record of what the lab had taken from him:"
        ],
        fig: {
          src: "assets/img/merch-early.jpg",
          cap: "Earlier merchandise design for Mingche Shan \u2014 an experimental blood-pack pouch, front and back.",
          wide: true
        }
      },
      {
        h: "Designing the cassette",
        p: [
          "For the charm itself I chose a cassette tape, and studied the real object closely before drawing anything \u2014 the A and B sides, the hidden tracks, the way the shell reads as a container for something recorded and not quite retrievable.",
          "I built the piece on the tape\u2019s signature red, keeping red and pink dominant, and used the reel holes structurally: the left hole sits exactly at Mingche Shan\u2019s neck. Scattered red noise and glitch blocks suggest technological malfunction, and the red threads running off the left edge read as both bloodstream and wiring \u2014 the idea being that he is still conscious inside the lab."
        ],
        figs: [
          { src: "assets/img/merch-tape-a.jpg", cap: "Side A \u2014 Laboratory" },
          { src: "assets/img/merch-tape-b.jpg", cap: "Side B \u2014 ???" }
        ]
      },
      {
        h: "Typography and the track list",
        p: [
          "To hold the clinical, lab-report atmosphere I set most of the text in a plain sans-serif close to Arial, and used Bender for the \u201c04\u201d so the subject number reads as geometric and technical rather than decorative.",
          "A cassette prints its track list down the right side, so I used that space to list the experiments performed on him \u2014 \u201cFirst contact with ordinary children,\u201d \u201cSchool episodes\u201d \u2014 as if they were song titles. Toward the end the list collapses into [BROKEN], which echoes the disintegrating red pixel effect under \u201cinsert to watch\u201d below it.",
          "The back goes one step further in: I drew Mingche Shan holding this same cassette, already shattered, looking into the distance through one of its reel holes."
        ]
      },
      {
        h: "The finished piece",
        p: [
          "Printed on clear acrylic, assembled with a rose-gold clasp, and small enough to hang off a bag."
        ],
        figs: [
          { src: "assets/img/merch-photo-a.jpg", cap: "Side A, printed" },
          { src: "assets/img/merch-photo-b.jpg", cap: "Side B, printed" },
          { src: "assets/img/merch-photo-desk.jpg", cap: "With the rest of the shelf" }
        ]
      }
    ],
    tags: ["Adobe Illustrator", "Photoshop", "Acrylic Print Production", "Manufacturer Coordination", "Typography", "Character Design"]
  },
  {
    id: "barista",
    cat: "work",
    title: "Barista",
    org: "By George · University of Washington",
    date: "Jun 2024 — 2025",
    role: "Barista",
    summary:
      "High volume, small counter, morning rush — the fastest lesson in clear communication I have had.",
    body: [
      "Delivered fast, friendly service in a high-volume café setting.",
      "Communicated clearly with customers and coordinated with teammates through peak hours, keeping the line moving without dropping accuracy."
    ],
    tags: ["Service", "Communication", "Teamwork"]
  }
];

const CATS = [
  { key: "all",      name: "All" },
  { key: "work",     name: "Work" },
  { key: "research", name: "Research" },
  { key: "project",  name: "Projects" },
  { key: "creative", name: "Creative" }
];

const ARTWORKS = [
  {
    id: "in-the-garden",
    title: "inTheGarden",
    date: "2024.1",
    file: "in-the-garden",
    tagline: "Two people, one bench, an afternoon that does not need to be spoken.",
    medium: "Digital · Paint Tool SAI",
    palette: ["#eef4ef", "#c9dcd6", "#7fa89b", "#2f4f4a", "#d8cfc0"],
    notes: [
      "A pavilion swallowed by its own garden. I drew the structure first as a loose blueprint — posts, beams, the roofline — and then let the leaves grow over it until the architecture was only half visible. The frame is made of plants, not lines.",
      "The two figures sit close but neither of them looks at the other. That was the whole point of the piece: the older one is leaning in mid-sentence, the younger one has already stopped listening and is looking at something outside the panel. Familiarity, not conversation.",
      "I kept the linework in pale blue instead of black so nothing in the image would feel finished. The greens are layered flat and unblended, cool in the shadows and slightly yellowed where the light lands. Everything sits on cream, never on white."
    ],
    aside:
      "The first piece where I stopped cleaning up my sketch layer and started treating it as the final line."
  },
  {
    id: "kaito-2025",
    title: "KAITO 2025 birth anniversary",
    date: "2025.2.14",
    file: "kaito-2025",
    tagline: "Blue on blue, wrapped in cable, drawn for a birthday.",
    medium: "Digital · Paint Tool SAI",
    palette: ["#ffffff", "#dce6f5", "#3b5ba8", "#1d3673", "#c9a227"],
    notes: [
      "Drawn for KAITO's anniversary. I wanted the opposite of a celebration illustration — no confetti, no stage. He is sitting on the floor of a room full of equipment, hands clasped, waiting for something to finish loading.",
      "The cables are the composition. They come in from the top of the frame, cross behind him, and pool around his coat, so the eye keeps circling back to the same figure instead of leaving the canvas. The dark disc behind his shoulder anchors the whole thing.",
      "Almost everything is white cloth, which meant the blues had to do all the work: deep blue for the scarf and boots, a lighter wash in the folds, and the single gold collar as the only warm note in the picture. Blue is my favorite color and this is the piece where I let it run unchecked."
    ],
    aside:
      "Anniversary illustration, drawn on Valentine's Day 2025."
  },
  {
    id: "untitled-2023",
    title: "untitled",
    date: "2023.10",
    file: "untitled-2023",
    tagline: "An embrace inside a scribble of flowers.",
    medium: "Digital · Paint Tool SAI",
    palette: ["#fdf7f4", "#f3c9c4", "#b98f9c", "#3b3a63", "#7f8f7a"],
    notes: [
      "It never got a title, and I have stopped trying to give it one. Two figures holding each other, drawn inside an oval of flowers that is really just several hundred loose strokes I refused to tidy.",
      "The linework is deliberately unresolved — pink hair rendered in soft parallel hatching against indigo drawn almost violently, so the two characters are separated by drawing technique before they are separated by color. The tenderness is in the hands; everything else is noise.",
      "I built the piece on a warm off-white and kept every value low-contrast except the dark red flower at the lower left. Your eye finds that one spot of saturation, then travels up to their faces. That path is the composition."
    ],
    aside:
      "October 2023. One sitting, no cleanup pass."
  }
];
