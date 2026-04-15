# 🌍 Smart Timezone Meeting Planner

A modern web application that helps users find the best overlapping meeting times across multiple time zones using the **Temporal API**.

---

## 🚀 Live Idea

Planning meetings across different countries is painful:

* Timezones are confusing
* Daylight Saving Time (DST) breaks logic
* Manual calculations are error-prone

This app solves that by using the **Temporal API** for accurate, reliable time calculations.

---

## 🎯 Features

### 👥 Add Participants

* Add multiple users dynamically
* Each participant includes:

  * Name
  * Timezone (IANA format, e.g. `Asia/Kolkata`)
  * Working hours (start & end)

---

### ⏱ Smart Timezone Handling

* Uses `Temporal.ZonedDateTime`
* Converts all times to UTC for comparison
* Automatically handles DST (no manual offsets)

---

### 🔄 Overlap Detection

* Finds common available time across all participants
* Displays:

  * Overlap time range
  * Total duration

---

### 💡 Smart Suggestions

* Suggests top 3 meeting slots
* Prioritizes:

  * Maximum overlap duration
  * Comfortable times (avoids very early/late hours)

---

### 🖥 Clean UI

* Built with React + Tailwind CSS
* Add/remove participants dynamically
* Displays results as cards or timeline
* Shows each participant’s **local time**

---

### ⚠️ Edge Case Handling

* Different days across timezones
* Midnight crossing
* No overlap scenarios
* Daylight Saving Time changes

---

## 🛠 Tech Stack

| Layer        | Technology            |
| ------------ | --------------------- |
| Frontend     | React (Hooks)         |
| Styling      | Tailwind CSS          |
| State        | useState, useMemo     |
| Time Logic   | @js-temporal/polyfill |
| Optional API | Node.js + Express     |

---

## 📁 Folder Structure

```
/src
  /components
    ParticipantForm.jsx
    TimezoneSelector.jsx
    TimeOverlapResult.jsx

  /utils
    timeUtils.js

  App.jsx
```

---

## ⚙️ How It Works

### Step 1: Capture User Input

Participants enter their:

* Timezone
* Working hours

---

### Step 2: Convert to Zoned Time

```js
Temporal.ZonedDateTime.from()
```

Each participant’s local time is converted into a timezone-aware object.

---

### Step 3: Normalize to UTC

```js
zdt.withTimeZone("UTC")
```

All times are aligned to a common reference.

---

### Step 4: Calculate Overlap

```js
start = max(all start times)
end   = min(all end times)
```

* If `start < end` → ✅ overlap exists
* Else → ❌ no overlap

---

### Step 5: Compute Duration

```js
duration = end.since(start)
```

---

## 🧪 Example

| Name    | Timezone         | Working Hours |
| ------- | ---------------- | ------------- |
| Hemanth | Asia/Kolkata     | 09:00–18:00   |
| John    | America/New_York | 09:00–17:00   |

👉 App calculates:

* Common time window (if exists)
* Best meeting suggestions

---

## 🧠 Why Temporal API?

Traditional `Date` has issues:

* ❌ Timezone bugs
* ❌ DST inconsistencies
* ❌ Hard to maintain

**Temporal solves this:**

* ✔ Built-in timezone awareness
* ✔ Immutable objects
* ✔ Accurate calculations

---

## 🎁 Bonus Features

* 🌙 Dark Mode
* 💾 localStorage persistence
* 📱 Fully responsive design

---

## 📦 Installation

```bash
git clone https://github.com/your-username/smart-timezone-planner.git
cd smart-timezone-planner
npm install
npm run dev
```

---

## 🔧 Usage

1. Add participants
2. Select timezones
3. Enter working hours
4. View overlapping time + suggestions

---

## 🚨 Important Notes

* This project **does NOT use JavaScript Date**
* All calculations are done using Temporal
* Designed to handle real-world timezone complexity

---

## 📌 Future Improvements

* Google Calendar integration
* Meeting booking links
* AI-based smart scheduling
* Team availability heatmaps

---

## 🤝 Contributing

Contributions are welcome!
Feel free to fork the repo and submit a PR.

---

## 📄 License

MIT License

---

## 💡 Author

Built with focus on real-world problem solving and clean architecture.
