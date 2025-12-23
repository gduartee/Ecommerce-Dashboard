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
import React, { useState } from "react";
import { toast } from "sonner";
import { useRefreshStore } from "@/store/useRefreshStore";

export function FormCadCategory() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const { bumpCategorias } = useRefreshStore();

    async function cadCategory(event: React.FormEvent<HTMLFormElement>) {
        try {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            setLoading(true);

            const name = String(formData.get("name")).trim();

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name
                })
            });

            const data = await response.json();

            if (!response.ok) {
                const messageError = data.errors ? data.errors.name : "Erro ao cadastrar categoria. Reporte ao suporte imediatamente"
                setError(messageError);
                throw new Error(error);
            }

            bumpCategorias();
            toast.success("Categoria cadastrada com sucesso!");
            setOpen(false);
        } catch (error) {
            toast.error(`${error}`);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>

            <DialogTrigger asChild className="flex gap-2 items-center">
                <p className="underline text-blue-600 cursor-pointer">Clique aqui para cadastrar uma nova categoria</p>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] overflow-y-auto">
                <DialogTitle>Cadastrar categoria</DialogTitle>
                <form onSubmit={cadCategory}>
                    <div className="flex flex-col w-full mt-4">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="name">Nome da categoria</Label>
                            <Input id="name" name="name" placeholder="Ex: Masculino" />
                        </div>
                        <Button
                            type="submit"
                            className="mt-4 cursor-pointer"
                            disabled={loading}
                        >
                            {loading ? "Cadastrando..." : "Cadastrar"}
                        </Button>
                    </div>
                </form>
            </DialogContent>

        </Dialog >
    )
}