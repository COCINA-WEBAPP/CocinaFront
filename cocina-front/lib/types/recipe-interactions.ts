import type { User } from "@/lib/types/users";

export type RecipeUserRef = Pick<User, "username" | "fullName"> | string;

export type RecipeReview = {
  user: RecipeUserRef;
  comment: string;
  rating: number;
};

export type RecipeAnswer = {
  user: RecipeUserRef;
  comment: string;
  date: string;
};

export type RecipeComment = {
  user: RecipeUserRef;
  comment: string;
  likeCount: number;
  dislikeCount: number;
  date: string;
  answers: RecipeAnswer[];
};
