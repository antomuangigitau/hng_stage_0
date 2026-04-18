(function () {
  "use strict";

  let DUE_DATE = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000);
  const REFRESH_INTERVAL_MS = 30_000;

  const card = document.querySelector('[data-testid="test-todo-card"]');
  const viewMode = document.querySelector("#view-mode");
  const checkbox = document.querySelector(
    '[data-testid="test-todo-complete-toggle"]',
  );
  const statusBadge = document.querySelector(
    '[data-testid="test-todo-status"]',
  );
  const titleEl = document.querySelector('[data-testid="test-todo-title"]');
  const descriptionEl = document.querySelector(
    '[data-testid="test-todo-description"]',
  );
  const priorityBadge = document.querySelector(
    '[data-testid="test-todo-priority"]',
  );
  const priorityIndicator = document.querySelector(
    '[data-testid="test-todo-priority-indicator"]',
  );
  const collapsibleSection = document.querySelector(
    '[data-testid="test-todo-collapsible-section"]',
  );

  const toggleBtn = document.querySelector(
    '[data-testid="test-todo-expand-toggle"]',
  );

  let isExpanded = false;
  const MAX_LENGTH = 120;

  let fullText = descriptionEl.textContent.trim();

  const dueDateEl = document.getElementById("due-date-el");
  const timeRemEl = document.getElementById("time-remaining-el");
  const editBtn = document.querySelector(
    '[data-testid="test-todo-edit-button"]',
  );
  const deleteBtn = document.querySelector(
    '[data-testid="test-todo-delete-button"]',
  );
  const statusControl = document.querySelector(
    '[data-testid="test-todo-status-control"]',
  );

  const editForm = document.querySelector(
    '[data-testid="test-todo-edit-form"]',
  );
  const editTitleInput = document.querySelector(
    '[data-testid="test-todo-edit-title-input"]',
  );
  const editDescInput = document.querySelector(
    '[data-testid="test-todo-edit-description-input"]',
  );
  const editPrioritySelect = document.querySelector(
    '[data-testid="test-todo-edit-priority-select"]',
  );
  const editDueDateInput = document.querySelector(
    '[data-testid="test-todo-edit-due-date-input"]',
  );
  const cancelBtn = document.querySelector(
    '[data-testid="test-todo-cancel-button"]',
  );

  const PRIORITY_MAP = {
    High: {
      emoji: "🔥",
      badgeClass: "badge--high",
      indicatorClass: "priority-indicator--high",
      label: "Priority: High",
    },
    Medium: {
      emoji: "⚡",
      badgeClass: "badge--medium",
      indicatorClass: "priority-indicator--medium",
      label: "Priority: Medium",
    },
    Low: {
      emoji: "🟢",
      badgeClass: "badge--low",
      indicatorClass: "priority-indicator--low",
      label: "Priority: Low",
    },
  };

  function collapseText() {
    if (fullText.length <= MAX_LENGTH) {
      toggleBtn.style.display = "none";
      return;
    }

    const shortText = fullText.slice(0, MAX_LENGTH) + "...";
    descriptionEl.textContent = shortText;

    toggleBtn.textContent = "Show more";
    toggleBtn.setAttribute("aria-expanded", "false");

    isExpanded = false;
  }

  function expandText() {
    descriptionEl.textContent = fullText;

    toggleBtn.textContent = "Show less";
    toggleBtn.setAttribute("aria-expanded", "true");

    isExpanded = true;
  }

  function handleToggleExpand() {
    if (isExpanded) {
      collapseText();
    } else {
      expandText();
    }
  }

  function updatePriorityIndicator(priority) {
    priorityIndicator.className = `priority-indicator ${PRIORITY_MAP[priority].indicatorClass}`;
  }

  function getCurrentPriority() {
    const text = priorityBadge.textContent.trim();
    if (text.includes("High")) return "High";
    if (text.includes("Medium")) return "Medium";
    return "Low";
  }

  function formatDueDate(date) {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return "Due " + date.toLocaleDateString("en-KE", options);
  }

  function toISODate(date) {
    return date.toISOString();
  }

  function toInputDateValue(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  function getTimeRemainingText(dueDate) {
    const now = Date.now();
    const diff = dueDate.getTime() - now;

    const absDiff = Math.abs(diff);
    const minutes = Math.floor(absDiff / (1000 * 60));
    const hours = Math.floor(absDiff / (1000 * 60 * 60));
    const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));

    let text = "";
    let state = "normal";

    if (diff <= 0) {
      state = "overdue";
      if (minutes < 1) text = "Due now!";
      else if (minutes < 60)
        text = `Overdue by ${minutes} minute${minutes === 1 ? "" : "s"}`;
      else if (hours < 24)
        text = `Overdue by ${hours} hour${hours === 1 ? "" : "s"}`;
      else text = `Overdue by ${days} day${days === 1 ? "" : "s"}`;
    } else {
      if (minutes < 1) {
        text = "Due now!";
        state = "soon";
      } else if (minutes < 60) {
        text = `Due in ${minutes} minute${minutes === 1 ? "" : "s"}`;
        state = "soon";
      } else if (hours < 2) {
        text = "Due in 1 hour";
        state = "soon";
      } else if (hours < 24) {
        text = `Due in ${hours} hours`;
        state = "soon";
      } else if (days === 1) {
        text = "Due tomorrow";
      } else {
        text = `Due in ${days} days`;
      }
    }

    return { text, state };
  }

  function renderDueDate() {
    dueDateEl.textContent = formatDueDate(DUE_DATE);
    dueDateEl.setAttribute("datetime", toISODate(DUE_DATE));
  }

  function renderTimeRemaining() {
    const overdueIndicator = document.getElementById("overdue-indicator");
    if (checkbox.checked) {
      timeRemEl.textContent = "Completed";
      timeRemEl.classList.remove("is-overdue", "is-soon");
      if (overdueIndicator) overdueIndicator.hidden = true;
      return;
    }

    const { text, state } = getTimeRemainingText(DUE_DATE);
    timeRemEl.textContent = text;

    timeRemEl.classList.remove("is-overdue", "is-soon");
    if (state === "overdue") timeRemEl.classList.add("is-overdue");
    if (state === "soon") timeRemEl.classList.add("is-soon");

    if (overdueIndicator) overdueIndicator.hidden = state !== "overdue";
  }

  function setStatus(status) {
    statusBadge.textContent = status;
    const radio = statusControl.querySelector(`input[value="${status}"]`);
    if (radio) radio.checked = true;
    checkbox.checked = status === "Done";
    card.classList.remove("is-done", "is-in-progress");
    if (status === "Done") card.classList.add("is-done");
    if (status === "In Progress") card.classList.add("is-in-progress");
    renderTimeRemaining();
  }

  function handleStatusChange(event) {
    setStatus(event.target.value);
  }

  function handleToggle() {
    setStatus(checkbox.checked ? "Done" : "Pending");
  }

  function enterEditMode() {
    editTitleInput.value = titleEl.textContent.trim();
    editDescInput.value = descriptionEl.textContent.trim();
    editPrioritySelect.value = getCurrentPriority();

    const datetimeAttr = dueDateEl.getAttribute("datetime");
    if (datetimeAttr) {
      editDueDateInput.value = toInputDateValue(new Date(datetimeAttr));
    } else {
      editDueDateInput.value = "";
    }

    viewMode.hidden = true;
    editForm.hidden = false;

    editTitleInput.focus();
  }

  function exitEditMode() {
    editForm.hidden = true;
    viewMode.hidden = false;
    editBtn.focus();
  }

  function handleSave(event) {
    event.preventDefault();
    titleEl.textContent = editTitleInput.value.trim();
    descriptionEl.textContent = editDescInput.value.trim();
    fullText = descriptionEl.textContent.trim();
    collapseText();

    const priority = editPrioritySelect.value;
    const info = PRIORITY_MAP[priority];
    priorityBadge.textContent = `${info.emoji} ${priority}`;
    priorityBadge.className = `badge badge--priority ${info.badgeClass}`;
    priorityBadge.setAttribute("aria-label", info.label);

    updatePriorityIndicator(priority);

    if (editDueDateInput.value) {
      DUE_DATE = new Date(editDueDateInput.value + "T00:00:00");
      renderDueDate();
      renderTimeRemaining();
    }

    exitEditMode();
  }

  function handleDelete() {
    alert("Delete clicked");
  }

  renderDueDate();
  renderTimeRemaining();
  collapseText();

  checkbox.addEventListener("change", handleToggle);
  statusControl.addEventListener("change", handleStatusChange);
  editBtn.addEventListener("click", enterEditMode);
  deleteBtn.addEventListener("click", handleDelete);
  editForm.addEventListener("submit", handleSave);
  cancelBtn.addEventListener("click", exitEditMode);
  toggleBtn.addEventListener("click", handleToggleExpand);

  setInterval(renderTimeRemaining, REFRESH_INTERVAL_MS);
})();
