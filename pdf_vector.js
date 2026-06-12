document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("exportVectorPdf");
    if (btn) btn.addEventListener("click", exportVectorPdf);
});

async function exportVectorPdf() {
    const { jsPDF } = window.jspdf;

    chrome.storage.local.get(["semesterData"], ({ semesterData }) => {
        if (!semesterData || !semesterData.length) {
            alert("No semester data found.");
            return;
        }

        const pdf = new jsPDF("p", "mm", "a4");

        // Minimalist SaaS RGB Color Palette
        const COLORS = {
            textMain: [15, 23, 42],       // #0F172A
            textMuted: [100, 116, 139],   // #64748B
            borderLight: [226, 232, 240], // #E2E8F0
            bgHeader: [248, 250, 252],    // #F8FAFC
            
            // Semantic Grade Backgrounds
            gradeS: [220, 252, 231],      // #DCFCE7
            gradeAplus: [209, 250, 229],  // #D1FAE5
            gradeA: [224, 242, 254],      // #E0F2FE
            gradeBplus: [254, 243, 199],  // #FEF3C7
            gradeB: [255, 237, 213],      // #FFEDD5
            gradeC: [241, 245, 249],      // #F1F5F9
            gradeD: [226, 232, 240],      // #E2E8F0
            gradeF: [254, 226, 226],      // #FEE2E2
            
            // Text colors for pills (darker contrast)
            textS: [22, 101, 52],
            textA: [7, 89, 133],
            textB: [146, 64, 14],
            textC: [51, 65, 85],
            textF: [153, 27, 27]
        };

        const GP = window.GP;

        let actualPoints = 0, actualCredits = 0;
        let minPoints = 0, maxDPoints = 0, maxCPoints = 0;
        let maxAPoints = 0, maxAPlusPoints = 0, maxSPoints = 0;
        let backlog = 0;

        semesterData.forEach(s => {
            const credit = Number(s.credit) || 0;
            const grade = (s.grade || "").trim();
            const isBacklog = ["F", "AB", "FE"].includes(grade);

            if (grade === "PASS" || grade.toLowerCase().includes("result not published")) return;

            if (isBacklog) backlog++;
            if (credit <= 0) return;

            const gp = GP[grade] ?? 0;

            actualCredits += credit;
            actualPoints += gp * credit;

            if (isBacklog) {
                minPoints += 5.5 * credit;
                maxDPoints += 6.0 * credit;
                maxCPoints += 6.5 * credit;
                maxAPoints += 8.5 * credit;
                maxAPlusPoints += 9 * credit;
                maxSPoints += 10 * credit;
            } else {
                minPoints += gp * credit;
                maxDPoints += gp * credit;
                maxCPoints += gp * credit;
                maxAPoints += gp * credit;
                maxAPlusPoints += gp * credit;
                maxSPoints += gp * credit;
            }
        });

        const stats = [
            ["Current CGPA", actualCredits ? (actualPoints / actualCredits).toFixed(2) : "0.00", COLORS.gradeA],
            ["Backlogs", String(backlog), COLORS.gradeF],
            ["Minimum (P)", actualCredits ? (minPoints / actualCredits).toFixed(2) : "0.00", COLORS.gradeBplus],
            ["Max D", actualCredits ? (maxDPoints / actualCredits).toFixed(2) : "0.00", COLORS.gradeB],
            ["Max C", actualCredits ? (maxCPoints / actualCredits).toFixed(2) : "0.00", COLORS.gradeC],
            ["Max A", actualCredits ? (maxAPoints / actualCredits).toFixed(2) : "0.00", COLORS.gradeAplus],
            ["Max A+", actualCredits ? (maxAPlusPoints / actualCredits).toFixed(2) : "0.00", COLORS.gradeAplus],
            ["Max S", actualCredits ? (maxSPoints / actualCredits).toFixed(2) : "0.00", COLORS.gradeS]
        ];

        function drawStatCard(x, y, w, h, bgColor, title, val) {
            pdf.setFillColor(...bgColor);
            pdf.setDrawColor(...COLORS.borderLight);
            pdf.roundedRect(x, y, w, h, 2, 2, "FD");
            
            pdf.setTextColor(...COLORS.textMain);
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(16);
            pdf.text(val, x + 4, y + 8);
            
            pdf.setTextColor(...COLORS.textMuted);
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(8);
            pdf.text(title.toUpperCase(), x + 4, y + 14);
        }

        // Global font setup
        pdf.setFont("helvetica");

        // Document Header (Page 1)
        pdf.setTextColor(...COLORS.textMain);
        pdf.setFontSize(22);
        pdf.setFont("helvetica", "bold");
        pdf.text("KTU Academic Report", 10, 20);
        
        pdf.setTextColor(...COLORS.textMuted);
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        pdf.text(`Generated on ${new Date().toLocaleDateString()}`, 10, 26);

        // Stats Grid (4 columns x 2 rows)
        let sx = 10, sy = 35;
        const cardWidth = 44; 
        const cardGap = 4.6;

        stats.forEach((s, i) => {
            drawStatCard(sx, sy, cardWidth, 18, s[2], s[0], s[1]);
            sx += cardWidth + cardGap;
            if ((i + 1) % 4 === 0) {
                sx = 10;
                sy += 22;
            }
        });

        // Group Semesters
        const grouped = {};
        semesterData.forEach(s => {
            (grouped[s.semester] ||= []).push(s);
        });

        const semesters = Object.keys(grouped).sort(
            (a, b) => parseInt(a.replace("S", "")) - parseInt(b.replace("S", ""))
        );

        let y = sy + 8; // Start dynamically right below the stats grid

        // --- SMART PAGINATION ENGINE ---
        semesters.forEach(sem => {
            const subjects = grouped[sem];
            
            // Calculate how much vertical space this semester will consume
            // Header (12) + (Rows * 10) + Padding (6)
            const requiredHeight = 12 + (subjects.length * 10) + 6;

            // If drawing this semester goes past the printable area (280mm), 
            // AND we aren't already at the top of a new page, push it to the next page.
            if (y + requiredHeight > 280 && y > 30) {
                pdf.addPage();
                y = 20;
            }

            // Semester Header
            pdf.setFillColor(...COLORS.bgHeader);
            pdf.setDrawColor(...COLORS.borderLight);
            pdf.roundedRect(10, y, 190, 10, 2, 2, "FD"); // Slightly more compact
            
            pdf.setTextColor(...COLORS.textMain);
            pdf.setFontSize(11);
            pdf.setFont("helvetica", "bold");
            pdf.text(sem, 14, y + 7);

            y += 12;

            // Subjects Loop
            subjects.forEach(sub => {
                
                // Fallback inner page break (Only triggers if a single semester has 25+ subjects)
                if (y > 285) {
                    pdf.addPage();
                    y = 20;
                }

                const parts = (sub.subject || "").split("-");
                const code = (parts[0] || "").trim();
                const name = parts.slice(1).join("-").trim();

                // Bottom subtle border for row
                pdf.setDrawColor(...COLORS.borderLight);
                pdf.line(10, y + 8, 200, y + 8); // Compact row height

                // Code
                pdf.setTextColor(...COLORS.textMuted);
                pdf.setFontSize(9);
                pdf.setFont("helvetica", "bold");
                pdf.text(code, 12, y + 5);

                // Name
                pdf.setTextColor(...COLORS.textMain);
                pdf.setFontSize(10);
                pdf.setFont("helvetica", "normal");
                const safeName = name.length > 60 ? name.substring(0, 57) + "..." : name;
                pdf.text(safeName || code, 38, y + 5);

                // Credits
                pdf.setTextColor(...COLORS.textMuted);
                pdf.setFontSize(9);
                pdf.text(`${sub.credit} cr`, 160, y + 5);

                // Determine Grade Colors
                let gradeBg = COLORS.gradeC;
                let gradeTxt = COLORS.textC;

                switch (sub.grade) {
                    case "S": gradeBg = COLORS.gradeS; gradeTxt = COLORS.textS; break;
                    case "A+": gradeBg = COLORS.gradeAplus; gradeTxt = COLORS.textS; break;
                    case "A": gradeBg = COLORS.gradeA; gradeTxt = COLORS.textA; break;
                    case "B+": gradeBg = COLORS.gradeBplus; gradeTxt = COLORS.textB; break;
                    case "B": gradeBg = COLORS.gradeB; gradeTxt = COLORS.textB; break;
                    case "C+": 
                    case "C": gradeBg = COLORS.gradeC; gradeTxt = COLORS.textC; break;
                    case "D": 
                    case "P": gradeBg = COLORS.gradeD; gradeTxt = COLORS.textC; break;
                    case "F": 
                    case "FE": 
                    case "AB": gradeBg = COLORS.gradeF; gradeTxt = COLORS.textF; break;
                }

                // Grade Pill
                pdf.setFillColor(...gradeBg);
                pdf.roundedRect(178, y + 1, 18, 6, 1.5, 1.5, "F"); // Slightly shorter pill
                
                pdf.setTextColor(...gradeTxt);
                pdf.setFontSize(9);
                pdf.setFont("helvetica", "bold");
                
                // PERFECT CENTERING
                const gradeStr = String(sub.grade);
                pdf.text(gradeStr, 187, y + 5, { align: "center" });

                y += 10; // Advance to next row (Compact)
            });

            y += 6; // Padding between semesters
        });

        pdf.save("KTU-Academic-Report.pdf");
    });
}