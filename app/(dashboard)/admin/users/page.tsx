import { auth } from "@/auth";
import db from "@/db/drizzle";
import { redirect } from "next/navigation";
import { DataTable } from "./data-table";
import { columns } from "./columns";

const UsersPage = async () => {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
        redirect("/");
    }

    const users = await db.query.user.findMany();

    return ( 
        <div>
            <DataTable columns={columns} data={users} />
        </div>
     );
}
 
export default UsersPage;