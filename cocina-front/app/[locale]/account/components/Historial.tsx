"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getCookingHistory, removeFromCookingHistory, clearCookingHistory } from "@/lib/services/user";
import type { CookingHistoryEntry } from "@/lib/types/users";
import { Link } from "@/i18n/navigation";
import { Clock, Trash2, ChefHat } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function Historial() {
  const [history, setHistory] = useState<CookingHistoryEntry[]>([]);

  useEffect(() => {
    setHistory(getCookingHistory());
  }, []);

  const handleRemove = async (index: number) => {
    await removeFromCookingHistory(index);
    setHistory(getCookingHistory());
    toast.success("Entrada eliminada del historial");
  };

  const handleClear = async () => {
    await clearCookingHistory();
    setHistory([]);
    toast.success("Historial limpiado");
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ChefHat size={20} className="text-[#2d6a4f]" />
              Historial de recetas preparadas ({history.length})
            </CardTitle>
            {history.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50">
                    <Trash2 size={14} className="mr-1" /> Limpiar todo
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Limpiar historial?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Se eliminarán todas las entradas del historial. Esta acción no se puede deshacer.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleClear} className="bg-red-500 hover:bg-red-600">
                      Limpiar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ChefHat size={48} className="text-gray-200 mb-4" />
              <p className="text-sm font-medium text-gray-500">Aún no has preparado ninguna receta</p>
              <p className="text-xs text-gray-400 mt-1">
                Cuando prepares una receta, aparecerá aquí para que puedas volver a hacerla fácilmente.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {history.map((entry, idx) => (
                <li key={idx} className="flex items-center gap-4 py-3 group">
                  {/* Thumbnail */}
                  <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                    {entry.recipeImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={entry.recipeImage}
                        alt={entry.recipeTitle}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ChefHat size={20} className="text-gray-300" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/recetas/${entry.recipeId}`}
                      className="font-medium text-gray-800 hover:text-[#2d6a4f] transition-colors line-clamp-1"
                    >
                      {entry.recipeTitle}
                    </Link>
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                      <Clock size={11} />
                      {formatDate(entry.cookedAt)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link href={`/recetas/${entry.recipeId}`}>
                      <Button size="sm" variant="outline"
                        className="text-[#2d6a4f] border-[#2d6a4f] hover:bg-[#f0faf5] text-xs h-8">
                        Ver receta
                      </Button>
                    </Link>
                    <button
                      onClick={() => handleRemove(idx)}
                      className="text-gray-300 hover:text-red-400 transition-colors p-1"
                      title="Eliminar del historial"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}