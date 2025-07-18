export interface Comment {
	id: number;
	content: string;
	user: {
		id: number;
		username: string;
		name: string;
	};
	created_at: string;
	isUpdateComment?: boolean; // toggle update mode
	commentInput?: string; // isi teks komentar
}
