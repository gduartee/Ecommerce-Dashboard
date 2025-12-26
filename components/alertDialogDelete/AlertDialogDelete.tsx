"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useRefreshStore } from "@/store/useRefreshStore";
import { useState } from "react";
import { FaTrash, FaTrashAlt } from "react-icons/fa";
import { toast } from "sonner";

type AlertDialogDeleteProps = {
    itemName: string;
    itemId: string | number | null;
}

export function AlertDialogDelete({ itemName, itemId }: AlertDialogDeleteProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const { bumpCategories } = useRefreshStore();

    var rota = "";
    var flexaoDeGenero = "";

    switch (itemName) {
        case "category":
            rota = "categories";
            flexaoDeGenero = "deletada";
            break;
        case "subcategory":
            rota = "categories";
            flexaoDeGenero = "deletada";
            break;
        default:
            break;
    }

    async function deleteItem() {
        if (!itemId) return;
        setLoading(true);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/${rota}/${itemId}`,
                {
                    method: "DELETE",
                }
            );

            const data = await response.json();

            if (!response.ok) {
                const error = data.message || "Erro ao deletar categoria. Verifique se não há produtos vinculados à ela."
                
                throw new Error(error);
            }


            if (itemName === "categoria" || itemName === "subcategoria")
                bumpCategories();


            toast.success(`${itemName} ${flexaoDeGenero} com sucesso`);
            setOpen(false);
        } catch (error) {
            toast.error(`${error}`);
        } finally {
            setLoading(false);
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button
                    className="cursor-pointer w-8 h-8"
                >
                    <FaTrash />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Você tem certeza que deseja continuar?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Essa ação é irreversível...
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel
                        className="cursor-pointer"
                        disabled={loading}
                    >
                        Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button
                            variant="destructive"
                            onClick={deleteItem}
                            disabled={loading || !itemId}
                            className="cursor-pointer"
                        >
                            {loading ? "Excluindo..." : "Confirmar exclusão"}
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}