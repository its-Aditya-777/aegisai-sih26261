(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[char]);
  }


  function initSidebar() {
    const shell = $(".app-shell");
    const sidebar = $("#appSidebar");
    const toggle = $(".sidebar-toggle");
    const overlay = $(".sidebar-overlay");
    if (!shell || !sidebar || !toggle) return;

    const mobileQuery = window.matchMedia("(max-width: 980px)");
    const setOpen = (open) => {
      if (mobileQuery.matches) {
        shell.classList.remove("sidebar-collapsed");
        shell.classList.toggle("sidebar-open", open);
      } else {
        shell.classList.remove("sidebar-open");
        shell.classList.toggle("sidebar-collapsed", !open);
      }
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    };
    const syncViewport = () => {
      shell.classList.remove("sidebar-open", "sidebar-collapsed");
      const open = !mobileQuery.matches;
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Collapse navigation" : "Open navigation");
    };

    toggle.addEventListener("click", () => {
      const isOpen = mobileQuery.matches
        ? shell.classList.contains("sidebar-open")
        : !shell.classList.contains("sidebar-collapsed");
      setOpen(!isOpen);
    });
    overlay?.addEventListener("click", () => setOpen(false));
    $$(".side-nav .nav-link", sidebar).forEach((link) => link.addEventListener("click", () => {
      if (mobileQuery.matches) setOpen(false);
    }));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        if (mobileQuery.matches && shell.classList.contains("sidebar-open")) setOpen(false);
        else if (!mobileQuery.matches && !shell.classList.contains("sidebar-collapsed")) setOpen(false);
      }
    });
    if (mobileQuery.addEventListener) mobileQuery.addEventListener("change", syncViewport);
    else mobileQuery.addListener(syncViewport);
    syncViewport();
  }

  function initExampleProfiles() {
    const form = $("#applicationForm");
    const status = $("#exampleProfileStatus");
    if (!form) return;
    $$('[data-example-fill]').forEach((button) => {
      button.addEventListener("click", () => {
        const setValue = (name, value) => {
          const field = $(`[name="${name}"]`, form);
          if (field) {
            field.value = value || "";
            field.dispatchEvent(new Event("change", { bubbles: true }));
          }
        };
        setValue("institution_name", button.dataset.institutionName);
        setValue("institution_code", button.dataset.institutionCode);
        setValue("academic_year", button.dataset.academicYear);
        setValue("category", button.dataset.category);
        setValue("contact_email", button.dataset.contactEmail);
        if (status) status.innerHTML = `<strong>Profile filled.</strong> Now download and extract the matching PDF pack above, attach the files using their matching document types, then click “Create application & validate”.`;
        form.scrollIntoView({ behavior: "smooth", block: "start" });
        window.setTimeout(() => $("input[name='institution_name']", form)?.focus({ preventScroll: true }), 350);
      });
    });
  }

  function initFlashMessages() {
    $$(".flash-close").forEach((button) => {
      button.addEventListener("click", () => button.closest(".flash")?.remove());
    });
  }

  function initUploadRows() {
    const form = $("#applicationForm");
    const rows = $("#documentUploadRows");
    const addButton = $("#addDocumentRow");
    if (!form || !rows || !addButton) return;

    const docTypes = Array.from(new Set($$("select[name='document_types'] option", rows).map((option) => option.value).filter(Boolean)));
    const maxRows = 12;

    const makeRow = (index) => {
      const options = ['<option value="">Choose type</option>']
        .concat(docTypes.map((type) => `<option value="${escapeHTML(type)}">${escapeHTML(type)}</option>`))
        .concat(['<option value="Other supporting document">Other supporting document</option>']);
      const wrapper = document.createElement("div");
      wrapper.className = "upload-row";
      wrapper.innerHTML = `
        <div class="upload-row-index">${String(index).padStart(2, "0")}</div>
        <label class="field"><span>Document type</span><select name="document_types">${options.join("")}</select></label>
        <label class="file-picker"><span class="file-picker-label">Choose file</span><input type="file" name="documents" accept=".pdf,.docx,.txt,.csv,.png,.jpg,.jpeg,.tif,.tiff,.webp"><span class="file-name">No file selected</span></label>
        <button type="button" class="remove-upload" aria-label="Remove upload row" title="Remove row">×</button>`;
      return wrapper;
    };

    function refreshIndexes() {
      $$(".upload-row", rows).forEach((row, index) => {
        const indexEl = $(".upload-row-index", row);
        if (indexEl) indexEl.textContent = String(index + 1).padStart(2, "0");
      });
      addButton.disabled = $$(".upload-row", rows).length >= maxRows;
      addButton.textContent = addButton.disabled ? "Upload limit reached" : "＋ Add document";
    }

    function bindRow(row) {
      const fileInput = $("input[type='file']", row);
      const fileLabel = $(".file-name", row);
      const remove = $(".remove-upload", row);
      fileLabel?.addEventListener("click", () => fileInput?.click());
      fileInput?.addEventListener("change", () => {
        const file = fileInput.files?.[0];
        fileLabel.textContent = file ? file.name : "No file selected";
        fileLabel.classList.toggle("has-file", Boolean(file));
      });
      remove?.addEventListener("click", () => {
        const allRows = $$(".upload-row", rows);
        if (allRows.length <= 1) {
          const select = $("select[name='document_types']", row);
          if (select) select.value = "";
          if (fileInput) fileInput.value = "";
          if (fileLabel) {
            fileLabel.textContent = "No file selected";
            fileLabel.classList.remove("has-file");
          }
        } else {
          row.remove();
        }
        refreshIndexes();
      });
    }

    $$(".upload-row", rows).forEach(bindRow);
    addButton.addEventListener("click", () => {
      if ($$(".upload-row", rows).length >= maxRows) return;
      const row = makeRow($$(".upload-row", rows).length + 1);
      rows.appendChild(row);
      bindRow(row);
      refreshIndexes();
      $("select[name='document_types']", row)?.focus();
    });

    const dropzone = $("#uploadDropzone");
    dropzone?.addEventListener("dragover", (event) => {
      event.preventDefault();
      dropzone.classList.add("dropzone-active");
    });
    dropzone?.addEventListener("dragleave", () => dropzone.classList.remove("dropzone-active"));
    dropzone?.addEventListener("drop", (event) => {
      event.preventDefault();
      dropzone.classList.remove("dropzone-active");
      const files = Array.from(event.dataTransfer?.files || []);
      files.forEach((file) => {
        if ($$(".upload-row", rows).length >= maxRows) return;
        const row = makeRow($$(".upload-row", rows).length + 1);
        rows.appendChild(row);
        bindRow(row);
        const input = $("input[type='file']", row);
        const transfer = new DataTransfer();
        transfer.items.add(file);
        input.files = transfer.files;
        $(".file-name", row).textContent = file.name;
        $(".file-name", row).classList.add("has-file");
      });
      refreshIndexes();
    });

    const requiredDocs = JSON.parse(form.dataset.requiredDocs || "{}");
    const category = $("#applicationCategory");
    const checklist = $("#dynamicChecklist");
    function updateChecklist() {
      if (!checklist || !category) return;
      const selected = category.value;
      const docs = requiredDocs[selected] || [];
      if (!docs.length) {
        checklist.innerHTML = '<div class="checklist-placeholder"><span>01</span><p>Choose an application category to view the expected documents.</p></div>';
        return;
      }
      checklist.innerHTML = docs.map((doc, index) => `
        <div class="checklist-preview-item"><span>${String(index + 1).padStart(2, "0")}</span><div><p>${escapeHTML(doc)}</p><small>Expected for this category</small></div></div>
      `).join("");
    }
    category?.addEventListener("change", updateChecklist);
    updateChecklist();

    form.addEventListener("submit", (event) => {
      const institution = $("input[name='institution_name']", form)?.value.trim();
      const code = $("input[name='institution_code']", form)?.value.trim();
      const categoryValue = category?.value;
      if (!institution || !code || !categoryValue) {
        event.preventDefault();
        window.alert("Please complete the required institution details and select an application category.");
        return;
      }
      const submit = $("button[type='submit']", form);
      if (submit) {
        submit.disabled = true;
        submit.innerHTML = '<span class="button-spinner"></span> Processing files…';
      }
    });
    refreshIndexes();
  }

  function initDetailTabs() {
    $$("[data-tab-target]").forEach((tab) => {
      tab.addEventListener("click", () => {
        $$("[data-tab-target]").forEach((item) => item.classList.remove("active"));
        tab.classList.add("active");
      });
    });
    const ids = ["findings", "documents", "checklist", "audit"];
    if (!ids.some((id) => window.location.hash === `#${id}`)) return;
    const current = window.location.hash.slice(1);
    $$("[data-tab-target]").forEach((tab) => tab.classList.toggle("active", tab.dataset.tabTarget === current));
  }

  function initReviewForms() {
    $$(".review-action-form").forEach((form) => {
      form.addEventListener("submit", (event) => {
        const action = $("input[name='review_action']", form)?.value;
        if (action === "acknowledge") {
          const input = $("input[name='review_note']", form);
          if (input && !input.value.trim()) input.value = "Acknowledged for authorized human review.";
        }
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initSidebar();
    initFlashMessages();
    initExampleProfiles();
    initUploadRows();
    initDetailTabs();
    initReviewForms();
  });
})();
