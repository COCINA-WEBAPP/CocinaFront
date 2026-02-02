"use client";

import { useMemo, useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import type { Recipe } from "@/lib/types/recipes";

type Review = Recipe["reviews"][number];

type ReseñasProps = {
	initialReviews: Review[];
	onChange: (next: Review[]) => void;
};

export function Reseñas({ initialReviews, onChange }: ReseñasProps) {
	const [comment, setComment] = useState("");
	const [rating, setRating] = useState(0);
	const demoUser = "Usuario (demo)"; // TODO: reemplazar por el usuario real cuando haya login

	const reviewCount = initialReviews.length;
	const avgRating = useMemo(() => {
		if (reviewCount === 0) return 0;
		const total = initialReviews.reduce((sum, r) => sum + r.rating, 0);
		return total / reviewCount;
	}, [initialReviews, reviewCount]);

	const handleSubmit = () => {
		if (rating < 1) {
			toast.error("Selecciona una calificación");
			return;
		}
		if (!comment.trim()) {
			toast.error("Escribe un comentario");
			return;
		}
		const next: Review = {
			user: demoUser,
			comment: comment.trim(),
			rating,
		};

		onChange([next, ...initialReviews]);
		setComment("");
		setRating(0);
		toast.success("Reseña enviada");
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Star className="h-5 w-5" />
					Reseñas ({reviewCount})
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
						{reviewCount > 0 ? `${avgRating.toFixed(1)}/5` : "Sin reseñas"}
					</span>
				</div>

				{/* Form */}
				<div className="rounded-lg border p-4 space-y-3">
					<p className="text-sm font-medium">Deja tu reseña</p>
					<div className="flex items-center gap-1">
						{[...Array(5)].map((_, i) => (
							<button
								key={i}
								type="button"
								className="p-1"
								onClick={() => setRating(i + 1)}
								aria-label={`Calificar ${i + 1} estrellas`}
							>
								<Star
									className={`h-5 w-5 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
								/>
							</button>
						))}
					</div>
					<Textarea
						placeholder="Escribe tu comentario..."
						value={comment}
						onChange={(e) => setComment(e.target.value)}
						rows={3}
					/>
					<Button onClick={handleSubmit}>Publicar reseña</Button>
				</div>

				{/* List */}
				<div className="space-y-4">
					{initialReviews.map((review, index) => (
						<div key={index} className="rounded-lg border p-4">
							<div className="mb-2 flex items-center justify-between">
								<span className="font-semibold">{review.user}</span>
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
							<p className="text-sm text-muted-foreground">{review.comment}</p>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
