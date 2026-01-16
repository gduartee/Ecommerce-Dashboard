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
      throw new Error("Erro ao buscar total de clientes. Reporte ao suporte imediatamente!");

    const data = await response.json();

    return data.totalElements;

  } catch (error) {
    console.error(`${error}`);
  }
}

async function getTotalFaturado(token: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/revenue/total`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      cache: "no-store"
    })

    if (!response.ok)
      throw new Error("Erro ao buscar total faturado. Reporte ao suporte imediatamente!");

    const data = await response.json();

    return data;

  } catch (error) {
    console.error(`${error}`);
  }
}

async function getPendingDelivery(token: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/pending-delivery`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      cache: "no-store"
    })

    if (!response.ok)
      throw new Error("Erro ao buscar envios pendentes. Reporte ao suporte imediatamente!");

    const data = await response.json();

    return data;

  } catch (error) {
    console.error(`${error}`);
  }
}

async function getTotalSoldProducts(token: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/stats/products-sold-month`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      cache: "no-store"
    })

    if (!response.ok)
      throw new Error("Erro ao buscar total de produtos vendidos. Reporte ao suporte imediatamente!");

    const data = await response.json();

    return data;

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

  const totalCustomers = await getTotalClientes(token) || 0;
  const totalInvoiced = await getTotalFaturado(token) || 0;
  const totalPendingDelivery = await getPendingDelivery(token) || 0;
  const totalSoldProducts = await getTotalSoldProducts(token) || 0;


  return (
    <main className="p-4 lg:p-10">
      <Cards 
      totalCustomers={totalCustomers} 
      totalInvoiced={totalInvoiced}
      totalPendingDelivery={totalPendingDelivery}
      totalSoldProducts={totalSoldProducts}
      />
      <PageContent />
    </main>
  );
}
