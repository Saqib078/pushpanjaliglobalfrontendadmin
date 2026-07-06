import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { authApi } from "../../lib/authapi";
import InstagramForm from "./InstagramForm";

const InstagramEdit = () => {

    const navigate = useNavigate();

    const { id } = useParams();

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [initialData, setInitialData] = useState(null);

    useEffect(() => {

        if (id) {
            getInstagramReel();
        }

    }, [id]);

    const getInstagramReel = async () => {

        try {

            setLoading(true);

            const response =
                await authApi.getInstagramReelById(id);

            setInitialData(response.data);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    };

    const handleSubmit = async (payload) => {

        try {

            setSaving(true);

            await authApi.updateInstagramReel(
                id,
                payload
            );

            navigate("/admin/instagram");

        } catch (error) {

            console.error(error);

            alert(error.message);

        } finally {

            setSaving(false);

        }

    };

    if (loading) {

        return (
            <div className="text-center py-20">
                Loading...
            </div>
        );

    }

    return (

        <InstagramForm

            mode="edit"

            initialData={initialData}

            loading={saving}

            onSubmit={handleSubmit}

        />

    );

};

export default InstagramEdit;