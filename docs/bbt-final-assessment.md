# BBT final assessment

The supplied September 2026 exam contains 50 four-option questions across seven modules. The marking scheme recommends 70% (35 correct). The exam duration is 60 minutes.

Student entry: `/final-assessment`. Staff administration: `/admin/final-assessment`.

Online students unlock the final exam after completing all seven modules and checkpoints. Local-church students use normal account creation and submit their church/location for administrator approval. Approval does not mark LMS lessons complete. One attempt is allowed initially; administrators can approve one additional attempt after a failed submission. Repeated approvals are idempotent. These access and retake defaults should be confirmed with the course owner.

Questions and the answer key are imported into Postgres, never shipped in public source or client props. The original documents and extracted answer-key JSON must remain private. Do not put them under `public/` or commit them.

Apply the additive Prisma migration before deploying the routes. Import a validated private JSON file using:

```
node_modules/.bin/tsx --env-file=.env scripts/import-final-assessment.ts PRIVATE_JSON_FILE EXPECTED_HOST/DATABASE
```

Each JSON question has `number`, `module`, `prompt`, four `options`, and zero-based `correctIndex`. The importer validates all 50 questions and refuses to overwrite a different existing exam. Use the target environment's database variables. Do not run the general curriculum seed to publish this exam.

Attempts snapshot the question set and pass mark. Server timestamps enforce the deadline. Autosave and submission use ownership checks, row locks and version checks. Late submissions grade only previously saved answers. Expired attempts are finalized when the student or staff opens the assessment page, including when the exam tab was closed. Results show scores per module without exposing answers to students. Certificates and existing module checkpoints remain separate.

Validation: grading and deadline unit tests; real HTTP checks for signup, approval, concurrent starts, autosave, stale writes, ownership, timeout grading, immutable results, and retakes; browser review of student and staff pages.
