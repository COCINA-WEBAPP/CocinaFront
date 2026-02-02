/**
 * Componente para mostrar la información del usuario
 */

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { User as AppUser } from "@/lib/types/users";
import Link from "next/link";

interface InformacionProps {
	user: AppUser;
	onFollowersClick?: () => void;
	onFollowingClick?: () => void;
}

export function Informacion({ user, onFollowersClick, onFollowingClick }: InformacionProps) {
	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row gap-6 items-start">
				<div className="flex-shrink-0">
					<img
						src={user.avatar || "https://i.pravatar.cc/150?img=3"}
						alt={user.fullName}
						className="h-24 w-24 rounded-full object-cover border"
					/>
				</div>

				<div className="flex-1">
					<h2 className="text-xl font-semibold">{user.fullName}</h2>
					<p className="text-muted-foreground">@{user.username}</p>
					<div className="mt-2 flex flex-wrap gap-2">
						<Badge variant="secondary">{user.role}</Badge>
						{user.location && <Badge variant="outline">{user.location}</Badge>}
					</div>
					{user.bio && <p className="mt-3 text-sm text-muted-foreground">{user.bio}</p>}
				</div>
			</div>

			<Separator />

			<Card>
				<CardContent className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
					<div>
						<Link href="/account?tab=recetas" className="block hover:text-primary">
							<p className="text-2xl font-bold">{user.recipes.length}</p>
							<p className="text-sm text-muted-foreground">Recetas</p>
						</Link>
					</div>

					<button
						onClick={onFollowingClick}
						className="block w-full hover:text-primary cursor-pointer hover:bg-orange-50 p-2 rounded transition"
					>
						<p className="text-2xl font-bold">{user.following.length}</p>
						<p className="text-sm text-muted-foreground">Siguiendo</p>
					</button>

					<button
						onClick={onFollowersClick}
						className="block w-full hover:text-primary cursor-pointer hover:bg-orange-50 p-2 rounded transition"
					>
						<p className="text-2xl font-bold">{user.followers.length}</p>
						<p className="text-sm text-muted-foreground">Seguidores</p>
					</button>
                    
					<div>
						<Link href="/account?tab=favoritos" className="block hover:text-primary">
							<p className="text-2xl font-bold">{user.savedRecipes.length}</p>
							<p className="text-sm text-muted-foreground">Favoritos</p>
						</Link>
					</div>
				</CardContent>
			</Card>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<Card>
					<CardContent className="p-6 space-y-2">
						<h3 className="font-semibold">Contacto</h3>
						<p className="text-sm text-muted-foreground">Email: {user.email}</p>
						{user.website && (
							<p className="text-sm text-muted-foreground">Web: {user.website}</p>
						)}
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-6 space-y-2">
						<h3 className="font-semibold">Redes</h3>
						<p className="text-sm text-muted-foreground">
							Instagram: {user.socialMedia?.instagram || "—"}
						</p>
						<p className="text-sm text-muted-foreground">
							Twitter: {user.socialMedia?.twitter || "—"}
						</p>
						<p className="text-sm text-muted-foreground">
							Facebook: {user.socialMedia?.facebook || "—"}
						</p>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

