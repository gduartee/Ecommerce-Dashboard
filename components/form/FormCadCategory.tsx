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
import { useState } from "react";
import { toast } from "sonner";

export function FormCadCategory() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function cadCategory() {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.errors ? data.erros.name : "Erro ao cadastrar categoria. Reporte ao suporte imediatamente");
                throw new Error(error);
            }

            toast.success("Categoria cadastrada com sucesso!");
        } catch (error) {
            toast.error(`${error}`);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>

            <DialogTrigger asChild className="flex gap-2 items-center">
                <p className="underline text-blue-600 cursor-pointer">Clique aqui para cadastrar uma nova categoria</p>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] overflow-y-auto">
                <DialogTitle>Cadastrar categoria</DialogTitle>
                <form>
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