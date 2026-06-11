import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { resolveAdminMediaUrl } from "../lib/resolveMediaUrl";
import AdminPagination from "../components/AdminPagination";

function ViewBlogImage({ url }) {
  const [broken, setBroken] = useState(false);
  const src = resolveAdminMediaUrl(url);
  return (
    <div className="adminViewProductImageFrame">
      {!src || broken ? (
        <div className="adminViewProductImagePlaceholder" role="img" aria-label="No image">
          No image
        </div>
      ) : (
        <img
          src={src}
          alt=""
          className="adminViewProductImage"
          loading="lazy"
          decoding="async"
          onError={() => setBroken(true)}
        />
      )}
    </div>
  );
}

function BlogThumb({ url }) {
  const [broken, setBroken] = useState(false);
  const src = resolveAdminMediaUrl(url);
  if (!src || broken) {
    return <div className="adminProductThumb adminProductThumb--empty" title="No image" aria-hidden />;
  }
  return (
    <img
      src={src}
      alt=""
      className="adminProductThumb"
      loading="lazy"
      decoding="async"
      onError={() => setBroken(true)}
    />
  );
}

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [listLoading, setListLoading] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [modal, setModal] = useState(null); // { mode: 'add'|'edit'|'view', blog?: {...} }
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    category: "",
    author: "",
    date_label: "",
    image_url: "",
    body: "", // We'll edit as a single textarea separated by double newlines
    status: "published",
  });

  async function refresh() {
    setError("");
    setListLoading(true);
    try {
      const res = await api.listBlogs(page, pageSize);
      const list = res.blogs || [];
      const totalCount = Number(res.total ?? 0);
      if (list.length === 0 && totalCount > 0 && page > 1) {
        setPage((p) => p - 1);
        return;
      }
      setBlogs(list);
      setTotal(totalCount);
      if (totalCount === 0) setPage(1);
    } catch (err) {
      setError(err?.message || "Failed to load blogs");
    } finally {
      setListLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, [page, pageSize]);

  function handlePageSizeChange(n) {
    setPageSize(n);
    setPage(1);
  }

  function resetForm() {
    setForm({
      title: "",
      excerpt: "",
      category: "",
      author: "",
      date_label: "",
      image_url: "",
      body: "",
      status: "published",
    });
  }

  function openAdd() {
    setError("");
    resetForm();
    setModal({ mode: "add" });
  }

  function openEdit(b) {
    setError("");
    let bodyText = "";
    if (Array.isArray(b.body)) {
      bodyText = b.body.join("\n\n");
    } else if (typeof b.body === "string") {
      bodyText = b.body;
    }

    setForm({
      title: b.title || "",
      excerpt: b.excerpt || "",
      category: b.category || "",
      author: b.author || "",
      date_label: b.date_label || "",
      image_url: b.image_url || "",
      body: bodyText,
      status: b.status || "published",
    });
    setModal({ mode: "edit", blog: b });
  }

  function openView(b) {
    setError("");
    setModal({ mode: "view", blog: b });
  }

  function closeModal() {
    setModal(null);
    resetForm();
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // Split body by double newlines to convert to array of paragraphs
      const bodyArray = form.body
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean);

      const payload = {
        title: form.title,
        excerpt: form.excerpt || undefined,
        category: form.category || undefined,
        author: form.author || undefined,
        date_label: form.date_label || undefined,
        image_url: form.image_url || undefined,
        body: bodyArray.length > 0 ? bodyArray : undefined,
        status: form.status,
      };

      if (modal?.mode === "edit" && modal.blog?.id) {
        await api.updateBlog(modal.blog.id, payload);
      } else {
        await api.createBlog(payload);
      }
      await refresh();
      closeModal();
    } catch (err) {
      setError(err?.message || "Save failed");
    } finally {
      setLoading(false);
    }
  }

  async function onImageFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setUploadingImage(true);
    try {
      const { url } = await api.uploadBlogImage(file);
      setForm((f) => ({ ...f, image_url: url }));
    } catch (err) {
      setError(err?.message || "Image upload failed");
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this blog post? It cannot be undone.")) return;
    setError("");
    setListLoading(true);
    try {
      await api.deleteBlog(id);
      await refresh();
    } catch (err) {
      setError(err?.message || "Delete failed");
      setListLoading(false);
    }
  }

  return (
    <div className="adminPage">
      <div className="adminPageTop">
        <h1 className="adminPageTitle">Blogs</h1>
      </div>

      {error && !modal && <div className="error" style={{ marginBottom: 14 }}>{error}</div>}

      <div className="adminTableWrap" style={{ marginTop: 14 }}>
        <div className="adminTableTop">
          <div className="adminTableTitle">Blog listing</div>
          <button className="adminBtn adminBtnPrimary" type="button" onClick={openAdd}>
            + Add Blog
          </button>
        </div>

        <table className="adminTable">
          <thead>
            <tr>
              <th style={{ width: 80 }}>Image</th>
              <th>Title &amp; Info</th>
              <th>Author / Date</th>
              <th style={{ width: 110 }}>Status</th>
              <th style={{ width: 220, textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {!listLoading &&
              blogs.map((b) => (
                <tr key={b.id}>
                  <td>
                    <BlogThumb url={b.image_url} />
                  </td>
                  <td style={{ fontWeight: 800 }}>
                    {b.title}
                    <div className="muted" style={{ marginTop: 2 }}>
                      Category: {b.category || "—"}
                    </div>
                  </td>
                  <td className="muted">
                    <div>{b.author || "—"}</div>
                    <div style={{ fontSize: 12 }}>{b.date_label || "—"}</div>
                  </td>
                  <td className="muted">{b.status}</td>
                  <td>
                    <div className="adminActions">
                      <button className="adminBtn" type="button" onClick={() => openView(b)}>
                        View
                      </button>
                      <button className="adminBtn" type="button" onClick={() => openEdit(b)}>
                        Edit
                      </button>
                      <button className="adminBtn" type="button" onClick={() => handleDelete(b.id)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            {listLoading ? (
              <tr>
                <td className="muted" colSpan={5} style={{ padding: 24, textAlign: "center" }}>
                  Loading…
                </td>
              </tr>
            ) : blogs.length === 0 ? (
              <tr>
                <td className="muted" colSpan={5} style={{ padding: 24, textAlign: "center" }}>
                  No blog posts yet. Click “Add Blog”.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
        
        <AdminPagination 
          total={total} 
          page={page} 
          limit={pageSize} 
          disabled={listLoading}
          onPageChange={setPage} 
          onLimitChange={handlePageSizeChange} 
        />
      </div>

      {/* MODAL */}
      {modal ? (
        <div className="adminModalOverlay" role="dialog" aria-modal="true" onMouseDown={closeModal}>
          <div className="adminModal" onMouseDown={(e) => e.stopPropagation()} style={{ width: "min(760px, calc(100vw - 32px))" }}>
            <div className="adminModalTop">
              <div>
                <h2 className="adminModalTitle">
                  {modal.mode === "view" ? "View blog" : modal.mode === "edit" ? "Edit blog" : "Add blog"}
                </h2>
                <div className="muted">
                  {modal.mode === "view" ? "Details" : "Fill blog details and save."}
                </div>
              </div>
              <button className="adminBtn" type="button" onClick={closeModal}>
                Close
              </button>
            </div>

            <div className="adminModalBody">
              {error && <div className="error" style={{ marginBottom: 12 }}>{error}</div>}

              {modal.mode === "view" ? (
                <div className="adminPanel">
                  <div className="adminViewProductImageBlock">
                    <div className="muted" style={{ marginBottom: 8 }}>Cover image</div>
                    <div className="adminViewProductImageWrap">
                      <ViewBlogImage url={modal.blog?.image_url} />
                    </div>
                  </div>
                  
                  <div className="adminGrid2">
                    <div>
                      <div className="muted">Title</div>
                      <div style={{ fontWeight: 850 }}>{modal.blog?.title}</div>
                      <div style={{ height: 10 }} />
                      <div className="muted">Category</div>
                      <div style={{ fontWeight: 850 }}>{modal.blog?.category || "—"}</div>
                    </div>
                    <div>
                      <div className="muted">Author</div>
                      <div style={{ fontWeight: 850 }}>{modal.blog?.author || "—"}</div>
                      <div style={{ height: 10 }} />
                      <div className="muted">Display Date</div>
                      <div style={{ fontWeight: 850 }}>{modal.blog?.date_label || "—"}</div>
                    </div>
                  </div>

                  <div style={{ height: 10 }} />
                  <div className="muted">Status</div>
                  <div style={{ fontWeight: 850 }}>{modal.blog?.status}</div>
                  
                  {modal.blog?.excerpt && (
                    <>
                      <div style={{ height: 10 }} />
                      <div className="muted">Excerpt</div>
                      <div style={{ fontWeight: 650 }}>{modal.blog.excerpt}</div>
                    </>
                  )}

                  {Array.isArray(modal.blog?.body) && modal.blog.body.length > 0 && (
                    <>
                      <div style={{ height: 10 }} />
                      <div className="muted">Body Content</div>
                      <div style={{ fontWeight: 650, whiteSpace: "pre-wrap", maxHeight: 200, overflow: "auto", lineHeight: 1.6 }}>
                        {modal.blog.body.join("\n\n")}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <form onSubmit={onSubmit} className="adminPanel" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div className="adminProductFormGrid">
                    <div className="field" style={{ margin: 0 }}>
                      <div className="label">Title *</div>
                      <input
                        className="input"
                        value={form.title}
                        onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                        required
                        autoFocus
                      />
                    </div>
                    <div className="field" style={{ margin: 0 }}>
                      <div className="label">Category</div>
                      <input
                        className="input"
                        placeholder="e.g. Health"
                        value={form.category}
                        onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                      />
                    </div>
                    <div className="field" style={{ margin: 0 }}>
                      <div className="label">Status</div>
                      <select
                        className="input"
                        value={form.status}
                        onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                      >
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                      </select>
                    </div>
                  </div>

                  <div className="adminProductFormGrid">
                    <div className="field" style={{ margin: 0 }}>
                      <div className="label">Author Name</div>
                      <input
                        className="input"
                        placeholder="e.g. Dr. Anita Sharma"
                        value={form.author}
                        onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
                      />
                    </div>
                    <div className="field" style={{ margin: 0 }}>
                      <div className="label">Display Date</div>
                      <input
                        className="input"
                        placeholder="e.g. 18 Nov 2025"
                        value={form.date_label}
                        onChange={(e) => setForm((f) => ({ ...f, date_label: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="field" style={{ margin: 0 }}>
                    <div className="label">Excerpt (Short Summary)</div>
                    <textarea
                      className="input"
                      rows={2}
                      value={form.excerpt}
                      onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
                      style={{ resize: "vertical" }}
                    />
                  </div>

                  <div className="field" style={{ margin: 0 }}>
                    <div className="label">Body Paragraphs (Separate with blank lines)</div>
                    <textarea
                      className="input"
                      rows={8}
                      value={form.body}
                      onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
                      style={{ resize: "vertical", minHeight: 120 }}
                    />
                  </div>

                  <div className="field" style={{ margin: 0 }}>
                    <div className="label">Cover Image</div>
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <input
                        className="input"
                        value={form.image_url}
                        readOnly
                        placeholder="/uploads/blog-..."
                      />
                      <button
                        className="adminBtn"
                        type="button"
                        disabled={uploadingImage}
                        onClick={() => document.getElementById("blogImageUpload").click()}
                        style={{ whiteSpace: "nowrap" }}
                      >
                        {uploadingImage ? "Uploading..." : "Upload"}
                      </button>
                      <input
                        id="blogImageUpload"
                        type="file"
                        accept="image/jpeg,image/png,image/gif,image/webp"
                        style={{ display: "none" }}
                        onChange={onImageFileChange}
                      />
                    </div>
                    <div className="muted" style={{ fontSize: 12, marginTop: 6 }}>
                      JPEG, PNG, GIF, WebP · max 5 MB
                    </div>
                    {form.image_url && (
                      <div style={{ marginTop: 8 }}>
                        <img src={resolveAdminMediaUrl(form.image_url)} alt="Preview" className="adminImagePreview" />
                      </div>
                    )}
                  </div>

                  <div style={{ display: "flex", gap: 10, marginTop: 4, flexWrap: "wrap" }}>
                    <button className="adminBtn adminBtnPrimary" disabled={loading || uploadingImage} type="submit">
                      {loading ? "Saving..." : "Save Blog"}
                    </button>
                    <button className="adminBtn" disabled={loading} type="button" onClick={closeModal}>
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
