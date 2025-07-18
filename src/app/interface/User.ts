export interface User {
	id: number;
	name: string;
	username?: string;
	email: string;
	profile_picture?: string; // optional profile picture
	bio?: string; // optional bio
	created_at: string;
	updated_at: string;
}
