"use client";

import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRefreshStore } from "@/store/useRefreshStore";
import { FaEdit } from "react-icons/fa";

type Props = {
    subcategoryId: number;
}

type Subcategory = {
    subCategoryId: number;
    name: string;
};

export function EditSubcategory({ subcategoryId }: Props) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [subcategory, setSubcategory] = useState<Subcategory | null>(null);

    const { bumpSubcategories } = useRefreshStore();

    async function fetchSubcategory() {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subcategories/${subcategoryId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (!response.ok) {
                const msgErro = data.message || "Erro ao buscar subcategoria. Reporte ao suporte imediatamente!";
                throw new Error(msgErro);
            }

            setSubcategory(data);
        } catch (error) {
            toast.error(`${error}`)
        }
    }

    async function editSubcategory(event: React.FormEvent<HTMLFormElement>) {
        try {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            setLoading(true);

            const name = String(formData.get("name")).trim();

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subcategories/${subcategoryId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name
                })
            });

            if (!response.ok) {
                const data = await response.json();
                const msgErro = data.errors ? data.errors.name : "Erro ao editar subcategoria. Reporte ao suporte imediatamente"

                throw new Error(msgErro);
            }

            bumpSubcategories();

            toast.success("Subcategoria editada com sucesso!");
            setOpen(false);
        } catch (error) {
            toast.error(`${error}`);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (open)
            fetchSubcategory();
    }, [open])

    return (
        <Dialog open={open} onOpenChange={setOpen}>

            <DialogTrigger asChild className="flex gap-2 items-center">
                <Button
                    className="cursor-pointer w-8 h-8"
                >
                    <FaEdit />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] overflow-y-auto">
                <DialogTitle>Editar subcategoria</DialogTitle>
                <form onSubmit={editSubcategory}>
                    <div className="flex flex-col w-full mt-4">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="name">Nome da subcategoria</Label>
                            <Input id="name" name="name" placeholder="Ex: Masculino" defaultValue={subcategory?.name} />
                        </div>
                        <Button
                            type="submit"
                            className="mt-4 cursor-pointer"
                            disabled={loading}
                        >
                            {loading ? "Editando..." : "Editar"}
                        </Button>
                    </div>
                </form>
            </DialogContent>

        </Dialog >
    )
}