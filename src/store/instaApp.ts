import { create } from "zustand";

interface User {
	username: string;
	displayName: string;
	avatar: string;
}

interface Story {
	username: string;
	avatar: string;
}

interface Post {
	username: string;
	userAvatar: string;
	timeAgo: string;
	image: string;
	likes: number;
	caption: string;
	showMore: boolean;
}

interface Suggestion {
	username: string;
	avatar: string;
	reason: string;
}

interface InstagramState {
	currentUser: User;
	stories: Story[];
	posts: Post[];
	suggestions: Suggestion[];
	setCurrentUser: (user: User) => void;
	addPost: (post: Post) => void;
	likePost: (index: number) => void;
}

export const useInstagramStore = create<InstagramState>((set) => ({
	currentUser: {
		username: "rifky911",
		displayName: "Rifky Akhmad",
		avatar: "/placeholder.svg?height=40&width=40",
	},

	stories: [
		{
			username: "azyatopus",
			avatar: "/placeholder.svg?height=60&width=60",
		},
		{ username: "renal.fa", avatar: "/placeholder.svg?height=60&width=60" },
		{
			username: "adrian_cak...",
			avatar: "/placeholder.svg?height=60&width=60",
		},
		{
			username: "aldriand365",
			avatar: "/placeholder.svg?height=60&width=60",
		},
		{ username: "buanda", avatar: "/placeholder.svg?height=60&width=60" },
		{
			username: "buildwitha...",
			avatar: "/placeholder.svg?height=60&width=60",
		},
		{
			username: "devakoding",
			avatar: "/placeholder.svg?height=60&width=60",
		},
		{
			username: "dellamaya...",
			avatar: "/placeholder.svg?height=60&width=60",
		},
	],

	posts: [
		{
			username: "wooblazz",
			userAvatar: "/placeholder.svg?height=40&width=40",
			timeAgo: "1d",
			image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-Pagwjr8VkZc7qr3o9pk28Mi8OIPP1N.png",
			likes: 8,
			caption: "Sini aku kasih tahu fitur ANDALAN dari Wooblazz! 🤩",
			showMore: true,
		},
	],

	suggestions: [
		{
			username: "mute.cfruit",
			avatar: "/placeholder.svg?height=40&width=40",
			reason: "Followed by aryan_d + 1 more",
		},
		{
			username: "anandadedys",
			avatar: "/placeholder.svg?height=40&width=40",
			reason: "Followed by adrian_cathalino + ...",
		},
		{
			username: "ana_chan8967",
			avatar: "/placeholder.svg?height=40&width=40",
			reason: "Suggested for you",
		},
		{
			username: "yosafatander14",
			avatar: "/placeholder.svg?height=40&width=40",
			reason: "Followed by adrian_cathalino",
		},
		{
			username: "azishadi_21",
			avatar: "/placeholder.svg?height=40&width=40",
			reason: "Followed by adrian_cathalino + ...",
		},
	],

	setCurrentUser: (user) => set({ currentUser: user }),

	addPost: (post) =>
		set((state) => ({
			posts: [post, ...state.posts],
		})),

	likePost: (index) =>
		set((state) => ({
			posts: state.posts.map((post, i) =>
				i === index ? { ...post, likes: post.likes + 1 } : post
			),
		})),
}));
