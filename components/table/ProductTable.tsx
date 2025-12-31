"use client";

import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { toast } from "sonner";
import imageIcon from "../../public/assets/images/sem-imagens.png";
import Image from "next/image";
import { Button } from "../ui/button";

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
    const [loading, setLoading] = useState(false);
    const [nameBuscar, setNameBuscar] = useState("");
    const [products, setProducts] = useState<Product[] | null>(null);

    async function fetchProducts() {
        try {
            setLoading(true);

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
        } finally {
            setLoading(false);
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

            <div className="grid grid-cols-1 lg:grid-cols-4 shadow-2xl gap-2 p-4 rounded-sm">
                {products && products.length > 0 ? (
                    products.map(product => (
                        <div
                            className="flex flex-col gap-4 shadow-2xl p-2 rounded-md"
                            key={product.productId}
                        >
                            <span className="font-bold text-lg">{product.name}</span>

                            <div className="relative w-full h-80 shadow-2xl rounded-lg overflow-hidden">
                                <Image
                                    src={product?.images[0]?.url || imageIcon}
                                    alt="Imagem do produto"
                                    className="object-cover"
                                    fill
                                    quality={95}
                                    draggable={false}
                                />
                            </div>

                            <div className="flex gap-2 mt-auto">
                                <Button className="cursor-pointer flex-1">
                                    Ver detalhes
                                </Button>

                                <Button
                                    className="cursor-pointer flex-1" variant="destructive"
                                >
                                    Excluir
                                </Button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="font-bold italic">{loading ? "Carregando produtos..." : "Nenhum produto encontrado..."}</p>
                )}
            </div>

        </div>
    )
}