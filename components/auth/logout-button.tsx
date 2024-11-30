"use client";

import { logout } from "@/actions/logout";

import {
    Dialog,
    DialogContent,
    DialogTrigger
} from "@/components/ui/dialog";

interface LogoutButtonProps {
    children?: React.ReactNode;
};

export const LogoutButton = ({ children }: LogoutButtonProps) => {
    const onClick = () => {
        logout();
    }

    return (
        <span onClick={onClick} className="cursor-pointer">
            {children}
        </span>
    )
}