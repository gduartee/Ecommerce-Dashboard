"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { toast } from "sonner";
import { useSelectionStore } from "@/store/useSelectionStore";
import { Input } from "../ui/input";
import { getCookieClient } from "@/utils/cookie";
import { FaTrash } from "react-icons/fa";
import { ViewCustomerAddresses } from "../view/ViewCustomerAddresses";
import { useRefreshStore } from "@/store/useRefreshStore";
import { AlertDialogDeleteCustomer } from "../alertDialogDelete/AlertDialogDeleteCustomer";


type Customer = {
    userId: string;
    name: string;
    phoneNumber: string;
    cpf: string;
    addresses: {
        addressId: number;
        cep: string;
        street: string;
        num: string;
    }[];
};

export function CustomerTable() {
    const [nameBuscar, setNameBuscar] = useState("");
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [customers, setCustomers] = useState<Customer[] | null>(null);

    const { selected, toggle } = useSelectionStore();

    const { customersVersion } = useRefreshStore();

    const token = getCookieClient("auth-token-emp");


    async function fetchCustomers() {
        try {
            setLoading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users?name=${nameBuscar}&page=${page - 1}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            })

            if (!response.ok)
                throw new Error("Erro ao buscar clientes");

            const data = await response.json();
            setCustomers(data.data);
            setTotalPages(data.totalPages);

        } catch (error) {
            toast.error("Erro ao buscar clientes");
        } finally {
            setLoading(false);
        }
    }


    useEffect(() => {
        fetchCustomers();
    }, [page, nameBuscar, customersVersion]);

    return (
        <div className="flex flex-col gap-4">
            <div className="w-full border-2 p-2 flex flex-col [@media(min-width:899px)]:flex-row gap-2 mt-4">
                <div className="flex flex-col gap-2 shadow-2xl p-2 flex-1">
                    <h1 className="">Buscar Cliente</h1>
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
                            <th className="px-2 py-1">Telefone</th>
                            <th className="px-2 py-1">CPF</th>
                            <th className="px-2 py-1">Ver Endereços</th>
                            <th className="px-2 py-1">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers && customers.length > 0 ? (
                            customers.map((customer) => (
                                <tr key={customer.userId} className="border-b hover:bg-gray-50">
                                    <td className="px-2 py-1">
                                        <Checkbox
                                            checked={selected.customer === customer.userId}
                                            onCheckedChange={() => toggle("customer", customer.userId)}
                                            aria-label={`Selecionar cliente ${customer.name}`}
                                        />
                                    </td>
                                    <td className="px-2 py-1">{customer.name}</td>
                                    <td className="px-2 py-1">
                                        {customer.phoneNumber}
                                    </td>
                                    <td className="px-2 py-1 ml-auto">
                                        {customer.cpf}
                                    </td>
                                    <td className="px-2 py-1 ml-auto">
                                        <ViewCustomerAddresses addresses={customer.addresses} />
                                    </td>
                                    <td className="px-2 py-1">
                                        {selected.customer !== customer.userId ? (
                                            <Button
                                                className="cursor-pointer w-8 h-8"
                                                disabled={true}
                                            >
                                                <FaTrash />
                                            </Button>
                                        ) : (
                                            <AlertDialogDeleteCustomer userId={customer.userId} />
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                {loading ? (<td colSpan={10} className="text-center px-4 py-2 font-semibold italic">
                                    Carregando clientes...
                                </td>) : (
                                    <td colSpan={10} className="text-center px-4 py-2">
                                        Nenhum cliente encontrado
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