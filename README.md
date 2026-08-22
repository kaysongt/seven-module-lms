# Seven-Module LMS

A production-oriented learning platform for a focused seven-module program. The working brand is **KingsWord Learning / The Formation Path**; program copy, modules, lessons, assessments, release dates, and publication status can be managed from the staff area.

## What is included

- Editorial public site with curriculum, application, privacy, and login pages
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

The seed creates the program, exactly seven modules, two working lessons per module, and three checkpoint questions per module. Seed lesson copy explicitly identifies itself as working material. Replace it with approved curriculum before accepting real students.

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
- The working brand and seed curriculum are editable foundations, not approved final content.
- The system supports one program with exactly seven ordered modules.

See [DEPLOY.md](./DEPLOY.md) for the production checklist.
