import { readFileSync } from 'node:fs';
import { PrismaClient } from '@prisma/client';
import { parseFinalQuestions } from '../src/lib/final-exam';
const [file, expectedTarget] = process.argv.slice(2);
if (!file || !expectedTarget) throw new Error('Usage: tsx scripts/import-final-assessment.ts PRIVATE_JSON_FILE EXPECTED_HOST/DATABASE');
const url = new URL(process.env.DATABASE_URL!);
if (url.hostname + url.pathname !== expectedTarget) throw new Error('Database target does not match the explicit target argument.');
const questions = parseFinalQuestions(JSON.parse(readFileSync(file, 'utf8')));
const db = new PrismaClient();
async function main() {
  const program = await db.program.findUniqueOrThrow({where:{slug:'formation-path'}});
  const existing = await db.finalExam.findUnique({where:{programId:program.id}});
  if (existing) {
    if (JSON.stringify(parseFinalQuestions(existing.questions)) !== JSON.stringify(questions)) throw new Error('Existing exam differs. Refusing to overwrite a published exam or attempt history.');
    console.log('The same 50-question exam is already imported.');
    return;
  }
  await db.finalExam.create({data:{programId:program.id,title:'Basic Believers Training Final Assessment',durationSeconds:3600,passMark:70,questions,published:true}});
  console.log('Imported BBT final exam: 50 questions, 60 minutes, 70% pass mark.');
}
main().catch(error=>{console.error(error.message);process.exitCode=1}).finally(()=>db.$disconnect());
