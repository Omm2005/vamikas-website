import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { LogOut, Trash2, Upload } from "lucide-react";
import { API } from "@/lib/api";

const CATEGORIES = ["garments", "sketchbook", "textiles", "art", "experiments", "editorial", "process"];

const EMPTY_FORM = { title: "", category: "garments", medium: "", year: "", description: "", diary: "" };

const formatError = (detail) => {
  if (detail == null) return "something went wrong.";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) return detail.map((e) => e?.msg || JSON.stringify(e)).join(" ");
  return String(detail);
};

const Admin = () => {
  const [user, setUser] = useState(undefined);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [links, setLinks] = useState({ email: "", instagram: "", elsewhere: "" });
  const [linksStatus, setLinksStatus] = useState("");

  const loadItems = () =>
    axios
      .get(`${API}/gallery`)
      .then((res) => setItems(res.data.items || []))
      .catch(() => {});

  const loadLinks = () =>
    axios
      .get(`${API}/settings/links`)
      .then((res) =>
        setLinks({
          email: res.data?.email || "",
          instagram: res.data?.instagram || "",
          elsewhere: res.data?.elsewhere || "",
        }),
      )
      .catch(() => {});

  useEffect(() => {
    axios
      .get(`${API}/auth/me`, { withCredentials: true })
      .then((res) => {
        setUser(res.data);
        loadItems();
        loadLinks();
      })
      .catch(() => setUser(null));
  }, []);

  const login = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await axios.post(
        `${API}/auth/login`,
        { email, password },
        { withCredentials: true },
      );
      setUser(data);
      loadItems();
      loadLinks();
    } catch (err) {
      setError(formatError(err.response?.data?.detail));
    }
  };

  const logout = async () => {
    await axios.post(`${API}/auth/logout`, {}, { withCredentials: true }).catch(() => {});
    setUser(null);
  };

  const saveLinks = async (e) => {
    e.preventDefault();
    setLinksStatus("saving…");
    try {
      await axios.put(`${API}/settings/links`, links, { withCredentials: true });
      setLinksStatus("links are live on the contact page ✓");
    } catch (err) {
      setLinksStatus(formatError(err.response?.data?.detail));
    }
  };

  const upload = async (e) => {
    e.preventDefault();
    if (!file) {
      setStatus("pick an image first.");
      return;
    }
    setStatus("uploading…");
    try {
      const fd = new FormData();
      fd.append("file", file);
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      await axios.post(`${API}/gallery`, fd, { withCredentials: true });
      setStatus("added to the archive ✓");
      setForm(EMPTY_FORM);
      setFile(null);
      e.target.reset();
      loadItems();
    } catch (err) {
      setStatus(formatError(err.response?.data?.detail));
    }
  };

  const remove = async (id) => {
    await axios.delete(`${API}/gallery/${id}`, { withCredentials: true }).catch(() => {});
    loadItems();
  };

  const inputCls =
    "w-full bg-paper border border-ink/50 px-4 py-3 font-sans text-sm text-ink placeholder:text-smoke/60 focus:outline-none focus:border-burgundy transition-colors";

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-cream min-h-screen pt-32 sm:pt-40 px-5 sm:px-16 pb-24"
    >
      <p className="font-hand text-2xl text-wine -rotate-2 mb-2">for vamika only —</p>
      <h1
        data-testid="admin-title"
        className="font-serif font-light uppercase tracking-tighter text-5xl sm:text-7xl"
      >
        the <span className="italic text-outline">studio</span>
      </h1>

      {user === undefined && <p className="mt-10 font-sans text-sm text-smoke">checking the key…</p>}

      {user === null && (
        <form data-testid="admin-login-form" onSubmit={login} className="mt-12 max-w-md space-y-4">
          <input
            data-testid="admin-email-input"
            type="email"
            required
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputCls}
          />
          <input
            data-testid="admin-password-input"
            type="password"
            required
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputCls}
          />
          {error && (
            <p data-testid="admin-login-error" className="font-hand text-xl text-wine">
              {error}
            </p>
          )}
          <button
            data-testid="admin-login-button"
            type="submit"
            className="border border-ink bg-cream px-7 py-3 text-xs tracking-[0.3em] uppercase font-sans shadow-[4px_4px_0px_#1A1A1A] hover:shadow-[6px_6px_0px_#9E4751] transition-shadow duration-300"
          >
            unlock the studio
          </button>
        </form>
      )}

      {user && (
        <div className="mt-12 grid lg:grid-cols-2 gap-14">
          <section>
            <div className="flex items-center justify-between">
              <h2 className="font-serif italic text-3xl">add a piece</h2>
              <button
                data-testid="admin-logout-button"
                onClick={logout}
                className="flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase text-smoke hover:text-wine transition-colors"
              >
                <LogOut size={14} /> log out
              </button>
            </div>

            <form data-testid="admin-upload-form" onSubmit={upload} className="mt-6 space-y-4">
              <input
                data-testid="upload-title-input"
                required
                placeholder="title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className={inputCls}
              />
              <select
                data-testid="upload-category-select"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className={inputCls}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <div className="grid grid-cols-2 gap-4">
                <input
                  data-testid="upload-medium-input"
                  placeholder="medium (e.g. cotton, embroidery)"
                  value={form.medium}
                  onChange={(e) => setForm({ ...form, medium: e.target.value })}
                  className={inputCls}
                />
                <input
                  data-testid="upload-year-input"
                  placeholder="year"
                  value={form.year}
                  onChange={(e) => setForm({ ...form, year: e.target.value })}
                  className={inputCls}
                />
              </div>
              <textarea
                data-testid="upload-description-input"
                placeholder="a line or two about it"
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className={inputCls}
              />
              <textarea
                data-testid="upload-diary-input"
                placeholder="diary note (optional) — a handwritten thought that unfolds in the viewer"
                rows={2}
                value={form.diary}
                onChange={(e) => setForm({ ...form, diary: e.target.value })}
                className={`${inputCls} font-hand text-xl`}
              />
              <input
                data-testid="upload-file-input"
                type="file"
                accept="image/*"
                required
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full font-sans text-sm text-smoke file:mr-4 file:border file:border-ink file:bg-cream file:px-4 file:py-2 file:text-xs file:tracking-[0.2em] file:uppercase file:font-sans hover:file:bg-paper"
              />
              {status && (
                <p data-testid="upload-status" className="font-hand text-xl text-wine">
                  {status}
                </p>
              )}
              <button
                data-testid="upload-submit-button"
                type="submit"
                className="flex items-center gap-3 border border-ink bg-ink text-cream px-7 py-3 text-xs tracking-[0.3em] uppercase font-sans shadow-[4px_4px_0px_#6B1226] hover:shadow-[6px_6px_0px_#B04A5C] transition-shadow duration-300"
              >
                <Upload size={14} /> add to the archive
              </button>
            </form>
          </section>

          <section>
            <h2 className="font-serif italic text-3xl">contact links</h2>
            <p className="mt-1 font-hand text-xl text-smoke -rotate-1">
              these appear on the contact page
            </p>
            <form
              data-testid="admin-links-form"
              onSubmit={saveLinks}
              className="mt-5 space-y-3 border border-dashed border-burgundy/60 bg-paper/60 p-5"
            >
              <input
                data-testid="links-email-input"
                type="text"
                placeholder="email (e.g. hello@vamika.com)"
                value={links.email}
                onChange={(e) => setLinks({ ...links, email: e.target.value })}
                className={inputCls}
              />
              <input
                data-testid="links-instagram-input"
                type="text"
                placeholder="instagram (e.g. @vamika.menon or full url)"
                value={links.instagram}
                onChange={(e) => setLinks({ ...links, instagram: e.target.value })}
                className={inputCls}
              />
              <input
                data-testid="links-elsewhere-input"
                type="text"
                placeholder="elsewhere (portfolio / behance / any url)"
                value={links.elsewhere}
                onChange={(e) => setLinks({ ...links, elsewhere: e.target.value })}
                className={inputCls}
              />
              {linksStatus && (
                <p data-testid="links-status" className="font-hand text-xl text-wine">
                  {linksStatus}
                </p>
              )}
              <button
                data-testid="links-save-button"
                type="submit"
                className="border border-ink bg-cream px-6 py-2.5 text-xs tracking-[0.3em] uppercase font-sans shadow-[4px_4px_0px_#1A1A1A] hover:shadow-[6px_6px_0px_#6B1226] transition-shadow duration-300"
              >
                save links
              </button>
            </form>

            <h2 className="font-serif italic text-3xl mt-12">in the archive ({items.length})</h2>
            <div className="mt-6 space-y-3 max-h-[60vh] overflow-y-auto pr-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  data-testid={`admin-item-${item.id}`}
                  className="flex items-center gap-4 border border-ink/50 bg-paper p-3"
                >
                  <img
                    src={`${API}/files/${item.storage_path}`}
                    alt={item.title}
                    className="w-14 h-14 object-cover border border-ink/40"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-serif italic text-lg truncate">{item.title}</p>
                    <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-smoke">
                      {item.category}
                      {item.year ? ` · ${item.year}` : ""}
                    </p>
                  </div>
                  <button
                    data-testid={`admin-delete-${item.id}`}
                    onClick={() => remove(item.id)}
                    className="text-smoke hover:text-wine transition-colors"
                    aria-label="delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              {items.length === 0 && (
                <p className="font-hand text-2xl text-smoke">nothing pinned yet.</p>
              )}
            </div>
          </section>
        </div>
      )}
    </motion.main>
  );
};

export default Admin;
