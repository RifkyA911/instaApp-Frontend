"use client";

import { Controller, useForm } from "react-hook-form";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { FaImage, FaPlusSquare } from "react-icons/fa";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { Post } from "@/app/interface/Post";
import { API_URL } from "@/app/config";
import { Textarea } from "../ui/textarea";
import Image from "next/image";
import { useRef } from "react";
import { useRouter } from "next/navigation";

interface ModalPostProps {
	type: "create" | "update";
	post: Post | null;
}

export const ModalPost: React.FC<ModalPostProps> = ({
	type = "create",
	post,
}) => {
	const router = useRouter();
	const uploadRef = useRef<HTMLInputElement>(null);

	const { control, handleSubmit } = useForm({
		defaultValues: {
			caption: post?.caption || "",
			image: post?.image_path || null,
		},
	});

	const onSubmit = async (formData: any) => {
		const formDataWithImage = new FormData();
		formDataWithImage.append("caption", formData.caption);
		if (formData.image) {
			formDataWithImage.append("image", formData.image[0]);
		}

		const response = await fetch(`${API_URL}/api/posts`, {
			method: type === "update" ? "PUT" : "POST",
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
			body: formDataWithImage,
		});

		if (response.ok) {
			toast.success("Post created successfully!");
			setTimeout(() => {
				window.location.href = "/";
			}, 2000);
		} else {
			toast.error("Error creating post!");
		}
	};

	return (
		<Dialog>
			<DialogTrigger>
				<div className="flex items-center gap-3 hover:font-semibold cursor-pointer">
					<FaPlusSquare />
					{type == "update" ? "Update" : "Create"}
				</div>
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>
						{type == "update" ? "Update Post" : "Create Post"}
					</DialogTitle>
				</DialogHeader>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="flex flex-col gap-4"
				>
					<div className="mt-2">
						<label
							htmlFor="image"
							className="block text-sm font-medium text-gray-700"
						>
							Image
						</label>
						<Controller
							name="image"
							control={control}
							render={({ field: { onChange, value } }) => (
								<div className="mt-1 flex flex-col gap-2">
									{value ? (
										<div className="flex flex-col items-center gap-2">
											<Image
												src={URL.createObjectURL(
													value[0] as any
												)}
												width={200}
												height={200}
												alt=""
												className="max-h-[300px] max-w-[300px] rounded-md object-cover"
											/>
											<div className="flex gap-2 justify-center">
												<Button
													variant="outline"
													className="mt-2"
													onClick={() =>
														uploadRef.current?.click()
													}
												>
													Change
												</Button>
												<Button
													variant="destructive"
													className="mt-2"
													onClick={() =>
														onChange(null)
													}
												>
													Remove
												</Button>
											</div>
										</div>
									) : (
										<div
											onClick={() =>
												uploadRef.current?.click()
											}
											className="mt-1 border-2 border-dashed border-gray-300 rounded-md p-4 flex items-center justify-center cursor-pointer"
										>
											<div className="bg-gray-200 h-40 w-40 rounded-md flex gap-2 flex-col items-center justify-center ">
												<FaImage className="text-gray-500 text-3xl" />
												<p className="text-gray-500">
													Upload Image
												</p>
											</div>
										</div>
									)}
									<Input
										ref={uploadRef}
										id="image"
										name="image"
										type="file"
										onChange={(e) => {
											onChange(e.target.files);
										}}
										className="hidden  w-full text-gray-700 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/50 focus:ring-offset-0"
									/>
								</div>
							)}
						/>
					</div>
					<Controller
						name="caption"
						control={control}
						render={({ field }) => (
							<Textarea
								{...field}
								id="caption"
								placeholder="Write a caption..."
								cols={8}
								maxLength={1000}
								className="mt-2"
							/>
						)}
					/>

					<DialogFooter className="sm:justify-start">
						<DialogClose asChild>
							<Button type="button" variant="secondary">
								Close
							</Button>
						</DialogClose>
						<Button type="submit">
							{type == "update" ? "Update" : "Create"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};
