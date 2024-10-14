import { cache } from "react"
import db from "./drizzle"
import { eq } from "drizzle-orm";
import { courses } from "./schema";

export const getCourses = cache(async () => {
    const data = await db.query.courses.findMany();

    return data;
})

export const getCourseById = cache(async (courseId: string) => {
    const data = await db.query.courses.findFirst({
        where: eq(courses.id, courseId),
        with: {
            units: {
                orderBy: (units, { asc }) => [asc(units.order)],
                with: {
                    lessons: {
                        orderBy: (lessons, {asc}) => [asc(lessons.order)],
                    }
                }
            }
        }
    })
})