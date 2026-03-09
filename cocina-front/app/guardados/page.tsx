"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RecipeCard } from "@/app/Explorar/components/RecipeCard";
import { getCurrentUser } from "@/lib/services/user";
import { MOCK_RECIPES } from "@/lib/data/recipes";
import type { User as AppUser } from "@/lib/types/users";

export default function GuardadosPage() {
	const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
	const router = useRouter();

	useEffect(() => {
		setCurrentUser(getCurrentUser());
	}, []);

	const savedRecipes = useMemo(() => {
		if (!currentUser) return [];
		return MOCK_RECIPES.filter((r) => currentUser.savedRecipes.includes(r.id));
	}, [currentUser]);

	if (!currentUser) {
		return (
			<div className="container mx-auto px-4 py-16 flex items-center justify-center">
				<Card className="w-full max-w-md text-center">
					<CardHeader>
						<CardTitle>No has iniciado sesión</CardTitle>
						<CardDescription>
							Para ver tus guardados necesitas iniciar sesión.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Button onClick={() => router.push("/login?tab=login")}>
							Ir al Login
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-10">
			<div className="max-w-5xl mx-auto space-y-6">
				<Card>
					<CardHeader>
						<CardTitle className="text-2xl">Mis Guardados</CardTitle>
						<CardDescription>
							Recetas a las que les diste corazón
						</CardDescription>
					</CardHeader>
					<CardContent>
						{savedRecipes.length === 0 ? (
							<p className="text-sm text-muted-foreground">
								Aún no tienes recetas guardadas.
							</p>
						) : (
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{savedRecipes.map((recipe) => (
									<RecipeCard
										key={recipe.id}
										recipe={recipe}
										onFavoriteChange={() => {
											const user = getCurrentUser();
											setCurrentUser(user ? { ...user } : null);
										}}
									/>
								))}
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
