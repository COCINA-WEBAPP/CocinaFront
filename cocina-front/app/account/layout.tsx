/**
 * Layout para la sección de cuenta (perfil)
 * Incluye Header (desktop), Footer (desktop) y MobileBottomNav (móvil)
 */

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileBottomNav } from "@/components/MobileBottomNav";

export default function AccountLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-col min-h-screen">
			<Header />
			{/* pb-20 en móvil para evitar que el contenido quede detrás del MobileBottomNav */}
			<main className="flex-1 pb-20 md:pb-0">{children}</main>
			<Footer />
			<MobileBottomNav />
		</div>
	);
}

