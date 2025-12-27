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
    var namePt = "";

    switch (itemName) {
        case "category":
            rota = "categories";
            flexaoDeGenero = "deletada";
            namePt = "categoria";
            break;
        case "subcategory":
            rota = "subcategories";
            flexaoDeGenero = "deletada";
            namePt = "subcategoria";
            break;
        default:
            break;
    }

    async function deleteItem() {
        try {
            if (!itemId) return;

            setLoading(true);

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/${rota}/${itemId}`,
                {
                    method: "DELETE"
                }
            );

            const text = await response.text();

            const data = text ? JSON.parse(text) : {};

            if (!response.ok) {
                const error = data.message || "Erro ao deletar. Reporte ao suporte imediatamente!";

                throw new Error(error);
            }


            if (itemName === "category" || itemName === "subcategory")
                bumpCategories();


            toast.success(`${namePt} ${flexaoDeGenero} com sucesso`);
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
                <div className="bg-primary text-white rounded-md p-2 cursor-pointer">
                    <FaTrash className="w-4 h-4" />
                </div>
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