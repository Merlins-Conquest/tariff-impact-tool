import { useState, useEffect } from "react";

// ---------- Helpers ----------
function normalizeEvent(item) {
  if (item === null || item === undefined) return { raw: String(item) };
  if (typeof item === "object") return item;
  if (typeof item === "string") {
    try { return JSON.parse(item); } catch { return { raw: item }; }
  }
  return { raw: String(item) };
}

// FedEx color palette
const colors = {
  purple: "#4D148C",
  orange: "#FF6600",
  lightGray: "#F5F5F5",
  white: "#FFFFFF",
  darkGray: "#333333",
};

const defaultJson = '{\n  "commodity": "electronics",\n  "rate": 0.1\n}';

// ---------- App ----------
export default function App() {
  const [json, setJson] = useState(defaultJson);
  const [status, setStatus] = useState("");
  const [feed, setFeed] = useState([]);
  const [page, setPage] = useState("home"); // home | about | design
  const API = import.meta.env.VITE_API_URL;

  const send = async () => {
    try {
      const body = JSON.parse(json);
      const res = await fetch(`${API}/demo/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(await res.text());
      setStatus("Tariff event sent successfully!");
      setTimeout(() => setStatus(""), 3000);
      loadFeed();
    } catch (err) {
      setStatus("Error: " + err.message);
    }
  };

  const loadFeed = async () => {
    try {
      const res = await fetch(`${API}/feed/latest`);
      const data = await res.json();
      const parsed = Array.isArray(data)
        ? data.map((d) => normalizeEvent(d))
        : [];
      setFeed(parsed);
    } catch (err) {
      setFeed([{ error: err.message }]);
    }
  };

  useEffect(() => {
    if (page === "home") loadFeed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // ---------- UI pieces ----------
  const NavBar = () => (
    <nav
      style={{
        backgroundColor: colors.purple,
        padding: "1rem 2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        color: colors.white,
      }}
    >
      <div
        style={{
          fontWeight: "bold",
          fontSize: "1.3rem",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
        }}
        onClick={() => setPage("home")}
      >
        Tariff Impact Tool
      </div>
      <div>
        {["home", "about", "design"].map((p) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            style={{
              background: page === p ? colors.orange : "transparent",
              color: colors.white,
              border: "none",
              marginLeft: "1rem",
              padding: "0.5rem 1rem",
              borderRadius: "20px",
              cursor: "pointer",
              fontSize: "1rem",
              transition: "background 0.2s",
            }}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>
    </nav>
  );

  const Footer = () => (
    <footer
      style={{
        marginTop: "2rem",
        padding: "1rem",
        backgroundColor: colors.purple,
        color: colors.white,
        textAlign: "center",
        fontSize: "0.9rem",
      }}
    >
      Created by Randy Ramsammy – FedEx Dataworks Intern
    </footer>
  );

  const Card = ({ title, children }) => (
    <section
      style={{
        backgroundColor: colors.white,
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        padding: "1.5rem",
        marginBottom: "1.5rem",
      }}
    >
      <h2 style={{ color: colors.purple, marginTop: 0 }}>{title}</h2>
      {children}
    </section>
  );

  // ---------- Pages ----------
  const HomePage = () => (
    <div style={{ padding: "2rem", backgroundColor: colors.lightGray }}>
      <Card title="Enter a Tariff Event">
        <p style={{ marginBottom: "0.5rem" }}>
          Paste or write your tariff event in JSON format below. Once submitted, it will be sent to our API and appear in the Live Feed.
        </p>
      <textarea
  id="tariff-json"
  name="tariffJson"
  value={json}
  onChange={(e) => setJson(e.target.value)}
  spellCheck={false}
  autoCorrect="off"
  autoCapitalize="none"
  autoComplete="off"
  // password-manager hints (harmless if not present)
  data-lpignore="true"      // LastPass
  data-1p-ignore="true"     // 1Password
  data-form-type="other"    // Dashlane
  inputMode="text"
  style={{
    width: "100%",
    height: "140px",
    fontFamily: "monospace",
    fontSize: "0.9rem",
    padding: "0.5rem",
    border: `1px solid ${colors.purple}`,
    borderRadius: "4px",
    marginBottom: "0.5rem",
  }}
/>

        <div>
          <button
            onClick={send}
            style={{
              padding: "0.6rem 1.2rem",
              backgroundColor: colors.orange,
              color: colors.white,
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Send Tariff Event
          </button>
        </div>
        {status && <p style={{ marginTop: "0.5rem" }}>{status}</p>}
      </Card>

      <Card title="Live Tariff Feed">
        <p>This section shows all recent tariff events from our system in real time.</p>
        <button
          onClick={loadFeed}
          style={{
            padding: "0.4rem 1rem",
            backgroundColor: colors.purple,
            color: colors.white,
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Refresh
        </button>

        <div style={{ overflowX: "auto", marginTop: "1rem" }}>
          <table style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr>
                {["Commodity", "Rate", "Type", "Other"].map((header) => (
                  <th
                    key={header}
                    style={{
                      border: `1px solid ${colors.lightGray}`,
                      padding: "0.5rem",
                      backgroundColor: colors.purple,
                      color: colors.white,
                      textAlign: "left",
                    }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {Array.isArray(feed) && feed.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ padding: "0.5rem", textAlign: "center" }}>
                    No data
                  </td>
                </tr>
              )}

              {Array.isArray(feed) &&
                feed.map((item, idx) => {
                  const evt = normalizeEvent(item) || {};
                  const commodity = evt?.commodity ?? "-";
                  const rate = typeof evt?.rate === "number" ? evt.rate : (evt?.rate ?? "-");
                  const type = evt?.type ?? "-";

                  const other = {};
                  if (evt && typeof evt === "object") {
                    for (const k in evt) {
                      if (!["commodity", "rate", "type"].includes(k)) other[k] = evt[k];
                    }
                  }

                  return (
                    <tr
                      key={idx}
                      style={{ backgroundColor: idx % 2 === 0 ? "#fafafa" : colors.white }}
                    >
                      <td style={tdStyle}>{commodity}</td>
                      <td style={tdStyle}>{rate}</td>
                      <td style={tdStyle}>{type}</td>
                      <td style={tdStyle}>
                        {Object.keys(other).length ? JSON.stringify(other) : "—"}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  const AboutPage = () => (
    <div style={{ padding: "2rem", backgroundColor: colors.lightGray }}>
      <Card title="About">
        <p>
          Tariff Impact Tool is designed to help logistics professionals monitor, send, and analyze tariff
          events in real time. This tool integrates with APIs to process tariff data instantly, providing
          actionable insights.
        </p>
      </Card>
    </div>
  );

  const DesignPage = () => (
    <div style={{ padding: "2rem", backgroundColor: colors.lightGray }}>
      <Card title="Design">
        <p>This page contains design assets and prototypes for the Tariff Impact Tool.</p>
        <a
          href="https://www.figma.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: colors.orange }}
        >
          View Figma Design
        </a>
      </Card>
    </div>
  );

  const tdStyle = {
    border: `1px solid ${colors.lightGray}`,
    padding: "0.5rem",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <NavBar />
      <div style={{ flex: 1 }}>
        {page === "home" && <HomePage />}
        {page === "about" && <AboutPage />}
        {page === "design" && <DesignPage />}
      </div>
      <Footer />
    </div>
  );
}
