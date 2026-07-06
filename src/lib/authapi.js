const API_URL = "https://pushpanjaliglobal.com/api";

async function refreshAccessToken() {

    console.log("REFRESH TOKEN CALLED");

    const response = await fetch(
        `${API_URL}/user/refresh`,
        {
            method: "POST",

            credentials: "include",
        }
    );

    if (!response.ok) {

        throw new Error(
            "Session expired"
        );
    }
}

async function request(
    path,
    options = {}
) {

    const isFormData =
        options.body instanceof FormData;

    let response = await fetch(
        `${API_URL}${path}`,
        {
            ...options,

            credentials: "include",

            headers: {
                ...(isFormData
                    ? {}
                    : {
                        "Content-Type":
                            "application/json",
                    }),

                ...(options.headers || {}),
            },
        }
    );

    // access token expired
    if (response.status === 401) {

        console.log(
            "ACCESS TOKEN EXPIRED"
        );

        try {

            // generate new access token
            await refreshAccessToken();

            // retry original request
            response = await fetch(
                `${API_URL}${path}`,
                {
                    ...options,

                    credentials:
                        "include",

                    headers: {
                        ...(isFormData
                            ? {}
                            : {
                                "Content-Type":
                                    "application/json",
                            }),

                        ...(options.headers || {}),
                    },
                }
            );

        } catch (err) {

            throw new Error(
                "Session expired"
            );
        }
    }

    // const data =
    //     await response.json();

    // if (!response.ok) {

    //     throw new Error(
    //         data.message ||
    //         "Request failed"
    //     );
    // }

    //  if (options.responseType === "blob") {
    //     return {
    //         blob: await response.blob()
    //     };
    // }

    if (!response.ok) {

        const data =
            await response.json();

        throw new Error(
            data.message ||
            "Request failed"
        );
    }

    if (options.responseType === "blob") {
        return {
            blob: await response.blob()
        };
    }

    const data =
        await response.json();

    return data;

    // return data;
}

export const authApi = {

    // send otp
    sendlogin: (email) =>
        request("/admin/login", {
            method: "POST",

            body: JSON.stringify({
                email,
            }),
        }),

    // verify otp
    verifyOtp: (otp_id, otp) =>
        request(
            "/admin/otp/verify",
            {
                method: "POST",


                body: JSON.stringify({
                    otp_id,
                    otp,
                }),
            }
        ),

    // current logged in admin
    me: () =>
        request("/admin/me"),

    // logout
    logout: () =>
        request("/user/logout", {
            method: "POST",
        }),

    // refresh access token
    refreshToken: () =>
        request(
            "/user/refresh",
            {
                method: "POST",
            }
        ),

    // create category
    createCategory: (payload) =>
        request(
            "/admin/product/category",
            {
                method: "POST",

                body: payload,
            }
        ),

    listCategories: () =>
        request(
            "/admin/product/categories",
            {
                method: "GET",
            }
        ),

    getCategoryBySlug: (slug) =>
        request(
            `/admin/product/category/${slug}`,
            {
                method: "GET",
            }
        ),

    updateCategory: (slug, payload) =>
        request(
            `/admin/product/category/update/${slug}`,
            {
                method: "PATCH",
                body: payload,
            }
        ),

    deleteCategory: (slug) =>
        request(
            `/admin/product/category/delete/${slug}`,
            {
                method: "DELETE",
            }
        ),

    getCatalogProducts: (slug) =>
        request(
            `/admin/product/categories/${slug}`
        ),

    createProduct: (payload) =>
        request(
            "/admin/product/create",
            {
                method: "POST",
                body: payload,
            }
        ),

    getProductBySlug: (slug) =>
        request(
            `/admin/product/slug/${slug}`,
            {
                method: "GET",
            }
        ),

    createProductMedia: (payload) =>
        request(
            "/admin/product/create/media",
            {
                method: "PATCH",
                body: payload,
            }
        ),

    updateProduct: (id, payload) =>
        request(
            `/admin/product/update/${id}`,
            {
                method: "POST",
                body: payload,
            }
        ),


    getProductMediaByProductId: (
        productId
    ) =>
        request(
            `/admin/product/media/product/${productId}`,
            {
                method: "GET",
            }
        ),

    updateProductMedia: (
        mediaId,
        payload
    ) =>
        request(
            `/admin/product/media/update/${mediaId}`,
            {
                method: "PATCH",
                body: payload,
            }
        ),

    deleteProductMediaFile: (
        mediaId,
        payload
    ) =>
        request(
            `/admin/product/media/file/delete/${mediaId}`,
            {
                method: "DELETE",
                body: JSON.stringify(payload),
            }
        ),
    deleteProduct: (id) =>
        request(
            `/admin/product/delete/${id}`,
            {
                method: "DELETE",
            }
        ),

    getOrders: () =>
        request(
            "/admin/order/delivery",
            {
                method: "GET",
            }
        ),

    getInvoice: (orderId) =>
        request(
            `/admin/order/invoice/${orderId}`,
            {
                method: "GET",
                responseType: "blob",
            }
        ),

    createCourier: (data) =>
        request(
            "/admin/order/delivery",
            {
                method: "POST",
                body: JSON.stringify(data),
            }
        ),

    getCourierByOrderNumber: (orderNumber) =>
        request(
            `/admin/order/courier/${orderNumber}`,
            {
                method: "GET",
            }
        ),

    updateCourier: (orderNumber, data) =>
        request(
            `/admin/order/courier/${orderNumber}`,
            {
                method: "PATCH",
                body: JSON.stringify(data),
            }
        ),

    updateStatus: (orderNumber, data) =>
        request(
            `/admin/order/orderstatus/${orderNumber}`,
            {
                method: "PATCH",
                body: JSON.stringify(data),
            }
        ),

    getemailTrackingurl: (orderNumber) =>
        request(
            `/admin/order/emaildelivery/${orderNumber}`,
            {
                method: "GET",
            }
        ),

    getProductInformation: (productId) =>
        request(
            `/admin/product-information/${productId}`,
            {
                method: "GET",
            }
        ),

    createProductInformation: (payload) =>
        request(
            "/admin/product-information",
            {
                method: "POST",
                body: JSON.stringify(payload),
            }
        ),

    updateProductInformation: (productId, payload) =>
        request(
            `/admin/product-information/${productId}`,
            {
                method: "PATCH",
                body: JSON.stringify(payload),
            }
        ),
};