"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaInstagram } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";

export default function RegisterPage() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [name, setName] = useState("");
	const [password, setPassword] = useState("");
	const [password2, setPassword2] = useState("");
	const [error, setError] = useState("");

	const handleRegister = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			// 1. Register ke Laravel
			await axios.post("http://localhost:8000/api/register", {
				name,
				email,
				password,
				password_confirmation: password2,
			});

			// 2. Langsung login
			const response = await axios.post(
				"http://localhost:8000/api/login",
				{
					email,
					password,
				}
			);

			const { token, user } = response.data;

			// 3. Simpan token dan redirect
			localStorage.setItem("token", token);
			localStorage.setItem("user", JSON.stringify(user));

			router.push("/");
		} catch (err: any) {
			setError(err?.response?.data?.message || "Register gagal");
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 to-pink-100">
			<div className="w-[350px] bg-white p-8 rounded-lg shadow-md">
				<div className="flex justify-center mb-6 text-pink-600 text-4xl font-[Lobster,cursive]">
					<FaInstagram />
					<span className="ml-2">InstaApp</span>
				</div>
				<h2 className="text-center text-xl font-semibold mb-4">
					Register
				</h2>
				<form onSubmit={handleRegister} className="space-y-4">
					<Input
						placeholder="Username"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
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
					<Input
						placeholder="Confirm Password"
						type="password"
						value={password2}
						onChange={(e) => setPassword2(e.target.value)}
					/>
					{error && <p className="text-sm text-red-500">{error}</p>}
					<Button type="submit" className="w-full cursor-pointer">
						Register
					</Button>
				</form>
			</div>
		</div>
	);
}
