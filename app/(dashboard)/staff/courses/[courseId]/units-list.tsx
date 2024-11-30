"use client";

import { useState, useEffect } from "react";
import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult,
} from "@hello-pangea/dnd";

import { cn } from "@/lib/utils";
import { Grip, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { units } from "@/db/schema";

interface UnitsListProps {
    items: typeof units.$inferSelect[];
    onReorder: (updateData: { id: string, order: number }[]) => void;
    onEdit: (id: string) => void;
}

export const UnitsList = ({
    items,
    onReorder,
    onEdit
}: UnitsListProps) => {
    const [isMounted, setIsMounted] = useState(false);
    const [units, setUnits] = useState(items);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        setUnits(items);
    }, [items]);

    const onDragEnd = (result: DropResult) => {
        if(!result.destination) return;

        const items = Array.from(units);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        const startIndex = Math.min(result.source.index, result.destination.index);
        const endIndex = Math.max(result.source.index, result.destination.index);

        const updatedUnits = items.slice(startIndex, endIndex + 1);

        setUnits(items);

        const bulkUpdateData = updatedUnits.map((unit) => ({
            id: unit.id,
            order: items.findIndex((item) => item.id === unit.id),
        }));

        onReorder(bulkUpdateData);
    }

    if (!isMounted) {
        return null;
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="units">
                {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                        {units.map((unit, index) => (
                            <Draggable
                                key={unit.id}
                                draggableId={unit.id.toString()}
                                index={index}
                            >
                                {(provided) => (
                                    <div className={cn(
                                        "flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 text-sm",
                                        unit.isPublished && "bg-sky-100 border-sky-200 text-sky-700"
                                    )}
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                    >
                                        <div className={cn(
                                            "px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition",
                                            unit.isPublished && "border-r-sky-200 hover:bg-sky-200"
                                        )}
                                            {...provided.dragHandleProps}
                                        >
                                            <Grip className="size-5" />
                                        </div>
                                        {unit.title}
                                        <div className="ml-auto pr-2 flex items-center gap-x-2">
                                            <Badge className={cn(
                                                "bg-slate-500",
                                                unit.isPublished && "bg-sky-700"
                                            )}>
                                                {unit.isPublished ? "Published" : "Draft"}
                                            </Badge>
                                            <Pencil
                                                onClick={() => onEdit(unit.id)}
                                                className="size-4 cursor-pointer hover:opacity-75 transition"
                                            />
                                        </div>
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    )
}