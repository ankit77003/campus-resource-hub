import { useEffect, useMemo, useState } from "react";
import { apiFetch, apiJson } from "../lib/api";
import { getToken } from "../lib/auth";

function buildQuery(params) {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === "" || v === null || v === undefined) continue;
    q.set(k, String(v));
  }
  const s = q.toString();
  return s ? `?${s}` : "";
}

export function BrowsePage() {
  const [filters, setFilters] = useState({ subject: "", semester: "", type: "" });
  const [search, setSearch] = useState("");
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const authed = useMemo(() => Boolean(getToken()), []);

  async function load() {
    setBusy(true);
    setError("");
    try {
      const q = buildQuery(filters);
      const data = await apiFetch(`/api/resources${q}`);
      setItems(data.resources || []);
    } catch (err) {
      setError(err.message || "Failed to load resources");
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onSearch(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const q = buildQuery({ q: search.trim() });
      const data = await apiFetch(`/api/resources/search${q}`);
      setItems(data.resources || []);
    } catch (err) {
      setError(err.message || "Search failed");
    } finally {
      setBusy(false);
    }
  }

  async function onApplyFilters(e) {
    e.preventDefault();
    await load();
  }

  async function vote(id, direction) {
    try {
      const data = await apiJson(`/api/resources/${id}/vote`, { method: "POST", body: { direction } });
      setItems((prev) =>
        prev.map((r) => (r._id === id ? { ...r, upvotes: data.resource.upvotes, downvotes: data.resource.downvotes } : r)),
      );
    } catch (err) {
      setError(err.message || "Voting failed");
    }
  }

  return (
    <div className="grid">
      <div className="card">
        <div className="title">Browse resources</div>

        <div className="grid cols-3">
          <form className="row" onSubmit={onSearch}>
            <div className="field">
              <label>Search (title or subject)</label>
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="e.g. DBMS" />
            </div>
            <button className="btn" disabled={busy} type="submit">
              Search
            </button>
          </form>

          <form className="row" onSubmit={onApplyFilters}>
            <div className="field">
              <label>Subject</label>
              <input
                value={filters.subject}
                onChange={(e) => setFilters((f) => ({ ...f, subject: e.target.value }))}
                placeholder="e.g. OS"
              />
            </div>
            <div className="field">
              <label>Semester</label>
              <input
                type="number"
                min="1"
                max="12"
                value={filters.semester}
                onChange={(e) => setFilters((f) => ({ ...f, semester: e.target.value }))}
                placeholder="e.g. 4"
              />
            </div>
            <div className="field">
              <label>Type</label>
              <select value={filters.type} onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}>
                <option value="">All</option>
                <option value="notes">Notes</option>
                <option value="PYQ">PYQ</option>
                <option value="assignment">Assignment</option>
              </select>
            </div>
            <button className="btn" disabled={busy} type="submit">
              Apply filters
            </button>
          </form>
        </div>

        {error ? <div className="error" style={{ marginTop: 10 }}>{error}</div> : null}
      </div>

      <div className="card">
        <div className="muted" style={{ marginBottom: 10 }}>
          {busy ? "Loading..." : `${items.length} result(s)`}
        </div>

        {items.length === 0 ? (
          <div className="muted">No resources found.</div>
        ) : (
          <div className="row" style={{ gap: 10 }}>
            {items.map((r) => (
              <div
                key={r._id}
                className="card"
                style={{ background: "#fff", borderColor: "var(--border)" }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                  <div>
                    <div style={{ fontWeight: 800 }}>{r.title}</div>
                    <div className="muted">
                      {r.subject} · Sem {r.semester} · {r.type}
                    </div>
                    <div className="muted">
                      Votes: {r.upvotes || 0} up / {r.downvotes || 0} down
                    </div>
                  </div>

                  <div className="row" style={{ alignContent: "start" }}>
                    <a className="btn" href={`${import.meta.env.VITE_API_BASE_URL || "http://localhost:4001"}/api/resources/${r._id}/view`} target="_blank" rel="noreferrer">
                      View
                    </a>
                    <a className="btn" href={`${import.meta.env.VITE_API_BASE_URL || "http://localhost:4001"}/api/resources/${r._id}/download`}>
                      Download
                    </a>
                    {authed ? (
                      <div style={{ display: "flex", gap: 8 }}>
                        <button className="btn" type="button" onClick={() => vote(r._id, "up")}>
                          Upvote
                        </button>
                        <button className="btn" type="button" onClick={() => vote(r._id, "down")}>
                          Downvote
                        </button>
                      </div>
                    ) : (
                      <div className="muted">Login to vote</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

