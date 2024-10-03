// "use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CourseSchemaTitle } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import * as z from "zod";
import axios from "axios";
import { redirect, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { useCurrentUser } from "@/hooks/use-current-user";
import db from "@/db/drizzle";
import { auth } from "@/auth";

const CoursePage = async () => {
    const user = auth();

    if(!user) {
        return redirect("/auth/login");
    }

    const courses = await db.query.courses.findMany()

    return (
        <div className="p-6">
        
        <DataTable columns={columns} data={courses} />
      </div>
    );
}

export default CoursePage;