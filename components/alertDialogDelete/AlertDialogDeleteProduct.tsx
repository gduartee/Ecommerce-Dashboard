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
import { getCookieClient } from "@/utils/cookie";
import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { toast } from "sonner";

type AlertDialogDeleteProps = {
    productId: number;
}

export function AlertDialogDeleteProduct({ productId }: AlertDialogDeleteProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const { bumpProducts } = useRefreshStore();

    const token = getCookieClient("auth-token-emp");


    async function deleteProduct() {
        try {
            setLoading(true);

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const text = await response.text();

            const data = text ? JSON.parse(text) : {};

            if (!response.ok) {
                const error = data.message || "Erro ao deletar. Reporte ao suporte imediatamente!";

                throw new Error(error);
            }

            bumpProducts();

            toast.success(`Produto deletado com sucesso`);
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
                    className="cursor-pointer" variant="destructive"
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
                            className="cursor-pointer" variant="destructive"
                            disabled={loading}
                            onClick={deleteProduct}
                        >
                            <FaTrash />
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}