/**
 * Builds the WordPress-ready content bundle from the Next.js LMS source.
 *
 * Reads the approved Believers Training curriculum (7 modules, 77 lessons) and
 * the module checkpoint questions (35), converts every Markdown lesson body to
 * Gutenberg block markup, and writes a single JSON bundle that the WP-CLI
 * importer consumes.
 *
 * Usage:
 *   node tools/build-content-bundle.mjs [--src <path-to-seven-module-lms>]
 */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..");

const argv = process.argv.slice(2);
const srcFlag = argv.indexOf("--src");
const SRC = resolve(srcFlag === -1 ? "C:/Users/kC/seven-module-lms" : argv[srcFlag + 1]);

const CURRICULUM = join(SRC, "src/content/manual-curriculum.json");
const ASSESSMENTS = join(SRC, "src/content/manual-assessments.ts");
const OUT = join(ROOT, "content/bt-content-bundle.json");

/** Pass mark carried over from the Next.js SITE_CONFIG. */
const PASS_MARK = 80;

// ---------------------------------------------------------------------------
// Markdown -> Gutenberg
// ---------------------------------------------------------------------------

const ESCAPES = { "&": "&amp;", "<": "&lt;", ">": "&gt;" };

function escapeHtml(text) {
  return text.replace(/[&<>]/g, (char) => ESCAPES[char]);
}

/**
 * Inline formatting. The source only ever uses **bold**, so this stays
 * deliberately narrow rather than pretending to be a general Markdown parser.
 */
function inline(text) {
  return escapeHtml(text).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}

function heading(level, text) {
  const attrs = level === 2 ? "" : ` {"level":${level}}`;
  return `<!-- wp:heading${attrs} -->\n<h${level}>${inline(text)}</h${level}>\n<!-- /wp:heading -->`;
}

function paragraph(text) {
  return `<!-- wp:paragraph -->\n<p>${inline(text)}</p>\n<!-- /wp:paragraph -->`;
}

function list(items, ordered) {
  const tag = ordered ? "ol" : "ul";
  const attrs = ordered ? ' {"ordered":true}' : "";
  const body = items
    .map((item) => `<!-- wp:list-item -->\n<li>${inline(item)}</li>\n<!-- /wp:list-item -->`)
    .join("\n");
  return `<!-- wp:list${attrs} -->\n<${tag}>\n${body}\n</${tag}>\n<!-- /wp:list -->`;
}

function quote(lines) {
  const body = lines.map((line) => `<p>${inline(line)}</p>`).join("\n");
  return `<!-- wp:quote -->\n<blockquote class="wp-block-quote">\n${body}\n</blockquote>\n<!-- /wp:quote -->`;
}

/**
 * Converts one lesson body. The leading `# Title` duplicates the post title,
 * which WordPress renders itself, so it is dropped.
 */
function markdownToBlocks(markdown, expectedTitle) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");

  if (lines[0] === `# ${expectedTitle}`) {
    lines.shift();
  } else if (/^# /.test(lines[0])) {
    throw new Error(`Leading heading does not match title: ${lines[0]}`);
  }

  const blocks = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (line.trim() === "") {
      index += 1;
      continue;
    }

    const headingMatch = /^(#{1,6})\s+(.*)$/.exec(line);
    if (headingMatch) {
      // h1 is reserved for the post title, so demote the body's scale by one.
      const level = Math.min(headingMatch[1].length + 1, 6);
      blocks.push(heading(level, headingMatch[2].trim()));
      index += 1;
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      const items = [];
      while (index < lines.length) {
        const item = /^[-*]\s+(.*)$/.exec(lines[index]);
        if (item) {
          items.push(item[1].trim());
          index += 1;
        } else if (lines[index].trim() === "" && /^[-*]\s+/.test(lines[index + 1] ?? "")) {
          index += 1; // blank line between items in the source
        } else {
          break;
        }
      }
      blocks.push(list(items, false));
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      const items = [];
      while (index < lines.length) {
        const item = /^\d+\.\s+(.*)$/.exec(lines[index]);
        if (item) {
          items.push(item[1].trim());
          index += 1;
        } else if (lines[index].trim() === "" && /^\d+\.\s+/.test(lines[index + 1] ?? "")) {
          index += 1;
        } else {
          break;
        }
      }
      blocks.push(list(items, true));
      continue;
    }

    if (/^>\s?/.test(line)) {
      const quoted = [];
      while (index < lines.length && /^>\s?/.test(lines[index])) {
        quoted.push(lines[index].replace(/^>\s?/, "").trim());
        index += 1;
      }
      blocks.push(quote(quoted.filter(Boolean)));
      continue;
    }

    // Plain paragraph: absorb wrapped continuation lines.
    const parts = [line.trim()];
    index += 1;
    while (index < lines.length && lines[index].trim() !== "" && !/^([-*>#]|\d+\.)\s/.test(lines[index])) {
      parts.push(lines[index].trim());
      index += 1;
    }
    blocks.push(paragraph(parts.join(" ")));
  }

  return blocks.join("\n\n");
}

// ---------------------------------------------------------------------------
// Source loading
// ---------------------------------------------------------------------------

/**
 * Reads MANUAL_ASSESSMENTS out of the TypeScript source. The file is a plain
 * object literal with no imports or computation, so the object body is
 * evaluated directly rather than adding a TypeScript build step here.
 */
function loadAssessments(path) {
  const source = readFileSync(path, "utf8");
  const start = source.indexOf("MANUAL_ASSESSMENTS");
  if (start === -1) throw new Error("MANUAL_ASSESSMENTS not found");

  const open = source.indexOf("{", source.indexOf("=", start));
  let depth = 0;
  let end = -1;

  for (let i = open; i < source.length; i += 1) {
    if (source[i] === "{") depth += 1;
    if (source[i] === "}") {
      depth -= 1;
      if (depth === 0) {
        end = i + 1;
        break;
      }
    }
  }
  if (end === -1) throw new Error("Unbalanced braces in MANUAL_ASSESSMENTS");

  const literal = source.slice(open, end);
  return Function(`"use strict"; return (${literal});`)();
}

// ---------------------------------------------------------------------------
// Build
// ---------------------------------------------------------------------------

const modules = JSON.parse(readFileSync(CURRICULUM, "utf8"));
const assessments = loadAssessments(ASSESSMENTS);

const problems = [];
const bundle = {
  generatedAt: new Date().toISOString(),
  source: "seven-module-lms/src/content",
  program: {
    organization: "KingsWord Training Institute",
    name: "Believers Training",
    slug: "believers-training",
    passMark: PASS_MARK,
  },
  modules: modules
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((module) => {
      const questions = assessments[module.order] ?? [];
      if (questions.length === 0) problems.push(`Module ${module.order} has no checkpoint questions`);

      return {
        order: module.order,
        slug: module.slug,
        title: module.title,
        eyebrow: module.eyebrow,
        summary: module.summary,
        description: module.description,
        objectives: module.objectives,
        sourceTitle: module.sourceTitle,
        sourceUrl: module.sourceUrl,
        lessons: module.lessons.map((lesson, position) => {
          let content;
          try {
            content = markdownToBlocks(lesson.body, lesson.title);
          } catch (error) {
            problems.push(`Module ${module.order} / ${lesson.slug}: ${error.message}`);
            content = "";
          }
          return {
            order: position + 1,
            slug: lesson.slug,
            title: lesson.title,
            summary: lesson.summary,
            kind: lesson.kind,
            resourceUrl: lesson.resourceUrl,
            estimatedMinutes: lesson.estimatedMinutes,
            content,
          };
        }),
        quiz: {
          title: `${module.title} Checkpoint`,
          slug: `${module.slug}-checkpoint`,
          passMark: PASS_MARK,
          questions: questions
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((question) => {
              if (question.options.length !== 4) {
                problems.push(`Module ${module.order} Q${question.order}: expected 4 options`);
              }
              if (question.correctIndex < 0 || question.correctIndex >= question.options.length) {
                problems.push(`Module ${module.order} Q${question.order}: correctIndex out of range`);
              }
              return {
                order: question.order,
                prompt: question.prompt,
                options: question.options,
                correctIndex: question.correctIndex,
                explanation: question.explanation,
              };
            }),
        },
      };
    }),
};

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, `${JSON.stringify(bundle, null, 2)}\n`, "utf8");

const lessonCount = bundle.modules.reduce((total, module) => total + module.lessons.length, 0);
const questionCount = bundle.modules.reduce((total, module) => total + module.quiz.questions.length, 0);

console.log(`Wrote ${OUT}`);
console.log(`  modules:   ${bundle.modules.length}`);
console.log(`  lessons:   ${lessonCount}`);
console.log(`  questions: ${questionCount}`);

if (problems.length > 0) {
  console.error(`\n${problems.length} problem(s):`);
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
}
console.log("\nNo problems found.");
