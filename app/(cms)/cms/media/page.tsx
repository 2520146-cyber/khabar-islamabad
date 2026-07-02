import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Image as ImageIcon, Upload } from 'lucide-react';

export default async function MediaPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const media = await prisma.media.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
    include: { uploadedBy: { select: { name: true } } },
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-ink">Media Library</h1>
          <p className="text-sm text-gray-500 mt-1">{media.length} files</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-brand-red text-white rounded-lg text-sm font-medium hover:bg-red-800 transition-colors">
          <Upload size={16} /> Upload
        </button>
      </div>

      {media.length === 0 ? (
        <div className="py-16 text-center">
          <ImageIcon size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No media files uploaded yet.</p>
          <p className="text-sm text-gray-400 mt-1">Upload images, videos, and documents for your articles.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {media.map((file) => (
            <div key={file.id} className="border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
              <div className="aspect-square bg-surface-1 flex items-center justify-center">
                {file.type === 'IMAGE' ? (
                  <img src={file.url} alt={file.altText || ''} className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon size={32} className="text-gray-300" />
                )}
              </div>
              <div className="p-2">
                <p className="text-xs text-gray-700 truncate">{file.fileName || 'Untitled'}</p>
                <p className="text-[10px] text-gray-400">{file.uploadedBy?.name}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
