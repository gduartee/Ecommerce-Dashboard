"use client";

import { getCookieClient } from "@/utils/cookie";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { Truck } from "lucide-react";

interface Props {
    orderId: number;
}

export function CadTrackingCode({ orderId }: Props) {
    const token = getCookieClient("auth-token-emp");
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false); // Controle manual para fechar ao terminar

    async function sendTrackingCode(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData(e.currentTarget);
            const trackingCode = String(formData.get("trackingCode")).trim();

            if (!trackingCode) {
                toast.error("Preencha o código de rastreio para enviar!");
                return;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/tracking`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ trackingCode })
            });

            if (!response.ok) throw new Error("Erro ao atualizar rastreamento.");

            toast.success("Código de rastreio atualizado e e-mail enviado!");
            setOpen(false); // Fecha o modal após sucesso
        } catch (error) {
            toast.error("Falha na comunicação com o servidor.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="cursor-pointer gap-2" variant="outline">
                    <Truck className="w-4 h-4" />
                    Enviar Rastreio
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Atualizar Rastreamento</DialogTitle>
                </DialogHeader>

                {/* O FORM deve envolver os campos e o botão de submit */}
                <form onSubmit={sendTrackingCode} className="flex flex-col gap-4 mt-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Código de Rastreio</label>
                        <Input 
                            placeholder="Ex: BR123456789JS" 
                            name="trackingCode" 
                            required 
                            autoComplete="off"
                        />
                    </div>
                    
                    <Button
                        type="submit" // Define como submit para disparar o onSubmit do form
                        className="w-full cursor-pointer"
                        disabled={loading}
                    >
                        {loading ? "Processando..." : "Atualizar e Notificar Cliente"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}