export type VisionElement =
  | "anemo"
  | "geo"
  | "electro"
  | "dendro"
  | "hydro"
  | "pyro"
  | "cryo"
  | "traveler";

export interface CommentReply {
  id: string;
  authorName: string;
  avatarElement: VisionElement;
  content: string;
  createdAt: string;
  likesCount: number;
}

export interface CommentItem {
  id: string;
  storySlug: string;
  authorName: string;
  avatarElement: VisionElement;
  content: string;
  createdAt: string;
  likesCount: number;
  replies?: CommentReply[];
}

