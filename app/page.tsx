import { Cards } from "@/components/cards/Cards";
import { PageContent } from "@/components/pageContent/PageContent";

export default function Home() {
  return (
    <main className="p-10">
      <Cards />
      <PageContent />
    </main>
  );
}
