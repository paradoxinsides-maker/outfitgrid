import { PackageSearch } from 'lucide-react';

interface EmptyStateProps {
  query?: string;
}

export default function EmptyState({ query }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center col-span-full">
      <div className="bg-slate-100 p-4 rounded-full mb-4">
        <PackageSearch size={40} className="text-slate-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-700">
        {query ? 'Koi product nahi mila' : 'Abhi koi product nahi hai'}
      </h3>
      <p className="text-sm text-slate-500 mt-1 max-w-xs">
        {query
          ? `"${query}" ke liye koi result nahi. Kuch aur search karein.`
          : 'Admin panel se apne products add karein.'}
      </p>
    </div>
  );
}
