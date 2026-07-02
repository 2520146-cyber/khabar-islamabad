'use client';

import { LogOut } from 'lucide-react';

export default function CMSLogoutButton() {
  const handleSignOut = async () => {
    const { signOut } = await import('next-auth/react');
    await signOut({ callbackUrl: '/login' });
  };

  return (
    <button onClick={handleSignOut} className="text-gray-400 hover:text-gray-600">
      <LogOut size={16} />
    </button>
  );
}
