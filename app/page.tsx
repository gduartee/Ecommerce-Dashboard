import { Cards } from "@/components/cards/Cards";
import { PageContent } from "@/components/pageContent/PageContent";

async function getTotalClientes() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
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
  const totalClientes = await getTotalClientes();
  return (
    <main className="p-4 lg:p-10">
      <Cards totalClientes={totalClientes} />
      <PageContent />
    </main>
  );
}
