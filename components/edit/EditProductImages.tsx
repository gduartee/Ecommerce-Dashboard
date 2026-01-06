"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { toast } from "sonner";
import Image from "next/image";
import { getCookieClient } from "@/utils/cookie";
import { useRefreshStore } from "@/store/useRefreshStore";
import noImage from "../../public/assets/images/sem-imagens.png"


interface Props {
    productId: number;
}

type Image = {
    imageId: number;
    url: string;
    isMain: boolean;
}

export function EditProductImages({ productId }: Props) {
    const [open, setOpen] = useState(false);
    const [images, setImages] = useState<Image[]>([]);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [loadingUpload, setLoadingUpload] = useState(false);
    const [targetIndex, setTargetIndex] = useState<number>(0);

    const token = getCookieClient("auth-token-emp");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const mainImage = images.find(img => img.isMain);
    const otherImages = images.filter(img => !img.isMain);

    const { bumpImages, imagesVersion } = useRefreshStore();

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

            const data = await response.json();
            console.log(data);
            setImages(data.data);
        } catch (error) {
            toast.error(`${error}`);
        }
    }

    async function deleteImageById(imageId: number) {
        if (!imageId)
            return;

        try {
            setLoadingDelete(true);

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/images/${imageId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok)
                throw new Error("Erro ao deletar imagem! Reporte ao suporte imediatamente.");

            bumpImages();
            toast.success("Imagem deletada com sucesso!");
        } catch (error) {
            toast.error(`${error}`);
        } finally {
            setLoadingDelete(false);
        }
    }

    // Função que dispara o clique no input escondido
    function handleTriggerUpload(index: number) {
        setTargetIndex(index); // Salva o index para a lógica do isMain
        fileInputRef.current?.click(); // Abre janela de arquivos
    }

    // Função que faz o upload pro banco de dados
    async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (!file)
            return;

        try {
            setLoadingUpload(true);
            const formData = new FormData();
            formData.append("file", file);

            if (targetIndex === 0)
                formData.append("isMain", "true");

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/images/product/${productId}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok)
                throw new Error("Erro ao subir imagem");

            bumpImages();
            toast.success("Upload realizado com sucesso!");
        } catch (error) {
            toast.error(`${error}`);
        } finally {
            setLoadingUpload(false);

            if (fileInputRef.current)
                fileInputRef.current.value = "";
        }
    }

    useEffect(() => {
        if (open)
            fetchProdImages();
    }, [open, imagesVersion]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="cursor-pointer">Editar imagens</Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Edite as imagens do produto
                    </DialogTitle>
                    <DialogDescription>
                        Para substituir alguma imagem, você precisa excluir a atual...
                    </DialogDescription>
                </DialogHeader>

                <input
                    type="file"
                    hidden
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                />
                <div className="w-full flex items-center justify-center">
                    <Carousel className="w-full max-w-xs">
                        <CarouselContent>
                            {Array.from({ length: 5 }).map((_, index) => {

                                let currentImage: Image | undefined;

                                if (index === 0)
                                    currentImage = mainImage;
                                else
                                    currentImage = otherImages[index - 1];

                                const hasImage = !!currentImage;

                                return (
                                    <CarouselItem key={index} className="flex flex-col gap-4 mt-auto">
                                        {index === 0 ? (<span className="font-bold ml-2 tracking-wide text-xl">Imagem principal</span>) : (
                                            <span className="font-bold ml-2 tracking-wide text-xl">Imagem adicional {index}</span>
                                        )}
                                        <div className="p-1">
                                            <Card className="p-2">
                                                <CardContent className="relative flex aspect-square items-center justify-center overflow-hidden rounded-md">
                                                    <Image
                                                        src={currentImage?.url || noImage}
                                                        fill
                                                        alt={`Slot ${index}`}
                                                        className={`object-cover ${!hasImage ? "opacity-50 p-8" : ""}`}
                                                        draggable={false}
                                                    />
                                                </CardContent>
                                            </Card>
                                        </div>
                                        <div className="flex gap-2 w-full px-1">
                                            <Button
                                                className="cursor-pointer flex-1"
                                                onClick={() => handleTriggerUpload(index)}
                                                disabled={hasImage || loadingUpload}
                                            >
                                                {loadingUpload && targetIndex === index ? "Enviando..." : "Upload"}
                                            </Button>
                                            <Button
                                                className="cursor-pointer flex-1" variant="destructive"
                                                disabled={!hasImage || loadingDelete}
                                                onClick={() => currentImage && deleteImageById(currentImage.imageId)}
                                            >
                                                {loadingDelete ? "Excluindo..." : "Excluir"}
                                            </Button>
                                        </div>

                                        <div className="text-center text-xs text-muted-foreground">
                                            Foto {index + 1} de 5
                                        </div>
                                    </CarouselItem>
                                );

                            })}
                        </CarouselContent>
                        <CarouselPrevious className="hidden lg:flex" />
                        <CarouselNext className="hidden lg:flex" />
                    </Carousel>
                </div>
            </DialogContent>
        </Dialog>
    )
}