export type ModuleProgressInput = {
  id: string;
  order: number;
  lessonIds: string[];
  availableAt?: Date | null;
  assessmentPassed: boolean;
};

export type ModuleProgressState = {
  id: string;
  order: number;
  completedLessons: number;
  totalLessons: number;
  percent: number;
  isComplete: boolean;
  isAvailable: boolean;
  isUnlocked: boolean;
};

export function calculateScore(correct: number, total: number): number {
  if (!Number.isInteger(correct) || !Number.isInteger(total) || total <= 0 || correct < 0 || correct > total) {
    throw new Error("Invalid assessment score inputs");
  }
  return Math.round((correct / total) * 100);
}

export function scorePasses(scorePct: number, passMark: number): boolean {
  if (passMark < 1 || passMark > 100) throw new Error("Pass mark must be between 1 and 100");
  return scorePct >= passMark;
}

export function deriveModuleProgress(
  modules: ModuleProgressInput[],
  completedLessonIds: ReadonlySet<string>,
  now = new Date(),
): ModuleProgressState[] {
  const ordered = [...modules].sort((a, b) => a.order - b.order);
  let previousComplete = true;

  return ordered.map((module) => {
    const completedLessons = module.lessonIds.filter((id) => completedLessonIds.has(id)).length;
    const totalLessons = module.lessonIds.length;
    const lessonsComplete = totalLessons > 0 && completedLessons === totalLessons;
    const isComplete = lessonsComplete && module.assessmentPassed;
    const isAvailable = !module.availableAt || module.availableAt <= now;
    const isUnlocked = previousComplete && isAvailable;

    previousComplete = isComplete;

    return {
      id: module.id,
      order: module.order,
      completedLessons,
      totalLessons,
      percent: totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100),
      isComplete,
      isAvailable,
      isUnlocked,
    };
  });
}

export function calculateProgramPercent(states: ModuleProgressState[]): number {
  if (states.length === 0) return 0;
  const moduleWeight = 100 / states.length;
  const earned = states.reduce((sum, state) => {
    const lessonShare = state.percent * 0.8;
    const assessmentShare = state.isComplete ? 20 : 0;
    return sum + ((lessonShare + assessmentShare) / 100) * moduleWeight;
  }, 0);
  return Math.round(earned);
}
