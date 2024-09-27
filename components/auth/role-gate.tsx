"use client";

import { UserRole } from "@/db/schema";
import { FormError } from "../form-error";
import { UseCurrentRole } from "@/hooks/use-current-role";

interface RoleGateProps {
    children: React.ReactNode;
    allowedRole: UserRole;
}

export const RoleGate = ({
    children,
    allowedRole
}: RoleGateProps) => {
    const role = UseCurrentRole();

    if (role != allowedRole) {
        return (
            <FormError message="You do not have permission to view this content!" />
        )
    }

    return (
        <div>
            {children}
        </div>
    )
}