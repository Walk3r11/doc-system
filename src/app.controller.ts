import { Controller, Get, Header } from "@nestjs/common";

@Controller()
export class AppController {
  @Get()
  @Header("Content-Type", "text/html; charset=utf-8")
  root() {
    return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>GP Visits Dashboard</title>
  <style>
    :root {
      --bg: #060b1a;
      --card: #101937;
      --card-2: #0d1530;
      --text: #eef3ff;
      --muted: #a9b7df;
      --line: #2a3865;
      --primary: #5ea1ff;
      --primary-2: #2f7dff;
      --ok: #6fd48d;
      --bad: #ff7c8b;
      --radius: 14px;
      --shadow: 0 8px 26px rgba(0, 0, 0, 0.35);
    }
    body {
      margin: 0;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
      background: var(--bg);
      color: var(--text);
      min-height: 100vh;
      line-height: 1.35;
    }
    .container {
      max-width: 1220px;
      margin: 0 auto;
      padding: 28px 18px 34px;
    }
    .hero {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      align-items: end;
      margin-bottom: 14px;
      flex-wrap: wrap;
    }
    h1 {
      margin: 0;
      font-size: 28px;
      letter-spacing: 0.2px;
    }
    .subtitle {
      margin: 6px 0 0;
      color: var(--muted);
      font-size: 14px;
    }
    .status {
      border: 1px solid var(--line);
      border-radius: 999px;
      padding: 8px 12px;
      font-size: 13px;
      background: var(--card-2);
      box-shadow: var(--shadow);
      white-space: nowrap;
    }
    .status b {
      color: var(--primary);
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(12, 1fr);
      gap: 14px;
    }
    .card {
      border: 1px solid var(--line);
      border-radius: var(--radius);
      padding: 14px;
      background: var(--card);
      box-shadow: var(--shadow);
    }
    .span-12 { grid-column: span 12; }
    .span-6 { grid-column: span 6; }
    .span-4 { grid-column: span 4; }
    .span-3 { grid-column: span 3; }
    @media (max-width: 1000px) {
      .span-6, .span-4, .span-3 { grid-column: span 12; }
    }
    h3 {
      margin: 0 0 10px;
      font-size: 16px;
      font-weight: 700;
    }
    .hint {
      color: var(--muted);
      font-size: 12px;
      margin-bottom: 8px;
    }
    label {
      display: block;
      margin: 8px 0 4px;
      font-size: 12px;
      color: var(--muted);
    }
    input, textarea {
      width: 100%;
      box-sizing: border-box;
      padding: 10px 11px;
      border: 1px solid var(--line);
      border-radius: 10px;
      background: #0b1330;
      color: var(--text);
      font: inherit;
      outline: none;
    }
    input:focus, textarea:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(94, 161, 255, 0.2);
    }
    textarea {
      min-height: 110px;
      resize: vertical;
    }
    .btn-row {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 10px;
    }
    button {
      padding: 9px 12px;
      border-radius: 10px;
      border: 1px solid transparent;
      background: linear-gradient(180deg, var(--primary), var(--primary-2));
      color: #fff;
      font-weight: 700;
      cursor: pointer;
      transition: transform 0.04s ease, opacity 0.2s ease;
    }
    button:hover { opacity: 0.92; }
    button:active { transform: translateY(1px); }
    .ghost {
      background: transparent;
      border-color: var(--line);
      color: var(--text);
    }
    .danger {
      background: #4a1c2a;
      border-color: #6f2a3d;
      color: #ffdfe5;
    }
    pre {
      margin: 0;
      border-radius: 10px;
      border: 1px solid var(--line);
      padding: 12px;
      overflow: auto;
      white-space: pre-wrap;
      background: #0b1330;
      min-height: 180px;
      max-height: 420px;
    }
    .inline {
      display: flex;
      gap: 8px;
      align-items: center;
      flex-wrap: wrap;
    }
    .chip {
      padding: 5px 9px;
      border-radius: 999px;
      border: 1px solid var(--line);
      background: var(--card-2);
      font-size: 12px;
      color: var(--muted);
    }
    .good { color: var(--ok); }
    .bad { color: var(--bad); }
    code {
      color: #9fd2ff;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="hero">
      <div>
        <h1>GP Visits Dashboard</h1>
        <p class="subtitle">UI for testing registration, authentication, visits and schedules.</p>
      </div>
      <div class="status">
        API: <b id="baseUrl"></b> |
        JWT token: <b id="tokenStatus" class="bad">not set</b>
      </div>
    </div>

    <div class="grid">
      <section class="card span-12">
        <h3>Auth Session</h3>
        <p class="hint">
          <b>Important:</b> <code>JWT_SECRET</code> in env is only the signing key.
          This UI needs a real access token from <code>/auth/login</code>.
        </p>
        <label>Manual JWT token (optional)</label>
        <input id="manualToken" placeholder="Paste access token here" />
        <div class="btn-row">
          <button id="saveToken">Save Token</button>
          <button class="ghost" id="clearToken">Clear Token</button>
        </div>
      </section>

      <section class="card span-4">
      <h3>Register Doctor</h3>
      <label>Name</label><input id="doctorName" value="Dr. Ivan Petrov" />
      <label>Email</label><input id="doctorEmail" value="doctor@example.com" />
      <label>Password</label><input id="doctorPassword" value="Passw0rd!" />
      <label>Address</label><input id="doctorAddress" value="Sofia, Bulgaria Blvd 1" />
      <label>Schedule JSON</label>
      <textarea id="doctorSchedule">{ "schedule": [ { "dayOfWeek": 1, "intervals": [ { "start": "08:30", "end": "12:00" }, { "start": "13:00", "end": "18:30" } ] } ] }</textarea>
      <div class="btn-row"><button id="registerDoctorBtn">Register Doctor</button></div>
    </section>

    <section class="card span-4">
      <h3>Register Patient</h3>
      <label>Name</label><input id="patientName" value="Maria Ivanova" />
      <label>Email</label><input id="patientEmail" value="patient@example.com" />
      <label>Password</label><input id="patientPassword" value="Passw0rd!" />
      <label>Phone</label><input id="patientPhone" value="+359888111222" />
      <label>Doctor ID</label><input id="patientDoctorId" placeholder="Paste doctor id" />
      <div class="btn-row"><button id="registerPatientBtn">Register Patient</button></div>
    </section>

    <section class="card span-4">
      <h3>Login</h3>
      <label>Email</label><input id="loginEmail" value="doctor@example.com" />
      <label>Password</label><input id="loginPassword" value="Passw0rd!" />
      <div class="btn-row"><button id="loginBtn">Login</button></div>
    </section>

    <section class="card span-6">
      <h3>Create Visit</h3>
      <label>Patient ID (required if doctor token)</label><input id="visitPatientId" />
      <label>Start At (ISO)</label><input id="visitStartAt" placeholder="2026-06-01T08:30:00.000Z" />
      <label>End At (ISO)</label><input id="visitEndAt" placeholder="2026-06-01T09:00:00.000Z" />
      <div class="btn-row"><button id="createVisitBtn">Create Visit</button></div>
    </section>

    <section class="card span-3">
      <h3>Cancel Visit</h3>
      <label>Visit ID</label><input id="cancelVisitId" />
      <div class="btn-row"><button class="danger" id="cancelVisitBtn">Cancel Visit</button></div>
    </section>

    <section class="card span-3">
      <h3>My Visits</h3>
      <div class="btn-row"><button id="listVisitsBtn">Fetch /visits/me</button></div>
    </section>

    <section class="card span-6">
      <h3>Update Base Schedule (Doctor)</h3>
      <label>Payload JSON</label>
      <textarea id="updateSchedulePayload">{ "schedule": { "schedule": [ { "dayOfWeek": 1, "intervals": [ { "start": "08:30", "end": "12:00" }, { "start": "13:00", "end": "18:30" } ] } ] } }</textarea>
      <div class="btn-row"><button id="updateScheduleBtn">PATCH /doctors/me/schedule</button></div>
    </section>

    <section class="card span-12">
      <div class="inline" style="justify-content:space-between;margin-bottom:8px;">
        <h3 style="margin:0;">Response Output</h3>
        <span class="chip">latest API call result</span>
      </div>
      <pre id="output">Ready.</pre>
    </section>
    </div>
  </div>

  <script>
    const output = document.getElementById("output");
    const baseUrl = window.location.origin;
    document.getElementById("baseUrl").textContent = baseUrl;
    const manualToken = document.getElementById("manualToken");

    function getToken() {
      return localStorage.getItem("jwtToken") || "";
    }

    function setToken(token) {
      if (token) {
        localStorage.setItem("jwtToken", token);
      }
      renderTokenStatus();
    }

    function clearToken() {
      localStorage.removeItem("jwtToken");
      renderTokenStatus();
    }

    function renderTokenStatus() {
      const token = getToken();
      document.getElementById("tokenStatus").textContent = token ? "set" : "not set";
      document.getElementById("tokenStatus").className = token ? "good" : "bad";
      manualToken.value = token;
    }

    function safeParseJson(value) {
      try {
        return JSON.parse(value);
      } catch (_error) {
        throw new Error("Invalid JSON payload.");
      }
    }

    async function api(path, method, body, needsAuth) {
      const headers = { "Content-Type": "application/json" };
      if (needsAuth && getToken()) {
        headers.Authorization = "Bearer " + getToken();
      }
      const response = await fetch(baseUrl + path, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });
      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (_error) {
        data = text;
      }
      const payload = JSON.stringify(
        {
          status: response.status,
          ok: response.ok,
          path,
          method,
          data,
        },
        null,
        2,
      );
      output.textContent = payload;
      return { response, data };
    }

    document.getElementById("clearToken").addEventListener("click", clearToken);
    document.getElementById("saveToken").addEventListener("click", () => {
      const value = manualToken.value.trim();
      if (!value) {
        clearToken();
        return;
      }
      setToken(value);
    });

    document.getElementById("registerDoctorBtn").addEventListener("click", async () => {
      const payload = {
        name: document.getElementById("doctorName").value,
        email: document.getElementById("doctorEmail").value,
        password: document.getElementById("doctorPassword").value,
        address: document.getElementById("doctorAddress").value,
        workingSchedule: safeParseJson(document.getElementById("doctorSchedule").value),
      };
      await api("/auth/register/doctor", "POST", payload, false);
    });

    document.getElementById("registerPatientBtn").addEventListener("click", async () => {
      const payload = {
        name: document.getElementById("patientName").value,
        email: document.getElementById("patientEmail").value,
        password: document.getElementById("patientPassword").value,
        phone: document.getElementById("patientPhone").value,
        doctorId: document.getElementById("patientDoctorId").value,
      };
      await api("/auth/register/patient", "POST", payload, false);
    });

    document.getElementById("loginBtn").addEventListener("click", async () => {
      const payload = {
        email: document.getElementById("loginEmail").value,
        password: document.getElementById("loginPassword").value,
      };
      const result = await api("/auth/login", "POST", payload, false);
      if (result.response.ok && result.data && result.data.accessToken) {
        setToken(result.data.accessToken);
      }
    });

    document.getElementById("createVisitBtn").addEventListener("click", async () => {
      const payload = {
        patientId: document.getElementById("visitPatientId").value || undefined,
        startAt: document.getElementById("visitStartAt").value,
        endAt: document.getElementById("visitEndAt").value,
      };
      await api("/visits", "POST", payload, true);
    });

    document.getElementById("cancelVisitBtn").addEventListener("click", async () => {
      const id = document.getElementById("cancelVisitId").value;
      await api("/visits/" + encodeURIComponent(id) + "/cancel", "POST", undefined, true);
    });

    document.getElementById("listVisitsBtn").addEventListener("click", async () => {
      await api("/visits/me", "GET", undefined, true);
    });

    document.getElementById("updateScheduleBtn").addEventListener("click", async () => {
      const payload = safeParseJson(document.getElementById("updateSchedulePayload").value);
      await api("/doctors/me/schedule", "PATCH", payload, true);
    });

    renderTokenStatus();
  </script>
</body>
</html>`;
  }

  @Get("health")
  health() {
    return {
      status: "ok",
    };
  }
}
