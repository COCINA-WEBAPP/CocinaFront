import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "../styles/globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["700"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <body
        className={`${plusJakarta.variable} ${playfair.variable} min-h-screen bg-background antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
