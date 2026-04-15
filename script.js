(function () {
  "use strict";

  const DUE_DATE = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000);
  const REFRESH_INTERVAL_MS = 30_000;

  const card = document.querySelector('[data-testid="test-todo-card"]');
  const checkbox = document.querySelector(
    '[data-testid="test-todo-complete-toggle"]',
  );
  const statusBadge = document.querySelector(
    '[data-testid="test-todo-status"]',
  );
  const dueDateEl = document.getElementById("due-date-el");
  const timeRemEl = document.getElementById("time-remaining-el");
  const editBtn = document.querySelector(
    '[data-testid="test-todo-edit-button"]',
  );
  const deleteBtn = document.querySelector(
    '[data-testid="test-todo-delete-button"]',
  );

  function formatDueDate(date) {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return "Due " + date.toLocaleDateString("en-KE", options);
  }

  function toISODate(date) {
    return date.toISOString();
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
    const { text, state } = getTimeRemainingText(DUE_DATE);
    timeRemEl.textContent = text;

    timeRemEl.classList.remove("is-overdue", "is-soon");
    if (state === "overdue") timeRemEl.classList.add("is-overdue");
    if (state === "soon") timeRemEl.classList.add("is-soon");
  }

  function handleToggle() {
    const isDone = checkbox.checked;

    card.classList.toggle("is-done", isDone);

    if (isDone) {
      statusBadge.textContent = "Done";
      statusBadge.className = "badge badge--status badge--done";
      statusBadge.setAttribute("aria-label", "Status: Done");
    } else {
      statusBadge.textContent = "In Progress";
      statusBadge.className = "badge badge--status badge--in-progress";
      statusBadge.setAttribute("aria-label", "Status: In Progress");
    }
  }

  function handleEdit() {
    console.log("edit clicked");
  }

  function handleDelete() {
    alert("Delete clicked");
  }

  renderDueDate();
  renderTimeRemaining();

  checkbox.addEventListener("change", handleToggle);
  editBtn.addEventListener("click", handleEdit);
  deleteBtn.addEventListener("click", handleDelete);

  setInterval(renderTimeRemaining, REFRESH_INTERVAL_MS);
})();
