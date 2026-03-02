/**
 * New Vision Project - FINAL (Vercel + Supabase)
 * - Safe refresh: s'ngel ne "Duke ngarkuar..."
 * - Anti-freeze: keepalive + visibility refresh
 * - Download direkt (jo tab)
 * - Activity me emra (profiles.full_name)
 * - Remember me (OFF => signOut ne close)
 * - Full Name ruhet 1 here (nuk ndryshohet pas regjistrimit)
 */

const SUPABASE_URL = "https://isakjtxcjpifuvhzpltq.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzYWtqdHhjanBpZnV2aHpwbHRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MDA0ODQsImV4cCI6MjA4NzE3NjQ4NH0.3W1pM35dIZxsTnBpdXdiRYMBaFO4sV1oU8UnDBbNfsc";

const BUCKET = "skica";
const PROCESSOR_BASE = "https://pastrimi-pikave-yllarti.onrender.com";

const SECTION_LABELS = {
  raw_points: "01 - Pika (RAW)",
  processed_points: "02 - Pika (PROCESSED)",
  dwg_plane: "03 - DWG Plane",
  dwg_pamje: "04 - DWG Pamje / Fasada",
  dwg_final: "05 - DWG Finale",
  dorezime: "06 - Dorëzime",
  skica: "07 - Skica / Materiale të tjera",
};

const DELIVERABLE_SECTIONS = new Set(["dwg_final", "dorezime"]);

// ---------- small utils ----------
function extOf(name) {
  const i = String(name || "").lastIndexOf(".");
  return i >= 0 ? name.slice(i + 1).toLowerCase() : "";
}
function fileTypeFromExt(ext) {
  if (["csv", "idx"].includes(ext)) return "points_raw";
  if (["txt"].includes(ext)) return "points_processed";
  if (["dwg"].includes(ext)) return "dwg";
  if (["pdf"].includes(ext)) return "pdf";
  if (["zip", "rar", "7z"].includes(ext)) return "archive";
  if (["jpg", "jpeg", "png", "webp"].includes(ext)) return "image";
  return "other";
}
function rand6() {
  return Math.random().toString(36).slice(2, 8);
}
function escapeHtml(str) {
  return String(str || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
function fmtDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleString("sq-AL", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
function toDatetimeLocalValue(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// ---------- Remember me ----------
const REMEMBER_KEY = "nvp-remember-me";
function getRememberMe() {
  const v = localStorage.getItem(REMEMBER_KEY);
  return v === null ? true : v === "1";
}
function setRememberMe(v) {
  localStorage.setItem(REMEMBER_KEY, v ? "1" : "0");
}

// ---------- Supabase client ----------
function makeSupabaseClient() {
  if (!window.supabase?.createClient) {
    throw new Error("Supabase library nuk u ngarkua. Kontrollo script supabase-js@2.");
  }
  return window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: window.localStorage,
    },
  });
}

let sup;
try {
  sup = makeSupabaseClient();
  sup.auth.startAutoRefresh();
} catch (e) {
  console.error(e);
  alert("Gabim: Supabase nuk u inicializua. Kontrollo console.");
}

// ---------- UI refs ----------
const alertArea = document.getElementById("alert-area");
const authSection = document.getElementById("auth-section");
const appSection = document.getElementById("app-section");
const userEmailTop = document.getElementById("user-email-top");

const signupBtn = document.getElementById("signup-btn");
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const refreshBtn = document.getElementById("refresh-btn");

const projectForm = document.getElementById("project-form");
const projectCategorySelect = document.getElementById("project-category");
const projectsTableBody = document.querySelector("#projects-table tbody");

const filterCategory = document.getElementById("filter-category");
const searchInput = document.getElementById("search-input");

const kpiProjects = document.getElementById("kpi-projects");
const kpiFiles = document.getElementById("kpi-files");
const kpiActivity = document.getElementById("kpi-activity");

// Panel
const panelHint = document.getElementById("panel-hint");
const panelProjectId = document.getElementById("panel-project-id");
const panelContent = document.getElementById("panel-content");
const panelProjectName = document.getElementById("panel-project-name");
const panelProjectCategory = document.getElementById("panel-project-category");
const panelProjectLocation = document.getElementById("panel-project-location");

const refreshFilesBtn = document.getElementById("refresh-files-btn");
const refreshActivityBtn = document.getElementById("refresh-activity-btn");
const activityList = document.getElementById("activity-list");

// Upload modal
const uploadModalEl = document.getElementById("uploadModal");
const uploadForm = document.getElementById("upload-form");
const uploadProjectIdInput = document.getElementById("upload-project-id");
const uploadSectionInput = document.getElementById("upload-section");
const uploadSectionLabel = document.getElementById("upload-section-label");
const uploadFilesInput = document.getElementById("upload-files");

// Deliverable modal
const deliverableModalEl = document.getElementById("deliverableModal");
const deliverableForm = document.getElementById("deliverable-form");
const deliverableFileId = document.getElementById("deliverable-file-id");
const deliverableFileName = document.getElementById("deliverable-file-name");
const deliverableStatus = document.getElementById("deliverable-status");
const deliverableDate = document.getElementById("deliverable-date");
const deliverableComment = document.getElementById("deliverable-comment");

const rememberMeEl = document.getElementById("remember-me");

// Auth inputs
const authFullnameEl = document.getElementById("auth-fullname");
const authEmailEl = document.getElementById("auth-email");
const authPassEl = document.getElementById("auth-password");

// ---------- state ----------
let categories = [];
let categoryMap = {};
let allProjects = [];
let selectedProject = null;
let isRefreshing = false;
let fileIndexById = {};

function showAlert(message, type = "info", timeout = 7000) {
  if (!alertArea) return;
  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Mbyll"></button>
    </div>
  `;
  alertArea.appendChild(wrapper);

  if (timeout) {
    setTimeout(() => {
      try {
        const alertEl = wrapper.firstElementChild;
        const inst = bootstrap.Alert.getInstance(alertEl);
        if (inst) inst.close();
        else alertEl.remove();
      } catch {}
    }, timeout);
  }
}

function cleanupBackdrops() {
  try {
    document.querySelectorAll(".modal-backdrop").forEach((b) => b?.remove?.());
    if (!document.querySelector(".modal.show")) {
      document.body.classList.remove("modal-open");
      document.body.style.removeProperty("padding-right");
    }
  } catch {}
}

function clearPanel() {
  selectedProject = null;
  if (panelHint) panelHint.textContent = "Zgjidh një projekt nga lista.";
  if (panelProjectId) panelProjectId.textContent = "—";
  if (panelContent) panelContent.classList.add("hidden");

  Object.keys(SECTION_LABELS).forEach((sec) => {
    const ul = document.getElementById(`list-${sec}`);
    if (ul) ul.innerHTML = "";
  });
  if (activityList) activityList.innerHTML = "";
}

function buildCategoryMap() {
  categoryMap = {};
  (categories || []).forEach((c) => (categoryMap[String(c.id)] = c.name || `Kategori ${c.id}`));
}

// ---------- profile name ----------
async function getMyProfileName() {
  try {
    const { data: userData } = await sup.auth.getUser();
    const user = userData?.user;
    if (!user?.id) return null;

    const { data, error } = await sup.from("profiles").select("full_name").eq("id", user.id).maybeSingle();
    if (error) return null;

    const nm = (data?.full_name || "").trim();
    return nm || null;
  } catch {
    return null;
  }
}

async function setAppVisible(isLoggedIn, session) {
  if (isLoggedIn) {
    authSection?.classList.add("hidden");
    appSection?.classList.remove("hidden");

    const display = await getMyProfileName();
    if (userEmailTop) userEmailTop.textContent = display || session?.user?.email || "—";
  } else {
    authSection?.classList.remove("hidden");
    appSection?.classList.add("hidden");
    if (userEmailTop) userEmailTop.textContent = "—";
    clearPanel();
  }
}

// ---------- activity ----------
async function logActivity(projectId, action, target = null) {
  try {
    const { data: userData } = await sup.auth.getUser();
    const user = userData?.user;
    if (!user) return;

    await sup.from("activity_log").insert({
      user_id: user.id,
      project_id: projectId,
      action,
      target,
      timestamp: new Date().toISOString(),
    });
  } catch (e) {
    console.warn("Activity log error:", e);
  }
}

// ---------- download ----------
async function shkarkoNgaStorage(filePath) {
  const fileName = (filePath || "").split("/").pop() || "skedar";
  const { data, error } = await sup.storage.from(BUCKET).download(filePath);
  if (error) throw error;

  const blobUrl = URL.createObjectURL(data);
  const a = document.createElement("a");
  a.href = blobUrl;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(blobUrl);
}

// ---------- remember policy ----------
function applyRememberPolicy() {
  const remember = rememberMeEl?.checked ?? true;
  setRememberMe(remember);

  if (!remember) {
    window.addEventListener("beforeunload", () => {
      try { sup.auth.signOut(); } catch {}
    });
  }
}

// ---------- AUTH ----------
async function handleSignUp(e) {
  e.preventDefault();

  const email = (authEmailEl?.value || "").trim();
  const password = authPassEl?.value || "";
  const fullName = (authFullnameEl?.value || "").trim();

  if (!email || !password) return showAlert("Plotëso email dhe fjalëkalimin.", "warning");
  if (!fullName) return showAlert("Plotëso Emër Mbiemër (për regjistrim).", "warning");

  try {
    applyRememberPolicy();

    const { data, error } = await sup.auth.signUp({ email, password });
    if (error) throw error;

    const userId = data?.user?.id;
    if (userId) {
      // NAME LOCK: ruaje vetëm nëse është bosh
      const { data: prof } = await sup.from("profiles").select("full_name").eq("id", userId).maybeSingle();
      const existing = (prof?.full_name || "").trim();

      if (!existing) {
        const { error: pErr } = await sup.from("profiles").upsert({ id: userId, full_name: fullName });
        if (pErr) console.warn("profiles upsert:", pErr);
      }
    }

    showAlert("Regjistrimi u krye. Tani mund të hysh me email/fjalëkalim.", "success", 7000);
    if (authFullnameEl) authFullnameEl.value = "";
  } catch (err) {
    showAlert(`Gabim në regjistrim: ${escapeHtml(err.message)}`, "danger", 9000);
  }
}

async function handleLogin(e) {
  e.preventDefault();

  const email = (authEmailEl?.value || "").trim();
  const password = authPassEl?.value || "";

  if (!email || !password) return showAlert("Plotëso email dhe fjalëkalimin.", "warning");

  try {
    applyRememberPolicy();
    const { error } = await sup.auth.signInWithPassword({ email, password });
    if (error) throw error;

    showAlert("U futët me sukses.", "success", 2500);
  } catch (err) {
    showAlert(`Gabim në hyrje: ${escapeHtml(err.message)}`, "danger", 9000);
  }
}

async function handleLogout(e) {
  e.preventDefault();
  try {
    const { error } = await sup.auth.signOut();
    if (error) throw error;
    showAlert("Dole nga sistemi.", "info", 2500);
  } catch (err) {
    showAlert(`Gabim në dalje: ${escapeHtml(err.message)}`, "danger", 9000);
  }
}

// ---------- DATA ----------
async function loadCategories() {
  try {
    const { data, error } = await sup
      .from("project_categories")
      .select("id,name")
      .order("id", { ascending: true });

    if (error) throw error;

    categories = data || [];
    buildCategoryMap();

    // fill project modal select
    if (projectCategorySelect) {
      projectCategorySelect.innerHTML = "";
      if (!categories.length) {
        projectCategorySelect.innerHTML = `<option value="">Nuk ka kategori</option>`;
      } else {
        categories.forEach((c) => {
          const opt = document.createElement("option");
          opt.value = String(c.id);
          opt.textContent = c.name;
          projectCategorySelect.appendChild(opt);
        });
      }
    }

    // fill filter
    if (filterCategory) {
      const current = filterCategory.value || "";
      filterCategory.innerHTML = `<option value="">Të gjitha kategoritë</option>`;
      categories.forEach((c) => {
        const opt = document.createElement("option");
        opt.value = String(c.id);
        opt.textContent = c.name;
        filterCategory.appendChild(opt);
      });
      filterCategory.value = current;
    }
  } catch (e) {
    console.error("loadCategories failed:", e);

    // mos e ler UI ne loading
    if (projectCategorySelect) projectCategorySelect.innerHTML = `<option value="">(Gabim kategori)</option>`;
    if (filterCategory) filterCategory.innerHTML = `<option value="">(Gabim kategori)</option>`;

    categories = [];
    buildCategoryMap();

    showAlert(
      `Kategoritë nuk u ngarkuan. Shkak tipik: RLS/permissions te tabela <b>project_categories</b>.<br/>Detaj: ${escapeHtml(e.message)}`,
      "warning",
      12000
    );
  }
}

async function loadProjects() {
  const { data, error } = await sup
    .from("projects")
    .select("id,name,location,category_id,created_by,created_at")
    .order("created_at", { ascending: false });

  if (error) throw error;
  allProjects = data || [];
  renderProjectsTable();
}

async function loadKPIs() {
  if (kpiProjects) kpiProjects.textContent = String(allProjects.length);

  const { count: filesCount } = await sup.from("skicat").select("*", { count: "exact", head: true });
  if (typeof filesCount === "number" && kpiFiles) kpiFiles.textContent = String(filesCount);

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count: actCount } = await sup.from("activity_log").select("*", { count: "exact", head: true }).gte("timestamp", since);
  if (typeof actCount === "number" && kpiActivity) kpiActivity.textContent = String(actCount);
}

// ---------- render projects ----------
function renderProjectsTable() {
  if (!projectsTableBody) return;

  const q = (searchInput?.value || "").toLowerCase().trim();
  const cat = filterCategory?.value || "";

  let filtered = [...allProjects];
  if (cat) filtered = filtered.filter((p) => String(p.category_id) === String(cat));
  if (q) filtered = filtered.filter((p) => (p.name || "").toLowerCase().includes(q));

  projectsTableBody.innerHTML = "";

  if (!filtered.length) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 5;
    td.className = "text-center";
    td.textContent = "Nuk u gjet asnjë punë sipas filtrave.";
    tr.appendChild(td);
    projectsTableBody.appendChild(tr);
    return;
  }

  filtered.forEach((p) => {
    const tr = document.createElement("tr");

    const tdName = document.createElement("td");
    tdName.textContent = p.name || "Pa emër";
    tr.appendChild(tdName);

    const tdCat = document.createElement("td");
    tdCat.textContent = categoryMap[String(p.category_id)] || `ID ${p.category_id || "—"}`;
    tr.appendChild(tdCat);

    const tdLoc = document.createElement("td");
    tdLoc.textContent = p.location || "—";
    tr.appendChild(tdLoc);

    const tdCreated = document.createElement("td");
    tdCreated.textContent = fmtDate(p.created_at);
    tr.appendChild(tdCreated);

    const tdOpen = document.createElement("td");
    const btn = document.createElement("button");
    btn.className = "btn btn-sm btn-outline-primary";
    btn.textContent = "Hap";
    btn.addEventListener("click", () => setPanel(p));
    tdOpen.appendChild(btn);
    tr.appendChild(tdOpen);

    projectsTableBody.appendChild(tr);
  });
}

// ---------- create project ----------
async function handleCreateProject(e) {
  e.preventDefault();

  const name = document.getElementById("project-name")?.value?.trim() || "";
  const categoryId = projectCategorySelect?.value || "";
  const location = document.getElementById("project-location")?.value?.trim() || "";

  if (!name || !categoryId) {
    return showAlert("Plotëso fushat e detyrueshme (Emri + Kategoria).", "warning", 6000);
  }

  try {
    const { data: userData } = await sup.auth.getUser();
    const user = userData?.user;

    const payload = {
      name,
      location: location || null,
      category_id: Number(categoryId),
      created_by: user?.id || null,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await sup.from("projects").insert(payload).select("id");
    if (error) throw error;

    const projectId = data?.[0]?.id;
    if (projectId) await logActivity(projectId, "u krijua puna", "projects");

    showAlert("Puna u krijua me sukses.", "success", 3000);

    bootstrap.Modal.getInstance(document.getElementById("projectModal"))?.hide();
    cleanupBackdrops();
    projectForm?.reset();

    await hardRefresh();
  } catch (err) {
    showAlert(`Gabim gjatë krijimit: ${escapeHtml(err.message)}`, "danger", 9000);
  }
}

// ---------- workspace ----------
async function setPanel(project) {
  selectedProject = project;
  if (panelHint) panelHint.textContent = "Workspace i projektit është aktiv.";
  if (panelProjectId) panelProjectId.textContent = project.id;
  panelContent?.classList.remove("hidden");

  if (panelProjectName) panelProjectName.textContent = project.name || "Pa emër";
  if (panelProjectCategory) panelProjectCategory.textContent = categoryMap[String(project.category_id)] || `ID ${project.category_id || "—"}`;
  if (panelProjectLocation) panelProjectLocation.textContent = project.location || "—";

  await loadAllFilesForProject(project.id);
  await loadProjectActivity(project.id);
}

function statusChip(status, deliveredAt) {
  const st = status || "ne_pritje";
  if (st === "dorezuar") return `<span class="chip ok">Dorëzuar • ${escapeHtml(fmtDate(deliveredAt))}</span>`;
  if (st === "anuluar") return `<span class="chip gray">Anuluar</span>`;
  return `<span class="chip warn">Në pritje</span>`;
}

// ---------- files ----------
async function loadAllFilesForProject(projectId) {
  fileIndexById = {};

  Object.keys(SECTION_LABELS).forEach((sec) => {
    const ul = document.getElementById(`list-${sec}`);
    if (ul) ul.innerHTML = `<li class="list-group-item text-muted">Duke ngarkuar...</li>`;
  });

  const { data, error } = await sup
    .from("skicat")
    .select("id,project_id,file_path,original_name,file_type,section,uploaded_at,uploaded_by,deliverable_status,delivered_at,deliverable_comment")
    .eq("project_id", projectId)
    .order("uploaded_at", { ascending: false });

  if (error) {
    showAlert(`Gabim në ngarkimin e materialeve: ${escapeHtml(error.message)}`, "danger", 9000);
    Object.keys(SECTION_LABELS).forEach((sec) => {
      const ul = document.getElementById(`list-${sec}`);
      if (ul) ul.innerHTML = `<li class="list-group-item text-danger">Gabim: ${escapeHtml(error.message)}</li>`;
    });
    return;
  }

  const grouped = {};
  Object.keys(SECTION_LABELS).forEach((sec) => (grouped[sec] = []));
  (data || []).forEach((f) => {
    fileIndexById[String(f.id)] = f;
    const sec = f.section || "skica";
    if (!grouped[sec]) grouped[sec] = [];
    grouped[sec].push(f);
  });

  Object.entries(grouped).forEach(([sec, files]) => {
    const ul = document.getElementById(`list-${sec}`);
    if (!ul) return;

    if (!files.length) {
      ul.innerHTML = `<li class="list-group-item text-muted">Nuk ka materiale.</li>`;
      return;
    }

    ul.innerHTML = "";
    files.forEach((f) => ul.appendChild(renderFileRow(sec, f)));
  });
}

function renderFileRow(section, f) {
  const li = document.createElement("li");
  li.className = "list-group-item";

  const filename = f.original_name || (f.file_path || "").split("/").pop() || "file";
  const left = document.createElement("div");
  left.className = "file-meta";

  let extra = "";
  if (DELIVERABLE_SECTIONS.has(section)) {
    extra = `<div class="mt-1">${statusChip(f.deliverable_status, f.delivered_at)}
      ${f.deliverable_comment ? `<div class="small text-muted mt-1">Koment: ${escapeHtml(f.deliverable_comment)}</div>` : ""}</div>`;
  }

  left.innerHTML = `
    <div class="file-name">${escapeHtml(filename)}</div>
    <div class="small text-muted">${escapeHtml(f.file_type || "file")} • ${escapeHtml(fmtDate(f.uploaded_at))}</div>
    ${extra}
  `;

  const right = document.createElement("div");
  right.className = "d-flex gap-2 flex-wrap";

  const btnDl = document.createElement("button");
  btnDl.className = "btn btn-sm btn-outline-success";
  btnDl.textContent = "Shkarko";
  btnDl.addEventListener("click", async () => {
    try {
      await shkarkoNgaStorage(f.file_path);
    } catch (e) {
      showAlert(`Gabim në shkarkim: ${escapeHtml(e.message)}`, "danger", 8000);
    }
  });
  right.appendChild(btnDl);

  if (DELIVERABLE_SECTIONS.has(section)) {
    const btnSt = document.createElement("button");
    btnSt.className = "btn btn-sm btn-outline-primary";
    btnSt.textContent = "Status";
    btnSt.addEventListener("click", () => openDeliverableModal(f.id));
    right.appendChild(btnSt);
  }

  li.appendChild(left);
  li.appendChild(right);
  return li;
}

// ---------- activity ----------
async function loadProjectActivity(projectId) {
  if (!activityList) return;
  activityList.innerHTML = `<li class="list-group-item text-muted">Duke ngarkuar...</li>`;

  const { data, error } = await sup
    .from("activity_log")
    .select("id,action,target,timestamp,user_id, profiles(full_name)")
    .eq("project_id", projectId)
    .order("timestamp", { ascending: false })
    .limit(15);

  if (error) {
    activityList.innerHTML = `<li class="list-group-item text-danger">Gabim: ${escapeHtml(error.message)}</li>`;
    return;
  }

  if (!data || !data.length) {
    activityList.innerHTML = `<li class="list-group-item text-muted">Nuk ka aktivitete për këtë projekt.</li>`;
    return;
  }

  activityList.innerHTML = "";
  data.forEach((a) => {
    const li = document.createElement("li");
    li.className = "list-group-item";

    const prof = Array.isArray(a.profiles) ? a.profiles[0] : a.profiles;
    const emri = (prof?.full_name || "").trim() || "Përdorues";

    li.innerHTML = `
      <div class="fw-semibold">${escapeHtml(a.action || "veprim")}</div>
      <div class="small text-muted">${escapeHtml(emri)} • ${escapeHtml(a.target || "")} • ${escapeHtml(fmtDate(a.timestamp))}</div>
    `;
    activityList.appendChild(li);
  });
}

// ---------- upload modal ----------
uploadModalEl?.addEventListener("show.bs.modal", (evt) => {
  const btn = evt.relatedTarget;
  const section = btn?.getAttribute?.("data-section") || "skica";

  if (!selectedProject?.id) {
    showAlert("Zgjidh një projekt (Hap) para se të ngarkosh materiale.", "warning", 7000);
    return;
  }

  uploadProjectIdInput.value = selectedProject.id;
  uploadSectionInput.value = section;
  uploadSectionLabel.textContent = SECTION_LABELS[section] || section;
  uploadFilesInput.value = "";
});

async function tryProcessorHealth() {
  try {
    const r = await fetch(`${PROCESSOR_BASE}/health`, { method: "GET" });
    return r.ok;
  } catch {
    return false;
  }
}
async function processWithProcessor(file) {
  const fd = new FormData();
  fd.append("file", file, file.name);

  const resp = await fetch(`${PROCESSOR_BASE}/process`, { method: "POST", body: fd });
  if (!resp.ok) {
    const t = await resp.text().catch(() => "");
    throw new Error(`Serveri i pastrimit error (${resp.status}): ${t || "n/a"}`);
  }
  return await resp.blob();
}

async function uploadOne(projectId, section, file) {
  const { data: userData } = await sup.auth.getUser();
  const user = userData?.user;

  const ext = extOf(file.name);
  const ftype = fileTypeFromExt(ext);

  const safeName = file.name.replaceAll(" ", "_");
  const path = `${projectId}/${section}/${Date.now()}_${rand6()}_${safeName}`;

  const { error: upErr } = await sup.storage.from(BUCKET).upload(path, file, { upsert: false });
  if (upErr) throw upErr;

  const baseRow = {
    project_id: projectId,
    file_path: path,
    original_name: file.name,
    file_type: ftype,
    section,
    uploaded_by: user?.id || null,
    uploaded_at: new Date().toISOString(),
  };

  if (DELIVERABLE_SECTIONS.has(section)) {
    baseRow.deliverable_status = "ne_pritje";
    baseRow.delivered_at = null;
    baseRow.deliverable_comment = null;
  }

  const { error: insErr } = await sup.from("skicat").insert(baseRow);
  if (insErr) throw insErr;
}

async function handleUpload(e) {
  e.preventDefault();

  const projectId = uploadProjectIdInput.value;
  const section = uploadSectionInput.value || "skica";
  const files = Array.from(uploadFilesInput.files || []);

  if (!projectId) return showAlert("Gabim: nuk u gjet projekt ID.", "danger");
  if (!files.length) return showAlert("Zgjidh të paktën një skedar.", "warning");

  const canAutoClean = section === "raw_points";
  const processorOk = canAutoClean ? await tryProcessorHealth() : false;

  if (canAutoClean && !processorOk) {
    showAlert("Serveri i pastrimit nuk u gjet. RAW do të ngarkohet normalisht (pa pastrim automatik).", "warning", 9000);
  }

  showAlert(`Po ngarkohen ${files.length} skedar(ë)...`, "info", 2500);

  let ok = 0, fail = 0;

  for (const f of files) {
    try {
      await uploadOne(projectId, section, f);
      ok++;
      await logActivity(projectId, `u ngarkua ${f.name}`, `storage/${BUCKET}/${section}`);

      if (canAutoClean && processorOk && ["csv", "idx"].includes(extOf(f.name))) {
        try {
          const cleanedBlob = await processWithProcessor(f);
          const cleanedName = f.name.replace(/\.(csv|idx)$/i, "") + "_clean.txt";
          const cleanedFile = new File([cleanedBlob], cleanedName, { type: "text/plain" });

          await uploadOne(projectId, "processed_points", cleanedFile);
          await logActivity(projectId, `u krijua ${cleanedName}`, "auto-clean");
          showAlert(`U pastrua automatikisht: ${cleanedName}`, "success", 3500);
        } catch (pe) {
          showAlert(`Pastrim automatik dështoi për ${f.name}: ${escapeHtml(pe.message)}`, "warning", 9000);
        }
      }
    } catch (err) {
      fail++;
      showAlert(`Dështoi: ${escapeHtml(f.name)} — ${escapeHtml(err.message)}`, "danger", 9000);
    }
  }

  showAlert(`Ngarkimi përfundoi: ${ok} sukses, ${fail} dështime.`, fail ? "warning" : "success", 6500);

  bootstrap.Modal.getInstance(uploadModalEl)?.hide();
  cleanupBackdrops();

  await loadAllFilesForProject(projectId);
  await loadKPIs();
  if (selectedProject?.id) await loadProjectActivity(selectedProject.id);
}

uploadForm?.addEventListener("submit", handleUpload);

// ---------- deliverable modal ----------
function openDeliverableModal(fileId) {
  const f = fileIndexById[String(fileId)];
  if (!f) return showAlert("Gabim: file nuk u gjet.", "danger");

  deliverableFileId.value = String(fileId);
  deliverableFileName.textContent = f.original_name || (f.file_path || "").split("/").pop() || "file";
  deliverableStatus.value = f.deliverable_status || "ne_pritje";
  deliverableDate.value = toDatetimeLocalValue(f.delivered_at);
  deliverableComment.value = f.deliverable_comment || "";

  new bootstrap.Modal(deliverableModalEl).show();
}

deliverableForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const fileId = deliverableFileId.value;
  const st = deliverableStatus.value || "ne_pritje";
  const comment = (deliverableComment.value || "").trim() || null;

  let deliveredAt = null;
  if (st === "dorezuar") {
    deliveredAt = deliverableDate.value ? new Date(deliverableDate.value).toISOString() : new Date().toISOString();
  }

  try {
    const { error } = await sup
      .from("skicat")
      .update({ deliverable_status: st, delivered_at: deliveredAt, deliverable_comment: comment })
      .eq("id", fileId);

    if (error) throw error;

    if (selectedProject?.id) await logActivity(selectedProject.id, `u ndryshua statusi: ${st}`, `skicat/${fileId}`);

    showAlert("Statusi u ruajt.", "success", 2500);

    bootstrap.Modal.getInstance(deliverableModalEl)?.hide();
    cleanupBackdrops();

    if (selectedProject?.id) {
      await loadAllFilesForProject(selectedProject.id);
      await loadProjectActivity(selectedProject.id);
    }
  } catch (err) {
    showAlert(`Gabim: ${escapeHtml(err.message)}`, "danger", 9000);
  }
});

// ---------- SAFE refresh ----------
async function hardRefresh() {
  if (isRefreshing) return;
  isRefreshing = true;

  try {
    const results = await Promise.allSettled([loadCategories(), loadProjects(), loadKPIs()]);
    const errs = results.filter(r => r.status === "rejected").map(r => r.reason?.message || String(r.reason));

    if (errs.length) {
      console.error("Refresh errors:", errs);
      showAlert("Disa të dhëna nuk u ngarkuan. Kontrollo RLS/Policies.", "warning", 9000);
    }

    if (selectedProject?.id) {
      await Promise.allSettled([
        loadAllFilesForProject(selectedProject.id),
        loadProjectActivity(selectedProject.id),
      ]);
    }

    // refresh header (name/email)
    try {
      const { data } = await sup.auth.getSession();
      if (data?.session) await setAppVisible(true, data.session);
    } catch {}
  } finally {
    isRefreshing = false;
  }
}

// ---------- anti-freeze ----------
setInterval(async () => {
  try { await sup.auth.getSession(); } catch {}
}, 45000);

document.addEventListener("visibilitychange", async () => {
  if (document.visibilityState === "visible") {
    try { await sup.auth.getSession(); } catch {}
    try { await hardRefresh(); } catch {}
  }
});

// ---------- init ----------
async function init() {
  if (rememberMeEl) rememberMeEl.checked = getRememberMe();

  const { data } = await sup.auth.getSession();
  const session = data?.session;

  await setAppVisible(!!session, session);
  if (session) await hardRefresh();
}

sup.auth.onAuthStateChange(async (_event, session) => {
  await setAppVisible(!!session, session);
  if (session) await hardRefresh();
  else clearPanel();
});

// events
signupBtn?.addEventListener("click", handleSignUp);
loginBtn?.addEventListener("click", handleLogin);
logoutBtn?.addEventListener("click", handleLogout);

refreshBtn?.addEventListener("click", hardRefresh);
searchInput?.addEventListener("input", renderProjectsTable);
filterCategory?.addEventListener("change", renderProjectsTable);

projectForm?.addEventListener("submit", handleCreateProject);

refreshFilesBtn?.addEventListener("click", async () => {
  if (selectedProject?.id) await loadAllFilesForProject(selectedProject.id);
});
refreshActivityBtn?.addEventListener("click", async () => {
  if (selectedProject?.id) await loadProjectActivity(selectedProject.id);
});

init();
