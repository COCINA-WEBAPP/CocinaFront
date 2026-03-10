"use client";

import { useMemo, useState } from "react";
import { Star } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import type { Recipe } from "@/lib/types/recipes";
import { getCurrentUser } from "@/lib/services/user";
import { getAvatarSrc, getDisplayNameFromRef, getInitials, resolveRecipeUser } from "@/lib/services/recipe-user";
import { useTranslations } from "next-intl";

type Review = Recipe["reviews"][number];

type ReseñasProps = {
	initialReviews: Review[];
	onChange: (next: Review[]) => void;
};

export function Reseñas({ initialReviews, onChange }: ReseñasProps) {
	const t = useTranslations("Reviews");
	const [comment, setComment] = useState("");
	const [rating, setRating] = useState(0);

	const reviewCount = initialReviews.length;
	const avgRating = useMemo(() => {
		if (reviewCount === 0) return 0;
		const total = initialReviews.reduce((sum, r) => sum + r.rating, 0);
		return total / reviewCount;
	}, [initialReviews, reviewCount]);

	const handleSubmit = () => {
		if (rating < 1) {
			toast.error(t("selectRating"));
			return;
		}
		if (!comment.trim()) {
			toast.error(t("writeCommentError"));
			return;
		}
		const sessionUser = getCurrentUser();
		const next: Review = {
			user: sessionUser
				? { username: sessionUser.username, fullName: sessionUser.fullName }
				: { username: "maria_user", fullName: "María García" },
			comment: comment.trim(),
			rating,
		};

		onChange([next, ...initialReviews]);
		setComment("");
		setRating(0);
		toast.success(t("reviewSent"));
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Star className="h-5 w-5" />
					{t("title")} ({reviewCount})
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				{/* Summary */}
				<div className="flex items-center gap-3">
					<div className="flex items-center gap-1">
						{[...Array(5)].map((_, i) => (
							<Star
								key={i}
								className={`h-5 w-5 ${i < Math.round(avgRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
							/>
						))}
					</div>
					<span className="text-sm text-muted-foreground">
						{reviewCount > 0 ? `${avgRating.toFixed(1)}/5` : t("noReviews")}
					</span>
				</div>

				{/* Form */}
				<div className="rounded-lg border p-4 space-y-3">
					<p className="text-sm font-medium">{t("leaveReview")}</p>
					<div className="flex items-center gap-1">
						{[...Array(5)].map((_, i) => (
							<button
								key={i}
								type="button"
								className="p-1"
								onClick={() => setRating(i + 1)}
								aria-label={t("rateStars", { count: i + 1 })}
							>
								<Star
									className={`h-5 w-5 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
								/>
							</button>
						))}
					</div>
					<Textarea
						placeholder={t("writeComment")}
						value={comment}
						onChange={(e) => setComment(e.target.value)}
						rows={3}
					/>
					<Button onClick={handleSubmit}>{t("publishReview")}</Button>
				</div>

				{/* List */}
				<div className="space-y-4">
					{initialReviews.map((review, index) => (
						<div key={index} className="rounded-lg border p-4">
							{(() => {
								const resolvedReviewUser = resolveRecipeUser(review.user);
								return (
							<div className="mb-2 flex items-center justify-between">
								<div className="flex items-center gap-2">
									<Avatar size="sm">
										<AvatarImage
											src={getAvatarSrc(getDisplayNameFromRef(review.user), resolvedReviewUser?.avatar)}
											alt={getDisplayNameFromRef(review.user)}
										/>
										<AvatarFallback>{getInitials(getDisplayNameFromRef(review.user))}</AvatarFallback>
									</Avatar>
									{resolvedReviewUser ? (
										<Link href={`/perfil/${resolvedReviewUser.username}`} className="font-semibold hover:underline">
											{resolvedReviewUser.fullName}
										</Link>
									) : (
										<span className="font-semibold">{getDisplayNameFromRef(review.user)}</span>
									)}
								</div>
								<div className="flex items-center gap-1">
									{[...Array(5)].map((_, i) => (
										<Star
											key={i}
											className={`h-4 w-4 ${
												i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
											}`}
										/>
									))}
								</div>
							</div>
								);
							})()}
							<p className="text-sm text-muted-foreground">{review.comment}</p>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
