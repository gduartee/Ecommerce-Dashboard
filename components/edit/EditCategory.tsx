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
    categoryId: number;
}

type Category = {
    categoryId: number;
    name: string;
};

export function EditCategory({ categoryId }: Props) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [category, setCategory] = useState<Category | null>(null);

    const { bumpCategories } = useRefreshStore();

    async function fetchCategory() {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${categoryId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok)
                throw new Error("Erro ao buscar categorias. Reporte ao suporte imediatamente!");

            const data = await response.json();

            setCategory(data);
        } catch (error) {
            toast.error(`${error}`)
        }
    }

    async function editCategory(event: React.FormEvent<HTMLFormElement>) {
        try {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            setLoading(true);

            const name = String(formData.get("name")).trim();

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name
                })
            });

            const data = await response.json();

            if (!response.ok) {
                const messageError = data.errors ? data.errors.name : "Erro ao editar categoria. Reporte ao suporte imediatamente"
                setError(messageError);
                throw new Error(error);
            }

            bumpCategories();
            toast.success("Categoria editada com sucesso!");
            setOpen(false);
        } catch (error) {
            toast.error(`${error}`);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (open)
            fetchCategory();
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
                <DialogTitle>Editar categoria</DialogTitle>
                <form onSubmit={editCategory}>
                    <div className="flex flex-col w-full mt-4">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="name">Nome da categoria</Label>
                            <Input id="name" name="name" placeholder="Ex: Masculino" defaultValue={category?.name} />
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