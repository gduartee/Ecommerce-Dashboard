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
import { FaTrashAlt } from "react-icons/fa";
import { toast } from "sonner";

type AlertDialogDeleteProps = {
    itemName: string;
    itemId: string | number | null;
}

export function AlertDialogDelete({ itemName, itemId }: AlertDialogDeleteProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { bumpCategorias } = useRefreshStore();

    var rota = "";
    var flexaoDeGenero = "";

    switch (itemName) {
        case "categoria":
            rota = "categories";
            flexaoDeGenero = "deletada";
            break;
        case "subcategoria":
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

            if (!response.ok)
                throw new Error(`HTTP ${response.status}`);

            if (itemName === "categoria" || itemName === "subcategoria")
                bumpCategorias();


            toast.success(`${itemName} ${flexaoDeGenero} com sucesso`);
            setOpen(false);
        } catch (err) {
            toast.error(`Erro ao deletar ${itemName}. Reporte ao suporte imediatamente!`);
        } finally {
            setLoading(false);
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <div className="bg-slate-900 rounded-md cursor-pointer  flex items-center justify-center hover:bg-slate-400 transition-colors w-7 h-7">
                    <FaTrashAlt className="text-white w-5 h-5" />
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