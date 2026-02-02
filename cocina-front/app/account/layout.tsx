/**
 * Layout para la sección de cuenta (perfil)
 * Incluye Header y Footer
 */

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function AccountLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-col min-h-screen">
			<Header />
			<main className="flex-1">{children}</main>
			<Footer />
		</div>
	);
}

