"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { toast } from "sonner";


interface Props {
    productId: number;
}

type Image = {
    imageId: number;
    url: string;
    isMain: boolean;
}

export function EditProductImages({ productId }: Props) {
    const [images, setImages] = useState<Image[] | null>(null);

    async function fetchProdImages() {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/images/product/${productId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok)
                throw new Error("Erro ao buscar imagens do produto. Reporte ao suporte imediatamente!");
        } catch (error) {
            toast.error(`${error}`);
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="cursor-pointer">Editar imagens</Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Edite as imagens do produto
                    </DialogTitle>
                </DialogHeader>
                <div className="w-full flex items-center justify-center">
                    <Carousel className="w-full max-w-xs">
                        <CarouselContent>
                            {Array.from({ length: 5 }).map((_, index) => (
                                <CarouselItem key={index}>
                                    <div className="p-1">
                                        <Card>
                                            <CardContent className="flex aspect-square items-center justify-center p-6">
                                                <span className="text-4xl font-semibold">{index + 1}</span>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                </div>
            </DialogContent>
        </Dialog>
    )
}