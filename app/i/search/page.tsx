import { Metadata } from 'next';
import { useSearchParams } from 'next/navigation';
import SearchPageClient from './search';

// Tipos para los parámetros de contexto de generateMetadata
interface SearchParams {
  q?: string;
}

interface Props {
  params: Record<string, string>;
  searchParams: SearchParams;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const query = searchParams.q || '';
  return {
    title: `Search "${query}" on X`,
    description: `Search results for "${query}" on X`,
  };
}

const SearchPage = () => {
  return (
    <div>
      <SearchPageClient />
    </div>
  );
};

export default SearchPage;
