# 🎓 KTU CGPA Calculator - For those in stressed with backlogs - not the usual calculator

A fun and powerful Chrome Extension for KTU students to instantly calculate CGPA, SGPA, backlog status, academic projections, and export professional reports directly from the KTU Student Portal.

---

## ✨ Features

### 📚 Automatic Result Extraction

- Reads results directly from the KTU portal
- No manual data entry required
- Supports multiple semesters

### 🎯 CGPA Analytics

Displays:

- Current CGPA
- Minimum Possible CGPA
- Maximum Possible CGPA (All Backlogs Cleared with A)
- Maximum Possible CGPA (All Backlogs Cleared with A+)
- Maximum Possible CGPA (All Backlogs Cleared with S)

### 🚀 Semester-wise SGPA

For every semester:

- Total Credits
- SGPA
- Passed Subjects
- Backlogs

### 💀 Backlog Tracking

Automatically detects:

- F
- FE
- AB

and calculates academic projections.

### 📄 Export Options

#### CSV Export

Download all extracted academic data as CSV.

#### Academic PDF Export

Generate a clean academic report containing:

- CGPA Summary
- SGPA Summary
- Semester Details
- Subject Details
- Backlog Information

### 🎨 Modern UI

- Neo-brutalist design
- Color-coded grades
- Lightweight and fast
- Built specifically for KTU students

---

# 📥 Installation

## Load Unpacked Extension

1. Download or clone this repository.

2. Open Chrome and navigate to:

```
chrome://extensions
```

3. Enable:

```
Developer Mode
```

4. Click:

```
Load Unpacked
```

5. Select the extension folder.

6. Pin the extension from the Chrome toolbar.

---

# 🚀 How To Use

## Step 1

Login to the KTU Student Portal.

```
https://app.ktu.edu.in
```

## Step 2

Open Students Tab -> View Full Profile -> Curriculum

## Step 3

Wait for the page to fully load.

The extension automatically extracts:

- Semester
- Subject Code
- Subject Name
- Grade
- Credits

## Step 4

Click the extension icon.

The popup displays:

- Current CGPA
- Minimum CGPA
- Maximum A CGPA
- Maximum A+ CGPA
- Maximum S CGPA
- Backlogs
- Semester SGPA

---

# 📊 Grade Mapping

| Grade | Grade Point |
|---------|---------|
| S | 10 |
| A+ | 9 |
| A | 8.5 |
| B+ | 8 |
| B | 7.5 |
| C+ | 7 |
| C | 6.5 |
| D | 6 |
| P | 5.5 |
| F | 0 |
| FE | 0 |
| AB | 0 |

---

# ⚠ Calculation Rules

## PASS Subjects

The following grades are excluded from CGPA calculations:

```
PASS
```

Examples include:

- Health & Wellness
- Life Skills
- Digital 101

## Result Not Published

Subjects marked as:

```
Result Not Published
```

are:

- Displayed in the UI
- Excluded from CGPA calculations
- Excluded from SGPA calculations

until official results are published.

## Backlogs

The following grades are treated as backlogs:

```
F
FE
AB
```

---

# 📄 PDF Export

Two export options are available.

## Academic PDF (Recommended)

- Smaller file size
- Searchable content
- Professional report format

## Visual PDF

- Exact popup appearance
- Larger file size
- Useful for archiving

---

# 🔒 Privacy

This extension:

- Stores data locally using Chrome Storage
- Performs calculations locally
- Does not transmit academic data to any external server
- Does not collect personal information
- Does not use analytics or tracking

---

# 🛠 Tech Stack

- HTML
- CSS
- JavaScript
- Chrome Extension Manifest V3
- Chrome Storage API
- jsPDF
- html2canvas
- dom-to-image-more

---

# 📈 Supported

- KTU 2019 Scheme
- Multiple Semesters
- Backlog Analysis
- SGPA Calculation
- CGPA Calculation
- Academic Projections
- CSV Export
- PDF Export

---

## 🎓 Academic Comeback Loading 🚀

Built for KTU students who are surviving, recovering, improving, and chasing placements one SGPA at a time.
