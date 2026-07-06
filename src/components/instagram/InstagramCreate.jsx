import { useState } from "react";
import { useNavigate } from "react-router-dom";

import InstagramForm from "./InstagramForm";
import { authApi } from "../../lib/authapi";

const InstagramCreate = () => {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (payload) => {

        try {

            setLoading(true);

            await authApi.createInstagramReel(payload);

            navigate("/admin/instagram");

        } catch (error) {

            console.error(error);

            alert(error.message);

        } finally {

            setLoading(false);

        }

    };

    return (

        <InstagramForm

            mode="create"

            loading={loading}

            onSubmit={handleSubmit}

        />

    );

};

export default InstagramCreate;