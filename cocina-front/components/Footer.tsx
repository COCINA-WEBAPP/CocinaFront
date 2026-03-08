"use client";

import { Facebook, Twitter, Instagram, Youtube, Mail, ChefHat } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { useState } from "react";

export function Footer() {
  const [email, setEmail] = useState("");

  return (
    /**
     * Footer de la aplicación.
     * - En móvil (<768px): se oculta (hidden) para no interferir con el
     *   MobileBottomNav que ocupa la parte inferior de la pantalla.
     * - En desktop (>=768px): se muestra normalmente (md:block).
     */
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                <ChefHat className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg">RecipeShare</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Tu destino para descubrir y compartir recetas increíbles de cocineros 
              de todo el mundo. Únete a nuestra comunidad culinaria hoy.
            </p>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Youtube className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3>Enlaces Rápidos</h3>
            <nav className="flex flex-col space-y-2">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Sobre Nosotros
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contacto
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Preguntas Frecuentes
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Cómo Publicar
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Comunidad
              </a>
            </nav>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3>Categorías</h3>
            <nav className="flex flex-col space-y-2">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Desayuno
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Almuerzo
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Cena
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Postres
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Bebidas
              </a>
            </nav>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3>Mantente Actualizado</h3>
            <p className="text-sm text-muted-foreground">
              Suscríbete para recibir las mejores recetas y consejos de cocina.
            </p>
            <div className="flex flex-col space-y-2">
              <div className="flex">
                <Input 
                  placeholder="Tu correo electrónico" 
                  className="rounded-r-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button className="rounded-l-none">
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Al suscribirte, aceptas nuestra Política de Privacidad.
              </p>
            </div>
          </div>
        </div>

        <Separator className="my-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-muted-foreground">
            © 2026 RecipeShare. Todos los derechos reservados.
          </p>
          <div className="flex space-x-4 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacidad</a>
            <a href="#" className="hover:text-foreground transition-colors">Términos de Servicio</a>
            <a href="#" className="hover:text-foreground transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}