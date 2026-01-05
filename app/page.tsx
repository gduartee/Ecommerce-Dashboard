import { Cards } from "@/components/cards/Cards";
import { PageContent } from "@/components/pageContent/PageContent";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

async function getTotalClientes(token: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      cache: "no-store"
    })

    if (!response.ok)
      throw new Error("Erro ao buscar dados dos cards. Reporte ao suporte imediatamente!");

    const data = await response.json();

    return data.totalElements;

  } catch (error) {
    console.error(`${error}`);
  }
}

export default async function Home() {
  // Acessa os cookies do servidor
  const cookieStore = await cookies();

  // Tenta pegar o valor
  const token = cookieStore.get("auth-token-emp")?.value;

  if (!token)
    redirect("/login");

  const totalClientes = await getTotalClientes(token);

  return (
    <main className="p-4 lg:p-10">
      <Cards totalClientes={totalClientes} />
      <PageContent />
    </main>
  );
}
