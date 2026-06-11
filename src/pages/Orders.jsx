import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { resolveAdminMediaUrl } from "../lib/resolveMediaUrl";
import AdminPagination from "../components/AdminPagination";
import { authApi } from "../lib/authapi";
import { Link } from "react-router-dom";

const FULFILLMENT_STATUSES = [
  { value: "processing", label: "Processing" },
  { value: "ready_to_ship", label: "Ready to ship" },
  { value: "handed_to_carrier", label: "Handed to delivery company" },
  { value: "in_transit", label: "In transit" },
  { value: "out_for_delivery", label: "Out for delivery" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
  { value: "returned", label: "Returned" },
];

function formatDt(v) {
  if (!v) return "—";
  try {
    return new Date(v).toLocaleString();
  } catch {
    return String(v);
  }
}

function formatTrackingEventDate(dateStr, timeStr) {
  const d = String(dateStr || "").trim();
  if (!/^\d{8}$/.test(d)) return "—";
  const dd = d.slice(0, 2);
  const mm = d.slice(2, 4);
  const yyyy = d.slice(4, 8);
  const t = String(timeStr || "").trim();
  let hh = "00";
  let mi = "00";
  if (/^\d{4,6}$/.test(t)) {
    const norm = t.padStart(4, "0");
    hh = norm.slice(0, 2);
    mi = norm.slice(2, 4);
  }
  return `${dd}/${mm}/${yyyy} ${hh}:${mi}`;
}

function OrderItemImage({ imageUrl }) {
  const [failed, setFailed] = useState(false);
  // const url = resolveAdminMediaUrl(imageUrl);
  const url = `https://pushpanjaliglobal.com${imageUrl}`
  console.log(url)
  if (!url || failed) {
    return (
      <div className="adminOrderDetailItemPlaceholder" aria-hidden>
        No image
      </div>
    );
  }
  return (
    <img
      src={url}
      alt=""
      className="adminOrderDetailItemImg"
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}

function orderChannelRef(orderId) {
  return `PJ${orderId}`;
}

export default function Orders() {
  /** @type {'all' | 'delivery'} */
  const [activeTab, setActiveTab] = useState("all");
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [listLoading, setListLoading] = useState(false);
  const [labelLoadingOrderId, setLabelLoadingOrderId] = useState(null);
  const [invoiceLoadingOrderId, setInvoiceLoadingOrderId] = useState(null);
  const [trackingLoadingOrderId, setTrackingLoadingOrderId] = useState(null);
  const [trackingByOrderId, setTrackingByOrderId] = useState({});
  const [error, setError] = useState("");
  const [statusOrderId, setStatusOrderId] = useState(null);
  const [orderStatus, setOrderStatus] = useState("new");
  const [loading, setLoading] = useState(false);
  /** @type {null | { mode: 'detail' | 'fulfillment', order: object }} */
  const [modal, setModal] = useState(null);
  const [orders2, setOrders2] = useState([])
  const [deliveryData, setDeliveryData] = useState(null);
  const [form, setForm] = useState({
    status: "pending",
    courierName: "",
    trackingNumber: "",
    awbCode: "",
    shippingProvider: "Shiprocket",
    trackingUrl: "",
  });

  // async function refresh() {
  //   setError("");
  //   setListLoading(true);
  //   try {
  //     const data = await api.listCustomerOrders(page, pageSize);
  //     const list = data.orders || [];
  //     const totalCount = Number(data.total ?? 0);
  //     if (list.length === 0 && totalCount > 0 && page > 1) {
  //       setPage((p) => p - 1);
  //       return;
  //     }
  //     setOrders(list);
  //     setTotal(totalCount);
  //     if (totalCount === 0) setPage(1);
  //   } catch (err) {
  //     setError(err?.message || "Failed to load orders");
  //   } finally {
  //     setListLoading(false);
  //   }
  // }

  async function refresh2() {
    setError("");
    setListLoading(true);

    try {
      const data = await authApi.getOrders();

      setOrders(data.orders || data.data || data);
      console.log(data)
    } catch (err) {
      setError(err?.message || "Failed to load orders");
    } finally {
      setListLoading(false);
    }
  }

  useEffect(() => {
    refresh2();
  }, []);

  // useEffect(() => {
  //   refresh();
  // }, [page, pageSize]);

  function handlePageSizeChange(n) {
    setPageSize(n);
    setPage(1);
  }

  function initFulfillmentForm(o) {
    setForm({
      fulfillmentStatus: o.fulfillment_status || "processing",
      carrierName: o.carrier_name || "",
      carrierTrackingNumber: o.carrier_tracking_number || "",
      carrierReference: o.carrier_reference || "",
      trackingUrl: o.tracking_url || "",
      fulfillmentNotes: o.fulfillment_notes || "",
    });
  }

  function openDetail(o) {
    setError("");
    setModal({ mode: "detail", order: o });
    openCourierModal(o);
  }

  function openFulfillment(o) {
    setError("");
    initFulfillmentForm(o);
    setModal({ mode: "fulfillment", order: o });
    openCourierModal(o);
  }

  const openCourierModal = async (order) => {
    try {
      setLoading(true);
      console.log("courier")

      const response = await authApi.getCourierByOrderNumber(
        order.orderNumber
      );

      console.log("courier", response)

      setDeliveryData(response.courier || null);

      setForm({
        courierName: response?.courier?.courierName || "",
        trackingNumber: response?.courier?.trackingNumber || "",
        awbCode: response?.courier?.awbCode || "",
        trackingUrl: response?.courier?.trackingUrl || "",
      });

    } catch (error) {

      setDeliveryData(null);

      setForm({
        courierName: "",
        trackingNumber: "",
        awbCode: "",
        trackingUrl: "",
      });

    } finally {
      setLoading(false);
    }
  };

  function closeModal() {
    setModal(null);
  }

  function goToFulfillmentFromDetail() {
    if (!modal?.order) return;
    openFulfillment(modal.order);
  }

  // async function onSaveFulfillment(e) {
  //   e.preventDefault();
  //   if (!modal?.order?._id) return;
  //   setLoading(true);
  //   setError("");
  //   try {
  //     const id = modal.order._id;
  //     const payload = {
  //       fulfillmentStatus: form.fulfillmentStatus,
  //       carrierName: form.carrierName.trim() || null,
  //       carrierTrackingNumber: form.carrierTrackingNumber.trim() || null,
  //       carrierReference: form.carrierReference.trim() || null,
  //       trackingUrl: form.trackingUrl.trim() || null,
  //       fulfillmentNotes: form.fulfillmentNotes.trim() || null,
  //     };
  //     if (
  //       ["ready_to_ship", "handed_to_carrier", "in_transit", "out_for_delivery", "delivered"].includes(
  //         form.fulfillmentStatus
  //       ) &&
  //       !modal.order.shipped_at
  //     ) {
  //       payload.shippedAt = new Date().toISOString();
  //     }
  //     if (form.fulfillmentStatus === "delivered" && !modal.order.delivered_at) {
  //       payload.deliveredAt = new Date().toISOString();
  //     }
  //     await api.updateCustomerOrderFulfillment(id, payload);
  //     await refresh();
  //     closeModal();
  //   } catch (err) {
  //     setError(err?.message || "Save failed");
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  // async function onSaveFulfillment(e) {
  //   e.preventDefault();

  //   if (!modal?.order?.orderNumber) return;

  //   setLoading(true);
  //   setError("");

  //   try {
  //     const payload = {
  //       orderNumber: modal.order.orderNumber,
  //       courierName: form.courierName.trim(),
  //       trackingNumber: form.trackingNumber.trim(),
  //       trackingUrl: form.trackingUrl.trim(),
  //       awbCode: form.awbCode.trim(),
  //       shippingProvider: "Shiprocket",
  //       status: "booked",
  //     };

  //     await authApi.createCourier(payload);
  //     // await refresh();
  //     closeModal();
  //   } catch (err) {
  //     setError(
  //       err?.response?.data?.message ||
  //       err?.message ||
  //       "Failed to save courier"
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // }
  async function onSaveFulfillment(e) {
    e.preventDefault();

    if (!modal?.order?.orderNumber) return;

    setLoading(true);
    setError("");

    try {
      const payload = {};

      if (form.courierName?.trim()) {
        payload.courierName = form.courierName.trim();
      }

      if (form.trackingNumber?.trim()) {
        payload.trackingNumber = form.trackingNumber.trim();
      }

      if (form.trackingUrl?.trim()) {
        payload.trackingUrl = form.trackingUrl.trim();
      }

      if (form.awbCode?.trim()) {
        payload.awbCode = form.awbCode.trim();
      }

      if (deliveryData) {
        await authApi.updateCourier(
          modal.order.orderNumber,
          payload
        );
      } else {
        await authApi.createCourier({
          orderNumber: modal.order.orderNumber,
          ...payload,
          shippingProvider: "Shiprocket",
          status: "booked",
        });
      }

      closeModal();

    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to save courier"
      );
    } finally {
      setLoading(false);
    }
  }

  // async function onPrintLabel(order, e) {
  //   if (e) e.stopPropagation();
  //   const orderId = Number(order?.id);
  //   if (!Number.isFinite(orderId)) return;
  //   setError("");
  //   setLabelLoadingOrderId(orderId);
  //   try {
  //     const referenceNumber = String(order?.carrier_tracking_number || order?.carrier_reference || "").trim();
  //     const { blob, fileName } = await api.printCustomerOrderLabel(orderId, {
  //       referenceNumber: referenceNumber || undefined,
  //     });
  //     const url = URL.createObjectURL(blob);
  //     const opened = window.open(url, "_blank", "noopener,noreferrer");
  //     if (!opened) {
  //       const a = document.createElement("a");
  //       a.href = url;
  //       a.download = fileName;
  //       document.body.appendChild(a);
  //       a.click();
  //       a.remove();
  //     }
  //     window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
  //   } catch (err) {
  //     setError(err?.message || "Failed to load shipping label");
  //   } finally {
  //     setLabelLoadingOrderId(null);
  //   }
  // }

  // async function onPrintInvoice(order, e) {
  //   console.log("order", order)
  //   if (e) e.stopPropagation();
  //   const orderId = order?.orderNumber;

  //   setError("");
  //   setInvoiceLoadingOrderId(orderId);
  //   try {
  //     console.log("hello")
  //     const {blob} = await authApi.getInvoice(orderId);
  //     console.log("blob", blob);

  //     const url = URL.createObjectURL(blob);
  //     console.log(url)
  //     // Same-tab navigation avoids popup blockers.
  //     window.location.assign(url);
  //     window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
  //   } catch (err) {
  //     setError(err?.message || "Failed to open invoice");
  //   } finally {
  //     setInvoiceLoadingOrderId(null);
  //   }
  // }

  async function onPrintInvoice(order, e) {
    if (e) e.stopPropagation();

    try {
      const { blob } = await authApi.getInvoice(order.orderNumber);

      const url = URL.createObjectURL(blob);

      window.open(url, "_blank");

      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 60000);

    } catch (err) {
      console.error(err);
      setError(err?.message || "Failed to open invoice");
    }
  }



  async function onFetchTracking(order, e) {
    if (e) e.stopPropagation();
    const orderId = Number(order?.id);
    if (!Number.isFinite(orderId)) return;
    setError("");
    setTrackingLoadingOrderId(orderId);
    try {
      const cnno = String(order?.carrier_tracking_number || order?.carrier_reference || "").trim();
      const data = await api.fetchCustomerOrderTracking(orderId, cnno || undefined);
      setTrackingByOrderId((prev) => ({ ...prev, [orderId]: data }));
    } catch (err) {
      setError(err?.message || "Failed to fetch tracking");
    } finally {
      setTrackingLoadingOrderId(null);
    }
  }

  const updateOrderStatus = async (
    orderNumber,
    status
  ) => {
    try {
      await authApi.updateStatus(
        orderNumber,
        {
          orderStatus: status,
        }
      );

      await refresh2();

      setStatusOrderId(null);
    } catch (err) {
      console.log(err);
    }
  };

  const sendTrackingEmail = async (orderNumber) => {
    try {
      setLoading(true);
      setError("");

      const response = await authApi.getemailTrackingurl(
        orderNumber
      );

      alert(
        response?.message ||
        "Tracking email sent successfully"
      );

    } catch (error) {

      setError(
        error?.response?.data?.message ||
        error?.message ||
        "Failed to send tracking email"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="adminPage">
      <div className="adminPageTop">
        <div>
          <h1 className="adminPageTitle">Orders &amp; delivery</h1>
          <div className="muted">
            {activeTab === "all"
              ? "Click an order to view line items and customer details. Use Update delivery to edit carrier and tracking."
              : "Shipment and tracking fields (DTDC booking, carrier, AWB, dates). Click a row for full order details."}
          </div>
        </div>
      </div>

      <div className="adminTabs" role="tablist" aria-label="Orders views">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "all"}
          className={`adminTab ${activeTab === "all" ? "adminTabActive" : ""}`}
          onClick={() => setActiveTab("all")}
        >
          All orders
        </button>
        {/* <button
          type="button"
          role="tab"
          aria-selected={activeTab === "delivery"}
          className={`adminTab ${activeTab === "delivery" ? "adminTabActive" : ""}`}
          onClick={() => setActiveTab("delivery")}
        >
          Delivery details
        </button> */}
      </div>

      {error ? (
        <div className="error" style={{ marginTop: 12 }}>
          {error}
        </div>
      ) : null}

      <div className="adminTableWrap" style={{ marginTop: 14 }}>
        <div className="adminTableTop">
          <div className="adminTableTitle">{activeTab === "all" ? "All orders" : "Delivery details"}</div>
          <button
            className="adminBtn"
            type="button"
            onClick={() => {
              setError("");
            }}
          >
            Refresh
          </button>
        </div>

        <div style={{ overflowX: "auto" }}>
          {activeTab === "all" ? (
            <table className="adminTable">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Items</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Order status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {listLoading ? (
                  <tr>
                    <td colSpan={8} className="muted" style={{ padding: 24, textAlign: "center" }}>
                      Loading…
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="muted" style={{ padding: 24, textAlign: "center" }}>
                      No customer orders yet.
                    </td>
                  </tr>
                ) : (
                  orders.map((o) => {
                    const n = Array.isArray(o.items) ? o.items.length : 0;
                    return (
                      <tr
                        key={o.id}
                        className="adminOrderRowClickable"
                        onClick={() => openDetail(o)}
                        title="View order details"
                      >
                        <td>
                          <strong>#{o.orderNumber}</strong>
                          <div className="muted" style={{ fontSize: 12 }}>
                            {formatDt(o.created_at)}
                          </div>
                        </td>
                        <td>
                          {n > 0 ? (
                            <span style={{ fontWeight: 700 }}>
                              {n} item{n === 1 ? "" : "s"}
                            </span>
                          ) : (
                            <span className="muted">—</span>
                          )}
                          <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>
                            Click row to view
                          </div>
                        </td>
                        <td>
                          <div>{o.address.fullName || "—"}</div>
                          <div className="muted" style={{ fontSize: 12 }}>
                            {o.address.email}
                          </div>
                        </td>
                        <td>₹{Number(o.pricing.totalAmount || 0).toFixed(2)}</td>
                        <td>{o.payment.razorpayPaymentId}</td>
                        <td>
                          <span
                            style={{
                              display: "inline-block",
                              padding: "4px 10px",
                              borderRadius: 999,
                              background: "rgba(0, 178, 7, 0.12)",
                              fontSize: 12,
                              fontWeight: 700,
                            }}
                          >
                            {o.orderStatus}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                            <button
                              type="button"
                              className="adminBtn"
                              onClick={(e) => onPrintInvoice(o, e)}
                              disabled={invoiceLoadingOrderId === o.id}
                            >
                              {invoiceLoadingOrderId === o.id ? "Opening…" : "Print invoice"}
                            </button>
                            <button
                              type="button"
                              className="adminBtn"
                              onClick={(e) => {
                                e.stopPropagation();
                                setStatusOrderId(
                                  statusOrderId === o.orderNumber ? null : o.orderNumber
                                );
                                setOrderStatus(o.orderStatus || "new");
                              }}
                            >
                              Order Status
                            </button>
                            {statusOrderId === o.orderNumber && (
                              <div
                                style={{
                                  marginTop: 10,
                                  padding: 12,
                                  border: "1px solid #ddd",
                                  borderRadius: 8,
                                  display: "flex",
                                  gap: 10,
                                  alignItems: "center",
                                  flexWrap: "wrap",
                                }}
                              >
                                <select
                                  className="input"
                                  value={orderStatus}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                  }}
                                  onChange={(e) => {
                                    setOrderStatus(e.target.value)
                                  }}
                                >
                                  <option value="new">New</option>
                                  <option value="confirmed">Confirmed</option>
                                  <option value="processing">Processing</option>
                                  <option value="packed">Packed</option>
                                  <option value="shipped">Shipped</option>
                                  <option value="delivered">Delivered</option>
                                  <option value="cancelled">Cancelled</option>
                                </select>

                                <button
                                  className="adminBtn adminBtnPrimary"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateOrderStatus(
                                      o.orderNumber,
                                      orderStatus
                                    )
                                  }}
                                >
                                  Save
                                </button>

                                <button
                                  className="adminBtn"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setStatusOrderId(null)
                                  }}
                                >
                                  Cancel
                                </button>
                              </div>
                            )}
                            <button
                              type="button"
                              className="adminBtn adminBtnPrimary"
                              onClick={(e) => {
                                e.stopPropagation();
                                openFulfillment(o);
                              }}
                            >
                              Update delivery
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          ) : (
            <table className="adminTable">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Status</th>
                  <th>Carrier</th>
                  <th>AWB / tracking</th>
                  <th>DTDC / legacy</th>
                  <th>Shipped</th>
                  <th>Delivered</th>
                  <th>Link</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {listLoading ? (
                  <tr>
                    <td colSpan={10} className="muted" style={{ padding: 24, textAlign: "center" }}>
                      Loading…
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="muted" style={{ padding: 24, textAlign: "center" }}>
                      No customer orders yet.
                    </td>
                  </tr>
                ) : (
                  orders.map((o) => (
                    <tr
                      key={o.id}
                      className="adminOrderRowClickable"
                      onClick={() => openDetail(o)}
                      title="View order details"
                    >
                      <td>
                        <strong>#{o.orderNumber}</strong>
                        <div className="muted" style={{ fontSize: 11, fontFamily: "monospace" }} title="Customer reference sent to DTDC">
                          {orderChannelRef(o.id)}
                        </div>
                        <div className="muted" style={{ fontSize: 12 }}>
                          {formatDt(o.created_at)}
                        </div>
                      </td>
                      <td style={{ maxWidth: 160 }}>
                        <div style={{ fontWeight: 650 }}>{o.address.fullName || "—"}</div>
                        <div className="muted" style={{ fontSize: 12, wordBreak: "break-all" }}>
                          {o.address.fullName}
                        </div>
                        {o.address.mobile ? (
                          <div className="muted" style={{ fontSize: 12 }}>
                            {o.address.mobile}
                          </div>
                        ) : null}
                      </td>
                      <td>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "4px 10px",
                            borderRadius: 999,
                            background: "rgba(0, 178, 7, 0.12)",
                            fontSize: 12,
                            fontWeight: 700,
                          }}
                        >
                          {o.address.orderStatus || "processing"}
                        </span>
                      </td>
                      <td style={{ maxWidth: 120 }}>{o.carrier_name || <span className="muted">—</span>}</td>
                      <td style={{ maxWidth: 140, fontSize: 12, wordBreak: "break-word" }}>
                        {o.carrier_tracking_number || <span className="muted">—</span>}
                      </td>
                      <td style={{ maxWidth: 200, fontSize: 11, fontFamily: "monospace", verticalAlign: "top" }}>
                        {o.shiprocket_order_id ? (
                          <div title="Legacy Shiprocket order id">
                            SR ord: {String(o.shiprocket_order_id)}
                          </div>
                        ) : null}
                        {o.shiprocket_shipment_id ? (
                          <div title="Legacy Shiprocket shipment id" style={{ marginTop: 4 }}>
                            SR shp: {String(o.shiprocket_shipment_id)}
                          </div>
                        ) : null}
                        {o.carrier_name === "DTDC" && o.carrier_tracking_number ? (
                          <div className="muted" style={{ marginTop: 4 }} title="DTDC AWB">
                            DTDC OK
                          </div>
                        ) : null}
                        {o.carrier_reference &&
                          String(o.carrier_reference) !== String(o.carrier_tracking_number) &&
                          String(o.carrier_reference) !== String(o.shiprocket_shipment_id) ? (
                          <div className="muted" style={{ marginTop: 4, wordBreak: "break-all" }} title="Carrier reference">
                            ref: {String(o.carrier_reference)}
                          </div>
                        ) : null}
                        {!String(o.carrier_tracking_number || "").trim() &&
                          !o.shiprocket_order_id &&
                          !o.shiprocket_shipment_id ? (
                          o.shiprocket_last_error ? (
                            <span style={{ color: "var(--danger, #c62828)", fontSize: 11 }} title={o.shiprocket_last_error}>
                              Error (see order detail)
                            </span>
                          ) : (
                            <span className="muted">—</span>
                          )
                        ) : null}
                        {o.shiprocket_last_error &&
                          (String(o.carrier_tracking_number || "").trim() || o.shiprocket_order_id || o.shiprocket_shipment_id) ? (
                          <div style={{ color: "var(--danger, #c62828)", fontSize: 10, marginTop: 4 }} title={o.shiprocket_last_error}>
                            Last booking issue logged
                          </div>
                        ) : null}
                      </td>
                      <td style={{ fontSize: 12, whiteSpace: "nowrap" }}>{formatDt(o.shipped_at)}</td>
                      <td style={{ fontSize: 12, whiteSpace: "nowrap" }}>{formatDt(o.delivered_at)}</td>
                      <td style={{ fontSize: 12 }}>
                        <span className="muted">—</span>
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          <button
                            type="button"
                            className="adminBtn"
                            onClick={(e) => onPrintInvoice(o, e)}
                            disabled={invoiceLoadingOrderId === o.orderNumber}
                          >
                            {invoiceLoadingOrderId === o.orderNumber ? "Opening…" : "Print invoice"}
                          </button>
                          {/* <button
                            type="button"
                            className="adminBtn"
                            onClick={(e) => onPrintLabel(o, e)}
                            disabled={labelLoadingOrderId === o.id}
                          >
                            {labelLoadingOrderId === o.id ? "Opening…" : "Print label"}
                          </button> */}
                          <button
                            type="button"
                            className="adminBtn adminBtnPrimary"
                            onClick={(e) => {
                              e.stopPropagation();
                              openFulfillment(o);
                            }}
                          >
                            Update
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
        <AdminPagination
          page={page}
          total={total}
          limit={pageSize}
          disabled={listLoading}
          onPageChange={setPage}
          onLimitChange={handlePageSizeChange}
        />
      </div>

      {
        modal?.mode === "detail" && modal.order ? (
          <div
            className="adminModalOverlay"
            role="dialog"
            aria-modal="true"
            aria-labelledby="order-detail-title"
            onMouseDown={closeModal}
          >
            <div
              className="adminModal adminModal--orderDetail"
              style={{ width: "min(640px, calc(100vw - 32px))" }}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <div className="adminModalTop">
                <div>
                  <h2 className="adminModalTitle" id="order-detail-title">
                    Order #{modal.order.orderNumber}
                  </h2>
                  <div className="muted" style={{ fontSize: 13 }}>
                    Placed {formatDt(modal.order.createdAt)}
                  </div>
                </div>
                <button type="button" className="adminBtn" onClick={closeModal}>
                  Close
                </button>
              </div>
              <div className="adminModalBody">
                <div className="adminOrderDetailBlock">
                  <div className="adminOrderDetailSection">
                    <div className="adminOrderDetailSectionTitle">Customer</div>
                    <div className="adminOrderDetailGrid">
                      <div>
                        <div className="muted" style={{ fontSize: 12 }}>
                          Name
                        </div>
                        <div style={{ fontWeight: 700 }}>{modal.order.address.fullName || "—"}</div>
                      </div>
                      <div>
                        <div className="muted" style={{ fontSize: 12 }}>
                          Email
                        </div>
                        <div>{modal.order.address.email || "—"}</div>
                      </div>
                      <div>
                        <div className="muted" style={{ fontSize: 12 }}>
                          Phone
                        </div>
                        <div>{modal.order.address.mobile || "—"}</div>
                      </div>
                    </div>
                  </div>

                  <div className="adminOrderDetailSection">
                    <div className="adminOrderDetailSectionTitle">Payment</div>
                    <div className="adminOrderDetailGrid">
                      <div>
                        <div className="muted" style={{ fontSize: 12 }}>
                          Method
                        </div>
                        <div>{modal.order.payment.method || "—"}</div>
                      </div>
                      <div>
                        <div className="muted" style={{ fontSize: 12 }}>
                          Subtotal
                        </div>
                        <div>₹{Number(modal.order.pricing.subtotal || 0).toFixed(2)}</div>
                      </div>
                      <div>
                        <div className="muted" style={{ fontSize: 12 }}>
                          Shipping
                        </div>
                        <div>{Number(modal.order.pricing.shipping || 0) > 0 ? `₹${Number(modal.order.pricing.shipping).toFixed(2)}` : "Free"}</div>
                      </div>
                      <div>
                        <div className="muted" style={{ fontSize: 12 }}>
                          Discount
                        </div>
                        <div style={{ fontWeight: 800 }}>₹{Number(modal.order.pricing.discount || 0).toFixed(2)}</div>
                      </div>
                      <div>
                        <div className="muted" style={{ fontSize: 12 }}>
                          Total
                        </div>
                        <div style={{ fontWeight: 800 }}>₹{Number(modal.order.pricing.totalAmount || 0).toFixed(2)}</div>
                      </div>
                    </div>
                    {(modal.order.payment.razorpayPaymentId) && (
                      <div style={{ marginTop: 10, fontSize: 12 }} className="muted">
                        {modal.order.payment.razorpayOrderId ? (
                          <div>
                            Razorpay order:{" "}
                            <code style={{ fontSize: 13, wordBreak: "break-all" }}>{modal.order.payment.razorpayOrderId}</code>
                          </div>
                        ) : null}
                        {modal.order.payment.razorpayPaymentId ? (
                          <div style={{ marginTop: 4 }}>
                            Razorpay payment:{" "}
                            <code style={{ fontSize: 13, wordBreak: "break-all" }}>{modal.order.payment.razorpayPaymentId}</code>
                          </div>
                        ) : null}
                        {modal.order.payment.paidAt ? (
                          <div style={{ marginTop: 4 }}>
                            Razorpay Payment Time:{" "}
                            <code style={{ fontSize: 13, wordBreak: "break-all" }}>{formatDt(modal.order.payment.paidAt)}</code>
                          </div>
                        ) : null}
                      </div>
                    )}
                  </div>

                  <div className="adminOrderDetailSection">
                    <div className="adminOrderDetailSectionTitle">Delivery (current)</div>
                    <div className="adminOrderDetailGrid">
                      {/* <div>
                      <div className="muted" style={{ fontSize: 12 }}>
                        Status
                      </div>
                      <div style={{ fontWeight: 700 }}>{modal.order.orderStatus || "processing"}</div>
                    </div> */}
                      {deliveryData && <><div>
                        <div className="muted" style={{ fontSize: 12 }}>
                          Carrier
                        </div>
                        <div>{deliveryData.courierName || "—"}</div>
                      </div>
                        <div>
                          <div className="muted" style={{ fontSize: 12 }}>
                            shipping Provider
                          </div>
                          <div>{deliveryData.shippingProvider || "—"}</div>
                        </div>
                        <div>
                          <div className="muted" style={{ fontSize: 12 }}>
                            AWB Code
                          </div>
                          <div>{deliveryData.awbCode || "—"}</div>
                        </div>
                        <div>
                          <div className="muted" style={{ fontSize: 12 }}>
                            Tracking Number
                          </div>
                          <div>{deliveryData.trackingNumber || "—"}</div>
                        </div>
                        <div>
                          <div className="muted" style={{ fontSize: 12 }}>
                            Tracking Link
                          </div>
                          <div>{deliveryData.trackingUrl || "—"}</div>
                        </div>

                        <button
                          className="adminBtn adminBtnPrimary"
                          onClick={() => sendTrackingEmail(modal.order.orderNumber)}
                        >
                          Send Tracking Email
                        </button>
                      </>
                      }
                      {/* <div>
                      <div className="muted" style={{ fontSize: 12 }}>
                        Shipped
                      </div>
                      <div>{formatDt(modal.order.shipped_at)}</div>
                    </div> */}
                      {/* <div>
                      <div className="muted" style={{ fontSize: 12 }}>
                        Delivered
                      </div>
                      <div>{formatDt(modal.order.delivered_at)}</div>
                    </div> */}
                      {/* {modal.order.carrier_reference ? (
                      <div style={{ gridColumn: "1 / -1" }}>
                        <div className="muted" style={{ fontSize: 12 }}>
                          Carrier reference
                        </div>
                        <code style={{ fontSize: 12, wordBreak: "break-all" }}>{modal.order.carrier_reference}</code>
                      </div>
                    ) : null} */}
                    </div>
                  </div>

                  {/* <div className="adminOrderDetailSection">
                  <div className="adminOrderDetailSectionTitle">DTDC booking</div>
                  <div className="adminOrderDetailGrid">
                    <div style={{ gridColumn: "1 / -1" }}>
                      <div className="muted" style={{ fontSize: 12 }}>
                        Customer reference sent to DTDC (softdata)
                      </div>
                      <code style={{ fontSize: 12 }}>{orderChannelRef(modal.order.id)}</code>
                      <div className="muted" style={{ fontSize: 11, marginTop: 6, lineHeight: 1.45 }}>
                        <strong>PJ…</strong> is the <code>customer_reference_number</code> in the DTDC Order Upload API. On success,
                        the AWB is stored in <strong>Tracking / AWB</strong> above.
                      </div>
                    </div>
                    {modal.order.shiprocket_order_id ? (
                      <div style={{ gridColumn: "1 / -1" }}>
                        <div className="muted" style={{ fontSize: 12 }}>
                          Legacy Shiprocket order id
                        </div>
                        <code style={{ fontSize: 12, wordBreak: "break-all" }}>{modal.order.shiprocket_order_id}</code>
                      </div>
                    ) : null}
                    {modal.order.shiprocket_shipment_id ? (
                      <div style={{ gridColumn: "1 / -1" }}>
                        <div className="muted" style={{ fontSize: 12 }}>
                          Legacy Shiprocket shipment id
                        </div>
                        <code style={{ fontSize: 12, wordBreak: "break-all" }}>{modal.order.shiprocket_shipment_id}</code>
                      </div>
                    ) : null}
                    {modal.order.shiprocket_last_error ? (
                      <div style={{ gridColumn: "1 / -1" }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--danger, #c62828)", marginBottom: 6 }}>
                          Carrier booking error
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            lineHeight: 1.45,
                            padding: "10px 12px",
                            borderRadius: 10,
                            background: "rgba(198, 40, 40, 0.08)",
                            border: "1px solid rgba(198, 40, 40, 0.25)",
                            wordBreak: "break-word",
                            fontFamily: "ui-monospace, monospace",
                          }}
                        >
                          {modal.order.shiprocket_last_error}
                        </div>
                        <div className="muted" style={{ fontSize: 12, marginTop: 10 }}>
                          Check <code>DTDC_*</code> on the Web and Admin APIs, customer 6-digit PIN and phone, and{" "}
                          <code>DTDC_SERVICE_TYPE_ID</code> / <code>DTDC_COMMODITY_ID</code> per your DTDC contract. Web API logs:{" "}
                          <code>[dtdc]</code>.
                        </div>
                      </div>
                    ) : null}
                    {!String(modal.order.carrier_tracking_number || "").trim() &&
                      !modal.order.shiprocket_last_error &&
                      !modal.order.shiprocket_order_id &&
                      !modal.order.shiprocket_shipment_id ? (
                      <div className="muted" style={{ gridColumn: "1 / -1", fontSize: 13, lineHeight: 1.5 }}>
                        No AWB stored yet — this order may have been placed before DTDC booking was active, or DTDC booking failed
                        at checkout time. New paid orders will attempt booking automatically from the Web checkout API.
                      </div>
                    ) : null}
                    {trackingByOrderId[modal.order.id]?.tracking?.trackHeader ? (
                      <div style={{ gridColumn: "1 / -1", marginTop: 8 }}>
                        <div className="adminOrderDetailSectionTitle" style={{ marginBottom: 8 }}>
                          Live DTDC tracking
                        </div>
                        <div className="adminOrderDetailGrid">
                          <div>
                            <div className="muted" style={{ fontSize: 12 }}>
                              Current status
                            </div>
                            <div style={{ fontWeight: 700 }}>
                              {trackingByOrderId[modal.order.id].tracking.trackHeader.strStatus || "—"}
                            </div>
                          </div>
                          <div>
                            <div className="muted" style={{ fontSize: 12 }}>
                              Shipment no.
                            </div>
                            <div>{trackingByOrderId[modal.order.id].tracking.trackHeader.strShipmentNo || "—"}</div>
                          </div>
                        </div>
                        {Array.isArray(trackingByOrderId[modal.order.id].tracking.trackDetails) &&
                          trackingByOrderId[modal.order.id].tracking.trackDetails.length > 0 ? (
                          <div style={{ marginTop: 10, border: "1px solid var(--border)", borderRadius: 10 }}>
                            {trackingByOrderId[modal.order.id].tracking.trackDetails.slice(0, 8).map((ev, idx) => (
                              <div
                                key={`${modal.order.id}-trk-${idx}`}
                                style={{
                                  padding: "8px 10px",
                                  borderBottom:
                                    idx === trackingByOrderId[modal.order.id].tracking.trackDetails.slice(0, 8).length - 1
                                      ? "none"
                                      : "1px solid var(--border)",
                                  fontSize: 12,
                                }}
                              >
                                <div style={{ fontWeight: 700 }}>{ev.strAction || "Update"}</div>
                                <div className="muted">
                                  {formatTrackingEventDate(ev.strActionDate, ev.strActionTime)} {ev.strOrigin ? `• ${ev.strOrigin}` : ""}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                  <div style={{ marginTop: 10 }}>
                    <button
                      type="button"
                      className="adminBtn"
                      onClick={(e) => onFetchTracking(modal.order, e)}
                      disabled={trackingLoadingOrderId === modal.order.id}
                    >
                      {trackingLoadingOrderId === modal.order.id ? "Tracking…" : "Track shipment"}
                    </button>
                  </div>
                </div> */}

                  <div className="adminOrderDetailSection">
                    <div className="adminOrderDetailSectionTitle">Ordered items</div>
                    {Array.isArray(modal.order.items) && modal.order.items.length > 0 ? (
                      <div className="adminOrderDetailItems">
                        {modal.order.items.map((it) => {
                          const line = Number(it.unitPrice || 0) * Number(it.quantity || 0);
                          const variant = it.product?.variations?.find((v) => {
                            console.log("variant id:", v._id?.toString());
                            console.log("order variation:", it.variation?.toString());

                            return v._id?.toString() === it.variation?.toString();
                          });
                          return (
                            <Link
                              to={`/products/${it.product?.slug}`}
                              style={{
                                textDecoration: "none",
                                color: "inherit",
                                display: "block",
                              }}
                            >
                              <div className="adminOrderDetailItem">
                                <div className="adminOrderDetailItemImgWrap">
                                  <OrderItemImage imageUrl={it.productImage} />
                                </div>
                                <div className="adminOrderDetailItemMeta">
                                  <div className="adminOrderDetailItemName">{it.product_name}</div>
                                  {it.product ? (
                                    <div className="muted" style={{ fontSize: 12 }}>
                                      Product Sku: {it.product.sku}
                                    </div>
                                  ) : null}
                                  {it.product ? (
                                    <div className="muted" style={{ fontSize: 12 }}>
                                      Product Name: {it.product.title}
                                    </div>
                                  ) : null}
                                  {variant?.label != null ? (
                                    <div className="muted" style={{ fontSize: 12 }}>
                                      Pack {variant.label}
                                      {/* {Number.isFinite(Number(it.price)) && Number(it.weight_grams) > 0
                                    ? ` · ₹${((Number(it.price) / Number(it.weight_grams)) * 1000).toFixed(2)}/kg`
                                    : ""} */}
                                    </div>
                                  ) : <div>null</div>}
                                  {variant?.sku != null ? (
                                    <div className="muted" style={{ fontSize: 12 }}>
                                      Sku: {variant.sku}
                                      {/* {Number.isFinite(Number(it.price)) && Number(it.weight_grams) > 0
                                    ? ` · ₹${((Number(it.price) / Number(it.weight_grams)) * 1000).toFixed(2)}/kg`
                                    : ""} */}
                                    </div>
                                  ) : <div>null</div>}
                                  {it.product ? (
                                    <div className="muted" style={{ fontSize: 12 }}>
                                      Quantity: {it.quantity}
                                    </div>
                                  ) : null}

                                  <div className="adminOrderDetailItemPrices">
                                    <span>
                                      ₹{Number(it.unitPrice || 0).toFixed(2)} × {it.quantity}
                                    </span>
                                    <span style={{ fontWeight: 800 }}>₹{line.toFixed(2)}</span>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="muted">No line items recorded for this order.</div>
                    )}
                    <div className="adminOrderDetailTotalBar">
                      <span className="muted">Shipping charge</span>
                      <span>₹{Number(modal.order.pricing.shipping || 0).toFixed(2)}</span>
                    </div>
                    <div className="adminOrderDetailTotalBar">
                      <span className="muted">Discount</span>
                      <span>₹{Number(modal.order.pricing.discount || 0).toFixed(2)}</span>
                    </div>
                    <div className="adminOrderDetailTotalBar">
                      <span className="muted">Total Amount</span>
                      <span>₹{Number(modal.order.pricing.totalAmount || 0).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", flexWrap: "wrap", marginTop: 8 }}>
                  <button
                    type="button"
                    className="adminBtn"
                    onClick={(e) => onPrintInvoice(modal.order, e)}
                    disabled={invoiceLoadingOrderId === modal.order.orderNumber}
                  >
                    {invoiceLoadingOrderId === modal.order.id ? "Opening…" : "Print invoice"}
                  </button>
                  {/* <button
                  type="button"
                  className="adminBtn"
                  onClick={(e) => onPrintLabel(modal.order, e)}
                  disabled={labelLoadingOrderId === modal.order.id}
                >
                  {labelLoadingOrderId === modal.order.id ? "Opening…" : "Print label"}
                </button> */}
                  <button type="button" className="adminBtn" onClick={closeModal}>
                    Close
                  </button>
                  <button type="button" className="adminBtn adminBtnPrimary" onClick={goToFulfillmentFromDetail}>
                    Update delivery
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null
      }

      {
        modal?.mode === "fulfillment" && modal.order ? (
          <div className="adminModalOverlay" role="dialog" aria-modal="true" onMouseDown={closeModal}>
            <div className="adminModal" style={{ maxWidth: 520 }} onMouseDown={(e) => e.stopPropagation()}>
              <div className="adminModalTop">
                <div>
                  <h2 className="adminModalTitle">Delivery — Order #{modal.order.id}</h2>
                  <div className="muted" style={{ fontSize: 13 }}>
                    {modal.order.customer_name} · {modal.order.customer_email}
                  </div>
                </div>
                <button type="button" className="adminBtn" onClick={closeModal}>
                  Close
                </button>
              </div>
              {/* <form onSubmit={onSaveFulfillment}>
              <div className="adminModalBody">
                <div className="adminPanel" style={{ display: "grid", gap: 12 }}>
                  <div className="field" style={{ margin: 0 }}>
                    <div className="label">Fulfillment / delivery status</div>
                    <select
                      className="input"
                      value={form.fulfillmentStatus}
                      onChange={(e) => setForm((f) => ({ ...f, fulfillmentStatus: e.target.value }))}
                    >
                      {FULFILLMENT_STATUSES.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="field" style={{ margin: 0 }}>
                    <div className="label">Delivery company (carrier)</div>
                    <input
                      className="input"
                      placeholder="e.g. Delhivery, Blue Dart, local partner"
                      value={form.carrierName}
                      onChange={(e) => setForm((f) => ({ ...f, carrierName: e.target.value }))}
                    />
                  </div>
                  <div className="field" style={{ margin: 0 }}>
                    <div className="label">Tracking / AWB number</div>
                    <input
                      className="input"
                      value={form.carrierTrackingNumber}
                      onChange={(e) => setForm((f) => ({ ...f, carrierTrackingNumber: e.target.value }))}
                    />
                  </div>
                  <div className="field" style={{ margin: 0 }}>
                    <div className="label">Carrier reference (optional)</div>
                    <input
                      className="input"
                      value={form.carrierReference}
                      onChange={(e) => setForm((f) => ({ ...f, carrierReference: e.target.value }))}
                    />
                  </div>
                  <div className="field" style={{ margin: 0 }}>
                    <div className="label">Tracking URL (optional)</div>
                    <input
                      className="input"
                      placeholder="https://..."
                      value={form.trackingUrl}
                      onChange={(e) => setForm((f) => ({ ...f, trackingUrl: e.target.value }))}
                    />
                  </div>
                  <div className="field" style={{ margin: 0 }}>
                    <div className="label">Internal notes (not shown to customer)</div>
                    <textarea
                      className="input"
                      rows={3}
                      value={form.fulfillmentNotes}
                      onChange={(e) => setForm((f) => ({ ...f, fulfillmentNotes: e.target.value }))}
                    />
                  </div>
                  <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
                    <button type="button" className="adminBtn" onClick={closeModal} disabled={loading}>
                      Cancel
                    </button>
                    <button type="submit" className="adminBtn adminBtnPrimary" disabled={loading}>
                      {loading ? "Saving…" : "Save"}
                    </button>
                  </div>
                </div>
              </div>
            </form> */}
              <form onSubmit={onSaveFulfillment}>
                <div className="adminModalBody">
                  <div className="adminPanel" style={{ display: "grid", gap: 12 }}>

                    <div className="field" style={{ margin: 0 }}>
                      {/* <div className="label">Courier Status</div> */}
                      {/* <select
                      className="input"
                      value={form.status}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, status: e.target.value }))
                      }
                    >
                      {COURIER_STATUSES.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select> */}
                    </div>

                    <div className="field" style={{ margin: 0 }}>
                      <div className="label">Courier Name</div>
                      <input
                        className="input"
                        placeholder="Delhivery, Blue Dart, DTDC..."
                        value={form.courierName}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, courierName: e.target.value }))
                        }
                      />
                    </div>

                    <div className="field" style={{ margin: 0 }}>
                      <div className="label">Tracking Number</div>
                      <input
                        className="input"
                        value={form.trackingNumber}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, trackingNumber: e.target.value }))
                        }
                      />
                    </div>

                    <div className="field" style={{ margin: 0 }}>
                      <div className="label">AWB Code</div>
                      <input
                        className="input"
                        value={form.awbCode}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, awbCode: e.target.value }))
                        }
                      />
                    </div>

                    {/* <div className="field" style={{ margin: 0 }}>
                    <div className="label">Shipping Provider</div>
                    <input
                      className="input"
                      placeholder="Shiprocket"
                      value={form.shippingProvider}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, shippingProvider: e.target.value }))
                      }
                    />
                  </div> */}

                    <div className="field" style={{ margin: 0 }}>
                      <div className="label">Tracking URL</div>
                      <input
                        className="input"
                        placeholder="https://..."
                        value={form.trackingUrl}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, trackingUrl: e.target.value }))
                        }
                      />
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: 10,
                        justifyContent: "flex-end",
                        marginTop: 8,
                      }}
                    >
                      <button
                        type="button"
                        className="adminBtn"
                        onClick={closeModal}
                        disabled={loading}
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        className="adminBtn adminBtnPrimary"
                        disabled={loading}
                      >
                        {loading ? "Saving..." : "Save Courier"}
                      </button>
                    </div>

                  </div>
                </div>
              </form>
            </div>
          </div>
        ) : null
      }
    </div >
  );
}
