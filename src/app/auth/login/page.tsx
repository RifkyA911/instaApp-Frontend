"use client";

import { useState } from "react";
import axios from "axios";
import { FaInstagram } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const router = useRouter();

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const response = await axios.post(
				"http://localhost:8000/api/login",
				{
					email,
					password,
				}
			);

			const { token, user } = response.data;

			// Simpan token di localStorage (atau cookies kalau kamu mau SSR)
			localStorage.setItem("token", token);
			localStorage.setItem("user", JSON.stringify(user));

			// Redirect ke halaman utama
			router.push("/");
		} catch (err: any) {
			setError(err?.response?.data?.message || "Login gagal");
		}
	};

	const handleGoToRegister = () => {
		router.push("/auth/register");
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-rose-100 to-blue-100">
			<div className="w-[350px] bg-white p-8 rounded-lg shadow-md">
				<div className="flex justify-center mb-6">
					<FaInstagram className="text-pink-600 text-4xl" />
				</div>
				<h2 className="text-center text-xl font-semibold mb-4">
					Login to InstaApp
				</h2>
				<form onSubmit={handleLogin} className="space-y-4">
					<Input
						placeholder="Email"
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<Input
						placeholder="Password"
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					{error && <p className="text-red-500 text-sm">{error}</p>}
					<Button className="w-full" type="submit">
						Login
					</Button>
				</form>
				<div className="mt-4 text-center">
					<span className="text-sm">Belum punya akun? </span>
					<Button
						variant="link"
						className="p-0 h-auto align-baseline text-blue-600"
						onClick={handleGoToRegister}
						type="button"
					>
						Register
					</Button>
				</div>
			</div>
		</div>
	);
}
