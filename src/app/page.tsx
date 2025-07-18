"use client";

import { useEffect, useState } from "react";
import { FaHeart, FaRegComment, FaRegTrashAlt, FaPen } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { API_URL } from "./config";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Post } from "./interface/Post";
import { toast } from "sonner";
import SidebarRight from "@/components/Home/SidebarRight";
import SidebarLeft from "@/components/Home/SidebarLeft";
import { Comment } from "./interface/Comment";
import { ModalPost } from "@/components/Post/Modal";

export default function HomePage() {
	const router = useRouter();

	const [posts, setPosts] = useState<Post[]>([]);
	const [loading, setLoading] = useState(true);
	const [token, setToken] = useState<string | null>(null);
	const [thisUser, setThisUser] = useState<any>(null);

	useEffect(() => {
		const fetchData = async () => {
			const storedToken = localStorage.getItem("token");
			const storedUser = JSON.parse(
				localStorage.getItem("user") || "null"
			);

			if (!storedToken || !storedUser) {
				console.log("Token atau user tidak ditemukan, redirecting...");
				router.replace("/auth/login");
				return;
			}

			setToken(storedToken);
			setThisUser(storedUser);

			try {
				const res = await axios.get(`${API_URL}/api/posts`, {
					headers: { Authorization: `Bearer ${storedToken}` },
				});
				setPosts(res.data);
			} catch (err) {
				console.error("Gagal fetch posts:", err);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [router]);

	// Tambahkan di dalam komponen HomePage
	const handleLike = async (postId: number, isLiked: boolean) => {
		const likeId = posts
			.find((post) => post.id === postId)
			?.likes?.find((like) => like.user.id === thisUser?.id)?.id;

		try {
			const res = !isLiked
				? await fetch(`${API_URL}/api/posts/${postId}/likes`, {
						method: "POST",
						headers: {
							Authorization: `Bearer ${token}`,
							"Content-Type": "application/json",
						},
				  })
				: await fetch(
						`${API_URL}/api/posts/${postId}/likes/${likeId}`,
						{
							method: "DELETE",
							headers: {
								Authorization: `Bearer ${token}`,
							},
						}
				  );

			if (!res.ok) {
				const errorData = await res.json();
				console.warn("Gagal like:", errorData.message);
				return;
			}

			// Refresh posts
			const updated = await fetch(`${API_URL}/api/posts`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			const data = await updated.json();
			setPosts(data);
		} catch (error) {
			console.error("Error saat like:", error);
		}
	};

	const handleDeletePost = (postId: number) => {
		if (!confirm("Apakah Anda yakin ingin menghapus postingan ini?")) {
			return;
		}

		fetch(`${API_URL}/api/posts/${postId}`, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
			.then((res) => {
				if (!res.ok) {
					throw new Error("Gagal menghapus postingan");
				}
				return res.json();
			})
			.then(() => {
				toast.success("Postingan berhasil dihapus");
				setPosts((prev) => prev.filter((post) => post.id !== postId));
			})
			.catch((error) => {
				console.error("Error saat menghapus postingan:", error);
				toast.error("Gagal menghapus postingan");
			});
	};

	const toggleCommentInput = (
		postId: number,
		event: "add" | "update" = "add",
		commentId?: number
	) => {
		if (event === "update" && commentId !== undefined) {
			setPosts((prev) =>
				prev.map((post) =>
					post.id === postId
						? {
								...post,
								comments: post.comments?.map((comment) =>
									comment.id === commentId
										? {
												...comment,
												isUpdateComment: true,
												commentInput:
													comment.content || "",
										  }
										: {
												...comment,
												isUpdateComment: false,
												commentInput: "",
										  }
								),
								showCommentInput: false,
								commentInput:
									post.comments?.find(
										(c) => c.id === commentId
									)?.content || "",
						  }
						: post
				)
			);
		} else {
			setPosts((prev) =>
				prev.map((post) =>
					post.id === postId
						? {
								...post,
								comments: post.comments?.map((comment) => ({
									...comment,
									isUpdateComment: false,
									commentInput: "",
								})),
								showCommentInput: true,
								commentInput: "",
						  }
						: post
				)
			);
		}
	};

	const handleCommentSubmit = async (
		postId: number,
		event: "add" | "update" | "cancel" = "add",
		commentId?: number
	) => {
		const post = posts.find((p) => p.id === postId);
		if (!post?.commentInput?.trim()) return;

		if (event === "cancel") {
			setPosts((prev) =>
				prev.map((p) =>
					p.id === postId
						? {
								...p,
								comments: p.comments?.map((comment) => ({
									...comment,
									isUpdateComment: false,
									commentInput: "",
								})),
								showCommentInput: false,
								commentInput: "",
						  }
						: p
				)
			);
			return;
		}

		try {
			const res =
				event === "add"
					? await fetch(`${API_URL}/api/posts/${postId}/comments`, {
							method: "POST",
							headers: {
								Authorization: `Bearer ${token}`,
								"Content-Type": "application/json",
							},
							body: JSON.stringify({
								content: post.commentInput,
							}),
					  })
					: await fetch(
							`${API_URL}/api/posts/${postId}/comments/${commentId}`,
							{
								method: "PUT",
								headers: {
									Authorization: `Bearer ${token}`,
									"Content-Type": "application/json",
								},
								body: JSON.stringify({
									content: post.commentInput,
								}),
							}
					  );

			if (!res.ok) {
				const err = await res.json();
				console.warn("Gagal mengirim komentar:", err.message);
				toast.error("Komentar gagal dikirim", {
					duration: 3000,
					icon: "🗑️",
				});
				return;
			}

			if (res.ok) {
				const result = await res.json();
				if (event === "add") {
					setPosts((prev) =>
						prev.map((p) =>
							p.id === postId
								? {
										...p,
										comments: [
											...(p.comments || []),
											result.data,
										],
										commentInput: "",
										isUpdateComment: false,
										showCommentInput: false,
								  }
								: p
						)
					);
				} else if (event === "update" && commentId !== undefined) {
					setPosts((prev) =>
						prev.map((p) =>
							p.id === postId
								? {
										...p,
										comments: p.comments?.map((comment) =>
											comment.id === commentId
												? result.data
												: comment
										),
										commentInput: "",
										isUpdateComment: false,
										showCommentInput: false,
								  }
								: p
						)
					);
				}
			}

			// toast.success("Komentar berhasil dikirim", {
			// 	duration: 3000,
			// 	icon: "✅",
			// });
		} catch (err) {
			console.error("Komentar error:", err);
			toast.error("Komentar gagal dikirim", {
				duration: 3000,
				icon: "🗑️",
			});
		}
	};

	const handleDeleteComment = async (post: Post, comment: Comment) => {
		try {
			const res = await fetch(
				`${API_URL}/api/posts/${post.id}/comments/${comment.id}`,
				{
					method: "DELETE",
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			if (!res.ok) {
				const err = await res.json();
				console.warn("Gagal hapus komentar:", err.message);
				return;
			}
			// Refresh posts
			const updated = await fetch(`${API_URL}/api/posts`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			const data = await updated.json();
			setPosts(data);

			toast.success("Komentar berhasil dihapus", {
				duration: 3000,
				icon: "🗑️",
			});
		} catch (err) {
			console.error("Gagal hapus komentar:", err);
			toast.error("Komentar gagal dihapus", {
				duration: 3000,
				icon: "🗑️",
			});
		}
	};

	useEffect(() => {
		console.log("Posts updated:", posts);
	}, [posts]);

	return (
		<div className="min-h-screen bg-gray-50 flex justify-between">
			<SidebarLeft />

			<main className="flex flex-col max-w-xl mx-auto p-4">
				{loading ? (
					<p>Loading...</p>
				) : posts.length === 0 ? (
					<p>Belum ada postingan.</p>
				) : (
					posts.map((post) => (
						<Card key={post.id} className="mb-6">
							<CardContent className="px-4">
								{/* Header */}
								<div className="flex justify-between px-2 items-center gap-3 mb-3">
									<div className="flex items-center gap-2">
										<Avatar>
											<AvatarImage
												src={`https://i.pravatar.cc/150?u=${post.user.name}`}
											/>
											<AvatarFallback>
												{post.user.name[0]}
											</AvatarFallback>
										</Avatar>
										<span className="font-medium">
											{post.user.name}
										</span>
										<span className="text-xs text-gray-500">
											@{post.user.name.toLowerCase()}
										</span>
									</div>
									{post.user.id === thisUser?.id && (
										<div className="flex items-center gap-2">
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button variant="ghost">
														<BsThreeDotsVertical />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent
													className="w-56"
													align="start"
												>
													<DropdownMenuLabel>
														My Post
													</DropdownMenuLabel>
													<DropdownMenuGroup>
														{/* <DropdownMenuItem
															// asChild
															onSelect={(e) =>
																e.preventDefault()
															}
														>
															<ModalPost
																type="update"
																post={post}
															/>
															<DropdownMenuShortcut>
																<FaPen />
															</DropdownMenuShortcut>
														</DropdownMenuItem> */}
														<DropdownMenuItem
															onClick={() =>
																handleDeletePost(
																	post.id
																)
															}
														>
															Hapus
															<DropdownMenuShortcut>
																<FaRegTrashAlt />
															</DropdownMenuShortcut>
														</DropdownMenuItem>
													</DropdownMenuGroup>
													<DropdownMenuSeparator />
												</DropdownMenuContent>
											</DropdownMenu>
										</div>
									)}
								</div>

								{/* Gambar */}
								<img
									src={`${post.image_path}`}
									alt="Post"
									className="w-full max-h[480px] object-cover rounded-lg mb-3"
								/>
								<p className="text-xs text-gray-500 mb-2">
									{new Date(post.created_at).toLocaleString(
										"id-ID",
										{
											dateStyle: "medium",
											timeStyle: "short",
										}
									)}
								</p>

								{/* Aksi */}
								<div className="flex flex-col  mb-2">
									<div className="flex gap-4 items-center text-gray-600 text-lg mb-2">
										<FaHeart
											className={`cursor-pointer hover:text-red-500 ${
												post.likes?.some(
													(like) =>
														like.user.id ===
														thisUser?.id
												)
													? "text-red-500"
													: ""
											}`}
											onClick={() =>
												handleLike(
													post.id,
													post.likes?.some(
														(like) =>
															like.user.id ===
															thisUser?.id
													)
												)
											}
										/>
										<FaRegComment
											className="cursor-pointer hover:text-blue-500"
											onClick={() =>
												toggleCommentInput(post.id)
											}
										/>
									</div>
									<p className="flex gap-2 items-center text-sm text-gray-600">
										{post.likes_count || 0} Likes
									</p>
								</div>

								{/* Caption */}
								<p className="text-sm">
									<span className="font-semibold">
										{post.user.name}
									</span>{" "}
									{post.caption && <>{post.caption}</>}
								</p>

								{/* Komentar */}
								{post.comments && post.comments.length > 0 && (
									<>
										<div key={post.id} className="mt-4">
											{post.comments
												.slice(0, 3)
												.map((comment) => (
													<div
														key={
															"post" + comment.id
														}
														className="flex items-start gap-2 mb-2"
													>
														<Avatar>
															<AvatarImage
																src={`https://i.pravatar.cc/150?u=${
																	comment.user
																		?.name ||
																	"???"
																}`}
															/>
														</Avatar>
														<div className="text-sm flex-1">
															<p className="font-semibold">
																{comment.user
																	?.name ||
																	"???"}
															</p>
															{comment.isUpdateComment ? (
																<div className="flex flex-col gap-2">
																	<textarea
																		value={
																			post.commentInput ||
																			""
																		}
																		onChange={(
																			e
																		) =>
																			setPosts(
																				(
																					prev
																				) =>
																					prev.map(
																						(
																							p
																						) =>
																							p.id ===
																							post.id
																								? {
																										...p,
																										commentInput:
																											e
																												.target
																												.value,
																								  }
																								: p
																					)
																			)
																		}
																		className="w-full p-2 border rounded text-sm"
																		rows={2}
																		placeholder="Tulis komentar..."
																	/>
																	<div className="flex items-center justify-end gap-2">
																		<Button
																			size={
																				"sm"
																			}
																			onClick={() =>
																				handleCommentSubmit(
																					post.id,
																					"update",
																					comment.id
																				)
																			}
																			className="self-end  px-3 py-1 rounded text-sm "
																		>
																			Update
																		</Button>
																		<Button
																			variant={
																				"secondary"
																			}
																			size={
																				"sm"
																			}
																			onClick={() =>
																				handleCommentSubmit(
																					post.id,
																					"cancel",
																					comment.id
																				)
																			}
																			className="self-end px-3 py-1 rounded text-sm"
																		>
																			Batal
																		</Button>
																	</div>
																</div>
															) : (
																<p>
																	{
																		comment.content
																	}
																</p>
															)}
															<p className="text-xs text-gray-500">
																{new Date(
																	comment.created_at
																).toLocaleString(
																	"id-ID",
																	{
																		dateStyle:
																			"medium",
																		timeStyle:
																			"short",
																	}
																)}
															</p>
														</div>
														{comment.user?.id ===
															thisUser?.id && (
															<DropdownMenu>
																<DropdownMenuTrigger
																	asChild
																>
																	<Button variant="ghost">
																		<BsThreeDotsVertical />
																	</Button>
																</DropdownMenuTrigger>
																<DropdownMenuContent
																	className="w-56"
																	align="start"
																>
																	<DropdownMenuLabel>
																		My
																		Account
																	</DropdownMenuLabel>
																	<DropdownMenuGroup>
																		<DropdownMenuItem
																			onClick={() =>
																				toggleCommentInput(
																					post.id,
																					"update",
																					comment.id
																				)
																			}
																		>
																			Edit
																			<DropdownMenuShortcut>
																				<FaPen />
																			</DropdownMenuShortcut>
																		</DropdownMenuItem>
																		<DropdownMenuItem
																			onClick={() =>
																				handleDeleteComment(
																					post,
																					comment
																				)
																			}
																		>
																			Hapus
																			<DropdownMenuShortcut>
																				<FaRegTrashAlt />
																			</DropdownMenuShortcut>
																		</DropdownMenuItem>
																	</DropdownMenuGroup>
																	<DropdownMenuSeparator />
																</DropdownMenuContent>
															</DropdownMenu>
														)}
													</div>
												))}
											{post.comments.length > 3 && (
												<p className="text-xs text-gray-500">
													...dan{" "}
													{post.comments.length - 3}{" "}
													komentar lainnya
												</p>
											)}
										</div>
									</>
								)}

								{post.showCommentInput && (
									<div className="flex flex-col gap-2 mb-2">
										<textarea
											value={post.commentInput || ""}
											onChange={(e) =>
												setPosts((prev) =>
													prev.map((p) =>
														p.id === post.id
															? {
																	...p,
																	commentInput:
																		e.target
																			.value,
															  }
															: p
													)
												)
											}
											className="w-full p-2 border rounded text-sm"
											rows={2}
											placeholder="Tulis komentar..."
										/>
										<div className="flex gap-2 justify-end">
											<Button
												size={"sm"}
												onClick={() =>
													handleCommentSubmit(post.id)
												}
												className="self-end  px-3 py-1 rounded text-sm"
											>
												Kirim
											</Button>
											{/* <Button
												variant={"secondary"}
												size={"sm"}
												onClick={() =>
													handleCommentSubmit(
														post.id,
														"cancel"
													)
												}
												className="self-end px-3 py-1 rounded text-sm"
											>
												Batal
											</Button> */}
										</div>
									</div>
								)}
							</CardContent>
						</Card>
					))
				)}
			</main>
			<SidebarRight />
		</div>
	);
}
