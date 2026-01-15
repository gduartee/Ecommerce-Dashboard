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
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getCookieClient } from "@/utils/cookie";
import { FaPen } from "react-icons/fa";
import { useRefreshStore } from "@/store/useRefreshStore";

interface Props {
    productVariantId: number;
}

interface ProductVariant {
    productVariantId: number;
    size: string;
    sku: string;
    price: number;
    stockQuantity: number;
    weightGrams: number;
}

export function EditProductVariant({ productVariantId }: Props) {
    const [open, setOpen] = useState(false);
    const [variant, setVariant] = useState<ProductVariant | null>(null);
    const [loading, setLoading] = useState(false);

    const token = getCookieClient("auth-token-emp");

    const { bumpVariants } = useRefreshStore();

    async function fetchVariant() {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/variants/${productVariantId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok)
                throw new Error("Erro ao buscar variação. Reporte ao suporte imediatamente!");

            const data = await response.json();
            setVariant(data);

        } catch (error) {
            toast.error(`${error}`);
        }
    }

    async function editProductVariant(event: React.FormEvent<HTMLFormElement>) {
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

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/variants/${productVariantId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    size,
                    sku,
                    price,
                    stockQuantity,
                    weightGrams
                })
            });

            if (!response.ok)
                throw new Error("Erro ao Editar produto. Verifique os campos ou reporte ao suporte!");

            bumpVariants();
            toast.success("Variação Editada com sucesso");
            setOpen(false);

        } catch (error) {
            toast.error(`${error}`);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (open)
            fetchVariant();
    }, [open])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="cursor-pointer">
                    <FaPen className="h-4 w-4" />
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Editar variação</DialogTitle>
                    <DialogDescription>
                        Preencha os dados da variação do produto e clique em Editar
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={editProductVariant} className="grid gap-4">
                    <div className="grid gap-3">
                        <Label htmlFor="size-1">Tamanho</Label>
                        <Input
                            id="size-1"
                            name="size"
                            placeholder="Ex: 40cm, P, 18..."
                            defaultValue={variant?.size}
                        />
                    </div>


                    <div className="grid gap-3">
                        <Label htmlFor="sku-1">Código SKU</Label>
                        <Input
                            id="sku-1"
                            name="sku"
                            placeholder="Ex: AN98"
                            defaultValue={variant?.sku}
                        />
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
                            defaultValue={variant?.price}
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
                            defaultValue={variant?.stockQuantity}
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
                            defaultValue={variant?.weightGrams}
                        />
                    </div>


                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" className="cursor-pointer">Cancelar</Button>
                        </DialogClose>
                        <Button type="submit" className="cursor-pointer">{loading ? "Editando..." : "Editar"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}