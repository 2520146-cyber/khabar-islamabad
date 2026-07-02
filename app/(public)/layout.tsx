import UtilityBar from '@/components/layout/UtilityBar';
import BreakingTicker from '@/components/layout/BreakingTicker';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <UtilityBar />
      <BreakingTicker />
      <Navigation />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
