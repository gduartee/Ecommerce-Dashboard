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
import { LuPlus } from "react-icons/lu";
import { useState } from "react";
import { toast } from "sonner";
import { getCookieClient } from "@/utils/cookie";

interface Props {
    productId: number;
}

export function CadProductVariant({ productId }: Props) {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [error, setError] = useState("");;

    const token = getCookieClient("auth-token-emp");

    async function cadProductVariant(event: React.FormEvent<HTMLFormElement>) {
        try {
            event.preventDefault();

            const formData = new FormData(event.currentTarget);

            const size = String(formData.get("size")).trim();
            const sku = String(formData.get("sku")).trim();
            const price = Number(formData.get("price"));
            const stockQuantity = Number(formData.get("stockQuantity"));
            const weightGrams = Number(formData.get("weightGrams"));

            if (!size) {
                toast.error("Preencha o campo tamanho!");
                return;
            }

            if (!sku) {
                toast.error("Preencha o campo SKU!");
                return;
            }

            if (price < 0) {
                toast.error("Preencha o preço!");
                return;
            }

            if (stockQuantity <= 0) {
                toast.error("Estoque inválido!");
                return;
            }

            if (weightGrams <= 0) {
                toast.error("Peso inválido!");
                return;
            }

            setLoading(true);

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/variants`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    productId,
                    size,
                    sku,
                    price,
                    stockQuantity,
                    weightGrams
                })
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.errors.description) {
                    setError(data.errors.description);
                    throw new Error(error);
                }
                else {
                    throw new Error("Erro ao cadastrar variação. Reporte ao suporte imediatamente!")
                }

            }

            toast.success("Variação cadastrada com sucesso");
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
                <Button className="cursor-pointer">
                    <LuPlus className="h-4 w-4" />
                    Cadastrar variação
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Cadastrar nova variação</DialogTitle>
                    <DialogDescription>
                        Preencha os dados da variação do produto e clique em cadastrar
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={cadProductVariant} className="grid gap-4">
                    <div className="grid gap-3">
                        <Label htmlFor="size-1">Tamanho</Label>
                        <Input id="size-1" name="size" placeholder="Ex: 40cm, P, 18..." />
                    </div>


                    <div className="grid gap-3">
                        <Label htmlFor="sku-1">Código SKU</Label>
                        <Input id="sku-1" name="sku" placeholder="Ex: AN98" />
                    </div>


                    <div className="grid gap-3">
                        <Label htmlFor="price-1">Preço</Label>
                        <Input
                            type="number"
                            id="price-1"
                            name="price"
                            step="0.01"
                            min="0"
                            placeholder="Ex: 28.90"
                        />
                    </div>

                    <div className="grid gap-3">
                        <Label htmlFor="stockQuantity-1">Quantidade Estoque</Label>
                        <Input
                            type="number"
                            id="stockQuantity-1"
                            name="stockQuantity"
                            min="1"
                            placeholder="Ex: 100"
                        />
                    </div>

                    <div className="grid gap-3">
                        <Label htmlFor="weightGrams-1">Peso (em gramas)</Label>
                        <Input
                            type="number"
                            id="weightGrams-1"
                            name="weightGrams"
                            step="0.01"
                            min="0"
                            placeholder="Ex: 125.25"
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