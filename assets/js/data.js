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
    id: "wordplay-color",
    cat: "research",
    title: "Cross-cultural Color Accessibility for Screen Reader Users",
    org: "Wordplay · UW iSchool",
    date: "Sep 2024 — Mar 2025",
    role: "Research Assistant",
    advisor: "Prof. Amy J. Ko",
    summary:
      "Modeling how color is named across languages, so a screen reader can describe it to someone who has never seen it.",
    body: [
      "Conducted research on color accessibility for screen reader users through literature review and hands-on exploration of screen reader functionality, mapping the interaction patterns and accessibility barriers that show up in real use.",
      "Analyzed color perception patterns in R using cluster analysis and perceptual boundary mapping, referencing the World Color Survey dataset to model 11 universal basic color categories.",
      "Developed a cross-cultural research proposal examining multilingual users' color perception, and designed a Figma prototype demonstrating accessible digital typography interfaces."
    ],
    result:
      "Identified 11 basic color clusters based on perceptual coordinate boundaries — a vocabulary a screen reader can actually speak.",
    tags: ["R", "Cluster Analysis", "World Color Survey", "Accessibility", "Figma"]
  },
  {
    id: "wordplay-emoji",
    cat: "research",
    title: "Emoji Accessibility for Screen Reader Users",
    org: "Wordplay · UW iSchool",
    date: "Sep 2024 — Mar 2025",
    role: "Research Assistant",
    advisor: "Prof. Amy J. Ko",
    summary:
      "If an emoji carries the feeling of a sentence, what happens when it is read aloud — and does it survive translation?",
    body: [
      "Designed a Figma prototype exploring how emoji can support emotional expression and accessibility in digital communication.",
      "Conducted secondary research on existing emoji classification systems and their emotional mapping to identify usability barriers for screen reader users.",
      "Collaborated with an interdisciplinary team of informatics, education, and accessibility researchers to sharpen the research questions and methodology."
    ],
    result:
      "Designed and prototyped an interactive mini-game testing cross-linguistic interpretations of emoji across English, Japanese, and Chinese users.",
    tags: ["Figma", "Prototyping", "Cross-linguistic Study", "Accessibility"]
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
    title: "Merchandise Design",
    org: "ACG Goods · Independent",
    date: "Dec 2020 — Present",
    role: "Designer",
    summary:
      "Taking a drawing off the screen and into acrylic, paper, and cloth — where the tolerances are real.",
    body: [
      "Used Photoshop and Illustrator to design ACG-inspired merchandise.",
      "Collaborated with manufacturers to review mockups and prototype samples, adjusting artwork for print, cut lines, and material behavior."
    ],
    tags: ["Photoshop", "Illustrator", "Print Production", "Prototyping"]
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
