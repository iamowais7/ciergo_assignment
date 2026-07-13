# Ciergo – Finance Bookings

A functional implementation of the Finance > Bookings page built as part of Ciergo's technical assignment.

## Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS v4
- Lucide React
- React Router v6

## Getting Started

```bash
npm install
npm run dev
```

App runs at `http://localhost:5173`. Opens directly on the Finance > Bookings page.

## What's Built

**Bookings Table (`/finance/bookings`)**
- Filter bar — booking date range, travel date range, owner search (simple + advanced mode), booking type, and search by ID / lead pax / amount
- Three tabs — Bookings, Deleted, Waiting for Approval (with sub-filter: All / Pending / Approved / Rejected)
- Sortable columns (lead pax, date, amount), toggleable date column (travel vs booking date), service filter with grouped tree
- Payment ↔ Booking status toggle on the column header
- Inline approve/reject with confirmation modals
- Per-row context menu with actions that adapt per booking state (pending / approved / rejected / deleted)
- Bulk selection mode — select individual rows or all at once
- Hover tooltip on amount showing customer and vendor pending split
- Pagination with configurable rows per page

**Calendar View (`/finance/bookings/calendar`)**
- 5-day timeline grid with hourly slots
- Booking cards positioned by travel date and time
- Status filter (Completed / On Trip / Upcoming / Cancelled)
- Week navigation, booking type filter, owner filter, and search — all wired up
- Current time indicator line

## Notes

- All data is mocked locally — no backend or API calls
- Sidebar open/close state persists via localStorage
