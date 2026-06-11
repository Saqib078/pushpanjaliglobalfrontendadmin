export default function CatalogHero({catalog}) {

  return (
    <div
      className="adminPanel"
      style={{
        marginTop: 20,
      }}
    >

      <div
        style={{
          display: "flex",

          gap: 20,

          alignItems: "center",
        }}
      >

        {/* IMAGE */}
        <div
          style={{
            width: 140,

            height: 140,

            borderRadius: 14,

            overflow: "hidden",

            background: "#111",

            flexShrink: 0,
          }}
        >

          {catalog.thumbnail ? (

            <img
              src={`https://pushpanjaliglobal.com${catalog.thumbnail}`}

              alt=""

              style={{
                width: "100%",

                height: "100%",

                objectFit: "cover",
              }}
            />

          ) : null}

        </div>

        {/* CONTENT */}
        <div>

          <h1
            style={{
              margin: 0,

              fontSize: 32,
            }}
          >
            {catalog.name}
          </h1>

          <div
            className="muted"

            style={{
              marginTop: 6,
            }}
          >
            /{catalog.slug}
          </div>

          <div
            style={{
              marginTop: 16,

              maxWidth: 700,

              lineHeight: 1.6,
            }}
          >
            {catalog.seo.meta_description ||
              "No description added."}
          </div>

        </div>

      </div>

    </div>
  );
}