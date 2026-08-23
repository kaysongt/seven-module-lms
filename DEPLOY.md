# Production Deployment

Deploy this LMS as a **new Vercel project**. Do not attach it to or overwrite an existing KTI website project.

## 1. Approve launch content

- Confirm the program name, organization name, support email, and domain.
- Review the seven imported BT manuals, 77 lessons, and 35 checkpoint questions in the admin curriculum area.
- Confirm that every lesson opens its approved Google Docs source manual.
- Add approved video URLs when the recordings are ready.
- Set module release dates and verify publication states.
- Confirm the pass mark and certificate wording.

## 2. Prepare PostgreSQL

Use a separate database for this LMS. The current development setup uses the isolated `formation_lms` database rather than mixing tables with another KTI application.

Set these locally or in a secure deployment shell:

```bash
DATABASE_URL="postgresql://...pooled-connection..."
DIRECT_URL="postgresql://...direct-connection..."
```

Apply committed migrations:

```bash
npm ci
npm run db:deploy
```

To create the first production administrator, temporarily set `SEED_ADMIN_EMAIL` and a unique password of at least 12 characters, omit both student seed variables, and run:

```bash
npm run db:seed
```

Remove the seed password from local shell history and deployment environment settings after the administrator can sign in. Running the seed again restores the approved manual-backed curriculum, so do not use it after staff begin making intentional live edits unless those edits should be overwritten.

## 3. Create the Vercel project

1. Import this repository as a new project.
2. If the repository contains multiple apps, set the Root Directory to `seven-module-lms`.
3. Keep Framework Preset as Next.js and Build Command as `npm run build`.
4. Add `DATABASE_URL`, `DIRECT_URL`, and `APP_URL` to the Production environment.
5. Set `APP_URL` to the final HTTPS origin, for example `https://learn.example.org`.
6. Deploy and attach the approved domain.

Database migrations are intentionally not run during every Vercel build. Run `npm run db:deploy` once before a release that includes schema changes.

## 4. Verify the production story

- `/api/health` returns `ok: true` and reports database connectivity.
- Public curriculum contains exactly seven approved modules.
- A new application appears in the admin admissions queue.
- Approval creates a private activation link that works once and expires after seven days.
- The activated student can sign in, complete lessons, submit assignments, pass a checkpoint, and unlock only the next module.
- Staff can pause and restore an enrollment.
- Community posts, replies, moderation, announcements, and assignment review work.
- A completed student can receive and print a certificate.
- Privacy, support email, mobile navigation, and custom-domain HTTPS work.

Delete all test applications, accounts, submissions, posts, and progress after verification.

## 5. Decide before public enrollment

- **Email:** choose a transactional provider if activation links and status updates should be sent automatically.
- **Payments:** define tuition, currency, full-program versus module pricing, refund terms, scholarships, and whether successful payment should auto-enroll a student.
- **Operations:** assign owners for admissions, curriculum publication, assignment review, moderation, and support.
- **Monitoring:** enable Vercel Web Analytics, Speed Insights, and runtime alerts as appropriate for the organization.
