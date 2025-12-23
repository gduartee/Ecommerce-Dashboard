"use client";

import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { useState } from "react";
import { toast } from "sonner";
import { useRefreshStore } from "@/store/useRefreshStore";

type Props = {
    parentId: number
}

export function FormCadSubCategory({ parentId }: Props) {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [error, setError] = useState("");

    const { bumpCategorias } = useRefreshStore();

    async function cadSubCategory(event: React.FormEvent<HTMLFormElement>) {
        try {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            setLoading(true);

            const name = String(formData.get("name")).trim();

            if (!name) {
                toast.error("Nome da subcategoria é obrigatório");
                return;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    parentId
                })
            });

            const data = await response.json();

            if (!response.ok) {
                const messageError = data.errors ? data.errors.name : "Erro ao cadastrar subcategoria. Reporte ao suporte imediatamente"
                setError(messageError);
                throw new Error(error);
            }

            bumpCategorias();
            toast.success("Subcategoria cadastrada com sucesso!");
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
                <Button className="max-w-50 cursor-pointer" variant={"outline"}>Cadastrar nova subcategoria</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-125 overflow-y-auto">
                <DialogTitle>Cadastrar subcategoria</DialogTitle>
                <form onSubmit={cadSubCategory}>
                    <div className="flex flex-col w-full mt-4">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="name">Nome da subcategoria</Label>
                            <Input id="name" name="name" placeholder="Ex: Anéis" />
                            {/*errors.name && <p className="text-red-600">{errors.name}</p>*/}
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

        </Dialog>
    )
}