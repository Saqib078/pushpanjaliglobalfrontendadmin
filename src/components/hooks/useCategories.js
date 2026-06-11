import { useState, useEffect } from "react";
import { api } from "../../lib/api";
import { authApi } from "../../lib/authapi";


export function useCategories(page, pageSize) {
    const [items, setItems] = useState([]);

    // const [total, setTotal] = useState(0);

    const [listLoading, setListLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    async function refresh() {
        setError("");
        setListLoading(true);

        try {
            const data =
                await authApi.listCategories();
            console.log(data.data)
            if (data.success) {
                setItems(data.data || []);
            }

        } catch (err) {
            setError(
                err?.message ||
                "Failed to load categories"
            );
        } finally {
            setListLoading(false);
        }
    }

    async function deleteCategory(id) {
        try {
            await api.deleteCategory(id);

            await refresh();
        } catch (err) {
            setError(
                err?.message ||
                "Delete failed"
            );
        }
    }

    useEffect(() => {
        refresh();
    }, []);

    return {
        items,
        listLoading,

        error,
        setError,

        refresh,
        deleteCategory,
    };
}