You are a senior full-stack developer.

Build a production-ready web application called **Smart Timezone Meeting Planner** using modern best practices.

## 🎯 Goal

Create a web app that helps users find the best overlapping meeting time across multiple time zones using the JavaScript Temporal API.

---

## 🛠 Tech Stack

* Frontend: React (functional components + hooks)
* Styling: Tailwind CSS (clean modern UI)
* State: useState + useMemo (no Redux)
* Time Handling: @js-temporal/polyfill
* Optional Backend: Node.js + Express (if needed for persistence)

---

## 📦 Features

### 1. Add Participants

* User can add multiple participants
* Each participant has:

  * Name
  * Timezone (dropdown of IANA timezones like "Asia/Kolkata", "America/New_York")
  * Working hours (start time, end time)

---

### 2. Timezone Handling (IMPORTANT)

* Use Temporal.ZonedDateTime for all time calculations
* Convert all working hours into a common reference (UTC)
* Handle DST automatically (no manual offsets)

---

### 3. Find Overlapping Time

* Calculate overlapping time slots across all participants
* Show:

  * Exact overlapping range
  * Duration of overlap
* If no overlap exists, show a clear message

---

### 4. Smart Suggestions

* Suggest best meeting slots (top 3)
* Prefer:

  * Maximum overlap duration
  * Mid-range time (avoid very early/late times)

---

### 5. UI Requirements

* Clean modern dashboard
* Add/remove participants dynamically
* Display results in:

  * Timeline view OR simple cards
* Show each participant’s local time alongside overlap

---

### 6. Edge Cases

* Different days across timezones
* Midnight crossing
* No overlap
* Daylight Saving Time changes

---

## 🧠 Core Logic Requirements

* Use Temporal.Now.zonedDateTimeISO() for current time
* Use Temporal.PlainTime for working hours
* Convert to Temporal.ZonedDateTime before comparison
* Use .withTimeZone() for conversions
* Use Temporal.Duration for overlap calculation

---

## 📁 Folder Structure

/src
/components
ParticipantForm.jsx
TimeOverlapResult.jsx
TimezoneSelector.jsx
/utils
timeUtils.js
App.jsx

---

## ⚙️ Deliverables

1. Complete working React app
2. Clean reusable components
3. Utility functions for:

   * Time conversion
   * Overlap calculation
4. Sample default participants for demo
5. Comments explaining Temporal usage clearly

---

## 🎁 Bonus (if possible)

* Dark mode toggle
* Persist data in localStorage
* Mobile responsive layout

---

## 🚨 Important Instructions

* Do NOT use JavaScript Date
* Use only Temporal API for all time logic
* Keep code clean, readable, and modular
* Add comments explaining key logic

---

Generate:

1. Full React code
2. Utility functions (Temporal logic)
3. Example usage
4. Brief explanation of how overlap logic works
