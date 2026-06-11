import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { resolveAdminMediaUrl } from "../lib/resolveMediaUrl";
import AdminPagination from "../components/AdminPagination";

function ViewInstaImage({ url }) {
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
          style={{ aspectRatio: '9/16', objectFit: 'cover' }}
          loading="lazy"
          decoding="async"
          onError={() => setBroken(true)}
        />
      )}
    </div>
  );
}

function InstaThumb({ url }) {
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
      style={{ aspectRatio: '9/16', objectFit: 'cover', height: '80px', width: 'auto' }}
      loading="lazy"
      decoding="async"
      onError={() => setBroken(true)}
    />
  );
}

export default function InstagramPosts() {
  const [posts, setPosts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [listLoading, setListLoading] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [modal, setModal] = useState(null); // { mode: 'add'|'edit'|'view', post?: {...} }
  const [form, setForm] = useState({
    image_url: "",
    link: "",
    sort_order: 0,
    status: "active",
  });

  async function refresh() {
    setError("");
    setListLoading(true);
    try {
      const res = await api.listInstagramPosts(page, pageSize);
      setPosts(res.posts || []);
      setTotal(Number(res.total ?? 0));
    } catch (err) {
      setError(err?.message || "Failed to load posts");
    } finally {
      setListLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, [page, pageSize]);

  function resetForm() {
    setForm({
      image_url: "",
      link: "",
      sort_order: 0,
      status: "active",
    });
  }

  function openAdd() {
    setError("");
    resetForm();
    setModal({ mode: "add" });
  }

  function openEdit(p) {
    setError("");
    setForm({
      image_url: p.image_url || "",
      link: p.link || "",
      sort_order: p.sort_order || 0,
      status: p.status || "active",
    });
    setModal({ mode: "edit", post: p });
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
      const payload = {
        image_url: form.image_url,
        link: form.link || undefined,
        sort_order: Number(form.sort_order),
        status: form.status,
      };

      if (modal?.mode === "edit" && modal.post?.id) {
        await api.updateInstagramPost(modal.post.id, payload);
      } else {
        await api.createInstagramPost(payload);
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
      const { url } = await api.uploadInstagramImage(file);
      setForm((f) => ({ ...f, image_url: url }));
    } catch (err) {
      setError(err?.message || "Image upload failed");
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this post?")) return;
    setError("");
    setListLoading(true);
    try {
      await api.deleteInstagramPost(id);
      await refresh();
    } catch (err) {
      setError(err?.message || "Delete failed");
      setListLoading(false);
    }
  }

  return (
    <div className="adminPage">
      <div className="adminPageTop">
        <h1 className="adminPageTitle">Instagram Feed</h1>
      </div>

      {error && !modal && <div className="error" style={{ marginBottom: 14 }}>{error}</div>}

      <div className="adminTableWrap" style={{ marginTop: 14 }}>
        <div className="adminTableTop">
          <div className="adminTableTitle">Post listing</div>
          <button className="adminBtn adminBtnPrimary" type="button" onClick={openAdd}>
            + Add Post
          </button>
        </div>

        <table className="adminTable">
          <thead>
            <tr>
              <th style={{ width: 80 }}>Image</th>
              <th>Link</th>
              <th style={{ width: 100 }}>Sort Order</th>
              <th style={{ width: 110 }}>Status</th>
              <th style={{ width: 180, textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {!listLoading &&
              posts.map((p) => (
                <tr key={p.id}>
                  <td>
                    <InstaThumb url={p.image_url} />
                  </td>
                  <td className="muted" style={{ wordBreak: 'break-all' }}>
                    {p.link || "—"}
                  </td>
                  <td>{p.sort_order}</td>
                  <td className="muted">{p.status}</td>
                  <td>
                    <div className="adminActions">
                      <button className="adminBtn" type="button" onClick={() => openEdit(p)}>
                        Edit
                      </button>
                      <button className="adminBtn" type="button" onClick={() => handleDelete(p.id)}>
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
            ) : posts.length === 0 ? (
              <tr>
                <td className="muted" colSpan={5} style={{ padding: 24, textAlign: "center" }}>
                  No posts yet. Click “Add Post”.
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
          onLimitChange={(n) => { setPageSize(n); setPage(1); }} 
        />
      </div>

      {modal ? (
        <div className="adminModalOverlay" role="dialog" aria-modal="true" onMouseDown={closeModal}>
          <div className="adminModal" onMouseDown={(e) => e.stopPropagation()} style={{ width: "min(500px, calc(100vw - 32px))" }}>
            <div className="adminModalTop">
              <h2 className="adminModalTitle">
                {modal.mode === "edit" ? "Edit post" : "Add post"}
              </h2>
              <button className="adminBtn" type="button" onClick={closeModal}>
                Close
              </button>
            </div>

            <div className="adminModalBody">
              {error && <div className="error" style={{ marginBottom: 12 }}>{error}</div>}

              <form onSubmit={onSubmit} className="adminPanel" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div className="field">
                  <div className="label">Instagram Link</div>
                  <input
                    className="input"
                    placeholder="https://www.instagram.com/p/..."
                    value={form.link}
                    onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))}
                  />
                </div>

                <div className="adminGrid2">
                  <div className="field">
                    <div className="label">Sort Order</div>
                    <input
                      type="number"
                      className="input"
                      value={form.sort_order}
                      onChange={(e) => setForm((f) => ({ ...f, sort_order: e.target.value }))}
                    />
                  </div>
                  <div className="field">
                    <div className="label">Status</div>
                    <select
                      className="input"
                      value={form.status}
                      onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="field">
                  <div className="label">Post Image (Reel Thumbnail) *</div>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <input
                      className="input"
                      value={form.image_url}
                      readOnly
                      required
                      placeholder="/uploads/insta-..."
                    />
                    <button
                      className="adminBtn"
                      type="button"
                      disabled={uploadingImage}
                      onClick={() => document.getElementById("instaImageUpload").click()}
                    >
                      {uploadingImage ? "..." : "Upload"}
                    </button>
                    <input
                      id="instaImageUpload"
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
                    <div style={{ marginTop: 8, textAlign: 'center' }}>
                      <ViewInstaImage url={form.image_url} />
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                  <button className="adminBtn adminBtnPrimary" disabled={loading || uploadingImage} type="submit" style={{ flex: 1 }}>
                    {loading ? "Saving..." : "Save Post"}
                  </button>
                  <button className="adminBtn" disabled={loading} type="button" onClick={closeModal} style={{ flex: 1 }}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
