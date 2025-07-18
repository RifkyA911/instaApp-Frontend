"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function NotFound() {
	const router = useRouter();

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) {
			router.replace("/auth/login");
			return;
		}
	}, [router]);

	return (
		<div>
			<h2>Not Found</h2>
			<p>Could not find requested resource</p>
			<Link href="/">Return Home</Link>
		</div>
	);
}
