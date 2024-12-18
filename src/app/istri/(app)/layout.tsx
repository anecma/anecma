import BottomNavigationIstri from "@/components/bottom-navigation/bottom-navigation-istri";

export default function IstriLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      {children}
      <BottomNavigationIstri/>
    </section>
  );
}
