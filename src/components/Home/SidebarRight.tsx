"use client";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

// components/SidebarRight.tsx
export default function SidebarRight() {
	const [token, setToken] = useState<string | null>(null);
	const [thisUser, setThisUser] = useState<any>(null);

	useEffect(() => {
		const token = localStorage.getItem("token");
		const user = JSON.parse(localStorage.getItem("user") || "null");
		setToken(token);
		setThisUser(user);
	}, []);

	return (
		<aside className="fixed top-0 right-0 h-full w-[320px] border-l bg-white px-6 pt-8">
			<div className="flex flex-col gap-6 mt-4">
				{/* User Info */}
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Avatar>
							<AvatarImage
								src={`https://i.pravatar.cc/150?u=${thisUser?.name}`}
							/>
							<AvatarFallback>
								{thisUser?.name?.[0]}
							</AvatarFallback>
						</Avatar>
						<span className="font-medium">{thisUser?.name}</span>
						<span className="text-xs text-gray-500">
							@{thisUser?.name?.toLowerCase()}
						</span>
					</div>
					<button className="text-blue-500 text-xs font-semibold hover:text-blue-700">
						Beralih
					</button>
				</div>
				{/* Suggestions */}
				<div>
					<div className="flex justify-between mb-3">
						<p className="text-gray-500 font-semibold text-sm">
							Saran untuk Anda
						</p>
						<button className="text-xs font-semibold hover:text-gray-700">
							Lihat Semua
						</button>
					</div>
					<div className="flex flex-col gap-4">
						{[1, 2, 3].map((i) => (
							<div
								key={i}
								className="flex items-center justify-between"
							>
								<div className="flex items-center gap-3">
									<img
										src={`https://randomuser.me/api/portraits/women/1${i}.jpg`}
										alt="Suggestion"
										className="w-9 h-9 rounded-full border"
									/>
									<div>
										<p className="font-semibold text-xs">
											user_saran{i}
										</p>
										<p className="text-gray-400 text-xs">
											Mengikuti Anda
										</p>
									</div>
								</div>
								<button className="text-blue-500 text-xs font-semibold hover:text-blue-700">
									Ikuti
								</button>
							</div>
						))}
					</div>
				</div>
				{/* Footer */}
				<div className="mt-6 text-xs text-gray-400">
					<p>
						Informasi • Bantuan • API • Karier • Privasi • Ketentuan
						• Lokasi • Bahasa
					</p>
					<p className="mt-2">&copy; 2024 INSTAGRAM</p>
				</div>
			</div>
		</aside>
	);
}
