"use client";

import { EditProductImages } from "../edit/EditProductImages";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";

interface ProductDataProps {
    productId: number;
    name: string;
    description: string;
    material: string;
    featured: boolean;
}

export function ViewProductDetails({ productId, name, description, material, featured }: ProductDataProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    className="cursor-pointer bg-slate-500 flex-1"
                >
                    Ver detalhes
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Detalhes do produto
                    </DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-2">

                    <div className="flex gap-2 items-center">
                        <span className="font-bold italic">Nome:</span>
                        {name}
                    </div>

                    <div className="flex gap-2 items-center">
                        <span className="font-bold italic">Descrição:</span>
                        {description}
                    </div>

                    <div className="flex gap-2 items-center">
                        <span className="font-bold italic">Material:</span>
                        {material}
                    </div>

                    <div className="flex gap-2 items-center">
                        <span className="font-bold italic">Em destaque:</span>
                        {featured ? "Sim" : "Não"}
                    </div>
                </div>

                <DialogFooter>
                    <EditProductImages productId={productId}/>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}