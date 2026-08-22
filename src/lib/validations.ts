import { z } from "zod";

const email = z.string().trim().email("Enter a valid email address").transform((value) => value.toLowerCase());

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Enter your password"),
});

export const activationSchema = z
  .object({
    token: z.string().min(20),
    password: z.string().min(12, "Use at least 12 characters").max(128),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const applicationSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name").max(120),
  email,
  phone: z.string().trim().max(40).optional(),
  country: z.string().trim().min(2, "Enter your country").max(80),
  churchOrOrganization: z.string().trim().max(160).optional(),
  ministryRole: z.string().trim().max(120).optional(),
  reason: z.string().trim().min(40, "Tell us a little more (at least 40 characters)").max(2000),
  website: z.string().max(0).optional(),
});

export const moduleSchema = z.object({
  moduleId: z.string().uuid(),
  title: z.string().trim().min(2).max(120),
  eyebrow: z.string().trim().min(2).max(80),
  summary: z.string().trim().min(10).max(240),
  description: z.string().trim().min(20).max(2000),
  objectives: z.string().trim().min(5).max(2000),
  estimatedMinutes: z.coerce.number().int().min(10).max(5000),
  availableAt: z.string().trim().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
});

export const programSchema = z.object({
  programId: z.string().uuid(),
  name: z.string().trim().min(3).max(160),
  shortName: z.string().trim().min(2).max(80),
  eyebrow: z.string().trim().min(3).max(120),
  tagline: z.string().trim().min(8).max(240),
  description: z.string().trim().min(20).max(2000),
  certificateLabel: z.string().trim().min(3).max(160),
  passMark: z.coerce.number().int().min(1).max(100),
  isPublished: z.enum(["true", "false"]).transform((value) => value === "true"),
});

export const lessonSchema = z.object({
  lessonId: z.string().uuid(),
  title: z.string().trim().min(2).max(160),
  summary: z.string().trim().min(10).max(300),
  body: z.string().trim().min(20).max(50000),
  kind: z.enum(["VIDEO", "READING", "DOWNLOAD", "ASSIGNMENT"]),
  videoUrl: z.string().trim().url().optional().or(z.literal("")),
  resourceUrl: z.string().trim().url().optional().or(z.literal("")),
  estimatedMinutes: z.coerce.number().int().min(1).max(1000),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
});

export const questionSchema = z.object({
  questionId: z.string().uuid(),
  prompt: z.string().trim().min(5).max(1000),
  option0: z.string().trim().min(1).max(500),
  option1: z.string().trim().min(1).max(500),
  option2: z.string().trim().min(1).max(500),
  option3: z.string().trim().min(1).max(500),
  correctIndex: z.coerce.number().int().min(0).max(3),
  explanation: z.string().trim().min(5).max(2000),
});

export const discussionSchema = z.object({
  moduleId: z.string().uuid(),
  body: z.string().trim().min(10, "Write at least 10 characters").max(3000),
  parentId: z.string().uuid().optional(),
});

export const assignmentSchema = z.object({
  lessonId: z.string().uuid(),
  response: z.string().trim().min(40, "Write at least 40 characters").max(10000),
});

export const announcementSchema = z.object({
  title: z.string().trim().min(3).max(160),
  body: z.string().trim().min(10).max(5000),
});
