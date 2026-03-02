<!doctype html>
<html lang="sq">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="dark" />
    <title>Databaza New Vision Project</title>

    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
      rel="stylesheet"
      crossorigin="anonymous"
    />

    <style>
      :root{
        --bg1:#06121b;
        --bg2:#0b2233;

        --card: rgba(255,255,255,.06);
        --line: rgba(255,255,255,.10);

        --text:#eaf4ff;
        --muted: rgba(234,244,255,.72);

        --accent:#32d0a5;
        --accent2:#4cc3ff;

        --shadow: 0 18px 42px rgba(0,0,0,.38);
        --radius: 18px;
      }

      body{
        min-height: 100vh;
        color: var(--text);
        background:
          radial-gradient(900px 500px at 16% 12%, rgba(76,195,255,.18), transparent 60%),
          radial-gradient(820px 500px at 92% 18%, rgba(50,208,165,.16), transparent 55%),
          linear-gradient(180deg, var(--bg1), var(--bg2));
        padding-top: 1.25rem;
        padding-bottom: 4.3rem;
      }

      .hidden{ display: none !important; }
      .muted{ color: var(--muted) !important; }
      .mono{ font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; }

      .nvp-header{
        border: 1px solid var(--line);
        background: linear-gradient(180deg, rgba(255,255,255,.07), rgba(255,255,255,.03));
        box-shadow: var(--shadow);
        border-radius: var(--radius);
        padding: 16px 16px;
        position: relative;
        overflow: hidden;
      }
      .nvp-header::before{
        content:"";
        position:absolute; inset:-2px;
        background:
          repeating-linear-gradient(
            135deg,
            rgba(255,255,255,.07) 0px,
            rgba(255,255,255,.07) 1px,
            transparent 1px,
            transparent 14px
          );
        opacity:.16;
        pointer-events:none;
      }

      .brand{
        display:flex;
        align-items:center;
        gap: 12px;
      }
      .brand-title{
        margin:0;
        font-weight: 950;
        letter-spacing: .2px;
        line-height: 1.05;
      }
      .brand-sub{
        margin-top: 4px;
        font-size: 13px;
        color: var(--muted);
      }
      .brand-badge{
        display:inline-flex;
        align-items:center;
        gap:.45rem;
        padding:.18rem .6rem;
        border-radius: 999px;
        border: 1px solid rgba(255,255,255,.12);
        background: rgba(255,255,255,.06);
        color: var(--muted);
        font-size: 12px;
        width: fit-content;
        margin-top: 6px;
      }

      .card{
        background: linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.03));
        border: 1px solid var(--line);
        border-radius: var(--radius) !important;
        box-shadow: var(--shadow);
        color: var(--text);
      }
      .card .card-body{ padding: 16px; }

      .btn{ border-radius: 14px; font-weight: 700; }
      .btn-primary{
        background: linear-gradient(90deg, var(--accent2), var(--accent));
        border: 0;
        color: #041219;
      }
      .btn-primary:hover{ filter: brightness(1.06); }
      .btn-success{
        background: linear-gradient(90deg, rgba(43,213,118,.95), rgba(50,208,165,.95));
        border: 0;
        color: #041219;
      }
      .btn-outline-primary{
        border-color: rgba(76,195,255,.55);
        color: var(--text);
      }
      .btn-outline-primary:hover{
        background: rgba(76,195,255,.16);
        border-color: rgba(76,195,255,.75);
        color: var(--text);
      }
      .btn-outline-secondary{
        border-color: rgba(255,255,255,.22);
        color: var(--text);
      }
      .btn-outline-secondary:hover{
        background: rgba(255,255,255,.10);
        border-color: rgba(255,255,255,.30);
        color: var(--text);
      }

      .form-control, .form-select{
        background: rgba(255,255,255,.06);
        border: 1px solid var(--line);
        color: var(--text);
        border-radius: 14px;
      }
      .form-control::placeholder{ color: rgba(234,244,255,.55); }
      .form-control:focus, .form-select:focus{
        border-color: rgba(76,195,255,.55);
        box-shadow: 0 0 0 .2rem rgba(76,195,255,.15);
        background: rgba(255,255,255,.07);
        color: var(--text);
      }
      .form-check-input{
        background-color: rgba(255,255,255,.08);
        border: 1px solid var(--line);
      }

      .table{
        --bs-table-bg: transparent;
        --bs-table-striped-bg: rgba(255,255,255,.04);
        --bs-table-border-color: rgba(255,255,255,.10);
        color: var(--text);
      }
      .table thead th{
        background: rgba(255,255,255,.06);
        color: var(--text);
        border-bottom: 1px solid rgba(255,255,255,.10);
      }

      .card-kpi{ min-height: 112px; }
      .display-6{ font-weight: 950; }

      .accordion-item{
        border: 1px solid rgba(255,255,255,.10);
        border-radius: 16px !important;
        overflow: hidden;
        background: rgba(255,255,255,.03);
        margin-bottom: 10px;
      }
      .accordion-button{
        background: rgba(255,255,255,.05);
        color: var(--text);
        font-weight: 850;
      }
      .accordion-button:not(.collapsed){
        background: rgba(76,195,255,.10);
        color: var(--text);
      }
      .accordion-button:focus{
        box-shadow: 0 0 0 .2rem rgba(76,195,255,.12);
      }

      .file-list .list-group-item{
        background: rgba(255,255,255,.03);
        border-color: rgba(255,255,255,.10);
        color: var(--text);
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:.75rem;
      }
      .file-meta{ min-width:0; }
      .file-name{
        font-weight: 850;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 52vw;
      }
      @media (min-width: 992px) { .file-name { max-width: 280px; } }

      .alert{
        border-radius: 16px;
        border: 1px solid rgba(255,255,255,.12);
      }
      .alert-info{ background: rgba(76,195,255,.08); color: var(--text); }
      .alert-success{ background: rgba(43,213,118,.10); color: var(--text); }
      .alert-warning{ background: rgba(255,193,7,.10); color: var(--text); }
      .alert-danger{ background: rgba(220,53,69,.10); color: var(--text); }

      hr{ border-color: rgba(255,255,255,.12); }

      #support-footer{
        position: fixed;
        right: 14px;
        bottom: 10px;
        font-size: 13px;
        opacity: 0.92;
        padding: 10px 12px;
        border-radius: 14px;
        background: rgba(255,255,255,0.08);
        border: 1px solid rgba(255,255,255,0.12);
        backdrop-filter: blur(8px);
        z-index: 9999;
        user-select: none;
        pointer-events: none;
        line-height: 1.25;
        color: var(--text);
      }
    </style>
  </head>

  <body>
    <div class="container">

      <!-- HEADER -->
      <div class="nvp-header mb-3">
        <div class="d-flex align-items-start justify-content-between gap-3 flex-wrap">
          <div class="brand">
            <!-- LOGO (SVG) -->
            <svg width="54" height="54" viewBox="0 0 54 54" xmlns="http://www.w3.org/2000/svg" aria-label="New Vision Project Logo">
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stop-color="#4cc3ff"/>
                  <stop offset="1" stop-color="#32d0a5"/>
                </linearGradient>
              </defs>
              <rect x="4" y="4" width="46" height="46" rx="14" fill="rgba(255,255,255,.06)" stroke="rgba(255,255,255,.14)"/>
              <path d="M27 14c7 0 13 4 13 9s-6 9-13 9-13-4-13-9 6-9 13-9Z" fill="none" stroke="url(#g1)" stroke-width="2" opacity=".95"/>
              <path d="M27 18c5.2 0 9.8 3 9.8 6.5S32.2 31 27 31s-9.8-3-9.8-6.5S21.8 18 27 18Z" fill="none" stroke="rgba(234,244,255,.55)" stroke-width="1.6" opacity=".9"/>
              <path d="M27 22c3.4 0 6.4 2 6.4 4.3S30.4 30.6 27 30.6s-6.4-2-6.4-4.3S23.6 22 27 22Z" fill="none" stroke="rgba(234,244,255,.35)" stroke-width="1.4" opacity=".9"/>
              <path d="M27 16l4.8 10.6L27 31.2l-4.8-4.6L27 16Z" fill="url(#g1)" opacity=".9"/>
              <circle cx="27" cy="27" r="2.2" fill="#06121b" stroke="rgba(255,255,255,.35)" />
            </svg>

            <div>
              <h1 class="brand-title mb-0">New Vision Project</h1>
              <div class="brand-sub">Databaza • Menaxhim punësh gjeodezike / topografike</div>
              <div class="brand-badge">
                <span>⦿</span>
                <span>Dark Topografik Dashboard</span>
              </div>
            </div>
          </div>

          <div class="text-end">
            <div class="small muted">Përdoruesi</div>
            <div class="fw-semibold" id="user-email-top">—</div>
          </div>
        </div>
      </div>

      <div id="alert-area"></div>

      <!-- AUTH -->
      <section id="auth-section">
        <div class="row justify-content-center">
          <div class="col-lg-6 col-xl-5">
            <div class="card">
              <div class="card-body">
                <h3 class="card-title mb-2">Hyr / Regjistrohu</h3>
                <div class="muted small mb-3">
                  Për regjistrim, <b>Emër Mbiemër</b> është i detyrueshëm dhe ruhet vetëm 1 herë.
                </div>

                <div class="mb-3">
                  <label for="auth-fullname" class="form-label">Emër Mbiemër (vetëm për regjistrim)</label>
                  <input type="text" class="form-control" id="auth-fullname" placeholder="p.sh. Eva Barjamaj" autocomplete="name" />
                  <div class="muted small mt-1">Nëse je regjistruar 1 herë, s’ka nevojë ta shkruash më.</div>
                </div>

                <div class="mb-3">
                  <label for="auth-email" class="form-label">Email</label>
                  <input type="email" class="form-control" id="auth-email" placeholder="p.sh. emri@domain.com" autocomplete="email" />
                </div>

                <div class="mb-2">
                  <label for="auth-password" class="form-label">Fjalëkalimi</label>
                  <input type="password" class="form-control" id="auth-password" placeholder="Shkruaj fjalëkalimin" autocomplete="current-password" />
                </div>

                <div class="form-check my-3">
                  <input class="form-check-input" type="checkbox" id="remember-me" checked />
                  <label class="form-check-label" for="remember-me">Mbaje mend hyrjen</label>
                </div>

                <div class="d-flex gap-2">
                  <button type="button" id="login-btn" class="btn btn-primary w-50">Hyr</button>
                  <button type="button" id="signup-btn" class="btn btn-outline-primary w-50">Regjistrohu</button>
                </div>

                <div class="small muted mt-3">
                  Nëse butonat nuk punojnë: Console (F12) dhe kontrollo <span class="mono">SUPABASE_URL</span> & <span class="mono">SUPABASE_ANON_KEY</span>.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- APP -->
      <section id="app-section" class="hidden">
        <div class="d-flex align-items-center justify-content-between gap-2 flex-wrap mb-3">
          <div class="d-flex gap-2 flex-wrap">
            <button type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#projectModal">+ Hap punë të re</button>
            <button type="button" id="refresh-btn" class="btn btn-outline-primary">Rifresko</button>
          </div>
          <button type="button" id="logout-btn" class="btn btn-outline-secondary">Dil</button>
        </div>

        <div class="row g-3 mb-3">
          <div class="col-md-4">
            <div class="card card-kpi">
              <div class="card-body">
                <div class="muted">Punë / Projekte</div>
                <div class="display-6" id="kpi-projects">0</div>
                <div class="small muted">Total i projekteve</div>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card card-kpi">
              <div class="card-body">
                <div class="muted">Materiale</div>
                <div class="display-6" id="kpi-files">0</div>
                <div class="small muted">Total i materialeve</div>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card card-kpi">
              <div class="card-body">
                <div class="muted">Aktivitete (24h)</div>
                <div class="display-6" id="kpi-activity">0</div>
                <div class="small muted">Veprimet e fundit</div>
              </div>
            </div>
          </div>
        </div>

        <div class="row g-3">
          <div class="col-lg-7">
            <div class="card">
              <div class="card-body">
                <div class="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-2">
                  <h5 class="mb-0">Lista e punëve</h5>
                  <div class="d-flex gap-2 flex-wrap">
                    <input id="search-input" class="form-control" placeholder="Kërko sipas emrit..." style="min-width: 220px;" />
                    <select id="filter-category" class="form-select" style="min-width: 220px;">
                      <option value="">Të gjitha kategoritë</option>
                    </select>
                  </div>
                </div>

                <div class="table-responsive">
                  <table class="table table-striped table-bordered align-middle mb-0" id="projects-table">
                    <thead>
                      <tr>
                        <th>Emri</th>
                        <th>Kategoria</th>
                        <th>Vendndodhja</th>
                        <th>Krijuar</th>
                        <th>Hap</th>
                      </tr>
                    </thead>
                    <tbody></tbody>
                  </table>
                </div>

                <div class="small muted mt-2">Hap një projekt për të parë materialet të organizuara në seksione.</div>
              </div>
            </div>
          </div>

          <div class="col-lg-5">
            <div class="card">
              <div class="card-body">
                <div class="d-flex align-items-start justify-content-between gap-2">
                  <div>
                    <h5 class="mb-1">Workspace i Projektit</h5>
                    <div class="small muted" id="panel-hint">Zgjidh një projekt nga lista.</div>
                  </div>
                  <div class="text-end">
                    <div class="small muted">Projekt ID</div>
                    <div class="mono small" id="panel-project-id">—</div>
                  </div>
                </div>

                <hr />

                <div id="panel-content" class="hidden">
                  <div class="mb-2">
                    <div class="muted small">Emri</div>
                    <div class="fw-semibold" id="panel-project-name">—</div>
                  </div>

                  <div class="mb-2 d-flex gap-2 flex-wrap align-items-center">
                    <span class="chip"><span class="muted">Kategoria:</span> <span id="panel-project-category">—</span></span>
                    <span class="chip"><span class="muted">Vendndodhja:</span> <span id="panel-project-location">—</span></span>
                  </div>

                  <div class="d-flex align-items-center justify-content-between flex-wrap gap-2 mt-3">
                    <div class="fw-semibold">Seksionet</div>
                    <div class="d-flex gap-2">
                      <button type="button" id="refresh-files-btn" class="btn btn-sm btn-outline-secondary">Rifresko materiale</button>
                      <button type="button" id="refresh-activity-btn" class="btn btn-sm btn-outline-secondary">Rifresko aktivitet</button>
                    </div>
                  </div>

                  <div class="small muted mt-1">Shënim: Pastrimi automatik funksionon me serverin e pastrimit (online).</div>

                  <div class="accordion mt-3" id="sectionsAccordion">
                    <div class="accordion-item">
                      <h2 class="accordion-header" id="hRaw">
                        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#cRaw">
                          01 - Pika (RAW) (.csv / .idx)
                        </button>
                      </h2>
                      <div id="cRaw" class="accordion-collapse collapse show" data-bs-parent="#sectionsAccordion">
                        <div class="accordion-body">
                          <div class="d-flex align-items-start justify-content-between gap-2 flex-wrap">
                            <div class="muted small">Ngarko skedarët origjinalë nga total station/GPS.</div>
                            <div class="d-flex align-items-center gap-2 flex-wrap">
                              <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="auto-clean-toggle" checked disabled>
                                <label class="form-check-label small" for="auto-clean-toggle">Pastrimi automatik aktiv (online)</label>
                              </div>
                              <button type="button" class="btn btn-sm btn-outline-primary" data-bs-toggle="modal" data-bs-target="#uploadModal" data-section="raw_points">Ngarko</button>
                            </div>
                          </div>
                          <ul class="list-group file-list mt-2" id="list-raw_points"></ul>
                        </div>
                      </div>
                    </div>

                    <div class="accordion-item">
                      <h2 class="accordion-header" id="hProc">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#cProc">
                          02 - Pika (PROCESSED) (.txt tab-delimited)
                        </button>
                      </h2>
                      <div id="cProc" class="accordion-collapse collapse" data-bs-parent="#sectionsAccordion">
                        <div class="accordion-body">
                          <div class="d-flex align-items-start justify-content-between gap-2 flex-wrap">
                            <div class="muted small">Rezultatet e pastrimit të pikave.</div>
                            <button type="button" class="btn btn-sm btn-outline-primary" data-bs-toggle="modal" data-bs-target="#uploadModal" data-section="processed_points">Ngarko</button>
                          </div>
                          <ul class="list-group file-list mt-2" id="list-processed_points"></ul>
                        </div>
                      </div>
                    </div>

                    <div class="accordion-item">
                      <h2 class="accordion-header" id="hDwgPlan">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#cDwgPlan">
                          03 - DWG Plane
                        </button>
                      </h2>
                      <div id="cDwgPlan" class="accordion-collapse collapse" data-bs-parent="#sectionsAccordion">
                        <div class="accordion-body">
                          <div class="d-flex align-items-start justify-content-between gap-2 flex-wrap">
                            <div class="muted small">Plane / planimetri.</div>
                            <button type="button" class="btn btn-sm btn-outline-primary" data-bs-toggle="modal" data-bs-target="#uploadModal" data-section="dwg_plane">Ngarko</button>
                          </div>
                          <ul class="list-group file-list mt-2" id="list-dwg_plane"></ul>
                        </div>
                      </div>
                    </div>

                    <div class="accordion-item">
                      <h2 class="accordion-header" id="hDwgViews">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#cDwgViews">
                          04 - DWG Pamje / Fasada
                        </button>
                      </h2>
                      <div id="cDwgViews" class="accordion-collapse collapse" data-bs-parent="#sectionsAccordion">
                        <div class="accordion-body">
                          <div class="d-flex align-items-start justify-content-between gap-2 flex-wrap">
                            <div class="muted small">Pamje, fasada, detaje.</div>
                            <button type="button" class="btn btn-sm btn-outline-primary" data-bs-toggle="modal" data-bs-target="#uploadModal" data-section="dwg_pamje">Ngarko</button>
                          </div>
                          <ul class="list-group file-list mt-2" id="list-dwg_pamje"></ul>
                        </div>
                      </div>
                    </div>

                    <div class="accordion-item">
                      <h2 class="accordion-header" id="hDwgFinal">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#cDwgFinal">
                          05 - DWG Finale
                        </button>
                      </h2>
                      <div id="cDwgFinal" class="accordion-collapse collapse" data-bs-parent="#sectionsAccordion">
                        <div class="accordion-body">
                          <div class="d-flex align-items-start justify-content-between gap-2 flex-wrap">
                            <div class="muted small">DWG finale (mund të ketë më shumë se 1 version).</div>
                            <button type="button" class="btn btn-sm btn-outline-primary" data-bs-toggle="modal" data-bs-target="#uploadModal" data-section="dwg_final">Ngarko</button>
                          </div>
                          <ul class="list-group file-list mt-2" id="list-dwg_final"></ul>
                        </div>
                      </div>
                    </div>

                    <div class="accordion-item">
                      <h2 class="accordion-header" id="hDeliver">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#cDeliver">
                          06 - Dorëzime (PDF / DWG / ZIP) + Status
                        </button>
                      </h2>
                      <div id="cDeliver" class="accordion-collapse collapse" data-bs-parent="#sectionsAccordion">
                        <div class="accordion-body">
                          <div class="d-flex align-items-start justify-content-between gap-2 flex-wrap">
                            <div class="muted small">Dokumente/dorëzime ndaj klientit (me status, datë dhe koment).</div>
                            <button type="button" class="btn btn-sm btn-outline-primary" data-bs-toggle="modal" data-bs-target="#uploadModal" data-section="dorezime">Ngarko</button>
                          </div>
                          <ul class="list-group file-list mt-2" id="list-dorezime"></ul>
                        </div>
                      </div>
                    </div>

                    <div class="accordion-item">
                      <h2 class="accordion-header" id="hSkica">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#cSkica">
                          07 - Skica / Materiale të tjera
                        </button>
                      </h2>
                      <div id="cSkica" class="accordion-collapse collapse" data-bs-parent="#sectionsAccordion">
                        <div class="accordion-body">
                          <div class="d-flex align-items-start justify-content-between gap-2 flex-wrap">
                            <div class="muted small">Çdo material tjetër i projektit.</div>
                            <button type="button" class="btn btn-sm btn-outline-primary" data-bs-toggle="modal" data-bs-target="#uploadModal" data-section="skica">Ngarko</button>
                          </div>
                          <ul class="list-group file-list mt-2" id="list-skica"></ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="mt-3">
                    <div class="fw-semibold">Aktivitetet (15 të fundit)</div>
                    <ul class="list-group mt-2" id="activity-list"></ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div><!-- row -->
      </section>

      <!-- Modal: Create Project -->
      <div class="modal fade" id="projectModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content" style="background: rgba(6,18,27,.92); border:1px solid rgba(255,255,255,.12); border-radius:18px;">
            <div class="modal-header" style="border-color: rgba(255,255,255,.12);">
              <h5 class="modal-title">Punë/Projekt i ri</h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Mbyll"></button>
            </div>

            <div class="modal-body">
              <form id="project-form">
                <div class="mb-3">
                  <label for="project-name" class="form-label">Emri i punës</label>
                  <input type="text" class="form-control" id="project-name" required />
                </div>

                <div class="mb-3">
                  <label for="project-category" class="form-label">Kategoria</label>
                  <select class="form-select" id="project-category" required>
                    <option value="">Duke ngarkuar...</option>
                  </select>
                </div>

                <div class="mb-3">
                  <label for="project-location" class="form-label">Vendndodhja</label>
                  <input type="text" class="form-control" id="project-location" placeholder="p.sh. Tiranë, Shqipëri" />
                </div>

                <button type="submit" class="btn btn-primary w-100">Ruaj</button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal: Upload -->
      <div class="modal fade" id="uploadModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content" style="background: rgba(6,18,27,.92); border:1px solid rgba(255,255,255,.12); border-radius:18px;">
            <div class="modal-header" style="border-color: rgba(255,255,255,.12);">
              <h5 class="modal-title">Ngarko materiale</h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Mbyll"></button>
            </div>

            <div class="modal-body">
              <form id="upload-form">
                <input type="hidden" id="upload-project-id" />
                <input type="hidden" id="upload-section" />

                <div class="mb-2">
                  <div class="small muted">Seksioni</div>
                  <div class="fw-semibold" id="upload-section-label">—</div>
                </div>

                <div class="mb-3">
                  <label for="upload-files" class="form-label">Zgjidh skedarë (mund të zgjedhësh shumë)</label>
                  <input class="form-control" type="file" id="upload-files" multiple />
                  <div class="small muted mt-1">P.sh: .csv .idx .dwg .pdf .zip .jpg</div>
                </div>

                <button type="submit" class="btn btn-primary w-100">Ngarko</button>
              </form>

              <div class="small muted mt-2">
                Materialet ruhen në Storage (bucket <b>skica</b>) dhe regjistrohen në tabelën <b>skicat</b>.
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal: Deliverable Status -->
      <div class="modal fade" id="deliverableModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content" style="background: rgba(6,18,27,.92); border:1px solid rgba(255,255,255,.12); border-radius:18px;">
            <div class="modal-header" style="border-color: rgba(255,255,255,.12);">
              <h5 class="modal-title">Status i Dorëzimit</h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Mbyll"></button>
            </div>
            <div class="modal-body">
              <form id="deliverable-form">
                <input type="hidden" id="deliverable-file-id" />
                <div class="mb-2">
                  <div class="small muted">Skedari</div>
                  <div class="fw-semibold" id="deliverable-file-name">—</div>
                </div>

                <div class="mb-3">
                  <label class="form-label">Status</label>
                  <select class="form-select" id="deliverable-status">
                    <option value="ne_pritje">Në pritje</option>
                    <option value="dorezuar">Dorëzuar</option>
                    <option value="anuluar">Anuluar</option>
                  </select>
                </div>

                <div class="mb-3">
                  <label class="form-label">Data</label>
                  <input type="datetime-local" class="form-control" id="deliverable-date" />
                  <div class="small muted mt-1">Nëse lë bosh, ruan datën aktuale.</div>
                </div>

                <div class="mb-3">
                  <label class="form-label">Koment</label>
                  <textarea class="form-control" id="deliverable-comment" rows="3" placeholder="p.sh. U dorëzua versioni final..."></textarea>
                </div>

                <button type="submit" class="btn btn-primary w-100">Ruaj statusin</button>
              </form>
            </div>
          </div>
        </div>
      </div>

    </div><!-- container -->

    <div id="support-footer">
      Per ndihme kontakto Ing.Yllart Seferi<br/>
      +355 67 556 2779<br/>
      iart.se2@gmail.com
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <script src="./app.js"></script>
  </body>
</html>
