export const SITE_CONFIG = {
  organization: "KingsWord Learning",
  name: "The Formation Path",
  shortName: "Formation Path",
  slug: "formation-path",
  eyebrow: "A seven-module learning journey",
  tagline: "Learn deeply. Practice faithfully. Finish with clarity.",
  description:
    "A guided formation experience that moves from foundations to applied practice through seven focused modules.",
  certificateLabel: "Certificate of Completion",
  supportEmail: "kti@kingsword.org",
  passMark: 80,
  sessionDays: 30,
  invitationDays: 7,
} as const;

export type SeedLesson = {
  title: string;
  slug: string;
  summary: string;
  body: string;
  estimatedMinutes: number;
};

export type SeedModule = {
  order: number;
  slug: string;
  eyebrow: string;
  title: string;
  summary: string;
  description: string;
  objectives: string[];
  lessons: SeedLesson[];
};

const lessonBody = (title: string, practice: string) => `# ${title}

This lesson is a structured starting point for the module. Replace this working copy in the admin curriculum editor with the approved teaching text, video, and downloadable resources before enrollment opens.

## Focus

Move slowly through the material. Record the ideas that challenge your assumptions and the questions you want to bring into the module discussion.

## Practice

${practice}

## Reflection

Write one concrete way this lesson should shape your decisions, service, or daily practice.`;

export const SEED_MODULES: SeedModule[] = [
  {
    order: 1,
    slug: "begin-with-purpose",
    eyebrow: "Orientation",
    title: "Begin with Purpose",
    summary: "Set your intention, understand the learning rhythm, and define what faithful completion will require.",
    description: "The opening module establishes the posture, expectations, and practical habits that support the full journey.",
    objectives: ["Name your purpose for beginning", "Build a sustainable study rhythm", "Use reflection and community well"],
    lessons: [
      { title: "Welcome to the Path", slug: "welcome-to-the-path", summary: "Understand how the seven modules fit together.", body: lessonBody("Welcome to the Path", "Create a weekly study appointment and protect it on your calendar."), estimatedMinutes: 15 },
      { title: "A Rule for Learning", slug: "a-rule-for-learning", summary: "Turn intention into a repeatable learning practice.", body: lessonBody("A Rule for Learning", "Write a simple three-part rule for reading, reflection, and response."), estimatedMinutes: 20 },
    ],
  },
  {
    order: 2,
    slug: "build-the-foundation",
    eyebrow: "Foundations",
    title: "Build the Foundation",
    summary: "Identify the convictions and sources that should carry the weight of your practice.",
    description: "This module helps learners distinguish core foundations from assumptions and inherited habits.",
    objectives: ["Identify load-bearing convictions", "Distinguish evidence from assumption", "Explain the foundation in your own words"],
    lessons: [
      { title: "What Carries the Weight", slug: "what-carries-the-weight", summary: "Find the ideas beneath your decisions.", body: lessonBody("What Carries the Weight", "Trace one recent decision back to the conviction beneath it."), estimatedMinutes: 25 },
      { title: "From Inheritance to Ownership", slug: "from-inheritance-to-ownership", summary: "Move from repeated language to understood conviction.", body: lessonBody("From Inheritance to Ownership", "Explain one core conviction without using familiar slogans."), estimatedMinutes: 25 },
    ],
  },
  {
    order: 3,
    slug: "read-with-understanding",
    eyebrow: "Understanding",
    title: "Read with Understanding",
    summary: "Slow down, ask better questions, and interpret material in its proper context.",
    description: "This module introduces a careful reading process that attends to context, purpose, and responsible application.",
    objectives: ["Observe before interpreting", "Use context responsibly", "Connect meaning to application"],
    lessons: [
      { title: "Observe Before You Answer", slug: "observe-before-you-answer", summary: "Practice disciplined attention before drawing conclusions.", body: lessonBody("Observe Before You Answer", "List ten observations about a short source before writing what you think it means."), estimatedMinutes: 30 },
      { title: "Context and Application", slug: "context-and-application", summary: "Make applications that honor the source and the present situation.", body: lessonBody("Context and Application", "Write one interpretation and two possible applications, then explain the difference."), estimatedMinutes: 30 },
    ],
  },
  {
    order: 4,
    slug: "practice-with-wisdom",
    eyebrow: "Practice",
    title: "Practice with Wisdom",
    summary: "Translate learning into decisions that are thoughtful, accountable, and appropriate to the moment.",
    description: "This module closes the gap between knowing and doing through practical judgment and reflection.",
    objectives: ["Recognize the demands of a situation", "Choose a proportionate response", "Review practice honestly"],
    lessons: [
      { title: "Wisdom in the Moment", slug: "wisdom-in-the-moment", summary: "Use a repeatable framework for practical judgment.", body: lessonBody("Wisdom in the Moment", "Apply the pause, notice, choose, review framework to a current decision."), estimatedMinutes: 30 },
      { title: "Reflective Practice", slug: "reflective-practice", summary: "Learn from action without hiding failure or overstating success.", body: lessonBody("Reflective Practice", "Review one recent action: intention, outcome, evidence, and next adjustment."), estimatedMinutes: 25 },
    ],
  },
  {
    order: 5,
    slug: "lead-with-character",
    eyebrow: "Character",
    title: "Lead with Character",
    summary: "Examine the inner life, boundaries, and accountability that make trustworthy leadership possible.",
    description: "This module treats character as a daily practice rather than a private claim or public image.",
    objectives: ["Connect authority with responsibility", "Name healthy boundaries", "Build meaningful accountability"],
    lessons: [
      { title: "Authority and Responsibility", slug: "authority-and-responsibility", summary: "Hold influence as a responsibility to others.", body: lessonBody("Authority and Responsibility", "Map the people affected by one area of authority you hold."), estimatedMinutes: 30 },
      { title: "Boundaries and Accountability", slug: "boundaries-and-accountability", summary: "Create structures that protect people and purpose.", body: lessonBody("Boundaries and Accountability", "Identify one boundary to clarify and one person invited to ask hard questions."), estimatedMinutes: 30 },
    ],
  },
  {
    order: 6,
    slug: "serve-in-community",
    eyebrow: "Community",
    title: "Serve in Community",
    summary: "Listen well, collaborate across difference, and contribute without centering yourself.",
    description: "This module develops the relational skills needed for service that strengthens rather than diminishes community.",
    objectives: ["Listen before solving", "Navigate disagreement with care", "Contribute toward shared flourishing"],
    lessons: [
      { title: "Listen Before You Lead", slug: "listen-before-you-lead", summary: "Treat listening as a form of responsible service.", body: lessonBody("Listen Before You Lead", "Hold a fifteen-minute conversation in which your only task is to understand."), estimatedMinutes: 25 },
      { title: "Repair and Shared Work", slug: "repair-and-shared-work", summary: "Approach conflict and collaboration with honesty.", body: lessonBody("Repair and Shared Work", "Write the opening sentence of a needed repair conversation without blame or evasion."), estimatedMinutes: 30 },
    ],
  },
  {
    order: 7,
    slug: "integrate-and-commission",
    eyebrow: "Integration",
    title: "Integrate and Commission",
    summary: "Gather what you have learned, demonstrate it in practice, and define your next faithful step.",
    description: "The final module turns seven modules of learning into an integrated plan for continued practice and service.",
    objectives: ["Integrate the seven module themes", "Demonstrate learning through a final practice", "Commit to a specific next step"],
    lessons: [
      { title: "Gather the Threads", slug: "gather-the-threads", summary: "See the connections across the full learning journey.", body: lessonBody("Gather the Threads", "Choose one insight from each module and connect them in a one-page map."), estimatedMinutes: 35 },
      { title: "Your Next Faithful Step", slug: "your-next-faithful-step", summary: "Finish with a grounded plan rather than a vague intention.", body: lessonBody("Your Next Faithful Step", "Write a thirty-day practice plan with one action, one measure, and one accountability partner."), estimatedMinutes: 35 },
    ],
  },
];

export const PUBLIC_OUTCOMES = [
  "A clear learning rhythm you can sustain",
  "Seven connected modules without unnecessary overload",
  "Guided reflection, discussion, and practical application",
  "Visible progress and a completion certificate",
] as const;
