"use client";

import { useEffect, useState, useCallback } from "react";
import { getCookieClient } from "@/utils/cookie";
import { formatBRL } from "@/utils/formatBRL";
import { toast } from "sonner";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  ChevronLeft, 
  ChevronRight, 
  User, 
  MapPin, 
  Calendar,
  Search
} from "lucide-react";
import { CadTrackingCode } from "../cad/CadTrackingCode";
import { ViewOrderDetails } from "../view/ViewOrderDetails";

// --- Interfaces Ajustadas ---

interface OrderItem {
  orderItemId: number;
  productName: string; // Adicionado conforme o novo DTO
  variantSize: string;  // Adicionado conforme o novo DTO
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
  user: {
    name: string;
    email: string;
    cpf: string;
  };
  address: {
    cep: string;
    street: string;
    num: string;
  };
  items: OrderItem[];
}

export function OrderSection() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const token = getCookieClient("auth-token-emp");

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const statusParam = statusFilter !== "ALL" ? `&status=${statusFilter}` : "";
      const url = `${process.env.NEXT_PUBLIC_API_URL}/orders?page=${page}${statusParam}`;

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Erro ao buscar pedidos");

      const result = await response.json();
      setOrders(result.data || []);
      setTotalPages(result.totalPages);
    } catch (error) {
      toast.error("Falha ao carregar lista de pedidos.");
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, token]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      WAITING_PAYMENT: { label: "Aguardando", color: "bg-yellow-500" },
      PAID: { label: "Pago", color: "bg-green-600" },
      SHIPPED: { label: "Enviado", color: "bg-blue-500" },
      DELIVERED: { label: "Entregue", color: "bg-slate-800" },
      CANCELED: { label: "Cancelado", color: "bg-red-500" },
    };
    const current = statusMap[status] || { label: status, color: "bg-gray-400" };
    return <Badge className={`${current.color} text-white`}>{current.label}</Badge>;
  };

  return (
    <div className="flex flex-col gap-6 p-4 max-w-[1600px] mx-auto">
      {/* Header com Filtros */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Package className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">Pedidos da Loja</h2>
            <p className="text-sm text-muted-foreground">Monitore pagamentos e organize envios.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Select 
            value={statusFilter} 
            onValueChange={(value) => { setStatusFilter(value); setPage(0); }}
          >
            <SelectTrigger className="w-[200px] bg-slate-50">
              <SelectValue placeholder="Status do Pedido" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos os Status</SelectItem>
              <SelectItem value="WAITING_PAYMENT">Aguardando Pagamento</SelectItem>
              <SelectItem value="PAID">Pago</SelectItem>
              <SelectItem value="SHIPPED">Enviado</SelectItem>
              <SelectItem value="DELIVERED">Entregue</SelectItem>
              <SelectItem value="CANCELED">Cancelado</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={fetchOrders} variant="ghost" size="icon" className="cursor-pointer">
            <Search className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Tabela de Resultados */}
      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="w-[100px]">Pedido</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Entrega</TableHead>
              <TableHead>Data/Status</TableHead>
              <TableHead>Total</TableHead>
              <TableHead className="text-center">Resumo</TableHead>
              <TableHead className="text-right">Logística</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-40 text-center text-muted-foreground italic">
                  Buscando informações no servidor...
                </TableCell>
              </TableRow>
            ) : orders.length > 0 ? (
              orders.map((order) => (
                <TableRow key={order.orderId} className="hover:bg-slate-50/50">
                  {/* ID do Pedido */}
                  <TableCell className="font-mono font-bold">#{order.orderId}</TableCell>

                  {/* Informações do Cliente */}
                  <TableCell>
                    <div className="flex items-start gap-2">
                      <User className="w-4 h-4 mt-0.5 text-slate-400" />
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold">{order.user.name}</span>
                        <span className="text-[11px] text-muted-foreground">CPF: {order.user.cpf}</span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Endereço de Entrega */}
                  <TableCell>
                    <div className="flex items-start gap-2 max-w-[200px]">
                      <MapPin className="w-4 h-4 mt-0.5 text-slate-400" />
                      <div className="flex flex-col text-xs">
                        <span className="line-clamp-1">{order.address.street}, {order.address.num}</span>
                        <span className="text-muted-foreground">CEP: {order.address.cep}</span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Data e Status */}
                  <TableCell>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                      </div>
                      {getStatusBadge(order.status)}
                    </div>
                  </TableCell>

                  {/* Valor Total */}
                  <TableCell className="font-bold text-slate-900">
                    <div className="flex flex-col">
                        {formatBRL(order.totalPrice)}
                        <span className="text-[10px] font-normal text-muted-foreground">
                            {order.items.length} {order.items.length === 1 ? 'item' : 'itens'}
                        </span>
                    </div>
                  </TableCell>

                  {/* Resumo de Itens (Dialog) */}
                  <TableCell className="text-center">
                    <ViewOrderDetails orderId={order.orderId} items={order.items}/>
                  </TableCell>

                  {/* Ações Logísticas (Tracking) */}
                  <TableCell className="text-right">
                    {(order.status === "PAID" || order.status === "SHIPPED") ? (
                      <CadTrackingCode orderId={order.orderId} />
                    ) : (
                      <span className="text-[11px] text-muted-foreground italic px-2">
                        {order.status === "WAITING_PAYMENT" ? "Aguardando pgto" : "Bloqueado"}
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-40 text-center text-muted-foreground italic">
                  Nenhum pedido encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Navegação de Paginação */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl border shadow-sm">
        <p className="text-sm text-slate-500 font-medium">
          Página {page + 1} de {totalPages || 1}
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0 || loading}
            className="h-9 px-4 transition-all hover:bg-slate-100 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 mr-2" /> Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => p + 1)}
            disabled={page + 1 >= totalPages || loading}
            className="h-9 px-4 transition-all hover:bg-slate-100 cursor-pointer"
          >
            Próximo <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}