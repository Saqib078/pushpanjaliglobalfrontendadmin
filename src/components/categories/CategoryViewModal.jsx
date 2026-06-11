import { resolveAdminMediaUrl } from "../../lib/resolveMediaUrl";

export default function CategoryViewModal({
  category,
  onClose,
}) {
  return (
    <div
      className="adminModalOverlay"
      onMouseDown={onClose}
    >
      <div
        className="adminModal"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h2>View Category</h2>

        <div>{category?.name}</div>

        <div>{category?.slug}</div>

        {category?.image_url ? (
          <img
            src={
              resolveAdminMediaUrl(category.image_url)
            }
            alt=""
          />
        ) : null}
      </div>
    </div>
  );
}