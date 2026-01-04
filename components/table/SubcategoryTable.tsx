"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { toast } from "sonner";
import { useSelectionStore } from "@/store/useSelectionStore";
import { AlertDialogDelete } from "../alertDialogDelete/AlertDialogDelete";
import { FaEdit, FaTrash } from "react-icons/fa";
import { EditSubcategory } from "../edit/EditSubcategory";
import { useRefreshStore } from "@/store/useRefreshStore";

type Props = {
    categoryId: number;
    categoryName: string;
}

type Subcategory = {
    subCategoryId: number;
    name: string;
}

export function SubcategoryTable({ categoryId }: Props) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [subcategories, setSubcategories] = useState<Subcategory[] | null>(null);

    const { selected, toggle } = useSelectionStore();
    const { subcategoriesVersion } = useRefreshStore();

    async function fetchSubcategories() {
        try {
            setLoading(true);

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subcategories/categoryId/${categoryId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok)
                throw new Error("Erro ao carregar subcategorias. Reporte ao suporte imediatamente!");

            const data = await response.json();
            console.log(data);
            setSubcategories(data.data);
        } catch (error) {
            toast.error(`${error}`)
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (open)
            fetchSubcategories();
    }, [open, subcategoriesVersion])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="cursor-pointer">
                    Ver Subcategorias
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Subcategorias da categoria <span className="font-bold"></span>
                    </DialogTitle>
                </DialogHeader>
                <table className="w-full text-sm text-left border border-gray-200 rounded-sm">
                    <thead className="bg-gray-100 text-gray-700">
                        <tr>
                            <th className="px-2 py-1"> </th>
                            <th className="px-2 py-1">Nome</th>
                            <th className="px-2 py-1">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subcategories && subcategories.length > 0 ? (
                            subcategories.map(subcategory => (

                                <tr key={subcategory.subCategoryId} className="border-b hover:bg-gray-50">
                                    <td className="px-2 py-1">
                                        <Checkbox
                                            checked={selected.subcategory === subcategory.subCategoryId}
                                            onCheckedChange={() => toggle("subcategory", subcategory.subCategoryId)}
                                            aria-label={`Selecionar subcategoria ${subcategory.name}`}
                                        />
                                    </td>
                                    <td className="px-2 py-1">
                                        {subcategory.name}
                                    </td>
                                    <td className="px-2 py-1 ml-auto">
                                        <div className="flex gap-2">
                                            {selected.subcategory !== subcategory.subCategoryId ? (
                                                <Button
                                                    className="cursor-pointer w-8 h-8"
                                                    disabled={true}
                                                >
                                                    <FaEdit />
                                                </Button>
                                            ) : (
                                                <EditSubcategory subcategoryId={subcategory.subCategoryId} />
                                            )}

                                            {selected.category !== subcategory.subCategoryId ? (
                                                <Button
                                                    className="cursor-pointer w-8 h-8"
                                                    disabled={true}
                                                >
                                                    <FaTrash />
                                                </Button>
                                            ) : (
                                                <AlertDialogDelete
                                                    itemId={subcategory.subCategoryId}
                                                    itemName="subcategory"
                                                />
                                            )}
                                        </div>
                                    </td>
                                </tr>

                            ))
                        ) : (
                            <tr>
                                {loading ? (<td colSpan={10} className="text-center px-4 py-2 font-semibold italic">
                                    Carregando subcategorias...
                                </td>) : (
                                    <td colSpan={10} className="text-center px-4 py-2">
                                        Nenhuma subcategoria encontrada
                                    </td>
                                )}
                            </tr>
                        )}
                    </tbody>
                </table>
            </DialogContent>
        </Dialog>
    )
}