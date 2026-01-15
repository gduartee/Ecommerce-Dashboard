"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useState } from "react";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export function FormLogin() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData(e.currentTarget);
            const email = String(formData.get("email")).trim();
            const password = String(formData.get("password")).trim();

            if (!email || !password) {
                toast.warning("Preencha todos os campos!");
                setLoading(false); // Importante parar o loading aqui
                return;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/employee/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            // Tenta pegar o texto da resposta
            const data = await response.text();

            if (!response.ok) {
                // Se não for OK (200-299), lança erro para o catch
                throw new Error(data || "Credenciais inválidas");
            }

            // Se chegou aqui, o login foi sucesso (Status 200)
            console.log("Token recebido:", data);

            // Configurando o cookie explicitamente para a raiz do domínio
            Cookies.set("auth-token-emp", data, {
                expires: 1,
                path: '/',
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production'
            });

            toast.success("Bem-vindo(a)!");

            // Use window.location.href se o router.push não refletir o cookie imediatamente
            router.push("/");
            router.refresh();

        } catch (error: any) {
            console.error("Erro no login:", error);
            toast.error(error.message || "Erro ao realizar login");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card className="w-[390px] sm:w-[600px] p-4 min-h-[400px] flex flex-col items-center justify-center">
            <CardHeader className="w-full">
                <CardTitle className="text-xl">
                    Realizar Login
                </CardTitle>
                <CardDescription className="text-base">
                    Digite as credenciais para acessar o sistema
                </CardDescription>
                <CardAction>
                    <Link
                        href="https://wa.me/5573981439422"
                        target="_blank"
                    >
                        <Button
                            variant="link"
                            className="text-blue-500 hover:text-blue-700 cursor-pointer outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Suporte
                        </Button>
                    </Link>
                </CardAction>
            </CardHeader>
            <CardContent className="w-full">
                <form onSubmit={handleLogin}>
                    <div className="flex flex-col gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="email" className="text-base">E-mail</Label>
                            <Input
                                name="email"
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password" className="text-base">Senha</Label>
                            <Input
                                name="password"
                                id="password"
                                type="password"
                                placeholder="********"
                                required
                            />
                        </div>
                    </div>
                    <CardFooter className="flex flex-col items-center w-full mt-4 p-0 gap-4">
                        <Button
                            type="submit"
                            className="w-full cursor-pointer">
                            {loading ? "Carregando..." : "Entrar"}
                        </Button>
                        <span>Esqueceu sua senha? <a className="underline text-blue-500 cursor-pointer" href="/resetPassword">Clique Aqui</a></span>
                    </CardFooter>
                </form>
            </CardContent>
        </Card>
    )
}