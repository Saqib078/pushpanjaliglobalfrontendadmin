import { useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";
import { resolveAdminMediaUrl } from "../lib/resolveMediaUrl";
import AdminPagination from "../components/AdminPagination";

/** Web-portal style: bordered frame + cover (FeaturedPickles cards). */
function ViewProductImage({ url }) {
  const [broken, setBroken] = useState(false);
  const src = resolveAdminMediaUrl(url);
  return (
    <div className="adminViewProductImageFrame">
      {!src || broken ? (
        <div className="adminViewProductImagePlaceholder" role="img" aria-label="No product image">
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

/** Listing thumbnail — same treatment as shop cards. */
function ProductThumb({ url }) {
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

function toNumber(v, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function formatVariantPriceRange(p) {
  const vs = p.variants;
  if (!Array.isArray(vs) || vs.length === 0) return String(p.price ?? "—");
  const nums = vs.map((v) => Number(v.price)).filter((x) => Number.isFinite(x));
  if (!nums.length) return String(p.price ?? "—");
  const min = Math.min(...nums);
  const max = Math.max(...nums);
  return min === max ? String(min) : `${min} – ${max}`;
}

export default function Products() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [listLoading, setListLoading] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [modal, setModal] = useState(null); // { mode: 'add'|'edit'|'view', product?: {...} }
  const [form, setForm] = useState({
    name: "",
    category_id: "",
    sku: "",
    variants: [{ weight_grams: "500", price: "0", mrp: "", stock: "0" }],
    status: "active",
    short_description: "",
    description: "",
    image_url: "",
    image2_url: "",
    image3_url: "",
    image4_url: "",
    seo_title: "",
    meta_description: "",
    ingredients: "",
    gst_rate: "5",
    tags: "",
  });

  async function refresh() {
    setError("");
    setListLoading(true);
    try {
      const [cats, prods] = await Promise.all([
        api.listCategories({ all: true }),
        api.listProducts(page, pageSize),
      ]);
      setCategories(cats.categories || []);
      const list = prods.products || [];
      const totalCount = Number(prods.total ?? 0);
      if (list.length === 0 && totalCount > 0 && page > 1) {
        setPage((p) => p - 1);
        return;
      }
      setProducts(list);
      setTotal(totalCount);
      if (totalCount === 0) setPage(1);
    } catch (err) {
      setError(err?.message || "Failed to load");
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

  const sortedProducts = useMemo(() => {
    return [...products];
  }, [products]);

  function resetForm() {
    setForm({
      name: "",
      category_id: categories[0]?.id ? String(categories[0].id) : "",
      sku: "",
      variants: [{ weight_grams: "500", price: "0", mrp: "", stock: "0" }],
      status: "active",
      short_description: "",
      description: "",
      image_url: "",
      image2_url: "",
      image3_url: "",
      image4_url: "",
      seo_title: "",
      meta_description: "",
      ingredients: "",
      gst_rate: "5",
      tags: "",
    });
  }

  function openAdd() {
    setError("");
    resetForm();
    setModal({ mode: "add" });
  }

  function openEdit(p) {
    setError("");
    const vs = Array.isArray(p.variants) && p.variants.length > 0
      ? p.variants.map((v) => ({
          weight_grams: String(v.weight_grams ?? 500),
          price: String(v.price ?? 0),
          mrp: v.mrp == null || v.mrp === "" ? "" : String(v.mrp),
          stock: String(v.stock ?? 0),
        }))
      : [{ weight_grams: String(p.weight_grams ?? 500), price: String(p.price ?? 0), mrp: p.mrp == null ? "" : String(p.mrp), stock: String(p.stock ?? 0) }];
    setForm({
      name: p.name || "",
      category_id: String(p.category_id),
      sku: p.sku || "",
      variants: vs,
      status: p.status || "active",
      short_description: p.short_description || "",
      description: p.description || "",
      image_url: p.image_url || "",
      image2_url: p.image2_url || "",
      image3_url: p.image3_url || "",
      image4_url: p.image4_url || "",
      seo_title: p.seo_title || "",
      meta_description: p.meta_description || "",
      ingredients: p.ingredients || "",
      gst_rate: String(p.gst_rate ?? 5),
      tags: (() => {
        let t = p.tags;
        if (typeof t === 'string') { try { t = JSON.parse(t); } catch { t = []; } }
        return Array.isArray(t) ? t.join(", ") : "";
      })(),
    });
    setModal({ mode: "edit", product: p });
  }

  function openView(p) {
    setError("");
    setModal({ mode: "view", product: p });
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
        name: form.name,
        category_id: toNumber(form.category_id),
        sku: form.sku || undefined,
        variants: form.variants.map((row, i) => ({
          weight_grams: Math.max(1, Math.round(toNumber(row.weight_grams, 500))),
          price: toNumber(row.price, 0),
          mrp: row.mrp === "" ? undefined : toNumber(row.mrp, 0),
          stock: toNumber(row.stock, 0),
          sort_order: i,
        })),
        status: form.status,
        short_description: form.short_description || undefined,
        description: form.description || undefined,
        image_url: form.image_url || undefined,
        image2_url: form.image2_url || undefined,
        image3_url: form.image3_url || undefined,
        image4_url: form.image4_url || undefined,
        seo_title: form.seo_title || undefined,
        meta_description: form.meta_description || undefined,
        ingredients: form.ingredients || undefined,
        gst_rate: toNumber(form.gst_rate, 5),
        tags: form.tags ? form.tags.split(",").map((s) => s.trim()).filter(Boolean) : undefined,
      };

      if (modal?.mode === "edit" && modal.product?.id) {
        await api.updateProduct(modal.product.id, payload);
      } else {
        await api.createProduct(payload);
      }
      await refresh();
      closeModal();
    } catch (err) {
      setError(err?.message || "Save failed");
    } finally {
      setLoading(false);
    }
  }

  async function onImageFileChange(e, fieldKey = "image_url") {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setUploadingImage(true);
    try {
      const data = await api.uploadProductImage(file);
      if (data?.url) setForm((f) => ({ ...f, [fieldKey]: data.url }));
    } catch (err) {
      setError(err?.message || "Image upload failed");
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  }

  function addVariantRow() {
    setForm((f) => ({
      ...f,
      variants: [...f.variants, { weight_grams: "250", price: "0", mrp: "", stock: "0" }],
    }));
  }

  function removeVariantRow(index) {
    setForm((f) => {
      if (f.variants.length <= 1) return f;
      return { ...f, variants: f.variants.filter((_, i) => i !== index) };
    });
  }

  async function onDelete(id) {
    if (!confirm("Delete this product?")) return;
    setError("");
    try {
      await api.deleteProduct(id);
      await refresh();
    } catch (err) {
      setError(err?.message || "Delete failed");
    }
  }

  return (
    <div className="adminPage">
      <div className="adminPageTop">
        <div>
          <h1 className="adminPageTitle">Products</h1>
          <div className="muted">Listing with View / Edit / Delete actions.</div>
        </div>
      </div>

      {categories.length === 0 ? (
        <div className="error" style={{ marginTop: 12 }}>
          Please create at least one category first (Categories).
        </div>
      ) : null}

      <div className="adminTableWrap" style={{ marginTop: 14 }}>
        <div className="adminTableTop">
          <div className="adminTableTitle">Product listing</div>
          <button
            className="adminBtn adminBtnPrimary"
            type="button"
            disabled={categories.length === 0}
            onClick={openAdd}
          >
            + Add Product
          </button>
        </div>

        <table className="adminTable">
          <thead>
            <tr>
              <th style={{ width: 70 }}>ID</th>
              <th style={{ width: 92 }}>Image</th>
              <th>Name</th>
              <th style={{ width: 180 }}>Category</th>
              <th style={{ width: 120 }}>Price (range)</th>
              <th style={{ width: 90 }}>Options</th>
              <th style={{ width: 90 }}>Stock Σ</th>
              <th style={{ width: 110 }}>Status</th>
              <th style={{ width: 300, textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {!listLoading &&
              sortedProducts.map((p) => (
              <tr key={p.id}>
                <td className="muted">{p.id}</td>
                <td style={{ verticalAlign: "middle" }}>
                  <ProductThumb key={`${p.id}-${p.image_url || ""}`} url={p.image_url} />
                </td>
                <td style={{ fontWeight: 800 }}>
                  {p.name}
                  <div className="muted" style={{ marginTop: 2 }}>
                    {p.slug}
                  </div>
                </td>
                <td className="muted">{p.category_name}</td>
                <td className="muted">{formatVariantPriceRange(p)}</td>
                <td className="muted">{Array.isArray(p.variants) ? p.variants.length : "—"}</td>
                <td className="muted">{p.stock}</td>
                <td className="muted">{p.status}</td>
                <td>
                  <div className="adminActions">
                    <button className="adminBtn" type="button" onClick={() => openView(p)}>
                      View
                    </button>
                    <button className="adminBtn" type="button" onClick={() => openEdit(p)}>
                      Edit
                    </button>
                    <button className="adminBtn" type="button" onClick={() => onDelete(p.id)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {listLoading ? (
              <tr>
                <td className="muted" colSpan={9} style={{ padding: 24, textAlign: "center" }}>
                  Loading…
                </td>
              </tr>
            ) : sortedProducts.length === 0 ? (
              <tr>
                <td className="muted" colSpan={9}>
                  No products yet. Click “Add Product”.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
        <AdminPagination
          page={page}
          total={total}
          limit={pageSize}
          disabled={listLoading}
          onPageChange={setPage}
          onLimitChange={handlePageSizeChange}
        />
      </div>

      {error ? <div className="error">{error}</div> : null}

      {modal ? (
        <div className="adminModalOverlay" role="dialog" aria-modal="true" onMouseDown={closeModal}>
          <div className="adminModal" onMouseDown={(e) => e.stopPropagation()} style={{ width: "min(760px, calc(100vw - 32px))" }}>
            <div className="adminModalTop">
              <div>
                <h2 className="adminModalTitle">
                  {modal.mode === "view"
                    ? "View product"
                    : modal.mode === "edit"
                      ? "Edit product"
                      : "Add product"}
                </h2>
                <div className="muted">
                  {modal.mode === "view" ? "Details" : "Fill product details and save."}
                </div>
              </div>
              <button className="adminBtn" type="button" onClick={closeModal}>
                Close
              </button>
            </div>

            <div className="adminModalBody">
              {modal.mode === "view" ? (
                <div className="adminPanel">
                  <div className="adminViewProductImageBlock">
                    <div className="muted" style={{ marginBottom: 8 }}>
                      Product image
                    </div>
                    <div className="adminViewProductImageWrap">
                      <ViewProductImage url={modal.product?.image_url} />
                    </div>
                  </div>
                  <div className="adminGrid2">
                    <div>
                      <div className="muted">Name</div>
                      <div style={{ fontWeight: 850 }}>{modal.product?.name}</div>
                      <div style={{ height: 10 }} />
                      <div className="muted">Category</div>
                      <div style={{ fontWeight: 850 }}>{modal.product?.category_name}</div>
                      <div style={{ height: 10 }} />
                      <div className="muted">SKU</div>
                      <div style={{ fontWeight: 850 }}>{modal.product?.sku || "-"}</div>
                    </div>
                    <div>
                      <div className="muted">Price range (₹)</div>
                      <div style={{ fontWeight: 850 }}>{formatVariantPriceRange(modal.product || {})}</div>
                      <div style={{ height: 10 }} />
                      <div className="muted">Total stock</div>
                      <div style={{ fontWeight: 850 }}>{modal.product?.stock ?? "—"}</div>
                      <div style={{ height: 10 }} />
                      <div className="muted">GST Rate (%)</div>
                      <div style={{ fontWeight: 850 }}>{modal.product?.gst_rate ?? "5"}%</div>
                    </div>
                  </div>
                  {Array.isArray(modal.product?.variants) && modal.product.variants.length > 0 ? (
                    <div style={{ marginTop: 16 }}>
                      <div className="muted" style={{ marginBottom: 8 }}>
                        Weight &amp; price options
                      </div>
                      <table className="adminTable">
                        <thead>
                          <tr>
                            <th>Weight (g)</th>
                            <th>Price</th>
                            <th>MRP</th>
                            <th>Stock</th>
                          </tr>
                        </thead>
                        <tbody>
                          {modal.product.variants.map((v) => (
                            <tr key={v.id}>
                              <td>{v.weight_grams}</td>
                              <td>{v.price}</td>
                              <td>{v.mrp ?? "—"}</td>
                              <td>{v.stock}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : null}
                  <div style={{ height: 10 }} />
                  <div className="muted">Status</div>
                  <div style={{ fontWeight: 850 }}>{modal.product?.status}</div>
                  <div style={{ height: 10 }} />
                  <div className="muted">Short description</div>
                  <div style={{ fontWeight: 650 }}>{modal.product?.short_description || "-"}</div>
                  <div style={{ height: 10 }} />
                  <div className="muted">Description</div>
                  <div style={{ fontWeight: 650, whiteSpace: "pre-wrap", maxHeight: 120, overflow: "auto" }}>{modal.product?.description || "-"}</div>
                  <div style={{ height: 10 }} />
                  <div className="muted">SEO title</div>
                  <div style={{ fontWeight: 650 }}>{modal.product?.seo_title || "-"}</div>
                  <div style={{ height: 10 }} />
                  <div className="muted">Meta description</div>
                  <div style={{ fontWeight: 650 }}>{modal.product?.meta_description || "-"}</div>
                  <div style={{ height: 10 }} />
                  <div className="muted">Ingredients</div>
                  <div style={{ fontWeight: 650, whiteSpace: "pre-wrap", maxHeight: 80, overflow: "auto" }}>{modal.product?.ingredients || "-"}</div>
                  <div className="label" style={{ marginTop: 8 }}>Tags</div>
                  <div style={{ fontWeight: 650 }}>{Array.isArray(modal.product?.tags) ? modal.product.tags.join(", ") : (modal.product?.tags || "-")}</div>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="adminPanel" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div className="adminProductFormGrid">
                    <div className="field" style={{ margin: 0 }}>
                      <div className="label">Name</div>
                      <input
                        className="input"
                        value={form.name}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                        required
                        autoFocus
                      />
                    </div>
                    <div className="field" style={{ margin: 0 }}>
                      <div className="label">Category</div>
                      <select
                        className="input"
                        value={form.category_id}
                        onChange={(e) => setForm((f) => ({ ...f, category_id: e.target.value }))}
                        required
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={String(c.id)}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="field" style={{ margin: 0 }}>
                      <div className="label">SKU (optional)</div>
                      <input
                        className="input"
                        value={form.sku}
                        onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))}
                      />
                    </div>
                    <div className="field" style={{ margin: 0 }}>
                      <div className="label">GST Rate (%)</div>
                      <input
                        className="input"
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.gst_rate}
                        onChange={(e) => setForm((f) => ({ ...f, gst_rate: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="field" style={{ margin: 0 }}>
                    <div className="label">Weight &amp; price options</div>
                    <div className="muted" style={{ fontSize: 12, marginBottom: 8 }}>
                      One row per pack size. Price is for that pack; ₹/kg is derived automatically on the storefront.
                    </div>
                    <div style={{ overflowX: "auto" }}>
                      <table className="adminTable" style={{ minWidth: 520 }}>
                        <thead>
                          <tr>
                            <th>Weight (g)</th>
                            <th>Price (₹)</th>
                            <th>MRP</th>
                            <th>Stock</th>
                            <th style={{ width: 88 }} />
                          </tr>
                        </thead>
                        <tbody>
                          {form.variants.map((row, idx) => (
                            <tr key={idx}>
                              <td>
                                <input
                                  className="input"
                                  type="number"
                                  min="1"
                                  step="1"
                                  required
                                  value={row.weight_grams}
                                  onChange={(e) =>
                                    setForm((f) => {
                                      const next = [...f.variants];
                                      next[idx] = { ...next[idx], weight_grams: e.target.value };
                                      return { ...f, variants: next };
                                    })
                                  }
                                />
                              </td>
                              <td>
                                <input
                                  className="input"
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  required
                                  value={row.price}
                                  onChange={(e) =>
                                    setForm((f) => {
                                      const next = [...f.variants];
                                      next[idx] = { ...next[idx], price: e.target.value };
                                      return { ...f, variants: next };
                                    })
                                  }
                                />
                              </td>
                              <td>
                                <input
                                  className="input"
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={row.mrp}
                                  onChange={(e) =>
                                    setForm((f) => {
                                      const next = [...f.variants];
                                      next[idx] = { ...next[idx], mrp: e.target.value };
                                      return { ...f, variants: next };
                                    })
                                  }
                                />
                              </td>
                              <td>
                                <input
                                  className="input"
                                  type="number"
                                  min="0"
                                  step="1"
                                  value={row.stock}
                                  onChange={(e) =>
                                    setForm((f) => {
                                      const next = [...f.variants];
                                      next[idx] = { ...next[idx], stock: e.target.value };
                                      return { ...f, variants: next };
                                    })
                                  }
                                />
                              </td>
                              <td>
                                <button type="button" className="adminBtn" onClick={() => removeVariantRow(idx)}>
                                  Remove
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <button type="button" className="adminBtn" style={{ marginTop: 8 }} onClick={addVariantRow}>
                      + Add weight option
                    </button>
                  </div>

                  <div className="adminProductFormGrid adminProductFormGrid--tight">
                    <div className="field" style={{ margin: 0 }}>
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

                  <div className="field" style={{ margin: 0 }}>
                    <div className="label">Short description (optional)</div>
                    <input
                      className="input"
                      value={form.short_description}
                      onChange={(e) => setForm((f) => ({ ...f, short_description: e.target.value }))}
                    />
                  </div>

                  {[
                    { key: "image_url", label: "Primary Product Image" },
                    { key: "image2_url", label: "Product Image 2 (optional)" },
                    { key: "image3_url", label: "Product Image 3 (optional)" },
                    { key: "image4_url", label: "Product Image 4 (optional)" },
                  ].map(({ key, label }) => (
                    <div className="field" style={{ margin: 0, marginTop: 8 }} key={key}>
                      <div className="label">{label}</div>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/gif,image/webp"
                        className="input"
                        disabled={uploadingImage || loading}
                        onChange={(e) => onImageFileChange(e, key)}
                      />
                      <div className="muted" style={{ fontSize: 12, marginTop: 6 }}>
                         {uploadingImage ? "Uploading…" : "JPEG, PNG, GIF, WebP · max 5 MB"}
                      </div>
                      {form[key] ? (
                        <div style={{ marginTop: 10 }}>
                          <img
                            src={resolveAdminMediaUrl(form[key]) || form[key]}
                            alt=""
                            className="adminImagePreview"
                          />
                        </div>
                      ) : null}
                    </div>
                  ))}

                  <div className="field" style={{ margin: 0 }}>
                    <div className="label">Description (optional)</div>
                    <textarea
                      className="input"
                      rows={4}
                      value={form.description}
                      onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                      style={{ resize: "vertical", maxWidth: "100%", boxSizing: "border-box" }}
                    />
                  </div>

                  <div className="adminProductFormGrid">
                    <div className="field" style={{ margin: 0 }}>
                      <div className="label">SEO title (optional)</div>
                      <input
                        className="input"
                        value={form.seo_title}
                        onChange={(e) => setForm((f) => ({ ...f, seo_title: e.target.value }))}
                      />
                    </div>
                    <div className="field" style={{ margin: 0 }}>
                      <div className="label">Meta description (optional)</div>
                      <input
                        className="input"
                        value={form.meta_description}
                        onChange={(e) => setForm((f) => ({ ...f, meta_description: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="field" style={{ margin: 0 }}>
                    <div className="label">Ingredients (optional)</div>
                    <textarea
                      className="input"
                      rows={3}
                      value={form.ingredients}
                      onChange={(e) => setForm((f) => ({ ...f, ingredients: e.target.value }))}
                      style={{ resize: "vertical", maxWidth: "100%", boxSizing: "border-box" }}
                    />
                  </div>

                  <div className="field" style={{ margin: 0 }}>
                    <div className="label">Tags (optional, comma-separated)</div>
                    <input
                      className="input"
                      value={form.tags}
                      onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
                      placeholder="Medium spicy, Red chilli, Mustard Oil"
                    />
                  </div>

                  <div style={{ display: "flex", gap: 10, marginTop: 4, flexWrap: "wrap" }}>
                    <button className="adminBtn adminBtnPrimary" disabled={loading || uploadingImage} type="submit">
                      Save
                    </button>
                    <button className="adminBtn" disabled={loading || uploadingImage} type="button" onClick={closeModal}>
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

