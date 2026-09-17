import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { LogOut, Trash2, Upload } from "lucide-react";
import { API } from "@/lib/api";
import { ALL_SLOTS, SLOT_GROUPS, mapPhotos, parseMedium, photoUrl, withSlot } from "@/lib/slots";

const CATEGORIES = ["garments", "sketchbook", "textiles", "art", "experiments", "editorial", "process"];

const EMPTY_FORM = { title: "", category: "garments", medium: "", year: "", description: "", diary: "", slot: "" };

const slotLabel = (id) => {
  const found = ALL_SLOTS.find((s) => s.id === id);
  return found ? `${found.group.page} · ${found.label}` : id;
};

// "something went wrong." told nobody anything. A failure here is almost
// always one of three things — the server said no and explained, the server
// said no without explaining, or the request never arrived — and the message
// should say which.
const formatError = (err) => {
  const response = err?.response;
  if (!response) {
    return err?.message
      ? `couldn't reach the server — ${err.message.toLowerCase()}`
      : "couldn't reach the server.";
  }
  const detail = response.data?.detail;
  if (typeof detail === "string" && detail) return detail;
  if (Array.isArray(detail) && detail.length) {
    return detail.map((e) => e?.msg || JSON.stringify(e)).join(" ");
  }
  if (detail && typeof detail === "object") return JSON.stringify(detail);
  if (response.status === 413) return "that image is too large for the server.";
  return `the server refused it (${response.status} ${response.statusText || ""}).`.trim();
};

const Admin = () => {
  const [user, setUser] = useState(undefined);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
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
      setError(formatError(err));
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
      setLinksStatus(formatError(err));
    }
  };

  // Object URLs have to be handed back or the page leaks one per pick.
  const chooseFile = (picked) => {
    setPreview((current) => {
      if (current) URL.revokeObjectURL(current);
      return picked ? URL.createObjectURL(picked) : "";
    });
    setFile(picked);
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
      const { slot, ...fields } = form;
      Object.entries({ ...fields, medium: withSlot(fields.medium, slot) }).forEach(([k, v]) =>
        fd.append(k, v),
      );
      await axios.post(`${API}/gallery`, fd, { withCredentials: true });
      setStatus(
        form.slot
          ? `added ✓ — it is now live in ${slotLabel(form.slot)}`
          : "added to the archive ✓",
      );
      setForm(EMPTY_FORM);
      chooseFile(null);
      e.target.reset();
      loadItems();
    } catch (err) {
      setStatus(formatError(err));
    }
  };

  const remove = async (id) => {
    await axios.delete(`${API}/gallery/${id}`, { withCredentials: true }).catch(() => {});
    loadItems();
  };

  // Which photo is standing in each spot on the site right now.
  const filled = mapPhotos(items);

  const labelCls = "font-sans text-[10px] tracking-[0.3em] uppercase text-wine";
  const subLabelCls = "mb-1.5 block font-sans text-[11px] text-smoke";

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

            <form data-testid="admin-upload-form" onSubmit={upload} className="mt-7 space-y-8">
              {/* 1 — the photo. It is the point of the form, so it goes first
                  and takes the room, instead of being a file button buried
                  under six identical text boxes. */}
              <div>
                <p className={labelCls}>the photo</p>
                <label className="mt-2 flex items-center gap-5 border border-dashed border-burgundy/50 bg-paper/60 p-4 cursor-pointer hover:border-burgundy transition-colors">
                  <div className="w-24 h-32 shrink-0 border border-ink/30 bg-cream overflow-hidden relative">
                    {preview ? (
                      <img src={preview} alt="" className="absolute inset-0 w-full h-full object-cover" />
                    ) : (
                      <span className="absolute inset-0 flex items-center justify-center font-hand text-lg text-smoke/70 -rotate-3">
                        none yet
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-serif italic text-xl">
                      {file ? file.name : "choose an image"}
                    </p>
                    <p className="mt-1 font-sans text-xs text-smoke">
                      {file
                        ? `${(file.size / 1024 / 1024).toFixed(1)} MB — click to swap`
                        : "jpg or png · it is served at full size, so resize large exports first"}
                    </p>
                  </div>
                  <input
                    data-testid="upload-file-input"
                    type="file"
                    accept="image/*"
                    required
                    onChange={(e) => chooseFile(e.target.files?.[0] || null)}
                    className="sr-only"
                  />
                </label>
              </div>

              {/* 2 — where it lives */}
              <div className="space-y-4">
                <p className={labelCls}>where it lives</p>
                <label className="block">
                  <span className={subLabelCls}>title</span>
                  <input
                    data-testid="upload-title-input"
                    required
                    placeholder="what it is called"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className={inputCls}
                  />
                </label>
                <div className="grid sm:grid-cols-2 gap-4">
                  <label className="block">
                    <span className={subLabelCls}>category</span>
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
                  </label>
                  <label className="block">
                    <span className={subLabelCls}>year</span>
                    <input
                      data-testid="upload-year-input"
                      placeholder="2026"
                      value={form.year}
                      onChange={(e) => setForm({ ...form, year: e.target.value })}
                      className={inputCls}
                    />
                  </label>
                </div>
                <label className="block">
                  <span className={subLabelCls}>a spot on the site</span>
                  <select
                    data-testid="upload-slot-select"
                    value={form.slot}
                    onChange={(e) => setForm({ ...form, slot: e.target.value })}
                    className={inputCls}
                  >
                    <option value="">the archive only</option>
                    {SLOT_GROUPS.map((group) => (
                      <optgroup key={group.id} label={`${group.page} — ${group.title}`}>
                        {group.slots.map((slot) => (
                          <option key={slot.id} value={slot.id}>
                            {slot.label}
                            {filled[slot.id] ? " — replaces current" : ""}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  <span className="mt-1.5 block font-hand text-lg text-smoke leading-tight">
                    {form.slot
                      ? `it will show up as ${slotLabel(form.slot)}`
                      : "leave as is and it only appears in the archive"}
                  </span>
                </label>
              </div>

              {/* 3 — the words, all optional, kept apart from the required bits */}
              <div className="space-y-4">
                <p className={labelCls}>the words — all optional</p>
                <label className="block">
                  <span className={subLabelCls}>medium</span>
                  <input
                    data-testid="upload-medium-input"
                    placeholder="cotton, embroidery, …"
                    value={form.medium}
                    onChange={(e) => setForm({ ...form, medium: e.target.value })}
                    className={inputCls}
                  />
                </label>
                <label className="block">
                  <span className={subLabelCls}>description</span>
                  <textarea
                    data-testid="upload-description-input"
                    placeholder="a line or two about it"
                    rows={3}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className={inputCls}
                  />
                </label>
                <label className="block">
                  <span className={subLabelCls}>diary note</span>
                  <textarea
                    data-testid="upload-diary-input"
                    placeholder="a handwritten thought that unfolds in the viewer"
                    rows={2}
                    value={form.diary}
                    onChange={(e) => setForm({ ...form, diary: e.target.value })}
                    className={`${inputCls} font-hand text-xl`}
                  />
                </label>
              </div>

              <div className="flex flex-wrap items-center gap-4 border-t border-ink/15 pt-6">
                <button
                  data-testid="upload-submit-button"
                  type="submit"
                  className="flex items-center gap-3 border border-ink bg-ink text-cream px-7 py-3 text-xs tracking-[0.3em] uppercase font-sans shadow-[4px_4px_0px_#6B1226] hover:shadow-[6px_6px_0px_#B04A5C] transition-shadow duration-300"
                >
                  <Upload size={14} /> add to the archive
                </button>
                {status && (
                  <p data-testid="upload-status" className="font-hand text-xl text-wine">
                    {status}
                  </p>
                )}
              </div>
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

            <h2 className="font-serif italic text-3xl mt-12">
              on the site ({Object.keys(filled).length}/{ALL_SLOTS.length})
            </h2>
            <p className="mt-1 font-hand text-xl text-smoke -rotate-1">
              every photo spot on the site — empty ones show the drawn placeholder
            </p>
            <div
              data-testid="admin-slots"
              className="mt-5 space-y-6 max-h-[60vh] overflow-y-auto pr-2 border border-dashed border-burgundy/60 bg-paper/60 p-5"
            >
              {SLOT_GROUPS.map((group) => (
                <div key={group.id}>
                  <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-wine">
                    {group.page} — {group.title}
                  </p>
                  {group.hint && (
                    <p className="mt-1 font-hand text-lg text-smoke leading-tight">{group.hint}</p>
                  )}
                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {group.slots.map((slot) => {
                      const item = filled[slot.id];
                      return (
                        <div key={slot.id} data-testid={`slot-${slot.id}`} className="min-w-0">
                          <div className="aspect-[3/4] border border-ink/50 bg-cream overflow-hidden relative">
                            {item ? (
                              <img
                                src={photoUrl(item)}
                                alt={item.title}
                                className="absolute inset-0 w-full h-full object-cover"
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="font-hand text-lg text-smoke/70 -rotate-3">empty</span>
                              </div>
                            )}
                          </div>
                          <p className="mt-1.5 font-sans text-[10px] leading-tight text-smoke truncate">
                            {slot.label}
                          </p>
                          {item && (
                            <button
                              data-testid={`slot-clear-${slot.id}`}
                              onClick={() => remove(item.id)}
                              className="mt-0.5 font-sans text-[10px] tracking-[0.2em] uppercase text-smoke hover:text-wine transition-colors"
                            >
                              remove
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

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
                      {parseMedium(item.medium).slot
                        ? ` · ${slotLabel(parseMedium(item.medium).slot)}`
                        : ""}
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
