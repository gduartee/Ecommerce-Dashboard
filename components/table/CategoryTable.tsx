"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { useRefreshStore } from "@/store/useRefreshStore";
import { toast } from "sonner";
import { useSelectionStore } from "@/store/useSelectionStore";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Input } from "../ui/input";
import { AlertDialogDelete } from "../alertDialogDelete/AlertDialogDelete";
import { EditCategory } from "../edit/EditCategory";

type Category = {
    categoryId: number;
    name: string;
    subCategories: {
        subCategoryId: number;
        name: string
    }
};

export function CategoryTable() {
    const [nameBuscar, setNameBuscar] = useState("");
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [categories, setCategories] = useState<Category[] | null>(null);

    const { selected, toggle } = useSelectionStore();

    const { categoriesVersion } = useRefreshStore();


    async function fetchCategories() {
        try {
            setLoading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories?name=${nameBuscar}&page=${page}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })

            if (!response.ok)
                throw new Error("Erro ao buscar categorias");

            const data = await response.json();
            setCategories(data.data);
            setTotalPages(data.totalPages);

        } catch (error) {
            toast.error("Erro ao buscar categorias");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchCategories();
    }, [categoriesVersion, page, nameBuscar]);


    return (
        <div className="flex flex-col gap-4">
            <div className="w-full border-2 p-2 flex flex-col [@media(min-width:899px)]:flex-row gap-2 mt-4">
                <div className="flex flex-col gap-2 shadow-2xl p-2 flex-1">
                    <h1 className="">Buscar categoria</h1>
                    <Input
                        type="text"
                        placeholder="Digite o nome da categoria"
                        className="w-full"
                        onChange={(e) => setNameBuscar(e.target.value)}
                    />
                </div>
            </div>

            <div className="overflow-x-auto overflow-y-auto max-h-[481px] shadow-2xl w-full p-4 rounded-sm mt-4">
                <p className="flex md:hidden text-base italic font-semibold">Arraste para o lado para ver mais</p>
                <table className="w-full text-sm text-left border border-gray-200 rounded-sm">
                    <thead className="bg-gray-100 text-gray-700">
                        <tr>
                            <th className="px-2 py-1"> </th>
                            <th className="px-2 py-1">Nome</th>
                            <th className="px-2 py-1">Ver subcategorias</th>
                            <th className="px-2 py-1">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories && categories.length > 0 ? (
                            categories.map((category) => (
                                <tr key={category.categoryId} className="border-b hover:bg-gray-50">
                                    <td className="px-2 py-1">
                                        <Checkbox
                                            checked={selected.category === category.categoryId}
                                            onCheckedChange={() => toggle("category", category.categoryId)}
                                            aria-label={`Selecionar categoria ${category.name}`}
                                        />
                                    </td>
                                    <td className="px-2 py-1">{category.name}</td>
                                    <td className="px-2 py-1">ver subcategorias</td>
                                    <td className="px-2 py-1 ml-auto">
                                        <div className="flex gap-2">
                                            {selected.category !== category.categoryId ? (
                                                <Button
                                                    className="cursor-pointer w-8 h-8"
                                                    disabled={true}
                                                >
                                                    <FaEdit />
                                                </Button>
                                            ) : (
                                                <EditCategory categoryId={category.categoryId} />
                                            )}

                                            {selected.category !== category.categoryId ? (
                                                <Button
                                                    className="cursor-pointer w-8 h-8"
                                                    disabled={true}
                                                >
                                                    <FaTrash />
                                                </Button>
                                            ) : (
                                                <AlertDialogDelete itemId={category.categoryId} itemName="category" />
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                {loading ? (<td colSpan={10} className="text-center px-4 py-2 font-semibold italic">
                                    Carregando categorias...
                                </td>) : (
                                    <td colSpan={10} className="text-center px-4 py-2">
                                        Nenhuma categoria encontrada
                                    </td>
                                )}
                            </tr>
                        )}
                    </tbody>

                </table>
                <div className="flex justify-between items-center mt-4">
                    <Button
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                        disabled={page === 1}
                        variant="outline"
                        className="cursor-pointer"
                    >
                        Anterior
                    </Button>
                    <span>Página {page} de {totalPages}</span>
                    <Button
                        onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={page === totalPages}
                        variant="outline"
                        className="cursor-pointer"
                    >
                        Próximo
                    </Button>
                </div>
            </div>
        </div>
    )
}