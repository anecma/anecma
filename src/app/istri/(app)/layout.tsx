import BottomNavigation from "@/components/bottom-navigation/bottom-navigation";

export default function IstriLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      {children}
      <BottomNavigation />
    </section>
  );
}
