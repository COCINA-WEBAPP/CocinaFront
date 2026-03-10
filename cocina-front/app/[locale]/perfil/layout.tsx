import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { setRequestLocale } from "next-intl/server";

type Props = {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
};

export default async function PerfilLayout({ children, params }: Props) {
	const { locale } = await params;
	setRequestLocale(locale);

	return (
		<div className="flex flex-col min-h-screen">
			<Header />
			<main className="flex-1 pb-20 md:pb-0">{children}</main>
			<Footer />
			<MobileBottomNav />
		</div>
	);
}
