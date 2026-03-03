/**
 * MobileBottomNav - Barra de navegación inferior para dispositivos móviles.
 *
 * Reemplaza el Header (navbar superior) en pantallas móviles (<768px).
 * Se muestra fija en la parte inferior de la pantalla con los enlaces
 * principales de navegación de la aplicación.
 *
 * En desktop (>=768px) se oculta automáticamente via la clase `md:hidden`.
 *
 * Patrón de navegación (siguiendo referencia de Figma):
 * - Móvil: navegación fija en la parte inferior (fixed bottom-0)
 * - Desktop: se oculta, ya que el Header maneja la navegación superior
 *
 * Rutas de navegación:
 * - Inicio    → /           (icono: Home)
 * - Explorar  → /Explorar   (icono: Search)
 * - Guardados → /guardados  (icono: BookMarked)
 * - Perfil    → /account    (icono: User)
 */
"use client";

import { Home, Search, BookMarked, User } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

/**
 * Definición de cada ítem del menú de navegación inferior.
 * - href: ruta de destino
 * - icon: componente de icono de lucide-react
 * - label: texto visible debajo del icono
 */
const NAV_ITEMS = [
  { href: "/", icon: Home, label: "Inicio" },
  { href: "/Explorar", icon: Search, label: "Explorar" },
  { href: "/guardados", icon: BookMarked, label: "Guardados" },
  { href: "/account", icon: User, label: "Perfil" },
] as const;

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    /**
     * Contenedor principal del menú inferior:
     * - fixed bottom-0: fijo en la parte inferior de la pantalla
     * - z-50: por encima de todo el contenido de la página
     * - md:hidden: se oculta en pantallas >= 768px (desktop usa Header)
     * - border-t: línea superior para separación visual del contenido
     * - safe-area: pb-safe para dispositivos con barra de navegación del sistema (iPhone)
     */
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden"
      role="navigation"
      aria-label="Navegación principal móvil"
    >
      <div className="flex items-center justify-around h-16 px-2">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          /**
           * Lógica de estado activo:
           * - Para "/" (Inicio): solo es activo si la ruta es exactamente "/"
           * - Para otras rutas: activo si pathname comienza con el href
           *   (ej: /Explorar/algo sigue mostrando Explorar como activo)
           */
          const isActive =
            href === "/"
              ? pathname === "/"
              : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="h-6 w-6" />
              <span className="text-[10px] font-medium leading-none">
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
