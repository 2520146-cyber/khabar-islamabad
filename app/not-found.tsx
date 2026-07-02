import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-1 px-4">
      <div className="text-center">
        <h1 className="font-serif text-6xl font-bold text-brand-red mb-4">404</h1>
        <h2 className="font-serif text-2xl font-semibold text-ink mb-2">Page Not Found</h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          The page you are looking for does not exist or has been moved. Perhaps the article was archived or the URL is incorrect.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/"
            className="px-6 py-3 bg-brand-red text-white rounded-lg font-medium hover:bg-red-800 transition-colors"
          >
            Back to Home
          </Link>
          <Link
            href="/search"
            className="px-6 py-3 border border-gray-200 rounded-lg font-medium hover:bg-surface-1 transition-colors"
          >
            Search
          </Link>
        </div>
      </div>
    </div>
  );
}
