import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

export function Layout({ children }: { children: React.ReactNode }) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex h-screen overflow-hidden bg-slate-900">
      <Sidebar searchQuery={searchQuery} />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        
        <main className="flex-1 overflow-y-auto bg-slate-100 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}