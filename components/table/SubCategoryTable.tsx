"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";

type Props = {
    categoryId: number;
}

export function SubCategoryTable({ categoryId }: Props) {
    const [open, setOpen] = useState(false);

    async function fetchSubcategories(){
        try {
            
        } catch (error) {
            
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    Ver Subcategorias
                </Button>
            </DialogTrigger>

            <DialogContent>
                <table className="w-full text-sm text-left border border-gray-200 rounded-sm">
                    <thead className="bg-gray-100 text-gray-700">
                        <tr>
                            <th className="px-2 py-1"> </th>
                            <th className="px-2 py-1">Nome</th>
                            <th className="px-2 py-1">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        <td className="px-2 py-1">
                            <Checkbox />
                        </td>
                        <td className="px-2 py-1">
                            Nome da subcategoria
                        </td>
                        <td className="px-2 py-1">

                        </td>
                    </tbody>
                </table>
            </DialogContent>
        </Dialog>
    )
}