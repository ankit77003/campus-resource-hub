import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadResource } from "../lib/api";

const TYPES = [
  { value: "notes", label: "Notes" },
  { value: "PYQ", label: "PYQ" },
  { value: "assignment", label: "Assignment" },
];

export function UploadPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    subject: "",
    semester: 1,
    type: "notes",
  });
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    if (!file) return setError("Please select a file.");
    setBusy(true);
    try {
      const fd = new FormData();
      fd.set("title", form.title);
      fd.set("subject", form.subject);
      fd.set("semester", String(form.semester));
      fd.set("type", form.type);
      fd.set("file", file);
      await uploadResource(fd);
      navigate("/browse");
    } catch (err) {
      setError(err.message || "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card" style={{ maxWidth: 760 }}>
      <div className="title">Upload resource</div>
      <form className="row" onSubmit={onSubmit}>
        <div className="field">
          <label>Title</label>
          <input value={form.title} onChange={(e) => set("title", e.target.value)} required />
        </div>

        <div className="grid cols-3">
          <div className="field">
            <label>Subject</label>
            <input value={form.subject} onChange={(e) => set("subject", e.target.value)} required />
          </div>
          <div className="field">
            <label>Semester</label>
            <input
              type="number"
              min="1"
              max="12"
              value={form.semester}
              onChange={(e) => set("semester", Number(e.target.value))}
              required
            />
          </div>
          <div className="field">
            <label>Type</label>
            <select value={form.type} onChange={(e) => set("type", e.target.value)} required>
              {TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="field">
          <label>File</label>
          <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} required />
          <div className="muted" style={{ marginTop: 6 }}>
            Max 25MB.
          </div>
        </div>

        {error ? <div className="error">{error}</div> : null}

        <button className="btn primary" disabled={busy} type="submit">
          {busy ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
}

