
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { updateUserProfile } from "@/lib/services/user";
import type { User as AppUser, UpdateUserProfile } from "@/lib/types/users";
import { useTranslations } from "next-intl";

interface EditarPerfilProps {
	user: AppUser;
	onUpdated?: (user: AppUser) => void;
}

export function EditarPerfil({ user, onUpdated }: EditarPerfilProps) {
	const t = useTranslations("EditProfile");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);

	const [formData, setFormData] = useState<UpdateUserProfile>({
		fullName: user.fullName,
		bio: user.bio || "",
		avatar: user.avatar || "",
		location: user.location || "",
		website: user.website || "",
		socialMedia: {
			instagram: user.socialMedia?.instagram || "",
			twitter: user.socialMedia?.twitter || "",
			facebook: user.socialMedia?.facebook || "",
		},
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setSuccess(false);
		setIsLoading(true);

		try {
			const updatedUser = await updateUserProfile(user.id, formData);
			setSuccess(true);
			onUpdated?.(updatedUser);
		} catch (err) {
			setError(err instanceof Error ? err.message : t("updateError"));
		} finally {
			setIsLoading(false);
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;

		if (name.startsWith("socialMedia.")) {
			const key = name.split(".")[1] as "instagram" | "twitter" | "facebook";
			setFormData((prev) => ({
				...prev,
				socialMedia: {
					...prev.socialMedia,
					[key]: value,
				},
			}));
			return;
		}

		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			{error && (
				<Alert variant="destructive">
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}

			{success && (
				<Alert className="bg-green-50 border-green-200 text-green-800">
					<AlertDescription>{t("profileUpdated")}</AlertDescription>
				</Alert>
			)}

			<div className="space-y-4 pb-4 border-b">
				<h3 className="font-semibold text-lg">{t("basicInfo")}</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label htmlFor="fullName">{t("fullName")}</Label>
						<Input
							id="fullName"
							name="fullName"
							value={formData.fullName}
							onChange={handleChange}
							disabled={isLoading}
							required
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="location">{t("location")}</Label>
						<Input
							id="location"
							name="location"
							value={formData.location}
							onChange={handleChange}
							disabled={isLoading}
							placeholder={t("locationPlaceholder")}
						/>
					</div>
				</div>
			</div>

			<div className="space-y-4 pb-4 border-b">
				<h3 className="font-semibold text-lg">{t("biography")}</h3>
				<div className="space-y-2">
					<Label htmlFor="bio">{t("aboutYou")}</Label>
					<Textarea
						id="bio"
						name="bio"
						rows={4}
						value={formData.bio}
						onChange={handleChange}
						disabled={isLoading}
						placeholder={t("bioPlaceholder")}
					/>
				</div>
			</div>

			<div className="space-y-4 pb-4 border-b">
				<h3 className="font-semibold text-lg">{t("linksAndWebsite")}</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label htmlFor="website">{t("personalWebsite")}</Label>
						<Input
							id="website"
							name="website"
							value={formData.website}
							onChange={handleChange}
							disabled={isLoading}
							placeholder={t("websitePlaceholder")}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="avatar">{t("avatarUrl")}</Label>
						<Input
							id="avatar"
							name="avatar"
							value={formData.avatar}
							onChange={handleChange}
							disabled={isLoading}
							placeholder={t("avatarPlaceholder")}
						/>
					</div>
				</div>
			</div>

			<div className="space-y-4 pb-4">
				<h3 className="font-semibold text-lg">{t("socialMedia")}</h3>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div className="space-y-2">
						<Label htmlFor="instagram">Instagram</Label>
						<Input
							id="instagram"
							name="socialMedia.instagram"
							value={formData.socialMedia?.instagram || ""}
							onChange={handleChange}
							disabled={isLoading}
							placeholder="@tuusuario"
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="twitter">Twitter</Label>
						<Input
							id="twitter"
							name="socialMedia.twitter"
							value={formData.socialMedia?.twitter || ""}
							onChange={handleChange}
							disabled={isLoading}
							placeholder="@tuusuario"
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="facebook">Facebook</Label>
						<Input
							id="facebook"
							name="socialMedia.facebook"
							value={formData.socialMedia?.facebook || ""}
							onChange={handleChange}
							disabled={isLoading}
							placeholder={t("facebookPlaceholder")}
						/>
					</div>
				</div>
			</div>

			<Button type="submit" disabled={isLoading} className="w-full">
				{isLoading ? t("saving") : t("saveChanges")}
			</Button>
		</form>
	);
}
