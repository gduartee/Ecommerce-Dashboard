"use client";

import { formatBRL } from "@/utils/formatBRL";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { CadProductVariant } from "../cad/CadProductVariant";
import { EditProductVariant } from "../edit/EditProductVariant";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRefreshStore } from "@/store/useRefreshStore";

interface ProductVariant {
    productVariantId: number;
    size: string;
    sku: string;
    price: number;
    stockQuantity: number;
    weightGrams: number;
}

interface Props {
    productId: number;
}

export function ViewProductVariants({ productId }: Props) {
    const [variants, setVariants] = useState<ProductVariant[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const { variantsVersion } = useRefreshStore();

    async function fetchVariants() {
        try {
            setLoading(true);

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/variants/all/product/${productId}`, {
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok)
                throw new Error("Erro ao buscar variações. Reporte ao suporte!");

            const data = await response.json();

            setVariants(data);
        } catch (error) {
            toast.error(`${error}`);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (open)
            fetchVariants();
    }, [open, variantsVersion])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="flex-1 cursor-pointer">
                    Ver variações
                </Button>
            </DialogTrigger>

            <DialogContent className="w-[95vw] max-w-[95vw] sm:max-w-4xl">
                <DialogHeader>
                    <DialogTitle>
                        Variações do produto
                    </DialogTitle>
                </DialogHeader>

                <div className="w-full overflow-auto max-h-[60vh]">
                    {variants && variants.length > 0 ? (
                        <table className="w-full min-w-[600px] text-sm text-left border-collapse">
                            <thead className="bg-slate-100 text-slate-700 uppercase text-xs sticky top-0">
                                <tr>
                                    <th className="px-4 py-3">SKU</th>
                                    <th className="px-4 py-3">Tamanho</th>
                                    <th className="px-4 py-3">Peso (g)</th>
                                    <th className="px-4 py-3">Estoque</th>
                                    <th className="px-4 py-3 text-right">Preço</th>
                                    <th className="px-4 py-3">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {variants.map((variant) => (
                                    <tr key={variant.productVariantId} className="border-b hover:bg-slate-50">
                                        <td className="px-4 py-3 font-medium whitespace-nowrap">{variant.sku}</td>
                                        <td className="px-4 py-3 whitespace-nowrap">{variant.size}</td>
                                        <td className="px-4 py-3 whitespace-nowrap">{variant.weightGrams}g</td>
                                        <td className="px-4 py-3">
                                            <span className={variant.stockQuantity === 0 ? "text-red-500 font-bold" : ""}>
                                                {variant.stockQuantity}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right font-bold text-green-600 whitespace-nowrap">
                                            {formatBRL(variant.price)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-2">
                                                <EditProductVariant productVariantId={variant.productVariantId} />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-center text-muted-foreground py-10">
                            {loading ? "Carregando variações" : "Nenhuma variação cadastrada para este produto."}
                        </p>
                    )}
                </div>
                <DialogFooter>
                    <CadProductVariant productId={productId} />
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}