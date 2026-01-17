"use client";

import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Package, Calendar, Tag, CreditCard, Truck } from "lucide-react";
import { formatBRL } from "@/utils/formatBRL";
import { getCookieClient } from "@/utils/cookie";
import { toast } from "sonner";
import { CadTrackingCode } from "../cad/CadTrackingCode";

interface OrderItem {
    orderItemId: number;
    productSku: string;
    quantity: number;
    unitPrice: number;
    subTotal: number;
}

interface Order {
    orderId: number;
    createdAt: string;
    totalPrice: number;
    status: string;
    trackingCode: string | null;
    items: OrderItem[];
}

interface ViewUserOrdersProps {
    userId: string;
    userName: string;
}

export function ViewUserOrders({ userId, userName }: ViewUserOrdersProps) {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const token = getCookieClient("auth-token-emp");

    async function fetchOrders() {
        try {
            setLoading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/user/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) throw new Error("Erro ao carregar pedidos");
            const result = await response.json();
            setOrders(result.data || []);
        } catch (error) {
            toast.error("Não foi possível carregar o histórico de pedidos.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (open) fetchOrders();
    }, [open]);

    const getStatusBadge = (status: string) => {
        const statusMap: Record<string, { label: string; color: string }> = {
            WAITING_PAYMENT: { label: "Aguardando Pagamento", color: "bg-yellow-500" },
            PAID: { label: "Pago", color: "bg-green-600" },
            SHIPPED: { label: "Enviado", color: "bg-blue-500" },
            DELIVERED: { label: "Entregue", color: "bg-gray-800" },
            CANCELED: { label: "Cancelado", color: "bg-red-500" },
        };
        const current = statusMap[status] || { label: status, color: "bg-gray-400" };
        return <Badge className={`${current.color} text-white`}>{current.label}</Badge>;
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex gap-2 cursor-pointer">
                    <ShoppingBag className="w-4 h-4" />
                    Pedidos
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-3xl w-[95vw]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Package className="w-5 h-5 text-primary" />
                        Histórico de Pedidos — {userName}
                    </DialogTitle>
                </DialogHeader>

                <ScrollArea className="h-[550px] mt-4 pr-4">
                    {loading ? (
                        <div className="flex justify-center items-center h-full font-semibold italic">Carregando...</div>
                    ) : orders.length > 0 ? (
                        <div className="flex flex-col gap-6">
                            {orders.map((order) => (
                                <div key={order.orderId} className="border rounded-xl p-4 bg-card shadow-sm border-slate-200">

                                    {/* Cabeçalho do Pedido */}
                                    <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-sm font-bold">
                                                <span>Pedido #{order.orderId}</span>
                                                {getStatusBadge(order.status)}
                                            </div>
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(order.createdAt).toLocaleDateString("pt-BR")} às{" "}
                                                {new Date(order.createdAt).toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-end gap-2">
                                            <div className="text-right font-mono font-bold text-lg text-green-600">
                                                {formatBRL(order.totalPrice)}
                                            </div>

                                            {/* Lógica do Botão de Rastreio: Só exibe se status for PAID ou SHIPPED */}
                                            {(order.status === "PAID" || order.status === "SHIPPED") && (
                                                <CadTrackingCode orderId={order.orderId} />
                                            )}
                                        </div>
                                    </div>

                                    {/* Detalhes de Rastreio Existente */}
                                    {order.trackingCode && (
                                        <div className="mb-4 flex items-center gap-2 p-2 rounded bg-blue-50 text-blue-700 text-xs border border-blue-100">
                                            <Truck className="w-3 h-3" />
                                            <span className="font-semibold">Rastreio Atual:</span> {order.trackingCode}
                                        </div>
                                    )}

                                    {/* Itens do Pedido */}
                                    <div className="space-y-3">
                                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Produtos</p>
                                        {order.items.map((item) => (
                                            <div key={item.orderItemId} className="flex justify-between items-center text-sm p-2 rounded-lg bg-slate-50 border border-slate-100">
                                                <div className="flex gap-3 items-center">
                                                    <Badge variant="outline" className="h-6 w-6 rounded-full p-0 flex items-center justify-center bg-white font-bold">
                                                        {item.quantity}
                                                    </Badge>
                                                    <div>
                                                        <p className="font-medium">{item.productSku}</p>
                                                        <p className="text-xs text-muted-foreground">{formatBRL(item.unitPrice)}/un</p>
                                                    </div>
                                                </div>
                                                <div className="font-semibold">
                                                    {formatBRL(item.subTotal)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 text-muted-foreground italic">Nenhum pedido encontrado.</div>
                    )}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}