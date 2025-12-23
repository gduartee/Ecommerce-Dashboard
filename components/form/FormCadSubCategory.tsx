"use client";

import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { useState } from "react";

export function FormCadSubCategory() {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    return (
        <Dialog open={open} onOpenChange={setOpen}>

            <DialogTrigger asChild className="flex gap-2 items-center">
                <Button className="max-w-50" variant={"outline"}>Cadastrar nova subcategoria</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-125 overflow-y-auto">
                <DialogTitle>Cadastrar subcategoria</DialogTitle>
                <form >
                    <div className="flex flex-col w-full mt-4">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="name">Nome da subcategoria</Label>
                            <Input id="name" name="name" placeholder="Ex: Corte masculino" />
                            {/*errors.name && <p className="text-red-600">{errors.name}</p>*/}
                        </div>
                        <Button
                            type="submit"
                            className="mt-4 cursor-pointer"
                            disabled={loading}
                        >
                            {loading ? "Cadastrando..." : "Cadastrar"}
                        </Button>
                    </div>
                </form>
            </DialogContent>

        </Dialog>
    )
}