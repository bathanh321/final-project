import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";

interface Challenge {
    id: number;
    question: string;
    type: "SELECT" | "ASSIST";
    difficultLevel: number;
    isPublished: boolean;
    order: number;
}

interface ChallengesListProps {
    items: Challenge[];
    onEdit: (id: number) => void;
}

export const ChallengesList = ({
    items,
    onEdit
}: ChallengesListProps) => {
    const [isMounted, setIsMounted] = useState(false);
    const [challenges, setChallenges] = useState(items);

    useEffect(() => {
        setChallenges(items);
    }, [items]);

    if (!isMounted) {
        return null;
    }

    return (
        <div>
            {challenges.map((challenge) => (
                <div
                    key={challenge.id}
                    className={cn(
                        "flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 text-sm",
                        challenge.isPublished && "bg-sky-100 border-sky-200 text-sky-700"
                    )}
                >
                    <div className={cn(
                        "px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition",
                        challenge.isPublished && "border-r-sky-200 hover:bg-sky-200"
                    )}>
                    </div>
                    {challenge.question}
                    <div className="ml-auto pr-2 flex items-center gap-x-2">
                        <Badge className={cn(
                            "bg-slate-500",
                            challenge.isPublished && "bg-sky-700"
                        )}>
                            {challenge.isPublished ? "Published" : "Draft"}
                        </Badge>
                        <Pencil
                            onClick={() => onEdit(challenge.id)}
                            className="size-4 cursor-pointer hover:opacity-75 transition"
                        />
                    </div>
                </div>
            ))}
        </div>
    )
}