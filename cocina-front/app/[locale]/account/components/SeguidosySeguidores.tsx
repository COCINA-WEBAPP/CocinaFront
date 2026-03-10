/**
 * Vista de Seguidos y Seguidores
 * Usa los datos mock actuales para mostrar números reales
 */

"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCurrentUser } from "@/lib/services/user";
import { MOCK_USERS } from "@/lib/data/users";
import type { User as AppUser } from "@/lib/types/users";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface SeguidosySeguidoresProps {
	user?: AppUser;
	defaultTab?: 'followers' | 'following';
	onUserSelect?: () => void;
	viewerUser?: AppUser | null;
}

export function SeguidosySeguidores({
	user: passedUser,
	defaultTab = 'followers',
	onUserSelect,
	viewerUser,
}: SeguidosySeguidoresProps) {
	const t = useTranslations("FollowersFollowing");
	const [currentUser, setCurrentUser] = useState<AppUser | null>(passedUser || null);

	useEffect(() => {
		if (!passedUser) {
			const user = getCurrentUser() ?? MOCK_USERS[0];
			setCurrentUser(user);
		}
	}, [passedUser]);

	const followingUsers = useMemo(() => {
		if (!currentUser) return [];
		return MOCK_USERS.filter((u) => currentUser.following.includes(u.id));
	}, [currentUser]);

	const followersUsers = useMemo(() => {
		if (!currentUser) return [];
		return MOCK_USERS.filter((u) => currentUser.followers.includes(u.id));
	}, [currentUser]);

	if (!currentUser) {
		return null;
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>{t("title")}</CardTitle>
			</CardHeader>
			<CardContent>
				<Tabs defaultValue={defaultTab}>
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="following">
							{t("following")} ({followingUsers.length})
						</TabsTrigger>
						<TabsTrigger value="followers">
							{t("followers")} ({followersUsers.length})
						</TabsTrigger>
					</TabsList>

					<TabsContent value="following" className="mt-4 space-y-3">
						{followingUsers.length === 0 ? (
							<p className="text-sm text-muted-foreground">{t("noFollowing")}</p>
						) : (
							followingUsers.map((user) => {
								const isSelf = viewerUser?.id === user.id;
								const href = isSelf ? "/account" : `/perfil/${user.username}`;

								return (
								<Link
									key={user.id}
									href={href}
									onClick={onUserSelect}
									className="flex items-center gap-3 rounded-lg p-2 hover:bg-orange-50 transition"
								>
									<img
										src={user.avatar || "https://i.pravatar.cc/150?img=3"}
										alt={user.fullName}
										className="h-10 w-10 rounded-full object-cover border"
									/>
									<div>
										<p className="font-medium">{user.fullName}</p>
										<p className="text-sm text-muted-foreground">@{user.username}</p>
									</div>
								</Link>
							);
							})
						)}
					</TabsContent>

					<TabsContent value="followers" className="mt-4 space-y-3">
						{followersUsers.length === 0 ? (
							<p className="text-sm text-muted-foreground">{t("noFollowers")}</p>
						) : (
							followersUsers.map((user) => {
								const isSelf = viewerUser?.id === user.id;
								const href = isSelf ? "/account" : `/perfil/${user.username}`;

								return (
								<Link
									key={user.id}
									href={href}
									onClick={onUserSelect}
									className="flex items-center gap-3 rounded-lg p-2 hover:bg-orange-50 transition"
								>
									<img
										src={user.avatar || "https://i.pravatar.cc/150?img=3"}
										alt={user.fullName}
										className="h-10 w-10 rounded-full object-cover border"
									/>
									<div>
										<p className="font-medium">{user.fullName}</p>
										<p className="text-sm text-muted-foreground">@{user.username}</p>
									</div>
								</Link>
							);
							})
						)}
					</TabsContent>
				</Tabs>
			</CardContent>
		</Card>
	);
}
