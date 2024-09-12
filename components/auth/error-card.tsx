import { CardWrapper } from "./card-wrapper";
import { TriangleAlertIcon } from "lucide-react";

export const ErrorCard = () => {
    return (
        <CardWrapper
            headerLabel="Có lỗi xảy ra"
            backButtonLabel="Quay lại trang đăng nhập?"
            backButtonHref="/auth/login"
        >
            <div className="w-full flex justify-center items-center">
                <TriangleAlertIcon className="text-destructive" />
            </div>
        </CardWrapper>
    );
};