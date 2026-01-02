"use client";

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { LuPlus } from "react-icons/lu";
import { useState } from "react";
import { toast } from "sonner";

export function CadProductVariant() {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [error, setError] = useState("");
    const [featured, setFeatured] = useState(false);

    async function cadProductVariant(event: React.FormEvent<HTMLFormElement>) {
        try {
            event.preventDefault();
            setLoading(true);
            const formData = new FormData(event.currentTarget);

            const name = String(formData.get("name")).trim();
            const material = String(formData.get("material")).trim();
            const description = String(formData.get("description")).trim();

            if (!name)
                toast.error("Preencha o campo nome!");

            if (!material)
                toast.error("Preencha o campo material!");

            if (!description)
                toast.error("Preencha a descrição!");

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    description,
                    material,
                    featured
                })
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.errors.description) {
                    setError(data.errors.description);
                    throw new Error(error);
                }
                else {
                    throw new Error("Erro ao cadastrar produto. Reporte ao suporte imediatamente!")
                }

            }

            toast.success("Produto cadastrado com sucesso");
            setOpen(false);

        } catch (error) {
            toast.error(`${error}`);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div className="flex items-center gap-2 py-2 pl-2 text-sm text-slate-400 hover:text-white hover:bg-slate-900/50 rounded-r-md transition-colors cursor-pointer">
                    <LuPlus className="h-4 w-4" />
                    Cadastrar Produto
                </div>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Cadastrar novo produto</DialogTitle>
                    <DialogDescription>
                        Preencha os dados do novo produto e clique em cadastrar.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={cadProductVariant} className="grid gap-4">
                    <div className="grid gap-3">
                        <Label htmlFor="name-1">Nome</Label>
                        <Input id="name-1" name="name" placeholder="Ex: Anél Prata 925" />
                    </div>


                    <div className="grid gap-3">
                        <Label htmlFor="material-1">Material</Label>
                        <Input id="material-1" name="material" placeholder="Ex: Ouro" />
                    </div>


                    <div className="grid gap-3">
                        <Label htmlFor="description-1">Descrição</Label>
                        <Input id="description-1" name="description" placeholder="Ex: Ideal para..." />
                    </div>


                    <div className="grid gap-3">
                        <Label htmlFor="featured">Colocar em destaque?</Label>
                        <Switch
                            className="cursor-pointer"
                            checked={featured}
                            onCheckedChange={setFeatured}
                        />
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" className="cursor-pointer">Cancelar</Button>
                        </DialogClose>
                        <Button type="submit" className="cursor-pointer">{loading ? "Cadastrando..." : "Cadastrar"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}