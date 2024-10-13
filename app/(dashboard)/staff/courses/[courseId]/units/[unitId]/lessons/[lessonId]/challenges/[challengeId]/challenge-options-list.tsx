import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";

interface ChallengeOption {
    id: string;
    text: string;
    correct: boolean;
    imageSrc: string;
    audioSrc: string;
}

interface ChallengeOptionsListProps {
    items: ChallengeOption[];
    onEdit: (id: string) => void;
}

export const ChallengeOptionsList = ({
    items,
    onEdit
}: ChallengeOptionsListProps) => {
    const [isMounted, setIsMounted] = useState(false);
    const [challengeOptions, setChallengeOptions] = useState(items);

    useEffect(() => {
        setChallengeOptions(items);
    }, [items]);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <div>
            {challengeOptions.map((challengeOption) => (
                <div
                    key={challengeOption.id}
                    className="flex items-center gap-x-2 bg-sky-100 border-sky-200 text-sky-800 rounded-md mb-4 text-sm py-3 px-5">
                    {challengeOption.text}
                    <div className="ml-auto pr-2 flex items-center gap-x-2">
                        <Pencil
                            onClick={() => onEdit(challengeOption.id)}
                            className="size-4 cursor-pointer hover:opacity-75 transition"
                        />
                    </div>
                </div>
            ))}
        </div>
    )
}