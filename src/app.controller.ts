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
  <title>GP Visits Interface</title>
  <style>
    :root {
      color-scheme: light dark;
      --bg: #0b1020;
      --card: #141a2e;
      --text: #e8ecff;
      --muted: #a8b0d6;
      --accent: #6ea8fe;
      --danger: #ff7b7b;
      --ok: #8de28d;
      --border: #2b355c;
    }
    body {
      margin: 0;
      padding: 24px;
      font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
      background: var(--bg);
      color: var(--text);
    }
    h1 { margin-top: 0; }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 16px;
    }
    .card {
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 14px;
      background: var(--card);
    }
    label { display: block; font-size: 12px; margin: 8px 0 4px; color: var(--muted); }
    input, textarea {
      width: 100%;
      box-sizing: border-box;
      padding: 10px;
      border: 1px solid var(--border);
      border-radius: 8px;
      background: #0f152b;
      color: var(--text);
      font: inherit;
    }
    textarea { min-height: 100px; }
    button {
      margin-top: 10px;
      padding: 10px 12px;
      border-radius: 8px;
      border: 0;
      background: var(--accent);
      color: #0b1020;
      font-weight: 700;
      cursor: pointer;
    }
    pre {
      margin: 16px 0 0;
      border-radius: 8px;
      border: 1px solid var(--border);
      padding: 12px;
      overflow: auto;
      white-space: pre-wrap;
      background: #0f152b;
    }
    .row {
      display: flex;
      gap: 8px;
      align-items: center;
      flex-wrap: wrap;
    }
    .pill {
      padding: 2px 8px;
      border-radius: 999px;
      border: 1px solid var(--border);
      color: var(--muted);
      font-size: 12px;
    }
    .ok { color: var(--ok); }
    .error { color: var(--danger); }
    code { color: #a9d1ff; }
  </style>
</head>
<body>
  <h1>GP Visits API Interface</h1>
  <p>Simple UI for testing the deployed API. It stores JWT in browser localStorage.</p>
  <div class="row">
    <span class="pill">Base URL: <code id="baseUrl"></code></span>
    <span class="pill">JWT: <span id="tokenStatus">not set</span></span>
    <button id="clearToken">Clear Token</button>
  </div>

  <div class="grid">
    <section class="card">
      <h3>Register Doctor</h3>
      <label>Name</label><input id="doctorName" value="Dr. Ivan Petrov" />
      <label>Email</label><input id="doctorEmail" value="doctor@example.com" />
      <label>Password</label><input id="doctorPassword" value="Passw0rd!" />
      <label>Address</label><input id="doctorAddress" value="Sofia, Bulgaria Blvd 1" />
      <label>Schedule JSON</label>
      <textarea id="doctorSchedule">{ "schedule": [ { "dayOfWeek": 1, "intervals": [ { "start": "08:30", "end": "12:00" }, { "start": "13:00", "end": "18:30" } ] } ] }</textarea>
      <button id="registerDoctorBtn">Register Doctor</button>
    </section>

    <section class="card">
      <h3>Register Patient</h3>
      <label>Name</label><input id="patientName" value="Maria Ivanova" />
      <label>Email</label><input id="patientEmail" value="patient@example.com" />
      <label>Password</label><input id="patientPassword" value="Passw0rd!" />
      <label>Phone</label><input id="patientPhone" value="+359888111222" />
      <label>Doctor ID</label><input id="patientDoctorId" placeholder="Paste doctor id" />
      <button id="registerPatientBtn">Register Patient</button>
    </section>

    <section class="card">
      <h3>Login</h3>
      <label>Email</label><input id="loginEmail" value="doctor@example.com" />
      <label>Password</label><input id="loginPassword" value="Passw0rd!" />
      <button id="loginBtn">Login</button>
    </section>

    <section class="card">
      <h3>Create Visit</h3>
      <label>Patient ID (required if doctor token)</label><input id="visitPatientId" />
      <label>Start At (ISO)</label><input id="visitStartAt" placeholder="2026-06-01T08:30:00.000Z" />
      <label>End At (ISO)</label><input id="visitEndAt" placeholder="2026-06-01T09:00:00.000Z" />
      <button id="createVisitBtn">Create Visit</button>
    </section>

    <section class="card">
      <h3>Cancel Visit</h3>
      <label>Visit ID</label><input id="cancelVisitId" />
      <button id="cancelVisitBtn">Cancel Visit</button>
    </section>

    <section class="card">
      <h3>My Visits</h3>
      <button id="listVisitsBtn">Fetch /visits/me</button>
    </section>

    <section class="card">
      <h3>Update Base Schedule (Doctor)</h3>
      <label>Payload JSON</label>
      <textarea id="updateSchedulePayload">{ "schedule": { "schedule": [ { "dayOfWeek": 1, "intervals": [ { "start": "08:30", "end": "12:00" }, { "start": "13:00", "end": "18:30" } ] } ] } }</textarea>
      <button id="updateScheduleBtn">PATCH /doctors/me/schedule</button>
    </section>
  </div>

  <pre id="output">Ready.</pre>

  <script>
    const output = document.getElementById("output");
    const baseUrl = window.location.origin;
    document.getElementById("baseUrl").textContent = baseUrl;

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
      document.getElementById("tokenStatus").className = token ? "ok" : "error";
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
      output.textContent = JSON.stringify(
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
      return { response, data };
    }

    document.getElementById("clearToken").addEventListener("click", clearToken);

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
