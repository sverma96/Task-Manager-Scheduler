# Task Manager & Scheduler

A client-side productivity application built with vanilla JavaScript and jQuery, featuring a dual-module architecture — a real-time ToDo list and an authenticated appointment scheduling system — delivered as a single-page application with zero backend dependencies.


## Overview

Task Manager & Scheduler is a modular, tab-driven SPA (Single-Page Application) that enables users to manage day-to-day tasks alongside a conflict-aware appointment scheduler — all without requiring a server, database, or build toolchain.

---

## Architecture

```
┌─────────────────────────────────────────────┐
│                  index.html                  │
│           (Entry point + DOM shell)          │
└────────────┬──────────────┬─────────────────┘
             │              │
     ┌───────▼──────┐  ┌────▼──────────────────┐
     │   todo.js    │  │    appointment.js       │
     │  TodoApp     │  │  AppointmentScheduler   │
     │  (Class)     │  │  (Class)                │
     └───────┬──────┘  └────┬──────────────────┘
             │              │
     ┌───────▼──────────────▼──────────────────┐
     │             main.js                      │
     │       (Tab navigation controller)        │
     └───────────────────┬─────────────────────┘
                         │
     ┌───────────────────▼─────────────────────┐
     │           jquery-functions.js            │
     │  (UX enhancements: validation, auto-save,│
     │   keyboard shortcuts, notification queue)│
     └─────────────────────────────────────────┘
```

Each module is independently instantiated and exposed on the `window` object for cross-module interoperability.

---

## Features

### ToDo Module
- Add, edit, and delete tasks via button or keyboard input
- Inline editing with state-aware ADD/UPDATE toggle
- XSS-safe rendering via `escapeHtml()` on all user input
- Click-to-delete affordance on task text
- Persistent state via `localStorage` (auto-save on change)

### Appointment Scheduler Module
- Session-based user registration and authentication (in-memory)
- Scheduling conflict detection within a configurable 30-minute window
- Past-date validation enforced at both the UI and logic layer
- Reschedule flow: pre-populates the form and removes the existing record
- Appointments sorted chronologically per authenticated user
- Auto-dismissing toast notifications on schedule/cancel actions

### UX & Enhancement Layer (`jquery-functions.js`)
- Animated tab switching with jQuery `fadeIn/fadeOut`
- Real-time input validation with inline error/warning state classes
- Debounced auto-save to `localStorage` (1000ms delay)
- Queued notification system with staggered display intervals
- Animated slide-in/slide-out notification components

---

## Tech Stack

| Layer | Technology |
|---|---|
| Markup | HTML5 (Semantic) |
| Styling | CSS3 (Grid, Flexbox, Custom Properties) |
| Core Logic | Vanilla JavaScript (ES6 Classes) |
| DOM/UX Layer | jQuery 3.6.0 (CDN) |
| Persistence | Web Storage API (`localStorage`) |
| Build Tools | None — zero-dependency, browser-native |

---

## Project Structure

```
task-manager-scheduler/
├── index.html              # Application shell and DOM structure
├── styles.css              # Global styles, component styles, responsive breakpoints
├── todo.js                 # TodoApp class — task CRUD logic
├── appointment.js          # AppointmentScheduler class — scheduling logic and auth
├── main.js                 # Application bootstrap and tab controller
└── jquery-functions.js     # jQuery-powered UX enhancements and utility layer
```

---

## Module Breakdown

### `todo.js` — `TodoApp` Class

| Method | Responsibility |
|---|---|
| `init()` | Binds DOM events and triggers initial render |
| `handleAdd()` | Handles both add and update operations based on `editingIndex` state |
| `handleEdit()` | Populates input with existing task text; sets edit mode |
| `handleDelete()` | Removes task by DOM-derived index |
| `render()` | Full re-render of the task list from in-memory array |
| `escapeHtml()` | Sanitizes user input before DOM injection |

### `appointment.js` — `AppointmentScheduler` Class

| Method | Responsibility |
|---|---|
| `handleRegister()` | Validates uniqueness and registers a new in-memory user |
| `handleLogin()` | Authenticates against in-memory user store |
| `handleSchedule()` | Validates input, checks temporal conflicts, persists appointment |
| `handleAppointmentReschedule()` | Extracts appointment data to form, removes original record |
| `renderAppointments()` | Filters by current user, sorts by datetime, renders to DOM |
| `showNotification()` | Programmatically creates and auto-removes toast notifications |
| `escapeHtml()` | XSS sanitization layer on appointment content |

### `jquery-functions.js` — Enhancement Layer

| Function | Responsibility |
|---|---|
| `setupFormValidation()` | Attaches real-time blur/input validators with error state classes |
| `setupAutoSave()` | Debounced `localStorage` persistence for todo state |
| `setupKeyboardShortcuts()` | Global hotkeys for tab switching and input clearing |
| `setupNotificationSystem()` | Polling-based notification queue with 500ms dispatch intervals |
| `displayEnhancedNotification()` | Animated, dismissible notification components |
| `showMiniNotification()` | Compact bottom-left confirmations for low-priority events |

---



