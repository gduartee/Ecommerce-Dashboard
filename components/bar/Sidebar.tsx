"use client";

import Link from "next/link";
import { LuMenu, LuPackage, LuPlus, LuList } from "react-icons/lu";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function Sidebar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed top-4 left-4 z-50 h-10 w-10 rounded-full shadow-md bg-white hover:bg-slate-100 text-slate-900 border-slate-200"
        >
          <LuMenu className="h-5 w-5" />
          <span className="sr-only">Abrir menu</span>
        </Button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="w-75 sm:w-87.5 bg-slate-950 border-r-slate-800 text-slate-50 [&>button]:text-slate-50"
      >
        <SheetHeader className="mb-6 text-left">
          <SheetTitle className="text-slate-100">Pratas Do Sol | Bem-Vindo(a)</SheetTitle>
        </SheetHeader>

        <nav className="flex flex-col gap-4">
          <Accordion type="single" collapsible className="w-full border-none">

            <AccordionItem value="produtos" className="border-b-slate-800">
              <AccordionTrigger className="py-2 px-2 rounded-md hover:bg-slate-900 hover:no-underline data-[state=open]:bg-slate-900 text-slate-200">
                <div className="flex items-center gap-2 cursor-pointer">
                  <LuPackage className="h-5 w-5 text-slate-400" />
                  <span className="font-medium">Produtos</span>
                </div>
              </AccordionTrigger>

              <AccordionContent className="pb-0 bg-slate-950">
                <div className="flex flex-col space-y-1 pl-9 mt-1 border-l border-slate-800 ml-4">
    
                  <SheetClose asChild>
                    <Link
                      href="/produtos/cadastrar"
                      className="flex items-center gap-2 py-2 pl-2 text-sm text-slate-400 hover:text-white hover:bg-slate-900/50 rounded-r-md transition-colors"
                    >
                      <LuPlus className="h-4 w-4" />
                      Cadastrar Produto
                    </Link>
                  </SheetClose>

                  <SheetClose asChild>
                    <Link
                      href="/produtos"
                      className="flex items-center gap-2 py-2 pl-2 text-sm text-slate-400 hover:text-white hover:bg-slate-900/50 rounded-r-md transition-colors"
                    >
                      <LuList className="h-4 w-4" />
                      Ver Produtos
                    </Link>
                  </SheetClose>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </nav>
      </SheetContent>
    </Sheet>
  );
}