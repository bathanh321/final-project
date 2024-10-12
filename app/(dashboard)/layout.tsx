import { Sidebar } from "@/components/sidebar";
import { Header } from "../(marketing)/header";

interface DashboardLayoutProps {
    children?: React.ReactNode
}

const ProtectedLayout = (
    { children }
        : DashboardLayoutProps
) => {
    return (
        <>
        <Sidebar className="hidden lg:flex"/>
            <main className="lg:pl-[256px]  h-full pt-[50px] lg:pt-0">
                <div className="max-w-[1056px] mx-auto h-full">
                    {children}
                </div>
            </main>
        </>
    );
}

export default ProtectedLayout;