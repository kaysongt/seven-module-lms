# Believers Training completion rules

Students sign up at /signup and sign in at /login. Each lesson requires every earlier published lesson in its module to be complete. Each module requires all earlier modules and their checkpoints to be complete.

- Video lessons complete only through authenticated, timed progress updates. The seven source videos have trusted durations in src/lib/video-progress.ts. A browser cannot supply a shorter duration or use the manual completion / assignment actions to complete a video.
- Progress is saved every five seconds while playing. Pausing, rewinding, and returning later are supported. Hidden tabs pause. A lost connection or a different playback session resumes from saved progress.
- Reading lessons require completion; the review assignment requires a written submission. Checkpoints require every answer and the configured passing score (currently 80%).
- Staff see completed lessons and per-module video progress at /admin/students. Certificates also require verified completion.
- Existing manual video completion rows are retained but do not satisfy verified watching. A changed video ID invalidates its previous watch progress.

## Content

The seven @tempkingsword video IDs match the first lessons of the seven modules. Every question prompt in the seven DOCX student manuals supplied on September 15, 2026 was found in the existing curriculum. The existing five-question checkpoints include answer explanations; the longer manual review/reflection prompts remain written assignments.

## Database rollout

Apply the additive Prisma migration 20260915180000_video_progress before deploying the new app. It creates VideoProgress and preserves existing users, lessons, and completions. Use prisma migrate deploy against the intended environment; do not reseed production. The health endpoint checks for the new table.

## Verification

- Lint, TypeScript, 66 tests, and production build passed.
- Fourteen real HTTP/database checks on an isolated Neon branch covered signup, password login, logout/session revocation, locked direct URLs/actions, manual and assignment bypass attempts, skipped playback, stale sessions, cross-origin writes, resume after login, automatic video completion, sequential readings and assignment, missing answers, failed/passed checkpoints, and paused enrollment.
- The completion integration check positioned a synthetic student's saved progress two seconds from the end, then used real timed requests. Timing unit tests separately cover continuous playback, network jitter, invalid jumps, and replay.
- Browser playback/visual verification could not run because the desktop browser automation sandbox failed to initialize. The player uses the documented YouTube IFrame API; manual device testing is still needed.

## Limits

Public YouTube links remain accessible outside the LMS. This does not make videos undownloadable, prevent screen recording, or prove human attention. Server timing prevents instant/accelerated completion through the ordinary LMS actions, but a client-controlled player cannot cryptographically prove that someone watched. Reading acknowledgments and written submissions likewise establish workflow completion rather than comprehension; the checkpoint provides the knowledge check.
