import Navbar from "@/components/layout/navbar";
import "./globals.css";
import { Inter } from "next/font/google";
import SidebarLeft from "@/components/Home/SidebarLeft";
import SidebarRight from "@/components/Home/SidebarRight";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: "InstaApp",
	description: "Instagram clone built with Next.js + Laravel",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={`${inter.className}`}>
				{/* Halaman konten */}
				<main>{children}</main>
				<Toaster expand={true} closeButton richColors />
			</body>
		</html>
	);
}
