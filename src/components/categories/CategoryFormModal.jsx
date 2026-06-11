import { useState } from "react";
import { resolveAdminMediaUrl } from "../../lib/resolveMediaUrl";

export default function CategoryFormModal({
  form,
  setForm,
  loading,
  onSave,
  onClose,
}) {

  const [keywordInput, setKeywordInput] = useState("");
  return (
    <div
      className="adminModalOverlay"
      role="dialog"
      aria-modal="true"
      onMouseDown={onClose}
    >
      <div
        className="adminModal"
        onMouseDown={(e) =>
          e.stopPropagation()
        }
      >
        <div className="adminModalTop">
          <div>
            <h2 className="adminModalTitle">
              Add category
            </h2>

            <div className="muted">
              Name will generate a slug
              automatically.
            </div>
          </div>

          <button
            className="adminBtn"
            type="button"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <div className="adminModalBody">
          <form
            onSubmit={onSave}
            className="adminPanel"
          >
            {/* NAME */}
            <div className="field">
              <div className="label">
                Category Name
              </div>

              <input
                className="input"
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,

                    name:
                      e.target.value,
                  }))
                }
                required
              />
            </div>

            {/* IMAGE */}
            <div
              className="field"
              style={{ marginTop: 12 }}
            >
              <div className="label">
                Thumbnail
              </div>

              <input
                className="input"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file =
                    e.target.files?.[0];

                  if (!file) return;

                  setForm((prev) => ({
                    ...prev,

                    thumbnail: file,
                  }));
                }}
              />
            </div>

            {/* META TITLE */}
            <div
              className="field"
              style={{ marginTop: 12 }}
            >
              <div className="label">
                Meta Title
              </div>

              <input
                className="input"
                value={
                  form.seo.meta_title
                }
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,

                    seo: {
                      ...prev.seo,

                      meta_title:
                        e.target
                          .value,
                    },
                  }))
                }
              />
            </div>

            {/* META DESCRIPTION */}
            <div
              className="field"
              style={{ marginTop: 12 }}
            >
              <div className="label">
                Meta Description
              </div>

              <textarea
                className="input"
                value={
                  form.seo
                    .meta_description
                }
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,

                    seo: {
                      ...prev.seo,

                      meta_description:
                        e.target
                          .value,
                    },
                  }))
                }
              />
            </div>

            {/* KEYWORDS */}
            <div
              className="field"
              style={{ marginTop: 12 }}
            >
              <div className="label">
                Keywords
              </div>

              <input
                className="input"
                placeholder="shirt, fashion"

                value={keywordInput}

                onChange={(e) => {

                  const value =
                    e.target.value;

                  setKeywordInput(value);

                  setForm((prev) => ({
                    ...prev,

                    seo: {
                      ...prev.seo,

                      keywords: value
                        .split(",")
                        .map((k) => k.trim())
                        .filter(Boolean),
                    },
                  }));
                }}
              />

            </div>

            {/* ACTIONS */}
            <div
              style={{
                display: "flex",
                gap: 10,
                marginTop: 16,
              }}
            >
              <button
                className="adminBtn adminBtnPrimary"
                type="submit"
                disabled={loading}
              >
                Save
              </button>

              <button
                className="adminBtn"
                type="button"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}