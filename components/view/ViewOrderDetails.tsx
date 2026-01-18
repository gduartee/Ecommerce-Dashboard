"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Eye, ListOrdered, Hash } from "lucide-react";
import { formatBRL } from "@/utils/formatBRL";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface OrderItem {
  orderItemId: number;
  productName: string; // Agora recebemos o nome
  variantSize: string; // E o tamanho
  productSku: string;
  quantity: number;
  unitPrice: number;
  subTotal: number;
}

interface ViewOrderDetailsProps {
  orderId: number;
  items: OrderItem[];
}

export function ViewOrderDetails({ orderId, items }: ViewOrderDetailsProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex gap-2 h-8 cursor-pointer">
          <Eye className="w-4 h-4" />
          Itens
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <ListOrdered className="w-5 h-5 text-primary" />
            Resumo do Pedido #{orderId}
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <div className="grid grid-cols-4 text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 px-2">
            <span className="col-span-2">Produto / SKU</span>
            <span className="text-center">Qtd x Preço</span>
            <span className="text-right">Subtotal</span>
          </div>
          
          <Separator />

          <ScrollArea className="h-[350px] mt-2">
            <div className="flex flex-col gap-2 pr-4">
              {items.map((item) => (
                <div 
                  key={item.orderItemId} 
                  className="grid grid-cols-4 items-center gap-2 p-3 rounded-lg border bg-slate-50/50 hover:bg-slate-50 transition-colors"
                >
                  {/* Nome e SKU */}
                  <div className="col-span-2 flex flex-col gap-0.5">
                    <span className="text-sm font-semibold text-slate-900 leading-tight">
                      {item.productName}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono bg-slate-200 px-1.5 rounded text-slate-700">
                        {item.productSku}
                      </span>
                      {item.variantSize && (
                        <Badge variant="secondary" className="text-[9px] h-4 px-1">
                          Tam: {item.variantSize}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Quantidade e Unitário */}
                  <div className="text-center flex flex-col">
                    <span className="text-xs font-medium">{item.quantity}x</span>
                    <span className="text-[10px] text-muted-foreground">{formatBRL(item.unitPrice)}</span>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right font-bold text-sm text-slate-800">
                    {formatBRL(item.subTotal)}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <Separator />

        <div className="flex justify-between items-center mt-2 p-4 bg-slate-900 text-white rounded-xl shadow-inner">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase text-slate-400 font-bold tracking-widest">Total do Pedido</span>
            <span className="text-xs text-slate-400 italic">({items.length} produtos diferentes)</span>
          </div>
          <span className="text-2xl font-black">
            {formatBRL(items.reduce((acc, item) => acc + item.subTotal, 0))}
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}