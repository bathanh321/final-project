
import { redirect } from "next/navigation";
import { CreateCourseForm } from "./create-course-form";
import { auth } from "@/auth";


const CreatePage = async () => {
  const user = await auth();

  if(!user || user.user.role === "USER") {
    redirect("/");
  }

  return (
    <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
      <div>
        <h1 className="text-2xl">
          Name your course
        </h1>
        <p className="text-sm text-slate-600">
          What would you like to name your course? Don&apos;t worry, you can change this later.
        </p>
        <CreateCourseForm />
      </div>
    </div>
  );
}

export default CreatePage;