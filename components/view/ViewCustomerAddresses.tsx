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
import { MapPin, Home, Hash, Navigation } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Address {
  addressId: number;
  cep: string;
  street: string;
  num: string;
}

interface ViewCustomerAddressesProps {
  addresses: Address[];
}

export function ViewCustomerAddresses({ addresses }: ViewCustomerAddressesProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex gap-2">
          <MapPin className="w-4 h-4" />
          Ver Endereços
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Home className="w-5 h-5 text-primary" />
            Endereços Cadastrados
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="mt-4 h-[350px] pr-4">
          <div className="flex flex-col gap-4">
            {addresses && addresses.length > 0 ? (
              addresses.map((address) => (
                <div
                  key={address.addressId}
                  className="relative flex flex-col gap-2 p-4 border rounded-xl bg-card hover:bg-accent/50 transition-colors shadow-sm cursor-pointer"
                >
                  <Badge variant="secondary" className="absolute top-4 right-4 text-[10px]">
                    ID: {address.addressId}
                  </Badge>
                  
                  <div className="flex items-start gap-3">
                    <div className="mt-1 p-2 rounded-full bg-primary/10 text-primary">
                      <Navigation className="w-4 h-4" />
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm font-semibold leading-none">
                        {address.street}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Hash className="w-3 h-3" />
                        <span>Número: {address.num}</span>
                      </div>
                      <p className="text-xs font-mono bg-muted w-fit px-1.5 py-0.5 rounded">
                        CEP: {address.cep}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
                <MapPin className="w-8 h-8 mb-2 opacity-20" />
                <p className="text-sm">Nenhum endereço encontrado.</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}