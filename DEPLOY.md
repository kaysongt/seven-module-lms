# Production Deployment

This repository is already linked to the **seven-module-lms** Vercel project in
**kaysongts-projects**. Use that project for this KingsWord network update and
retain its database configuration. Do not overwrite a separate KTI project.
See [DOMAINS.md](./DOMAINS.md) for the five-domain cutover. The setup steps below
also cover a fresh installation when no existing deployment is available.

## 1. Approve launch content

- Confirm the program name, organization name, support email, and domain.
- Review the seven imported BT manuals, 77 lessons, and 35 checkpoint questions in the admin curriculum area.
- Confirm that every lesson opens its approved Google Docs source manual.
- Add approved video URLs when the recordings are ready.
- Set module release dates and verify publication states.
- Confirm the pass mark and certificate wording.

## 2. Prepare PostgreSQL

Use the database already connected to the `seven-module-lms` Vercel project. The original development installation used `formation_lms`; production is connected through the project's Neon integration. Verify the selected project and branch before applying migrations, and do not mix tables with another KTI application.

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

## Ministers portal

Apply `20260909000000_ministers_portal` with `npm run db:deploy` before deploying the portal. The migration adds minister profiles, private file metadata/content, request counters, and constraints without changing existing learning records. Do not run the curriculum seed as part of this update.

- The public **Ministers Login** menu opens `/ministers/login`. Existing accounts can request minister access; new accounts start as pending with clearance 0. Login lets pending applicants check their status, but does not grant document access.
- Existing `ADMIN` users review accounts at `/admin/ministers`. Instructors cannot approve requests. Administrators should verify the applicant's identity before approval.
- Clearance levels are cumulative: **1 General Ministry**, **2 Leadership**, **3 Restricted**. Approval is required at every level. Declining or suspending access resets clearance to 0; every download rechecks authorization.
- Administrators upload and manage documents at `/admin/ministry-files`. PDF, DOCX, XLSX and PPTX files up to **3 MB each** are supported. New uploads default to Draft. Only published documents appear to eligible ministers; archiving removes access.
- File bytes stay in PostgreSQL and are delivered as private, uncached attachments through `/ministers/files/[id]`. There are no public storage URLs. Monitor database storage as the library grows; larger files require a private object-storage upload/download design.
- Approval changes, document changes and downloads are recorded in the audit log. Concurrent edits require a refresh instead of silently replacing another administrator's decision.
- No automatic approval emails are sent. Applicants see their current status when they sign in; staff can notify them separately.

Before release, verify registration, existing-account requests, approval, all three clearance levels, copied download links, suspension, draft/archive access, and administrator-only actions using an isolated database branch.
