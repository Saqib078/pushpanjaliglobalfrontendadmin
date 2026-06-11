import { useState } from "react";
import { resolveAdminMediaUrl } from "../lib/resolveMediaUrl";

/** Same path as Web portal Header (proxied to storefront in dev). Fallback: public favicon. */
const BRAND_LOGO_PRIMARY = "/images/Pushpanjali%20logo.jpg";
const BRAND_LOGO_FALLBACK = "/favicon.svg";

/**
 * @param {{ variant?: "sidebar" | "login", className?: string }} props
 */
export default function AdminBrandLogo({ variant = "sidebar", className = "" }) {
  const [src, setSrc] = useState(() => resolveAdminMediaUrl(BRAND_LOGO_PRIMARY));
  const [showLetter, setShowLetter] = useState(false);

  const sizeClass = variant === "login" ? "adminBrandLogo--login" : "";

  if (showLetter) {
    return (
      <div
        className={`adminBrandLogo adminBrandLogoLetter ${sizeClass} ${className}`.trim()}
        aria-hidden
      >
        P
      </div>
    );
  }

  return (
    <img
      className={`adminBrandLogo ${sizeClass} ${className}`.trim()}
      src={src}
      alt="Pushpanjali"
      loading="eager"
      decoding="async"
      onError={() => {
        if (src === BRAND_LOGO_PRIMARY) setSrc(BRAND_LOGO_FALLBACK);
        else setShowLetter(true);
      }}
    />
  );
}
