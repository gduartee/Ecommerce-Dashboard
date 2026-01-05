"use client";

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import React, { useEffect, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { LuPlus } from "react-icons/lu";
import { toast } from "sonner";
import { useRefreshStore } from "@/store/useRefreshStore";
import { getCookieClient } from "@/utils/cookie";


type Category = {
    categoryId: number;
    name: string;
    subCategories: {
        subCategoryId: number;
        name: string
    }[];
};

export function CadProduto() {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [error, setError] = useState("");
    const [featured, setFeatured] = useState(false);

    // Categoria
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const selectedCategory = categories.find((category) => category.categoryId === selectedCategoryId);
    const [catOpen, setCatOpen] = useState(false);
    const [loadingCats, setLoadingCats] = useState(false);

    // Subcategoria
    const [subCatOpen, setSubCatOpen] = useState(false);
    const availableSubCategories = selectedCategory?.subCategories || [];
    const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<number | null>(null);
    const selectedSubCategory = availableSubCategories.find((sc) => sc.subCategoryId === selectedSubCategoryId);

    const { bumpProducts } = useRefreshStore();

    const token = getCookieClient("auth-token-emp");


    async function fetchCategories() {
        try {
            setLoadingCats(true);

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok)
                throw new Error("Erro ao carregar categorias. Reporte ao suporte imediatamente!");

            setCategories(data.data);

        } catch (error) {
            toast.error(`${error}`);
        } finally {
            setLoadingCats(false);
        }
    }

    async function cadProduct(event: React.FormEvent<HTMLFormElement>) {
        try {
            event.preventDefault();
            setLoading(true);
            const formData = new FormData(event.currentTarget);

            const name = String(formData.get("name")).trim();
            const material = String(formData.get("material")).trim();
            const description = String(formData.get("description")).trim();

            if (!selectedSubCategoryId)
                toast.error("Selecione a subcategoria!")

            if (!name)
                toast.error("Preencha o campo nome!");

            if (!material)
                toast.error("Preencha o campo material!");

            if (!description)
                toast.error("Preencha a descrição!");

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    subcategoryId: selectedSubCategoryId,
                    name,
                    description,
                    material,
                    featured
                })
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.errors.description) {
                    setError(data.errors.description);
                    throw new Error(error);
                }
                else {
                    throw new Error("Erro ao cadastrar produto. Reporte ao suporte imediatamente!")
                }

            }

            bumpProducts();
            toast.success("Produto cadastrado com sucesso");
            setOpen(false);

        } catch (error) {
            toast.error(`${error}`);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (open)
            fetchCategories();
    }, [open])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div className="flex items-center gap-2 py-2 pl-2 text-sm text-slate-400 hover:text-white hover:bg-slate-900/50 rounded-r-md transition-colors cursor-pointer">
                    <LuPlus className="h-4 w-4" />
                    Cadastrar Produto
                </div>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Cadastrar novo produto</DialogTitle>
                    <DialogDescription>
                        Preencha os dados do novo produto e clique em cadastrar.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={cadProduct} className="grid gap-4">
                    <div className="grid gap-3">
                        <Label htmlFor="name-1">Nome</Label>
                        <Input id="name-1" name="name" placeholder="Ex: Anél Prata 925" />
                    </div>

                    {/* ========= Categoria ========= */}
                    <div className="grid gap-3">
                        <Label htmlFor="category-combobox">Categoria</Label>
                        <input type="hidden" name="categoryId" value={selectedCategoryId ?? ""} />

                        <div className="flex items-center gap-2">
                            <Popover open={catOpen} onOpenChange={setCatOpen} modal>
                                <PopoverTrigger asChild>
                                    <Button
                                        id="category-combobox"
                                        type="button"
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={catOpen}
                                        className="w-full justify-between"
                                        disabled={loadingCats}
                                    >
                                        {loadingCats
                                            ? "Carregando..."
                                            : selectedCategory
                                                ? selectedCategory.name
                                                : "Selecione uma categoria"}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>

                                <PopoverContent
                                    side="bottom"
                                    align="start"
                                    sideOffset={4}
                                    className="z-[999] w-[var(--radix-popover-trigger-width)] p-0 pointer-events-auto"
                                >
                                    <Command>
                                        <CommandInput placeholder="Buscar categoria..." />
                                        <CommandList>
                                            <CommandEmpty>
                                                {loadingCats ? "Carregando..." : "Nenhuma categoria encontrada."}
                                            </CommandEmpty>
                                            <CommandGroup heading="Categorias">
                                                {categories.map((c) => (
                                                    <CommandItem
                                                        key={c.categoryId}
                                                        value={c.name}
                                                        onSelect={() => {
                                                            setSelectedCategoryId(c.categoryId);
                                                            setCatOpen(false);
                                                        }}
                                                        className="cursor-pointer"
                                                    >
                                                        {c.name}
                                                        <Check
                                                            className={`ml-auto h-4 w-4 ${selectedCategoryId === c.categoryId ? "opacity-100" : "opacity-0"}`}
                                                        />
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                    {/* ========= /Categoria ========= */}

                    {/* ========= Subcategoria ========= */}
                    <div className="grid gap-3">
                        <Label htmlFor="subcategory-combobox">Subcategoria</Label>
                        <input type="hidden" name="subCategoryId" value={selectedSubCategoryId ?? ""} />

                        <div className="flex items-center gap-2">
                            <Popover open={subCatOpen} onOpenChange={setSubCatOpen} modal>
                                <PopoverTrigger asChild>
                                    <Button
                                        id="subcategory-combobox"
                                        type="button"
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={subCatOpen}
                                        className="w-full justify-between"
                                        disabled={!selectedCategoryId || availableSubCategories.length === 0}
                                    >
                                        {selectedSubCategory
                                            ? selectedSubCategory.name
                                            : availableSubCategories.length === 0 && selectedCategoryId
                                                ? "Sem subcategorias"
                                                : "Selecione uma subcategoria"}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>

                                <PopoverContent
                                    side="bottom"
                                    align="start"
                                    sideOffset={4}
                                    className="z-[999] w-[var(--radix-popover-trigger-width)] p-0 pointer-events-auto"
                                >
                                    <Command>
                                        <CommandInput placeholder="Buscar subcategoria..." />
                                        <CommandList>
                                            <CommandEmpty>
                                                Nenhuma subcategoria encontrada.
                                            </CommandEmpty>
                                            <CommandGroup heading="Subcategorias">
                                                {availableSubCategories.map((subCategory) => (
                                                    <CommandItem
                                                        key={subCategory.subCategoryId}
                                                        value={subCategory.name}
                                                        onSelect={() => {
                                                            setSelectedSubCategoryId(subCategory.subCategoryId);
                                                            setSubCatOpen(false);
                                                        }}
                                                        className="cursor-pointer"
                                                    >
                                                        {subCategory.name}
                                                        <Check
                                                            className={`ml-auto h-4 w-4 ${selectedSubCategoryId === subCategory.subCategoryId ? "opacity-100" : "opacity-0"}`}
                                                        />
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                    {/* ========= /Subcategoria ========= */}


                    <div className="grid gap-3">
                        <Label htmlFor="material-1">Material</Label>
                        <Input id="material-1" name="material" placeholder="Ex: Ouro" />
                    </div>


                    <div className="grid gap-3">
                        <Label htmlFor="description-1">Descrição</Label>
                        <Input id="description-1" name="description" placeholder="Ex: Ideal para..." />
                    </div>


                    <div className="grid gap-3">
                        <Label htmlFor="featured">Colocar em destaque?</Label>
                        <Switch
                            className="cursor-pointer"
                            checked={featured}
                            onCheckedChange={setFeatured}
                        />
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" className="cursor-pointer">Cancelar</Button>
                        </DialogClose>
                        <Button type="submit" className="cursor-pointer">{loading ? "Cadastrando..." : "Cadastrar"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}