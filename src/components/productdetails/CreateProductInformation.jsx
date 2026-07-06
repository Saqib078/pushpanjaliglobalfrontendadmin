import { useState } from "react";
import axios from "axios";
import ProductInformationForm from "./ProductInformationForm";

const CreateProductInformation = () => {

    const [loading, setLoading] = useState(false);

    const handleCreate = async (formData) => {

        try {

            setLoading(true);

            const response = await axios.post(
                "/api/admin/product-information",
                formData
            );

            console.log(response.data);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    };

    return (
        <ProductInformationForm
            mode="create"
            loading={loading}
            onSubmit={handleCreate}
        />
    );
};

export default CreateProductInformation;