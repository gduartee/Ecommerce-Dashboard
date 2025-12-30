import { useState } from "react";
import { Input } from "../ui/input";

export function ProductTable() {
    const [nameBuscar, setNameBuscar] = useState("");
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
        </div>
    )
}