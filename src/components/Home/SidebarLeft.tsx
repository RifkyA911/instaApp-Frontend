"use client";

// components/SidebarLeft.tsx
import Link from "next/link";
import {
	FaHome,
	FaSearch,
	FaPlusSquare,
	FaUser,
	FaInstagram,
} from "react-icons/fa";
import { ModalPost } from "../Post/Modal";
import { API_URL } from "@/app/config";

export default function SidebarLeft() {
	return (
		<aside className="fixed top-0 left-0 h-full w-[220px] border-r p-4 bg-white flex flex-col">
			<div className="text-2xl font-bold text-pink-600 mb-10 flex items-center gap-2">
				<FaInstagram />
				<span>InstaApp</span>
			</div>
			<nav className="flex flex-col gap-4">
				<Link
					href="/"
					className="flex items-center gap-3 hover:font-semibold"
				>
					<FaHome />
					Home
				</Link>
				<ModalPost type="create" post={null} />
				<Link
					href="#"
					className="disabled flex items-center gap-3 hover:font-semibold"
				>
					<FaSearch />
					Search
				</Link>
				<Link
					href="#"
					className="disabled flex items-center gap-3 hover:font-semibold"
				>
					<FaUser />
					Profile
				</Link>
				<button
					onClick={() => {
						fetch(`${API_URL}/api/logout`, {
							method: "POST",
							headers: {
								Authorization: `Bearer ${localStorage.getItem(
									"token"
								)}`,
							},
						}).then(() => {
							// Hapus data pengguna dari localStorage
							localStorage.removeItem("token");
							localStorage.removeItem("user");
							window.location.href = "/auth/login";
						});
						// Redirect ke halaman login
					}}
					className="flex items-center gap-3 hover:font-semibold text-left bg-transparent border-none p-0 cursor-pointer"
				>
					<FaUser />
					Logout
				</button>
			</nav>
		</aside>
	);
}
