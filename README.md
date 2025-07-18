# 📸 InstaApp Frontend (Next.js 15 + ShadCN + Tailwind)

Frontend application for **InstaApp** built with **Next.js 15**, **Turbopack**, **ShadCN**, and **NextAuth**.  
Features: **authentication**, **CRUD Posts (caption + image)**, **like**, **comment**, and **update posts with image**.

---

## 🚀 Tech Stack

-   [Next.js 15](https://nextjs.org/) + Turbopack ⚡
-   [TypeScript](https://www.typescriptlang.org/)
-   [ShadCN/UI](https://ui.shadcn.com/) for UI components
-   [Tailwind CSS](https://tailwindcss.com/)
-   [React Hook Form](https://react-hook-form.com/) + Controller for file input
-   [Lucide Icons](https://lucide.dev/) & React Icons
-   [Laravel Sanctum](https://laravel.com/docs/11.x/sanctum) for backend auth
-   [Axios](https://axios-http.com/) for HTTP requests
-   [Bun](https://bun.sh/) as package manager & runtime

---

## 📦 Installation

```bash
git clone https://github.com/username/instaApp-Frontend.git
cd instaApp-Frontend
bun install
```

Create `.env.local` file:

```env
NEXT_PUBLIC_BASE_API_URL=http://127.0.0.1:8000
```

---

## 🛠️ Development

Run development server:

```bash
bun dev
```

Visit `http://localhost:3000`.

---

## 🔑 Authentication

-   Login and register via **Laravel Sanctum**.
-   User token is stored in `localStorage`:

    ```ts
    const token =
    	typeof window !== "undefined" ? localStorage.getItem("token") : null;
    ```

-   Middleware checks token & user, redirects to `/auth/login` if not authenticated.

---

## 🖼️ Posts

### Create / Update Post

-   Input **caption** & upload **image** with preview:

    ```tsx
    <Controller
      name="image"
      control={control}
      render={({ field: { onChange, value } }) => (
        value && value[0] instanceof File
          ? <Image src={URL.createObjectURL(value[0])} ... />
          : typeof value === "string"
          ? <Image src={value} ... />
          : null
      )}
    />
    ```

-   Update post uses **`_method=PUT`** because Laravel doesn't parse `multipart/form-data` with `PUT`:

    ```ts
    const formData = new FormData();
    formData.append("_method", "PUT");
    formData.append("caption", caption);
    formData.append("image", image[0]);

    await axios.post(`${API_URL}/api/posts/${postId}`, formData, {
    	headers: { Authorization: `Bearer ${token}` },
    });
    ```

### Like / Unlike

```ts
await axios.post(`${API_URL}/api/posts/${postId}/likes`, {}, { headers });
await axios.delete(`${API_URL}/api/posts/${postId}/likes/${likeId}`, {
	headers,
});
```

### Comment

-   **Add**, **Update**, **Cancel** comments managed via `posts[]` state.
-   `toggleCommentInput` & `handleCommentSubmit` handle show/hide input & sending comments.

---

## ⚙️ next.config.js

Allow `127.0.0.1` for `next/image`:

```js
images: {
  remotePatterns: [
    {
      protocol: "http",
      hostname: "127.0.0.1",
      pathname: "/api/image/posts/**",
    },
  ],
},
```

---

## 🐞 Troubleshooting

-   **`localStorage is not defined`**  
    Wrap with `typeof window !== "undefined"` to avoid server-side errors.
-   **Update post caption not received**  
    Use `_method=PUT` with `POST` when sending `FormData`.
-   **ShadCN modal auto-closing on child click**  
    Use `e.stopPropagation()` in trigger or `asChild` prop.

---

## 📌 TODO

-   [ ] Optimize posts state to avoid refetching after like/comment.
-   [ ] Implement delete post & remove old files on backend.
-   [ ] Add loading indicators & skeleton UI.

---

### License

MIT
