"use client";

import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

import { FormCadCategory } from "../form/FormCadCategory";
import { FormCadSubCategory } from "../form/FormCadSubCategory";
import { LuPlus } from "react-icons/lu";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useRefreshStore } from "@/store/useRefreshStore";
import { AlertDialogDelete } from "../alertDialogDelete/AlertDialogDelete";
import { getCookieClient } from "@/utils/cookie";

type Subcategory = {
    subCategoryId: number;
    name: string;
}

type Category = {
    categoryId: number;
    name: string;
    subCategories: Subcategory[];
}

export function CadCategory() {
    const [categories, setCategories] = useState<Category[] | null>(null);
    const [open, setOpen] = useState(false);

    const { categoriesVersion } = useRefreshStore();

    const token = getCookieClient("auth-token-emp");

    async function fetchCategories() {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            })

            if (!response.ok)
                throw new Error("Erro ao buscar categorias. Reporte ao suporte imediatamente!");

            const data = await response.json();

            setCategories(data.data);
        } catch (error) {
            toast.error(`${error}`)
        }
    }

    useEffect(() => {
        if (open)
            fetchCategories();
    }, [open, categoriesVersion])
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <form>
                <DialogTrigger asChild>
                    <div className="flex items-center gap-2 py-2 pl-2 text-sm text-slate-400 hover:text-white hover:bg-slate-900/50 rounded-r-md transition-colors cursor-pointer">
                        <LuPlus className="h-4 w-4" />
                        Cadastrar Categoria
                    </div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[700px] max-h-[700px] overflow-y-auto">
                    <DialogTitle>Categorias</DialogTitle>

                    <FormCadCategory />

                    <p className="text-sm italic">Clique no nome da categoria para expandir/ocultar a lista de subcategorias</p>

                    {categories && categories.length > 0 ? (
                        categories.map(category => (
                            <Accordion
                                type="single"
                                collapsible
                                className="w-full"
                                defaultValue="item-1"
                                key={category.categoryId}
                            >
                                <AccordionItem value="item-1">
                                    <AccordionTrigger className="text-xl cursor-pointer flex w-full gap-2 flex-row items-center">

                                        {category.name}

                                        <AlertDialogDelete itemId={category.categoryId} itemName="category" />

                                    </AccordionTrigger>
                                    {category.subCategories.length > 0 ? (
                                        category.subCategories.map(subCategory => (
                                            <AccordionContent className="flex flex-col gap-4 text-balance" key={subCategory.subCategoryId}>
                                                <div className="flex justify-between bg-slate-50 p-2 rounded-sm">
                                                    <p className="text-base">{subCategory.name}</p>
                                                    <div className="flex items-center gap-2">

                                                        <AlertDialogDelete itemId={subCategory.subCategoryId} itemName="subcategory" />

                                                    </div>
                                                </div>
                                                <FormCadSubCategory categoryId={category.categoryId} />
                                            </AccordionContent>
                                        ))
                                    ) : (
                                        <div>
                                            <p className="font-bold italic">Nenhuma subcategoria encontrada...</p>
                                            <FormCadSubCategory categoryId={category.categoryId} />
                                        </div>
                                    )}
                                </AccordionItem>
                            </Accordion>
                        ))
                    ) : (
                        <p className="font-bold italic">Nenhuma categoria encontrada...</p>
                    )}
                </DialogContent>
            </form>
        </Dialog>

    )
}