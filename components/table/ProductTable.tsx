"use client";

import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { toast } from "sonner";

interface ProductVariant {
    productVariantId: number;
    size: string;
    sku: string;
    price: number;
    stockQuantity: number;
    weightGrams: number;
}

interface ProductImage {
    imageId: number;
    url: string;
    isMain: boolean;
}

interface Product {
    productId: number;
    name: string;
    description: string;
    material: string;
    featured: boolean;
    productVariants: ProductVariant[];
    images: ProductImage[];
}

export function ProductTable() {
    const [nameBuscar, setNameBuscar] = useState("");
    const [products, setProducts] = useState<Product[] | null>(null);

    async function fetchProducts() {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok)
                throw new Error("Erro ao buscar produtos. Reporte ao suporte imediatamente!");

            const data = await response.json();

            setProducts(data.data);
        } catch (error) {
            toast.error(`${error}`)
        }
    }

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <div className="flex flex-col gap-4">

            <div className="w-full border-2 p-2 flex flex-col [@media(min-width:899px)]:flex-row gap-2 mt-4">
                <div className="flex flex-col gap-2 shadow-2xl p-2 flex-1">
                    <h1 className="">Buscar produto</h1>
                    <Input
                        type="text"
                        placeholder="Digite o nome do produto"
                        className="w-full"
                        onChange={(e) => setNameBuscar(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 shadow-2xl gap-2">
                <div>

                </div>
            </div>

        </div>
    )
}