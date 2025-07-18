import { Comment } from "./Comment";
import { Like } from "./Like";
import { User } from "./User";

export interface Post {
	id: number;
	image_path: string;
	created_at: string;
	caption: string | null;
	user: User;
	likes: Like[];
	likes_count: number;
	is_liked?: boolean;
	comments?: Comment[];
	showCommentInput?: boolean; // toggle visibility
	commentInput?: string; // isi teks komentar
}
