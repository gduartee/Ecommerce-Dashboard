"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { useRefreshStore } from "@/store/useRefreshStore";
import { toast } from "sonner";
import { useSelectionStore } from "@/store/useSelectionStore";

type categoryProps = {
    nameBuscar: string;
}

type category = {
    categoryId: number;
    name: string;
    subCategories: {
        id:
    }
};

export function TableCategoria({ nameBuscar }: categoryProps) {

    const [loading, setLoading] = useState(true);


    const [page, setPage] = useState(1);
    const limit = 10;
    const [totalPages, setTotalPages] = useState(1);
    const [name, setName] = useState('');
    const [categorias, setCategorias] = useState<category[]>([]);

    const selectedCategoryId = useSelectionStore((s) => s.selected.category);
    const select = useSelectionStore((s) => s.select);

    const { categoriasVersion } = useRefreshStore();


    async function fetchCategories() {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })

            if (!response.ok)
                throw new Error("Erro ao buscar categorias");

            const data = await response.json();
            setCategorias(data.data);
            setTotalPages(data.meta.totalPages);

        } catch (error) {
            console.error("Erro ao buscar categorias:", error);
            toast.error("Erro ao buscar categorias");
        }
    }

    useEffect(() => {
        fetchCategories();
    }, [categoriasVersion, page, name]);

    useEffect(() => {
        setName(nameBuscar);
        setPage(1)
    }, [nameBuscar])

    setTimeout(() => {
        setLoading(false);
    }, 1500);

    return (
        <div className="overflow-x-auto overflow-y-auto max-h-[481px] shadow-2xl w-full p-4 rounded-sm">
            <p className="flex md:hidden text-base italic font-semibold">Arraste para o lado para ver mais</p>
            <table className="w-full text-sm text-left border border-gray-200 rounded-sm">
                <thead className="bg-gray-100 text-gray-700">
                    <tr>
                        <th className="px-2 py-1"> </th>
                        <th className="px-2 py-1">Nome</th>
                        <th className="px-2 py-1">Ver subcategorias</th>
                    </tr>
                </thead>
                <tbody>
                    {categorias.length > 0 ? (
                        categorias.map((categoria) => (
                            <tr key={categoria.id} className="border-b hover:bg-gray-50">
                                <td className="px-2 py-1">
                                    <Checkbox
                                        checked={selectedCategoryId === String(categoria.id)}
                                        onCheckedChange={() => select("category", categoria.id)}
                                        aria-label={`Selecionar categoria ${categoria.name}`}
                                    />
                                </td>
                                <td className="px-2 py-1">{categoria.name}</td>
                                <td className="px-2 py-1">{categoria.subCategories.length}</td>
                                <td className="px-2 py-1">
                                    {new Date(categoria.createdAt).toLocaleString("pt-BR", {
                                        timeZone: "America/Sao_Paulo"
                                    })}
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
    )
}