import { getToken } from "./auth";

const API_URL =
  // import.meta.env.VITE_ADMIN_API_URL?.replace(/\/+$/, "") ||
  "https://pushpanjaliglobal.com/api";


const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

function validateImageFile(file) {
  if (!file) throw new Error("No file selected");
  const okType = /^image\/(jpeg|png|gif|webp)$/i.test(file.type || "");
  if (!okType) throw new Error("Only JPEG, PNG, GIF, or WebP images are allowed");
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error("Image too large. Max allowed size is 5 MB");
  }
}

async function request(path, { method = "GET", body, auth = false } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    const msg =
      err?.message?.toLowerCase?.().includes("fetch") || err?.name === "TypeError"
        ? `Cannot reach the Admin API. Is the Admin backend running at ${API_URL}?`
        : err?.message || "Network error";
    throw new Error(msg);
  }

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await res.json() : null;

  if (!res.ok) {
    const message = data?.message || `Request failed (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    throw err;
  }

  return data;
}

export const api = {
  // login: (email, password) => request("/auth/login", { method: "POST", body: { email, password } }),
  login: (email) => request("/admin/login", { method: "POST", body: { email } }),

  me: () => request("/me", { auth: true }),
  logout: () => request("/auth/logout", { method: "POST", auth: true }),
  /** @param {{ all?: boolean, page?: number, limit?: number }} [opts] — use `all: true` for dropdowns (full list). */
  listCategories: (opts = {}) => {
    const params = new URLSearchParams();
    if (opts.all) params.set("all", "1");
    else {
      params.set("page", String(opts.page ?? 1));
      params.set("limit", String(opts.limit ?? 20));
    }
    return request(`/categories?${params}`, { auth: true });
  },
  createCategory: (name, image_url, default_tags) =>
    request("/categories", { method: "POST", auth: true, body: { name, image_url: image_url || null, default_tags: default_tags ?? undefined } }),
  updateCategory: (id, name, image_url, default_tags) =>
    request(`/categories/${id}`, {
      method: "PUT",
      auth: true,
      body: {
        name,
        ...(image_url !== undefined ? { image_url } : {}),
        default_tags: default_tags ?? undefined,
      },
    }),
  deleteCategory: (id) =>
    request(`/categories/${id}`, { method: "DELETE", auth: true }),
  /** Upload category image; returns `{ url }` for category `image_url` (path under `/uploads/categories/`). */
  uploadCategoryImage: async (file) => {
    validateImageFile(file);
    const token = getToken();
    if (!token) throw new Error("Not signed in");
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch(`${API_URL}/categories/upload-image`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) throw new Error(data?.message || `Upload failed (${res.status})`);
    return data;
  },
  listProducts: (page = 1, limit = 20) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    return request(`/products?${params}`, { auth: true });
  },
  createProduct: (payload) =>
    request("/products", { method: "POST", auth: true, body: payload }),
  updateProduct: (id, payload) =>
    request(`/products/${id}`, { method: "PUT", auth: true, body: payload }),
  deleteProduct: (id) =>
    request(`/products/${id}`, { method: "DELETE", auth: true }),
  /** Upload image file; returns `{ url }` for product `image_url`. */
  uploadProductImage: async (file) => {
    validateImageFile(file);
    const token = getToken();
    if (!token) throw new Error("Not signed in");
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch(`${API_URL}/uploads/product-image`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) throw new Error(data?.message || `Upload failed (${res.status})`);
    return data;
  },
  listCustomerOrders: (page = 1, limit = 20) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    return request(`/customer-orders?${params}`, { auth: true });
  },
  updateCustomerOrderFulfillment: (orderId, body) =>
    request(`/customer-orders/${orderId}/fulfillment`, { method: "PATCH", auth: true, body }),
  fetchCustomerOrderTracking: (orderId, cnno) => {
    const params = new URLSearchParams();
    if (cnno) params.set("cnno", cnno);
    const query = params.toString();
    return request(`/customer-orders/${orderId}/dtdc-tracking${query ? `?${query}` : ""}`, { auth: true });
  },
  printCustomerOrderLabel: async (orderId, options = {}) => {
    const token = getToken();
    if (!token) throw new Error("Not signed in");
    const params = new URLSearchParams();
    if (options.referenceNumber) params.set("reference_number", options.referenceNumber);
    if (options.labelCode) params.set("label_code", options.labelCode);
    if (options.labelFormat) params.set("label_format", options.labelFormat);
    const query = params.toString();
    const path = `/customer-orders/${orderId}/dtdc-label${query ? `?${query}` : ""}`;
    const res = await fetch(`${API_URL}${path}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      throw new Error(data?.message || `Label request failed (${res.status})`);
    }
    const blob = await res.blob();
    const disposition = res.headers.get("content-disposition") || "";
    const m = disposition.match(/filename="?([^"]+)"?/i);
    return { blob, fileName: m?.[1] || `dtdc-label-order-${orderId}.pdf` };
  },
  fetchCustomerOrderInvoice: async (orderId) => {
    const token = getToken();
    if (!token) throw new Error("Not signed in");
    const res = await fetch(`${API_URL}/customer-orders/${orderId}/invoice`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      throw new Error(data?.message || `Invoice request failed (${res.status})`);
    }
    const html = await res.text();
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    return { blob, fileName: `invoice-order-${orderId}.html` };
  },
  // Blogs
  listBlogs: (page = 1, limit = 20) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    return request(`/blogs?${params}`, { auth: true });
  },
  createBlog: (payload) =>
    request("/blogs", { method: "POST", auth: true, body: payload }),
  updateBlog: (id, payload) =>
    request(`/blogs/${id}`, { method: "PUT", auth: true, body: payload }),
  deleteBlog: (id) =>
    request(`/blogs/${id}`, { method: "DELETE", auth: true }),
  uploadBlogImage: async (file) => {
    validateImageFile(file);
    const token = getToken();
    if (!token) throw new Error("Not signed in");
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch(`${API_URL}/uploads/blog-image`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) throw new Error(data?.message || `Upload failed (${res.status})`);
    return data;
  },

  // Instagram
  listInstagramPosts: (page = 1, limit = 20) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    return request(`/instagram-posts?${params}`, { auth: true });
  },
  createInstagramPost: (payload) =>
    request("/instagram-posts", { method: "POST", auth: true, body: payload }),
  updateInstagramPost: (id, payload) =>
    request(`/instagram-posts/${id}`, { method: "PUT", auth: true, body: payload }),
  deleteInstagramPost: (id) =>
    request(`/instagram-posts/${id}`, { method: "DELETE", auth: true }),
  uploadInstagramImage: async (file) => {
    validateImageFile(file);
    const token = getToken();
    if (!token) throw new Error("Not signed in");
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch(`${API_URL}/uploads/instagram-image`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) throw new Error(data?.message || `Upload failed (${res.status})`);
    return data;
  },
};

