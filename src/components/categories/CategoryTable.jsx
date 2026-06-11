import AdminPagination from "../AdminPagination";
import { resolveAdminMediaUrl } from "../../lib/resolveMediaUrl";
import { useNavigate } from "react-router-dom";

export default function CategoryTable({
  items,
  listLoading,
  onView,
  onEdit,
  onDelete,
}) {
  const navigate = useNavigate();
  return (
    <div className="adminTableWrap" style={{ marginTop: 14 }}>
      <table className="adminTable">
        <thead>
          <tr>
            <th>NAME</th>
            <th>Image</th>
            <th>IsActive</th>
            <th>Slug</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {!listLoading &&
            items.map((cat) => (
              <tr key={cat.id}>
                <td>{cat.name}</td>

                <td>
                  {cat.thumbnail ? (
                    <img
                      src={`https://pushpanjaliglobal.com${cat.thumbnail}`}
                      alt=""
                      style={{
                        width: 40,
                        height: 40,
                        objectFit: "cover",
                      }}
                    />
                  ) : null}
                </td>

                <td>{cat.is_active ? "True" : "false"}</td>

                <td>{cat.slug}</td>

                <td>
                  <button onClick={() =>
                    navigate(
                      `/categories/${cat.slug}`
                    )
                  }>
                    View
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}