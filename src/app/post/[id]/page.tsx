import { notFound } from "next/navigation";

interface PostPageProps {
	params: {
		id: string;
	};
}

export default async function PostPage({ params }: PostPageProps) {
	const res = await fetch(`http://localhost:8000/api/posts/${params.id}`, {
		cache: "no-store", // jika perlu disable cache
	});

	if (!res.ok) return notFound();

	const post = await res.json();

	return (
		<div>
			<h1>{post.caption}</h1>
			<img src={post.image_path} alt="Post Image" />
			<p>By: {post.user.name}</p>
			{/* tampilkan komentar jika ada */}
			{post.comments && post.comments.length > 0 && (
				<ul>
					{post.comments.map((comment: any) => (
						<li key={comment.id}>{comment.content}</li>
					))}
				</ul>
			)}
		</div>
	);
}
