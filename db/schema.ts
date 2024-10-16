import { relations } from "drizzle-orm";
import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  uniqueIndex,
  pgEnum,
  unique,
  boolean,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters"

export const userRole = pgEnum("role", ["ADMIN", "STAFF", "USER"]);

export enum UserRole {
  ADMIN = "ADMIN",
  STAFF = "STAFF",
  USER = "USER"
}

export const user = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  password: text("password"),
  role: userRole("role").notNull().default("USER"),
});

export const account = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const verificationToken = pgTable("verification_token", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  email: text("email"),
  token: text("token").unique(),
  expires: timestamp("expires", { mode: "date" }),
}, (verificationToken) => ({
  uniqueEmailVerificationToken: uniqueIndex('unique_email_verification_token_index').on(verificationToken.email, verificationToken.token),
}));

export const passwordResetToken = pgTable("password_reset_token", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  email: text("email"),
  token: text("token").unique(),
  expires: timestamp("expires", { mode: "date" }),
}, (passwordResetToken) => ({
  uniqueEmailResetToken: uniqueIndex('unique_email_reset_token_index').on(passwordResetToken.email, passwordResetToken.token),
}));

// Courses Table
export const courses = pgTable("courses", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  imageSrc: text("image_src"),
  isPublished: boolean("is_published").default(false).notNull(),
});

// Units Table
export const units = pgTable("units", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  courseId: text("course_id").references(() => courses.id, { onDelete: "cascade" }).notNull(),
  isPublished: boolean("is_published").default(false).notNull(),
  order: integer("order").notNull(),
});

// Lessons Table
export const lessons = pgTable("lessons", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  unitId: text("unit_id").references(() => units.id, { onDelete: "cascade" }).notNull(),
  isPublished: boolean("is_published").default(false).notNull(),
  order: integer("order").notNull(),
});

// Challenges Table
export const challengesEnum = pgEnum("type", ["SELECT", "ASSIST"]);

export const challenges = pgTable("challenges", {
  id: text("id").primaryKey(),
  lessonId: text("lesson_id").references(() => lessons.id, { onDelete: "cascade" }).notNull(),
  type: challengesEnum("type").default("SELECT").notNull(),
  question: text("question").notNull(),
  difficultLevel: integer("difficult_level"),
  isPublished: boolean("is_published").default(false).notNull(),
  order: integer("order").notNull(),
});

// Challenge Options Table
export const challengeOptions = pgTable("challenge_options", {
  id: text("id").primaryKey(),
  challengeId: text("challenge_id").references(() => challenges.id, { onDelete: "cascade" }).notNull(),
  text: text("text"),
  correct: boolean("correct").notNull().default(false),
  imageSrc: text("image_src"),
  audioSrc: text("audio_src"),
});

// Challenge Progress Table
export const challengeProgress = pgTable("challenge_progress", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().unique().references(() => user.id, { onDelete: "cascade" }),
  challengeId: text("challenge_id").references(() => challenges.id, { onDelete: "cascade" }).notNull(),
  completed: boolean("completed").notNull().default(false),
});

// User Progress Table
export const userProgress = pgTable("user_progress", {
  userId: text("user_id").primaryKey(),
  userName: text("user_name").notNull().default("User"),
  userImageSrc: text("user_image_src").notNull().default("/mascot.svg"),
  activeCourseId: text("active_course_id").references(() => courses.id, { onDelete: "cascade" }),
  hearts: integer("hearts").notNull().default(5),
  points: integer("points").notNull().default(0),
});

// User Subscription Table
export const userSubscription = pgTable("user_subscription", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().unique().references(() => user.id, { onDelete: "cascade" }),
  stripeCustomerId: text("stripe_customer_id").notNull().unique(),
  stripeSubscriptionId: text("stripe_subscription_id").notNull().unique(),
  stripePriceId: text("stripe_price_id").notNull(),
  stripeCurrentPeriodEnd: timestamp("stripe_current_period_end").notNull(),
});

// Relations
export const userRelations = relations(user, ({ many }) => ({
  users: many(user),
  userProgress: many(userProgress),
  challengeProgress: many(challengeProgress),
  userSubscriptions: many(userSubscription),
}));

export const userProgressRelations = relations(userProgress, ({ one }) => ({
  user: one(user, {
    fields: [userProgress.userId],
    references: [user.id]
  }),
  activeCourse: one(courses, {
    fields: [userProgress.activeCourseId],
    references: [courses.id]
  }),
}));

export const userSubscriptionRelations = relations(userSubscription, ({ one }) => ({
  user: one(user, {
    fields: [userSubscription.userId],
    references: [user.id]
  }),
}));

export const coursesRelations = relations(courses, ({ many }) => ({
  userProgress: many(userProgress),
  units: many(units),
}));

export const unitsRelations = relations(units, ({ one, many }) => ({
  course: one(courses, {
    fields: [units.courseId],
    references: [courses.id]
  }),
  lessons: many(lessons),
}));

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  unit: one(units, {
    fields: [lessons.unitId],
    references: [units.id]
  }),
  challenges: many(challenges),
}));

export const challengesRelations = relations(challenges, ({ one, many }) => ({
  lesson: one(lessons, {
    fields: [challenges.lessonId],
    references: [lessons.id]
  }),
  challengeOptions: many(challengeOptions),
  challengeProgress: many(challengeProgress),
}));

export const challengeOptionsRelations = relations(challengeOptions, ({ one }) => ({
  challenge: one(challenges, {
    fields: [challengeOptions.challengeId],
    references: [challenges.id]
  }),
}));

export const challengeProgressRelations = relations(challengeProgress, ({ one }) => ({
  challenge: one(challenges, {
    fields: [challengeProgress.challengeId],
    references: [challenges.id]
  }),
  user: one(user, {
    fields: [challengeProgress.userId],
    references: [user.id]
  })
}));