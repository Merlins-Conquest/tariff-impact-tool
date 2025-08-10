import { useState, useEffect, useRef } from "react";

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

const tdStyle = {
  border: `1px solid ${colors.lightGray}`,
  padding: "0.5rem",
};

function NavBar({ page, setPage }) {
  return (
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
          fontWeight: "900",
          fontSize: "2rem",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          letterSpacing: "1px",
        }}
        onClick={() => setPage("home")}
      >
        <span style={{ color: "#4d148c", backgroundColor: colors.white, padding: "0.2rem 0.4rem", borderRadius: "4px" }}>
          Tariff Impact
        </span>
        <span style={{ color: "#ff6600", marginLeft: "0.3rem" }}>
          Tool
        </span>
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
}


function Footer() {
  return (
<footer style={{
  marginTop: '2rem',
  padding: '1rem',
  backgroundColor: '#4D148C', // FedEx purple
  color: 'white',
  textAlign: 'center'
}}>
  <strong style={{ fontSize: '1.1rem' }}>
    Created by Randy Ramsammy
  </strong>
  <span style={{ display: 'block', fontSize: '0.9rem', marginTop: '0.2rem' }}>
    FedEx Dataworks Intern
  </span>
</footer>

  );
}

function Card({ title, children }) {
  return (
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
}

function HomePage({ textRef, defaultJson, status, onSend, feed, onRefresh }) {
  return (
    <div style={{ padding: "2rem", backgroundColor: colors.lightGray }}>
      <Card title="Enter a Tariff Event">
        <p style={{ marginBottom: "0.5rem" }}>
          Paste or write your tariff event in JSON format below. Once submitted, it will be sent to our API and appear in the Live Feed.
        </p>
        <textarea
          id="tariff-json"
          name="tariffJson"
          defaultValue={defaultJson}
          ref={textRef}
          spellCheck={false}
          autoCorrect="off"
          autoCapitalize="none"
          autoComplete="off"
          data-lpignore="true"
          data-1p-ignore="true"
          data-form-type="other"
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
            onClick={onSend}
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
          onClick={onRefresh}
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
}

function AboutPage() {
  return (
    <div style={{ padding: "2rem", backgroundColor: colors.lightGray }}>
      <Hero
        title="About the Tariff Impact Tool"
        subtitle="A technical demonstration of an event‑driven architecture for logistics and clearance workflows."
      />

      <Card title="What this project is">
        <p style={{ marginTop: 0 }}>
          The <strong>Tariff Impact Tool</strong> is a proof‑of‑concept I built to showcase my ability to design and
          implement <strong>event‑driven systems</strong> for logistics and customs clearance. It demonstrates end‑to‑end
          streaming—from a React UI through a backend API into <strong>Azure Event Hubs</strong> (Kafka‑compatible)—and
          a live feed UI that surfaces recent events instantly.
        </p>
        <div style={{ marginTop: "0.75rem" }}>
          <Badge>React (Azure Static Web Apps)</Badge>
          <Badge>API (Azure App Service)</Badge>
          <Badge>Azure Event Hubs (Kafka)</Badge>
          <Badge>TypeScript/JavaScript</Badge>
          <Badge>Event‑driven design</Badge>
        </div>
      </Card>

      <Card title="Why it matters for clearance platforms">
        <ul style={{ paddingLeft: 0, listStyle: "none", margin: 0 }}>
          <CheckItem>Enable <strong>touchless clearance</strong> over time by streaming tariff signals as events.</CheckItem>
          <CheckItem>Provide <strong>real‑time visibility</strong> into tariff impact on specific commodities.</CheckItem>
          <CheckItem>Decouple producers/consumers with a <strong>scalable message bus</strong> (Event Hubs/Kafka).</CheckItem>
          <CheckItem>Keep the UI fast with a lightweight <strong>browser cache</strong>—no DB required for the demo.</CheckItem>
          <CheckItem>Production‑ready direction: add auth, persistence (Cosmos/SQL), and push updates via SignalR.</CheckItem>
        </ul>
      </Card>

      <Card title="How it works (high level)">
        <ol style={{ marginTop: 0, paddingLeft: "1.1rem" }}>
          <li><strong>Send Tariff Event</strong> — UI posts JSON to <code>/demo/send</code>; API validates and publishes to Event Hubs.</li>
          <li><strong>Live Feed</strong> — UI calls <code>/feed/latest</code>; API reads recent events from Event Hubs and returns them.</li>
          <li><strong>UX</strong> — The table renders events and also saves a short history in <code>localStorage</code> for snappy reloads.</li>
        </ol>
        <p style={{ margin: 0 }}>
          This mirrors a modern clearance workflow where upstream systems emit events and downstream services react,
          enrich, and notify operations—without tight coupling.
        </p>
      </Card>

      <Card title="Roadmap (if taken to production)">
        <ul style={{ marginTop: 0 }}>
          <CheckItem>Persistence tier (Cosmos DB or SQL) for auditability and long‑term analytics.</CheckItem>
          <CheckItem>Secure endpoints with API keys/JWT + managed identities; store secrets in Key Vault.</CheckItem>
          <CheckItem>Push updates via <strong>Azure SignalR</strong> to remove manual refresh.</CheckItem>
          <CheckItem>Dashboards for SKU/HS code impact with filters, charts, and exports.</CheckItem>
          <CheckItem>Automated decisions (risk rules, thresholds) to reduce manual touches.</CheckItem>
        </ul>
      </Card>

      <Card title="Contact & Credits">
        <p style={{ marginTop: 0 }}>
          Built by <strong>Randy Ramsammy</strong> — FedEx Dataworks Intern. This demo is intended for hiring managers
          and platform teams evaluating event‑driven approaches to clearance.
        </p>
      </Card>
    </div>
  );
}


function DesignPage() {
  return (
    <div style={{ padding: "2rem", backgroundColor: colors.lightGray }}>
      <Card title="Design Overview">
        <p>
          The Tariff Impact Tool is an event-driven demo designed to simulate
          how clearance platforms can achieve touchless clearance and
          real-time visibility into tariff impacts for specific commodities.
        </p>
        <p>
          The application uses a React frontend hosted on Azure Static Web Apps,
          an Azure App Service backend API, and Azure Event Hubs (Kafka-compatible)
          for streaming tariff events. Data is cached in the browser’s
          <code> localStorage </code> for quick reloads without a database.
        </p>
        <p>
          Key goals:
        </p>
        <ul>
          <li>Demonstrate end-to-end streaming from UI → API → Event Hubs → UI</li>
          <li>Highlight scalable architecture patterns for logistics clearance</li>
          <li>Show how commodity-level tariff data can be standardized in JSON</li>
        </ul>

        {/* Figma preview image hosted in Git repo */}
        <div style={{ margin: "2rem 0" }}>
          <img
              src="/images/arch_figma.png"
            alt="Figma Design Preview"
            style={{
              maxWidth: "100%",
              border: "1px solid #ccc",
              borderRadius: "8px",
            }}
          />
        </div>

        {/* Link to live Figma */}
        <a
          href="https://www.figma.com/board/FVlUu87LI4szbnNyIeCn8D/Tariff-Impact-Tool?t=C3jIpskltc41qS9D-1" // replace with your actual Figma link
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: colors.orange, fontWeight: "bold", fontSize: "1.1rem" }}
        >
          View Full Figma Design →
        </a>
      </Card>
    </div>
  );
}
  function Hero({ title, subtitle }) {
  return (
    <div
      style={{
        background: `linear-gradient(135deg, ${colors.purple} 0%, ${colors.orange} 100%)`,
        color: colors.white,
        borderRadius: "12px",
        padding: "2rem",
        boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
        marginBottom: "1.5rem",
      }}
    >
      <h1 style={{ margin: 0, fontSize: "1.8rem", lineHeight: 1.2 }}>{title}</h1>
      <p style={{ margin: "0.5rem 0 0", opacity: 0.95 }}>{subtitle}</p>
    </div>
  );
}

function Badge({ children }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "0.35rem 0.6rem",
        borderRadius: "999px",
        backgroundColor: "#F1ECF8",
        color: colors.purple,
        fontSize: "0.85rem",
        fontWeight: 600,
        marginRight: "0.5rem",
        marginBottom: "0.5rem",
        border: `1px solid rgba(77,20,140,0.12)`,
      }}
    >
      {children}
    </span>
  );
}

function CheckItem({ children }) {
  return (
    <li style={{ display: "flex", alignItems: "flex-start", marginBottom: "0.5rem" }}>
      <svg width="18" height="18" viewBox="0 0 24 24" style={{ marginTop: 2, marginRight: 8 }}>
        <path fill={colors.orange} d="M9 16.2l-3.5-3.5L4 14.2l5 5 11-11-1.5-1.5z" />
      </svg>
      <span>{children}</span>
    </li>
  );
}



// ---------- App ----------
export default function App() {
  const [status, setStatus] = useState("");
  const [feed, setFeed] = useState([]);
  const [page, setPage] = useState("home"); // home | about | design
  const textRef = useRef(null);
  const API = import.meta.env.VITE_API_URL;

  const onSend = async () => {
    try {
      const raw = textRef.current?.value ?? "";
      const body = JSON.parse(raw);
      const res = await fetch(`${API}/demo/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(await res.text());
      setStatus("Tariff event sent successfully!");
      setTimeout(() => setStatus(""), 3000);
      onRefresh();
    } catch (err) {
      setStatus("Error: " + err.message);
    }
  };

  const onRefresh = async () => {
    try {
      const res = await fetch(`${API}/feed/latest`);
      const data = await res.json();
      const parsed = Array.isArray(data) ? data.map((d) => normalizeEvent(d)) : [];
      setFeed(parsed);
    } catch (err) {
      setFeed([{ error: err.message }]);
    }
  };

  useEffect(() => {
    if (page === "home") onRefresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <NavBar page={page} setPage={setPage} />
      <div style={{ flex: 1 }}>
        {page === "home" && (
          <HomePage
            textRef={textRef}
            defaultJson={defaultJson}
            status={status}
            onSend={onSend}
            feed={feed}
            onRefresh={onRefresh}
          />
        )}
        {page === "about" && <AboutPage />}
        {page === "design" && <DesignPage />}
      </div>
      <Footer />
    </div>
  );
}
