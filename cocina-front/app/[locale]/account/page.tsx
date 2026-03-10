/**
 * Página de Perfil de Usuario
 * Muestra la información del usuario y permite editar el perfil
 */

"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getCurrentUser } from "@/lib/services/user";
import type { User as AppUser } from "@/lib/types/users";
import { Informacion } from "./components/Informacion";
import { Favoritos } from "./components/Favoritos";
import { RecetasCreadas } from "./components/RecetasCreadas";
import { SeguidosySeguidores } from "./components/SeguidosySeguidores";
import { EditarPerfil } from "./components/Editar";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

function AccountPageContent() {
	const t = useTranslations("Account");
	const router = useRouter();
	const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [isFollowingDialogOpen, setIsFollowingDialogOpen] = useState(false);
	const [followingDialogTab, setFollowingDialogTab] = useState<'followers' | 'following'>('followers');
	const searchParams = useSearchParams();

	const defaultTab = useMemo(() => {
		const tab = searchParams.get("tab");
		if (tab === "favoritos" || tab === "recetas") {
			return tab;
		}
		return "info";
	}, [searchParams]);

	useEffect(() => {
		setCurrentUser(getCurrentUser());
	}, []);

	if (!currentUser) {
		return (
			<div className="container mx-auto px-4 py-16 flex items-center justify-center">
				<Card className="w-full max-w-md text-center">
					<CardHeader>
						<CardTitle>{t("notLoggedIn")}</CardTitle>
						<CardDescription>
							{t("loginRequired")}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Button onClick={() => router.push("/login")}>{t("goToLogin")}</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-10">
			<div className="max-w-4xl mx-auto">
				<Card>
					<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle className="text-2xl">{t("myProfile")}</CardTitle>
							<CardDescription>
								{t("profileDescription")}
							</CardDescription>
						</div>
						<Button onClick={() => setIsEditDialogOpen(true)}>{t("edit")}</Button>
					</div>
					</CardHeader>
					<CardContent>
						<Tabs defaultValue={defaultTab} className="w-full">
							<TabsList className="grid w-full grid-cols-3">
								<TabsTrigger value="info">{t("info")}</TabsTrigger>
								<TabsTrigger value="favoritos">{t("favorites")}</TabsTrigger>
								<TabsTrigger value="recetas">{t("createdRecipes")}</TabsTrigger>
							</TabsList>

							<TabsContent value="info" className="mt-6">
							<Informacion 
								user={currentUser}
								onFollowersClick={() => {
									setFollowingDialogTab('followers');
									setIsFollowingDialogOpen(true);
								}}
								onFollowingClick={() => {
									setFollowingDialogTab('following');
									setIsFollowingDialogOpen(true);
								}}
							/>
						</TabsContent>

							<TabsContent value="favoritos" className="mt-6">
								<Favoritos />
							</TabsContent>

							<TabsContent value="recetas" className="mt-6">
								<RecetasCreadas />
							</TabsContent>
						</Tabs>
					</CardContent>
				</Card>
			</div>

			<Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
			<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
				<DialogHeader className="sticky top-0 bg-background z-10">
					<DialogTitle className="text-2xl">{t("editProfile")}</DialogTitle>
					<DialogDescription>
						{t("editDescription")}
					</DialogDescription>
				</DialogHeader>
				<div className="mt-6 pr-4">
						<EditarPerfil
							user={currentUser}
							onUpdated={(updated) => {
								setCurrentUser(updated);
								setIsEditDialogOpen(false);
							}}
						/>
					</div>
				</DialogContent>
			</Dialog>

				<Dialog open={isFollowingDialogOpen} onOpenChange={setIsFollowingDialogOpen}>
					<DialogContent className="w-[90vw] max-w-5xl max-h-[90vh] overflow-y-auto">
						<DialogHeader>
							<DialogTitle>{t("followersAndFollowing")}</DialogTitle>
							<DialogDescription>
								{t("followersDescription")}
							</DialogDescription>
						</DialogHeader>
						<div className="mt-6">
							<SeguidosySeguidores
								user={currentUser}
								defaultTab={followingDialogTab}
								onUserSelect={() => setIsFollowingDialogOpen(false)}
								viewerUser={currentUser}
							/>
						</div>
					</DialogContent>
				</Dialog>
				</div>
			);
		}

export default function AccountPage() {
	return (
		<Suspense fallback={<div className="container mx-auto px-4 py-10" />}>
			<AccountPageContent />
		</Suspense>
	);
}

