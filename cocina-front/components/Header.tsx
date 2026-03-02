"use client";

import { Search, BookMarked, User, Menu, ChefHat, LogOut, UserCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { getCurrentUser, logout } from "@/lib/services/user";
import type { User as AppUser } from "@/lib/types/users";

interface HeaderProps {
  savedRecipesCount?: number;
  onMenuToggle?: () => void;
}

export function Header({ savedRecipesCount = 0, onMenuToggle }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const router = useRouter();

  useEffect(() => {
    setCurrentUser(getCurrentUser());
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/Explorar?search=${encodeURIComponent(searchQuery)}`);
  };

  const handleSavedClick = () => {
    const user = getCurrentUser();
    if (!user) {
      router.push("/login?tab=login");
      return;
    }
    router.push("/guardados");
  };

  return (
    /**
     * Header principal de la aplicación.
     * - En móvil (<768px): se oculta completamente (hidden) porque la navegación
     *   la maneja el componente MobileBottomNav (barra inferior).
     * - En desktop (>=768px): se muestra como barra superior sticky (md:block).
     */
    <header className="hidden md:block sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={onMenuToggle}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <ChefHat className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg hidden sm:block">RecipeShare</span>
          </div>
        </div>

        {/* Navigation - Hidden on mobile */}
        <nav className="hidden md:flex items-center gap-6">
          <a href="/" className="hover:text-primary transition-colors">Inicio</a>
          <a href="/Explorar" className="hover:text-primary transition-colors">Explorar</a>

        </nav>

        {/* Search Bar - Hidden on small screens */}
        <form onSubmit={handleSearch} className="hidden sm:flex relative max-w-sm flex-1 mx-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar recetas..." 
            className="pl-10 bg-input-background"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="sm:hidden">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="sm" className="relative" onClick={handleSavedClick}>
            <BookMarked className="h-5 w-5" />
            {savedRecipesCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {savedRecipesCount}
              </Badge>
            )}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" aria-label="User menu">
                {currentUser?.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.fullName}
                    className="h-5 w-5 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-5 w-5" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              {!currentUser && (
                <>
                  <DropdownMenuItem onSelect={() => router.push("/login?tab=login")}>Login</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => router.push("/login?tab=register")}>Register</DropdownMenuItem>
                </>
              )}
              {currentUser && (
                <>
                  <DropdownMenuItem onSelect={() => router.push("/account")}
                  >
                    <UserCircle className="mr-2 h-4 w-4" />
                    My profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={async () => {
                      await logout();
                      setCurrentUser(null);
                      router.push("/login");
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}