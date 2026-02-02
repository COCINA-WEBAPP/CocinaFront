export type Recipe = {
  id: string;
  slug: string;
  title: string;
  description: string;
  images: string[];
  author: string;
  category: string;
  cookTime: number;
  servings: number;
  difficulty: "Fácil" | "Intermedio" | "Difícil";
  rating: number;
  tags: string[];
  ingredients: string[];
  reviews: {
    user: string;
    comment: string;
    rating: number;
  }[]; 
  comments: {
    user: string;
    comment: string;
    likeCount: number;
    dislikeCount: number;
    date: string;
    answers: {
      user: string;
      comment: string;
      date: string;
    }[];
  }[]; 
  isNew: boolean;
  isFeatured: boolean;
};
