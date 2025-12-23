"use client";

import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BadgeDollarSignIcon, Users2 } from "lucide-react";
import { BsBox2 } from "react-icons/bs";
import { CiDeliveryTruck } from "react-icons/ci";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";

export function Cards() {
    return (
        <section className="flex flex-col">
            {/* APENAS DESKTOP */}
            <div className="hidden lg:grid gap-4 grid-cols-4">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-center">
                            <CardTitle className="text-lg sm:text-xl text-gray-800 select-none">
                                Total faturado
                            </CardTitle>
                            <BadgeDollarSignIcon className="ml-auto w-6 h-6" />
                        </div>

                        <CardDescription className="select-none">
                            Soma de todos os serviços e produtos pagos
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="select-none">
                        <p className="text-base sm:text-lg font-bold"> x</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-center">
                            <CardTitle className="text-lg sm:text-xl text-gray-800 select-none">
                                Clientes cadastrados
                            </CardTitle>
                            <Users2 className="ml-auto w-6 h-6" />
                        </div>

                        <CardDescription className="select-none">
                            Total de clientes cadastrados.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="select-none">
                        <p className="text-base sm:text-lg font-bold ">X</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-center">
                            <CardTitle className="text-lg sm:text-xl text-gray-800 select-none">
                                Produtos vendidos
                            </CardTitle>
                            <BsBox2 className="ml-auto w-6 h-6" />
                        </div>

                        <CardDescription className="select-none">
                            Quantidade de produtos vendidos no mês
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="select-none">
                        <p className="text-base sm:text-lg font-bold ">x</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex flex-col lg:flex-row items-center justify-center">
                            <CardTitle className="text-lg sm:text-xl text-gray-800 select-none">
                                Envios pendentes
                            </CardTitle>
                            <CiDeliveryTruck className="ml-auto w-4 h-4 lg:w-6 lg:h-6" />
                        </div>

                        <CardDescription className="select-none">
                            Quantidade de envios pendentes
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="select-none">
                        <p className="text-base sm:text-lg font-bold ">x</p>
                    </CardContent>
                </Card>
            </div>

            {/* APENAS MOBILE */}
            <div className="flex lg:hidden">
                <Carousel className="w-full">
                    <CarouselContent>

                        <CarouselItem>
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-center">
                                        <CardTitle className="text-lg sm:text-xl text-gray-800 select-none">
                                            Total faturado
                                        </CardTitle>
                                        <BadgeDollarSignIcon className="ml-auto w-6 h-6" />
                                    </div>

                                    <CardDescription className="select-none">
                                        Soma de todos os serviços e produtos pagos
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="select-none">
                                    <p className="text-base sm:text-lg font-bold"> x</p>
                                </CardContent>
                            </Card>
                        </CarouselItem>

                        <CarouselItem>
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-center">
                                        <CardTitle className="text-lg sm:text-xl text-gray-800 select-none">
                                            Clientes cadastrados
                                        </CardTitle>
                                        <Users2 className="ml-auto w-6 h-6" />
                                    </div>

                                    <CardDescription className="select-none">
                                        Total de clientes cadastrados.
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="select-none">
                                    <p className="text-base sm:text-lg font-bold ">X</p>
                                </CardContent>
                            </Card>
                        </CarouselItem>

                        <CarouselItem>
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-center">
                                        <CardTitle className="text-lg sm:text-xl text-gray-800 select-none">
                                            Produtos vendidos
                                        </CardTitle>
                                        <BsBox2 className="ml-auto w-6 h-6" />
                                    </div>

                                    <CardDescription className="select-none">
                                        Quantidade de produtos vendidos no mês
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="select-none">
                                    <p className="text-base sm:text-lg font-bold ">x</p>
                                </CardContent>
                            </Card>
                        </CarouselItem>

                        <CarouselItem>
                            <Card>
                                <CardHeader>
                                    <div className="flex flex-col lg:flex-row items-center justify-center">
                                        <CardTitle className="text-lg sm:text-xl text-gray-800 select-none">
                                            Envios pendentes
                                        </CardTitle>
                                        <CiDeliveryTruck className="ml-auto w-4 h-4 lg:w-6 lg:h-6" />
                                    </div>

                                    <CardDescription className="select-none">
                                        Quantidade de envios pendentes
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="select-none">
                                    <p className="text-base sm:text-lg font-bold ">x</p>
                                </CardContent>
                            </Card>
                        </CarouselItem>

                    </CarouselContent>
                </Carousel>
            </div>
        </section>
    )
}