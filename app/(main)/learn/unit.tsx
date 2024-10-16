import { lessons, units } from "@/db/schema";
import { UnitBanner } from "./unit-banner";
import { LessonButton } from "./lesson-button";

interface UnitProps {
    id: string,
    order: number,
    title: string,
    description: string | null,
    lessons: (typeof lessons.$inferSelect & {
        completed: boolean;
    })[];
    activeLesson: typeof lessons.$inferSelect & {
        unit: typeof units.$inferSelect;
    } | undefined;
    activeLessonPercentage: number;
};

export const Unit = ({
    id,
    order,
    title,
    description,
    lessons,
    activeLesson,
    activeLessonPercentage
}: UnitProps) => {
    return (
        <>
          <UnitBanner title={title} description={description} />
          <div className=" p-6 flex items-center flex-col relative bg-green-200 rounded-lg">
            {lessons.map((lesson, index) => {
              const isCurrent = lesson.id === activeLesson?.id;
              const isLocked = !lesson.completed && !isCurrent;
    
              return (
                <LessonButton
                  key={lesson.id}
                  id={lesson.id}
                  index={index}
                  totalCount={lessons.length - 1}
                  current={isCurrent}
                  locked={isLocked}
                  percentage={activeLessonPercentage}
                />
              );
            })}
          </div>
        </>
      );
}