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
import { FaPlusSquare } from "react-icons/fa";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { Post } from "@/app/interface/Post";
import { API_URL } from "@/app/config";

interface ModalPostProps {
	type: "create" | "update";
	post: Post | null;
}

export const ModalPost: React.FC<ModalPostProps> = ({
	type = "create",
	post,
}) => {
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
				<form onSubmit={handleSubmit(onSubmit)}>
					<Controller
						name="caption"
						control={control}
						render={({ field }) => (
							<Input
								{...field}
								id="caption"
								placeholder="Caption"
								className="mt-2"
							/>
						)}
					/>
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
								<div className="mt-1">
									<Input
										id="image"
										name="image"
										type="file"
										onChange={(e) => {
											onChange(e.target.files);
										}}
										className="block w-full text-gray-700 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/50 focus:ring-offset-0"
									/>
									{value && (
										<div className="mt-1">
											<img
												src={URL.createObjectURL(
													value[0] as any
												)}
												alt=""
												className="h-20 w-20 rounded-md object-cover"
											/>
										</div>
									)}
								</div>
							)}
						/>
					</div>
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
