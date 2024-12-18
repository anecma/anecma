import BottomNavigationSuami from "@/components/bottom-navigation/bottom-navigation-suami";

export default function SuamiLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      {children}
      <BottomNavigationSuami/>
    </section>
  );
}
