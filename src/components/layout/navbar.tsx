"use client";

import { Lobster } from "next/font/google";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FaInstagram } from "react-icons/fa";

const lobster = Lobster({ weight: "400", subsets: ["latin"] });

export default function Navbar() {
	return (
		<nav className="flex items-center justify-between bg-white border-b px-6 py-4 sticky top-0 z-50">
			<Link
				href="/"
				className={`text-pink-600 text-2xl flex items-center gap-2 ${lobster.className}`}
			>
				<FaInstagram />
				<span>InstaApp</span>
			</Link>
			<div className="flex items-center gap-4">
				<Link href="/profile">
					<Button variant="ghost">Profile</Button>
				</Link>
				<Button
					variant="destructive"
					onClick={() => {
						localStorage.removeItem("token");
						window.location.href = "/login";
					}}
				>
					Logout
				</Button>
			</div>
		</nav>
	);
}
