/**
 * Vista de Recetas Favoritas del usuario
 * Usa los datos mock actuales para mostrar un número real de favoritos
 */

"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/services/user";
import { MOCK_USERS } from "@/lib/data/users";
import { MOCK_RECIPES } from "@/lib/data/recipes";
import type { User as AppUser } from "@/lib/types/users";
import { RecipeCard } from "@/app/Explorar/components/RecipeCard";

function refreshUser(setter: (u: AppUser | null) => void) {
	const user = getCurrentUser();
	setter(user ? { ...user } : null);
}

interface FavoritosProps {
	user?: AppUser;
}

export function Favoritos({ user: passedUser }: FavoritosProps) {
	const [currentUser, setCurrentUser] = useState<AppUser | null>(passedUser || null);

	useEffect(() => {
		if (!passedUser) {
			const user = getCurrentUser() ?? MOCK_USERS[0];
			setCurrentUser(user);
		}
	}, [passedUser]);

	const favoriteRecipes = useMemo(() => {
		if (!currentUser) return [];
		return MOCK_RECIPES.filter((r) => currentUser.savedRecipes.includes(r.id));
	}, [currentUser]);

	if (!currentUser) {
		return null;
	}

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Favoritos ({favoriteRecipes.length})</CardTitle>
				</CardHeader>
				<CardContent>
					{favoriteRecipes.length === 0 ? (
						<p className="text-sm text-muted-foreground">
							Aún no has guardado recetas.
						</p>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{favoriteRecipes.map((recipe) => (
								<RecipeCard
									key={recipe.id}
									recipe={recipe}
									onFavoriteChange={() => refreshUser(setCurrentUser)}
								/>
							))}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}

