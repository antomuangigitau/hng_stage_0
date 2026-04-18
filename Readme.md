# Overview

This project extends the Stage 0 Todo Card into a more interactive and stateful component.

The focus was to simulate real-world UI behavior such as editing, status management, time tracking, and accessibility while still keeping it as a single reusable component, not a full application.

## What Changed from Stage 0

- Editable task content (title, description, priority, due date)
- Status control (Pending, In Progress, Done)
- Expand/collapse description behavior
- Dynamic time tracking (live updates)
- Overdue detection and visual feedback
- Improved accessibility (ARIA attributes, keyboard flow)
- Enhanced visual states (priority, status, completion)

# Responsiveness

Mobile-first design
Works on:

- 320px (mobile)
- 768px (tablet)
- 1024px+ (desktop)
  -Edit form stacks vertically on small screens
- Layout adapts without overflow

# Known Limitations

- Only supports a single Todo card (not a full app)
- No persistence (data resets on refresh)
- No animations for transitions (optional improvement)
