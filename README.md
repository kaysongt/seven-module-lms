# KingsWord Chicago

The church's website and its **Believers Training** programme, as one application.

This replaces [chicago.kingsword.org](https://chicago.kingsword.org/) — a WordPress
and Elementor site — and folds the seven-module training programme in as a tab
rather than running it as a separate product.

A parallel rebuild of the church site on WordPress + LearnDash was carried some
way before being dropped: this app already worked, held the real curriculum and
was deployed, so rebuilding it on a paid plugin would have bought consolidation
rather than capability. Building the marketing site here instead gets the same
consolidation the other way round — one codebase, one login, one design system.

The church's own details live in `src/lib/church.ts`; the training programme's
live in `src/lib/site-config.ts`. They are separate because "the phone number"
and "the pass mark" belong to different things.

## What is included

- The church site: home, about, children's ministry, contact, and visiting details
- Believers Training as a tab, with curriculum, application, privacy, and login pages
- Admissions queue with approve/decline decisions and one-time activation links
- Password-based authentication using scrypt, opaque database sessions, secure cookies, and login lockouts
- Sequential seven-module student journey with lesson and release-date locks
- Reading, video, download, and assignment lessons
- Module checkpoints with an editable pass mark, retakes, feedback, and server-side grading
- Module community discussions, replies, staff moderation, and announcements
- Student, assignment, curriculum, assessment, enrollment, and certificate administration
- PostgreSQL persistence through Prisma, with an initial migration and idempotent seed
- Responsive layouts, accessible controls, print-ready certificates, and a health endpoint

## Stack

- Next.js 16 App Router and React 19
- Strict TypeScript and Tailwind CSS 4
- Prisma 6 and PostgreSQL (tested with Neon)
- Zod validation and Vitest
- Self-hosted Fraunces and Manrope variable fonts

## Local setup

Prerequisites: Node.js 20+, npm, and a PostgreSQL database.

```bash
cp .env.example .env
npm ci
npm run db:deploy
npm run db:seed
npm run dev
```

Open `http://localhost:3000`.

Configure `.env` before seeding:

- `DATABASE_URL`: pooled PostgreSQL URL used by the application
- `DIRECT_URL`: direct PostgreSQL URL used by Prisma migrations
- `APP_URL`: canonical application URL, without a trailing slash
- `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD`: optional first administrator
- `SEED_STUDENT_EMAIL` and `SEED_STUDENT_PASSWORD`: optional local demo student; omit these in production

The seed creates the complete approved curriculum from the seven BT student manuals:

- Seven ordered modules
- Ten reading lessons per module
- One review and personal integration assignment per module
- Five manual-specific checkpoint questions per module, with an 80% pass mark
- A source-manual link on every lesson

The normalized curriculum is stored in `src/content/manual-curriculum.json`. Checkpoint questions are stored in `src/content/manual-assessments.ts`.

## Staff workflow

1. Sign in with an administrator account and open `/admin`.
2. Review applications under **Admissions**.
3. Approve an applicant and send the displayed one-time activation link through a private channel.
4. Edit and publish approved modules, lessons, videos, resources, checkpoint questions, and release dates under **Curriculum**.
5. Monitor enrollments, assignment submissions, discussions, announcements, and completion from the staff area.
6. Issue a certificate after the dashboard confirms program completion.

Instructors can review submissions, post announcements, and moderate discussions. Only administrators can change curriculum, approve admissions, alter enrollment access, or issue certificates.

## Quality checks

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

`npm run check` runs the complete sequence.

## Current launch boundaries

- Email delivery is not connected. Staff copy the secure activation link from the admissions queue.
- Payment is not implemented because no tuition, currency, refund, or enrollment-after-payment policy was provided. Admissions currently activate enrollment manually.
- Curriculum remains editable by administrators, but reseeding restores the approved manual-backed source content.
- The system supports one program with exactly seven ordered modules.

See [DEPLOY.md](./DEPLOY.md) for the production checklist.
