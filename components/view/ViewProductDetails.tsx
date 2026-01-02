"use client";

import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";

export function ViewProductDetails() {
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
                        Nome do produto...
                    </div>

                    <div className="flex gap-2 items-center">
                        <span className="font-bold italic">Descrição:</span>
                        descrição do produto
                    </div>

                    <div className="flex gap-2 items-center">
                        <span className="font-bold italic">Material:</span>
                        Material
                    </div>

                    <div className="flex gap-2 items-center">
                        <span className="font-bold italic">Em destaque:</span>
                        Destaque
                    </div>
                </div>

                <DialogFooter>
                    <Button>
                        Editar imagens
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}