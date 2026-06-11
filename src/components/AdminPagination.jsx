/**
 * Server-backed listing pagination (page, total, limit).
 */
const PAGE_SIZE_OPTIONS = [10, 20, 40, 80];

export default function AdminPagination({
  page,
  total,
  limit,
  onPageChange,
  onLimitChange,
  disabled,
  pageSizeOptions = PAGE_SIZE_OPTIONS,
}) {
  const totalPages = Math.max(1, Math.ceil(total / limit) || 1);
  const safePage = Math.min(Math.max(1, page), totalPages);
  const from = total === 0 ? 0 : (safePage - 1) * limit + 1;
  const to = Math.min(safePage * limit, total);

  return (
    <div className="adminPagination">
      <div className="adminPaginationRow">
        {typeof onLimitChange === "function" ? (
          <label className="adminPaginationLabel">
            <span className="muted">Rows per page</span>
            <select
              className="input adminPaginationSelect"
              value={limit}
              disabled={disabled}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              aria-label="Rows per page"
            >
              {pageSizeOptions.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <span />
        )}

        <div className="adminPaginationInfo muted">
          Showing <strong style={{ color: "var(--text)" }}>{from}</strong>–
          <strong style={{ color: "var(--text)" }}>{to}</strong> of{" "}
          <strong style={{ color: "var(--text)" }}>{total}</strong>
        </div>

        <div className="adminPaginationBtns">
          <button
            type="button"
            className="adminBtn"
            disabled={disabled || safePage <= 1}
            onClick={() => onPageChange(safePage - 1)}
          >
            Previous
          </button>
          <span className="muted" style={{ fontSize: 13 }}>
            Page {safePage} / {totalPages}
          </span>
          <button
            type="button"
            className="adminBtn"
            disabled={disabled || safePage >= totalPages || total === 0}
            onClick={() => onPageChange(safePage + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
