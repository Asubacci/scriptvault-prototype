import { messages } from "./data/messages.js";
import { logger } from "./utils/logger.js";

const sampleLeads = [
  {
    id: "sample-1",
    fullName: "Adaora Nwosu",
    email: "adaora.producer@example.com",
    company: "Lagos Lantern Studios",
    role: "Producer",
    primaryNeed: "Find low-budget production-ready stories",
    preferredGenre: "Thriller",
    budgetRange: "Low budget",
    productionTimeline: "Next 3 months",
    status: "NEW",
    adminNotes: "Strong fit for contained thriller inventory.",
  },
  {
    id: "sample-2",
    fullName: "Tunde Bello",
    email: "tunde.development@example.com",
    company: "Rivergate Pictures",
    role: "Development executive",
    primaryNeed: "Buy exclusive rights",
    preferredGenre: "Drama",
    budgetRange: "Mid budget",
    productionTimeline: "Next 6 months",
    status: "REVIEWED",
    adminNotes: "Send first coverage-backed marketplace preview.",
  },
  {
    id: "sample-3",
    fullName: "Miriam Okonkwo",
    email: "miriam.studio@example.com",
    company: "New Coast Media",
    role: "Studio executive",
    primaryNeed: "Commission rewrites or adaptations",
    preferredGenre: "Faith / Family",
    budgetRange: "Premium / studio",
    productionTimeline: "Researching for later",
    status: "CONTACTED",
    adminNotes: "Follow up with partnership deck.",
  },
];

let currentLeads = [...sampleLeads];

function getElement(selector) {
  return document.querySelector(selector);
}

function getApiSettings() {
  const apiUrlInput = getElement("#adminApiUrl");
  const adminKeyInput = getElement("#adminKey");
  const savedApiUrl = window.SCRIPTVAULT_API_URL || window.localStorage.getItem("scriptvault_api_url") || "";
  const savedAdminKey = window.localStorage.getItem("scriptvault_admin_key") || "";

  if (apiUrlInput && !apiUrlInput.value) {
    apiUrlInput.value = savedApiUrl;
  }

  if (adminKeyInput && !adminKeyInput.value) {
    adminKeyInput.value = savedAdminKey;
  }

  return {
    apiUrl: apiUrlInput?.value.trim() || savedApiUrl,
    adminKey: adminKeyInput?.value.trim() || savedAdminKey,
  };
}

function setStatus(message) {
  const status = getElement("#adminWaitlistStatus");
  if (status) {
    status.textContent = message;
  }
}

function renderLeads(leads) {
  const rows = getElement("#adminWaitlistRows");
  if (!rows) {
    return;
  }

  rows.innerHTML = leads
    .map(
      (lead) => `<tr data-lead-id="${lead.id}">
        <td>
          <strong>${lead.fullName}</strong>
          <span>${lead.email}</span>
          <small>${lead.company || "Independent"} · ${lead.role}</small>
        </td>
        <td>
          <strong>${lead.primaryNeed}</strong>
          <span>${lead.preferredGenre || "Any genre"} · ${lead.budgetRange || "Budget TBD"}</span>
        </td>
        <td>${lead.productionTimeline || "Timeline TBD"}</td>
        <td>
          <select class="lead-status" aria-label="Lead status for ${lead.fullName}">
            ${["NEW", "REVIEWED", "CONTACTED", "QUALIFIED", "ARCHIVED"]
              .map((status) => `<option ${lead.status === status ? "selected" : ""}>${status}</option>`)
              .join("")}
          </select>
        </td>
        <td>
          <textarea class="lead-notes" aria-label="Admin notes for ${lead.fullName}" rows="2">${lead.adminNotes || ""}</textarea>
          <button class="outline-button save-lead-button" type="button">Save</button>
        </td>
      </tr>`
    )
    .join("");
}

async function fetchLiveLeads() {
  const { apiUrl, adminKey } = getApiSettings();

  if (!apiUrl || !adminKey) {
    currentLeads = [...sampleLeads];
    renderLeads(currentLeads);
    setStatus(messages.adminWaitlistDemo);
    return;
  }

  window.localStorage.setItem("scriptvault_api_url", apiUrl);
  window.localStorage.setItem("scriptvault_admin_key", adminKey);

  const response = await window.fetch(`${apiUrl.replace(/\/$/, "")}/admin/waitlist`, {
    headers: { "x-admin-key": adminKey },
  });

  if (!response.ok) {
    throw new Error(`Waitlist API returned ${response.status}`);
  }

  currentLeads = await response.json();
  renderLeads(currentLeads);
  setStatus(messages.adminWaitlistLoaded);
}

async function saveLead(row) {
  const leadId = row.dataset.leadId;
  const status = row.querySelector(".lead-status").value;
  const adminNotes = row.querySelector(".lead-notes").value;
  const lead = currentLeads.find((item) => item.id === leadId);
  const { apiUrl, adminKey } = getApiSettings();

  if (!lead) {
    return;
  }

  lead.status = status;
  lead.adminNotes = adminNotes;

  if (apiUrl && adminKey && !leadId.startsWith("sample-")) {
    const response = await window.fetch(`${apiUrl.replace(/\/$/, "")}/admin/waitlist/${leadId}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        "x-admin-key": adminKey,
      },
      body: JSON.stringify({ status, adminNotes }),
    });

    if (!response.ok) {
      throw new Error(`Waitlist update returned ${response.status}`);
    }
  }

  setStatus(messages.adminWaitlistSaved);
}

function exportCsv() {
  const headers = [
    "Name",
    "Email",
    "Company",
    "Role",
    "Need",
    "Genre",
    "Budget",
    "Timeline",
    "Status",
    "Notes",
  ];
  const lines = [
    headers,
    ...currentLeads.map((lead) => [
      lead.fullName,
      lead.email,
      lead.company || "",
      lead.role,
      lead.primaryNeed,
      lead.preferredGenre || "",
      lead.budgetRange || "",
      lead.productionTimeline || "",
      lead.status,
      lead.adminNotes || "",
    ]),
  ].map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","));

  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "scriptvault-waitlist-review.csv";
  link.click();
  URL.revokeObjectURL(link.href);
  setStatus(messages.adminWaitlistExported);
}

export function initAdminWaitlist() {
  renderLeads(currentLeads);

  getElement("#refreshWaitlistButton")?.addEventListener("click", async () => {
    try {
      await fetchLiveLeads();
      logger.info("admin_waitlist_refreshed");
    } catch (error) {
      currentLeads = [...sampleLeads];
      renderLeads(currentLeads);
      setStatus(messages.adminWaitlistError);
      logger.warn("admin_waitlist_refresh_failed", { message: error.message });
    }
  });

  getElement("#exportWaitlistButton")?.addEventListener("click", exportCsv);

  getElement("#adminWaitlistRows")?.addEventListener("click", async (event) => {
    if (!event.target.classList.contains("save-lead-button")) {
      return;
    }

    try {
      await saveLead(event.target.closest("tr"));
      logger.info("admin_waitlist_lead_saved");
    } catch (error) {
      setStatus(messages.adminWaitlistError);
      logger.warn("admin_waitlist_save_failed", { message: error.message });
    }
  });
}
