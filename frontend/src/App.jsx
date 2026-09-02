import { useEffect, useState } from "react";
import { api, clearToken, getToken, setToken } from "./api";

const emptyAlumni = {
  name: "",
  graduation_year: "",
  course: "",
  company: "",
  job_title: "",
  location: "",
  bio: "",
  linkedin_url: "",
};

const emptyArchive = {
  title: "",
  description: "",
  category: "School History",
  year: "",
  file_url: "",
  image_url: "",
};

const emptyEvent = {
  title: "",
  description: "",
  event_date: "",
  location: "",
};

function Auth({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ email: "", full_name: "", password: "" });
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    setError("");
    try {
      const result =
        mode === "login"
          ? await api.login({ email: form.email, password: form.password })
          : await api.register(form);
      setToken(result.access_token);
      onLogin(result.user);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <div className="brand-mark">RA</div>
        <h1>Rototuna Alumni Connect......</h1>
        <p className="muted">Connect alumni and preserve school history.</p>

        {error && <div className="alert">{error}</div>}

        <form onSubmit={submit} className="form">
          {mode === "register" && (
            <label>
              Full name
              <input
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                required
              />
            </label>
          )}

          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              minLength="8"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </label>

          <button className="primary" type="submit">
            {mode === "login" ? "Login" : "Create account"}
          </button>
        </form>

        <button className="link-button" onClick={() => setMode(mode === "login" ? "register" : "login")}>
          {mode === "login" ? "Create a new account" : "I already have an account"}
        </button>
      </section>
    </main>
  );
}

function Dashboard({ user, onLogout }) {
  const [tab, setTab] = useState("alumni");
  const [alumni, setAlumni] = useState([]);
  const [archive, setArchive] = useState([]);
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const [alumniForm, setAlumniForm] = useState(emptyAlumni);
  const [archiveForm, setArchiveForm] = useState(emptyArchive);
  const [eventForm, setEventForm] = useState(emptyEvent);

  async function loadAll() {
    try {
      setError("");
      const [a, ar, ev] = await Promise.all([
        api.alumni(),
        api.archive(),
        api.events(),
      ]);
      setAlumni(a);
      setArchive(ar);
      setEvents(ev);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function searchAlumni(e) {
    e.preventDefault();
    try {
      setAlumni(await api.alumni(search));
    } catch (err) {
      setError(err.message);
    }
  }

  async function addAlumni(e) {
    e.preventDefault();
    try {
      await api.createAlumni({
        ...alumniForm,
        graduation_year: alumniForm.graduation_year ? Number(alumniForm.graduation_year) : null,
      });
      setAlumniForm(emptyAlumni);
      await loadAll();
    } catch (err) {
      setError(err.message);
    }
  }

  async function addArchive(e) {
    e.preventDefault();
    try {
      await api.createArchive({
        ...archiveForm,
        year: archiveForm.year ? Number(archiveForm.year) : null,
      });
      setArchiveForm(emptyArchive);
      await loadAll();
    } catch (err) {
      setError(err.message);
    }
  }

  async function addEvent(e) {
    e.preventDefault();
    try {
      await api.createEvent({
        ...eventForm,
        event_date: new Date(eventForm.event_date).toISOString(),
      });
      setEventForm(emptyEvent);
      await loadAll();
    } catch (err) {
      setError(err.message);
    }
  }

  async function remove(kind, id) {
    try {
      if (kind === "alumni") await api.deleteAlumni(id);
      if (kind === "archive") await api.deleteArchive(id);
      if (kind === "event") await api.deleteEvent(id);
      await loadAll();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <strong>Rototuna Alumni Connect</strong>
          <span className="topbar-sub">Digital Archive</span>
        </div>
        <div className="user-actions">
          <span>{user.full_name}</span>
          <button onClick={onLogout}>Logout</button>
        </div>
      </header>

      <div className="layout">
        <aside className="sidebar">
          <button className={tab === "alumni" ? "nav active" : "nav"} onClick={() => setTab("alumni")}>Alumni</button>
          <button className={tab === "archive" ? "nav active" : "nav"} onClick={() => setTab("archive")}>Digital Archive</button>
          <button className={tab === "events" ? "nav active" : "nav"} onClick={() => setTab("events")}>Events</button>
          <a className="nav-link" href="http://localhost:8000/docs" target="_blank">API Docs ↗</a>
        </aside>

        <main className="content">
          <div className="hero">
            <div>
              <p className="eyebrow">WELCOME BACK</p>
              <h2>Build the Rototuna community.</h2>
              <p>Discover alumni, preserve memories, and stay connected.</p>
            </div>
          </div>

          {error && <div className="alert">{error}</div>}

          {tab === "alumni" && (
            <>
              <section className="panel">
                <div className="panel-heading">
                  <div>
                    <h3>Alumni Directory</h3>
                    <p className="muted">Search and add alumni profiles.</p>
                  </div>
                  <form onSubmit={searchAlumni} className="search">
                    <input placeholder="Search name, company, course..." value={search} onChange={(e) => setSearch(e.target.value)} />
                    <button>Search</button>
                  </form>
                </div>

                <div className="grid">
                  {alumni.map((person) => (
                    <article className="card" key={person.id}>
                      <div className="avatar">{person.name.split(" ").map(x => x[0]).join("").slice(0,2).toUpperCase()}</div>
                      <h4>{person.name}</h4>
                      <p>{person.job_title || "Alumni"} {person.company ? `· ${person.company}` : ""}</p>
                      <p className="muted">{person.course || "Course not listed"} {person.graduation_year ? `· ${person.graduation_year}` : ""}</p>
                      <p className="muted">{person.location || "Location not listed"}</p>
                      {person.linkedin_url && <a href={person.linkedin_url} target="_blank">LinkedIn ↗</a>}
                      <button className="danger-text" onClick={() => remove("alumni", person.id)}>Delete</button>
                    </article>
                  ))}
                </div>
              </section>

              <section className="panel">
                <h3>Add Alumni</h3>
                <form onSubmit={addAlumni} className="form two-col">
                  {Object.entries(emptyAlumni).map(([key]) => (
                    <label key={key}>
                      {key.replaceAll("_", " ")}
                      {key === "bio" ? (
                        <textarea value={alumniForm[key]} onChange={(e) => setAlumniForm({ ...alumniForm, [key]: e.target.value })} />
                      ) : (
                        <input value={alumniForm[key]} onChange={(e) => setAlumniForm({ ...alumniForm, [key]: e.target.value })} />
                      )}
                    </label>
                  ))}
                  <button className="primary" type="submit">Add alumni</button>
                </form>
              </section>
            </>
          )}

          {tab === "archive" && (
            <>
              <section className="panel">
                <h3>Digital Archive</h3>
                <p className="muted">A place for historical stories, photographs, documents and memories.</p>
                <div className="grid">
                  {archive.map((item) => (
                    <article className="card" key={item.id}>
                      {item.image_url && <img className="archive-image" src={item.image_url} alt="" />}
                      <span className="tag">{item.category}</span>
                      <h4>{item.title}</h4>
                      <p>{item.description}</p>
                      <p className="muted">{item.year || "Year not listed"}</p>
                      {item.file_url && <a href={item.file_url} target="_blank">Open resource ↗</a>}
                      <button className="danger-text" onClick={() => remove("archive", item.id)}>Delete</button>
                    </article>
                  ))}
                </div>
              </section>

              <section className="panel">
                <h3>Add Archive Item</h3>
                <form onSubmit={addArchive} className="form two-col">
                  <label>Title<input value={archiveForm.title} onChange={(e) => setArchiveForm({ ...archiveForm, title: e.target.value })} required /></label>
                  <label>Category<input value={archiveForm.category} onChange={(e) => setArchiveForm({ ...archiveForm, category: e.target.value })} /></label>
                  <label>Year<input type="number" value={archiveForm.year} onChange={(e) => setArchiveForm({ ...archiveForm, year: e.target.value })} /></label>
                  <label>Image URL<input value={archiveForm.image_url} onChange={(e) => setArchiveForm({ ...archiveForm, image_url: e.target.value })} /></label>
                  <label>File URL<input value={archiveForm.file_url} onChange={(e) => setArchiveForm({ ...archiveForm, file_url: e.target.value })} /></label>
                  <label>Description<textarea value={archiveForm.description} onChange={(e) => setArchiveForm({ ...archiveForm, description: e.target.value })} /></label>
                  <button className="primary" type="submit">Add archive item</button>
                </form>
              </section>
            </>
          )}

          {tab === "events" && (
            <>
              <section className="panel">
                <h3>Community Events</h3>
                <div className="grid">
                  {events.map((event) => (
                    <article className="card" key={event.id}>
                      <span className="tag">EVENT</span>
                      <h4>{event.title}</h4>
                      <p>{event.description}</p>
                      <p><strong>{new Date(event.event_date).toLocaleString()}</strong></p>
                      <p className="muted">{event.location}</p>
                      <button className="danger-text" onClick={() => remove("event", event.id)}>Delete</button>
                    </article>
                  ))}
                </div>
              </section>

              <section className="panel">
                <h3>Add Event</h3>
                <form onSubmit={addEvent} className="form two-col">
                  <label>Title<input value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} required /></label>
                  <label>Date and time<input type="datetime-local" value={eventForm.event_date} onChange={(e) => setEventForm({ ...eventForm, event_date: e.target.value })} required /></label>
                  <label>Location<input value={eventForm.location} onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })} /></label>
                  <label>Description<textarea value={eventForm.description} onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })} /></label>
                  <button className="primary" type="submit">Add event</button>
                </form>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(getToken()));

  useEffect(() => {
    if (!getToken()) return;
    api.me()
      .then(setUser)
      .catch(() => clearToken())
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="loading">Loading Rototuna Alumni Connect…</div>;
  }

  if (!user) {
    return <Auth onLogin={setUser} />;
  }

  return (
    <Dashboard
      user={user}
      onLogout={() => {
        clearToken();
        setUser(null);
      }}
    />
  );
}
