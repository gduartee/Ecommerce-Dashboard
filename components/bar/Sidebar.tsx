"use client";

import { LuMenu, LuPackage, LuPlus, LuList } from "react-icons/lu";
import { MdOutlineCategory } from "react-icons/md";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
  SheetFooter
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";
import { LogOut } from "lucide-react";
import { CadCategory } from "../cad/CadCategory";
import { useSectionStore } from "@/store/useSectionStore";
import { CadProduto } from "../cad/CadProduto";

export function Sidebar() {
  const { setActiveSection } = useSectionStore();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed top-4 left-4 z-50 h-10 w-10 rounded-full shadow-md bg-white hover:bg-slate-100 text-slate-900 border-slate-200 cursor-pointer"
        >
          <LuMenu className="h-5 w-5" />
          <span className="sr-only">Abrir menu</span>
        </Button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="w-75 sm:w-87.5 bg-slate-950 border-r-slate-800 text-slate-50 [&>button]:text-slate-50"
      >
        <SheetHeader className="mb-6 text-left bg-slate-800">
          <SheetTitle className="text-slate-100">Pratas Do Sol | Bem-Vindo(a)</SheetTitle>
        </SheetHeader>

        <nav className="flex flex-col gap-4 overflow-y-auto">
          <Accordion type="single" collapsible className="w-full border-none">

            <AccordionItem value="produtos" className="border-b-slate-800">
              <AccordionTrigger className="py-2 px-2 rounded-md hover:bg-slate-900 hover:no-underline data-[state=open]:bg-slate-900 text-slate-200 cursor-pointer">
                <div className="flex items-center gap-2">
                  <MdOutlineCategory className="h-5 w-5 text-slate-400" />
                  <span className="font-medium">Categorias</span>
                </div>
              </AccordionTrigger>

              <AccordionContent className="pb-0 bg-slate-950">
                <div className="flex flex-col space-y-1 pl-9 mt-1 border-l border-slate-800 ml-4">

                  <SheetClose asChild>
                    <CadCategory />
                  </SheetClose>

                  <SheetClose asChild>
                    <div
                      className="flex items-center gap-2 py-2 pl-2 text-sm text-slate-400 hover:text-white hover:bg-slate-900/50 rounded-r-md transition-colors cursor-pointer"
                      onClick={() => setActiveSection("categorySection")}
                    >
                      <LuList className="h-4 w-4" />
                      Ver Categorias
                    </div>
                  </SheetClose>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Accordion type="single" collapsible className="w-full border-none">

            <AccordionItem value="produtos" className="border-b-slate-800">
              <AccordionTrigger className="py-2 px-2 rounded-md hover:bg-slate-900 hover:no-underline data-[state=open]:bg-slate-900 text-slate-200 cursor-pointer">
                <div className="flex items-center gap-2">
                  <LuPackage className="h-5 w-5 text-slate-400" />
                  <span className="font-medium">Produtos</span>
                </div>
              </AccordionTrigger>

              <AccordionContent className="pb-0 bg-slate-950">
                <div className="flex flex-col space-y-1 pl-9 mt-1 border-l border-slate-800 ml-4">

                  <SheetClose asChild>
                    <CadProduto />
                  </SheetClose>

                  <SheetClose asChild>
                    <div className="flex items-center gap-2 py-2 pl-2 text-sm text-slate-400 hover:text-white hover:bg-slate-900/50 rounded-r-md transition-colors cursor-pointer">
                      <LuList className="h-4 w-4" />
                      Ver Produtos
                    </div>
                  </SheetClose>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </nav>
        <SheetFooter className="bg-slate-800 p-6">
          <div className="flex items-center gap-2">
            <Image
              src="/assets/images/do-utilizador.png"
              width={40}
              height={40}
              alt="user"
              draggable={false}
            />
            <span className="text-sm">Bem-vindo(a) user</span>

            <LogOut size={20} className="ml-auto text-red-500 cursor-pointer" />
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}