/**
 * Vista de Recetas Creadas por el usuario
 * Usa los datos mock actuales para mostrar un número real
 */

"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/services/user";
import { MOCK_USERS } from "@/lib/data/users";
import { MOCK_RECIPES } from "@/lib/data/recipes";
import type { User as AppUser } from "@/lib/types/users";
import { RecipeCard } from "@/app/Explorar/components/RecipeCard";

interface RecetasCreadasProps {
	user?: AppUser;
}

export function RecetasCreadas({ user: passedUser }: RecetasCreadasProps) {
	const [currentUser, setCurrentUser] = useState<AppUser | null>(passedUser || null);

	useEffect(() => {
		if (!passedUser) {
			const user = getCurrentUser() ?? MOCK_USERS[0];
			setCurrentUser(user);
		}
	}, [passedUser]);

	const createdRecipes = useMemo(() => {
		if (!currentUser) return [];
		return MOCK_RECIPES.filter((r) => currentUser.recipes.includes(r.id));
	}, [currentUser]);

	if (!currentUser) {
		return null;
	}

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Recetas creadas ({createdRecipes.length})</CardTitle>
				</CardHeader>
				<CardContent>
					{createdRecipes.length === 0 ? (
						<p className="text-sm text-muted-foreground">
							Aún no has publicado recetas.
						</p>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{createdRecipes.map((recipe) => (
								<RecipeCard key={recipe.id} recipe={recipe} />
							))}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}

