const VIBES = [
    "🚀 Academic Comeback Arc",
    "🔥 Locked In Mode",
    "💀 Surviving KTU",
    "✨ Delulu CGPA Calculator",
    "📚 Trust The Process",
    "🎯 Placement Season Loading",
    "☕ Powered By Last Minute Studying"
];



const GP = window.GP;

const subtitle =
    document.querySelector(".subtitle");

if (subtitle) {
    subtitle.textContent =
        VIBES[
            Math.floor(
                Math.random() * VIBES.length
            )
        ];
}

chrome.storage.local.get(
    ["semesterData"],
    ({ semesterData }) => {

        if (!semesterData || !semesterData.length)
            return;

        renderSemesterCards(semesterData);

        calculateCGPA(semesterData);

        document
            .getElementById("download")
            .onclick = () =>
                downloadCSV(semesterData);
    }
);

function renderSemesterCards(data) {

    const container =
        document.getElementById(
            "semesterContainer"
        );

    container.innerHTML = "";

    const grouped = {};

    data.forEach(subject => {

        if (!grouped[subject.semester]) {

            grouped[subject.semester] = [];
        }

        grouped[subject.semester]
            .push(subject);
    });

    Object.keys(grouped)
        .sort(
            (a, b) =>
                Number(
                    a.replace("S", "")
                ) -
                Number(
                    b.replace("S", "")
                )
        )
        .forEach(semester => {

            const subjects =
    grouped[semester];

const publishedSubjects =
    subjects;

            const sgpaCredits =
                publishedSubjects
                    .filter(
                        s =>
                            Number(
                                s.credit
                            ) > 0
                    )
                    .reduce(
                        (sum, s) =>
                            sum +
                            Number(
                                s.credit
                            ),
                        0
                    );

            const sgpaPoints =
                publishedSubjects
                    .filter(
                        s =>
                            Number(
                                s.credit
                            ) > 0
                    )
                    .reduce(
                        (sum, s) =>
                            sum +
                            (
                                (
                                    GP[
                                        s.grade
                                        .trim()
                                    ] ?? 0
                                ) *
                                Number(
                                    s.credit
                                )
                            ),
                        0
                    );

            const sgpa =
                sgpaCredits
                    ? (
                        sgpaPoints /
                        sgpaCredits
                    ).toFixed(2)
                    : "0.00";

            const totalCredits =
                publishedSubjects.reduce(
                    (sum, s) =>
                        sum +
                        (
                            Number(
                                s.credit
                            ) || 0
                        ),
                    0
                );

            const backlogs =
                publishedSubjects.filter(
                    s =>
                        [
                            "F",
                            "AB",
                            "FE"
                        ].includes(
                            s.grade.trim()
                        )
                ).length;

            const passed =
                publishedSubjects.length -
                backlogs;

            const semesterCard =
                document.createElement(
                    "div"
                );

            semesterCard.className =
                "semester-card";

            semesterCard.innerHTML = `
                <div class="semester-header">
                    ${semester}
                </div>

                <div class="semester-meta">

                    <div class="meta-pill">
                        📚 ${totalCredits} Credits
                    </div>

                    <div class="meta-pill">
                        🎯 SGPA ${sgpa}
                    </div>

                    <div class="meta-pill">
                        ✅ ${passed} Passed
                    </div>

                    <div class="meta-pill">
                        💀 ${backlogs} Backlogs
                    </div>

                </div>

                <div class="subjects-list"></div>
            `;

            const subjectList =
                semesterCard.querySelector(
                    ".subjects-list"
                );

subjects.forEach(subject => {

    const grade =
        String(
            subject.grade || ""
        ).trim();


                const row =
                    document.createElement(
                        "div"
                    );

                row.className =
                    "subject";

                row.innerHTML = `
                    <div>

                        <div class="subject-code">
                            ${
                                subject.subject
                                    .split("-")[0]
                                    .trim()
                            }
                        </div>

                        <div class="subject-name">
                            ${
                                subject.subject
                                    .split("-")
                                    .slice(1)
                                    .join("-")
                                    .trim()
                            }
                        </div>

                    </div>

                    <div style="
                        display:flex;
                        gap:8px;
                        align-items:center;
                    ">

                        <div>
                            ${subject.credit} cr
                        </div>

                        <div class="
                            grade-pill
                            ${getGradeClass(
                                grade
                            )}
                        ">
                            ${grade}
                        </div>

                    </div>
                `;

                subjectList.appendChild(
                    row
                );
            });

            container.appendChild(
                semesterCard
            );
        });
}


function getGradeClass(grade) {

    switch (grade) {

        case "S":
            return "grade-S";

        case "A+":
            return "grade-Aplus";

        case "A":
            return "grade-A";

        case "B+":
            return "grade-Bplus";

        case "B":
            return "grade-B";

        case "C+":
        case "C":
        case "D":
        case "P":
            return "grade-C";

        case "F":
        case "AB":
        case "FE":
            return "grade-F";

        default:
            return "";
    }
}

function calculateCGPA(data) {

    let actualPoints = 0;
    let actualCredits = 0;

    let minPoints = 0;

    let maxAPoints = 0;
    let maxAPlusPoints = 0;
    let maxSPoints = 0;

    let backlog = 0;

    const BACKLOG_GRADES =
        new Set([
            "F",
            "AB",
            "FE"
        ]);

    data.forEach(subject => {

        const credit =
            Number(
                subject.credit
            ) || 0;

        const grade =
            String(
                subject.grade || ""
            ).trim();

        // Ignore unpublished results completely

        if (
    grade === "PASS" ||
    grade
        .toLowerCase()
        .includes(
            "result not published"
        )
)
    return;

        const isBacklog =
            BACKLOG_GRADES.has(
                grade
            );

        if (isBacklog)
            backlog++;

        if (credit <= 0)
            return;

        const gp =
            GP[grade] ?? 0;

        actualCredits +=
            credit;

        actualPoints +=
            gp * credit;

        if (isBacklog) {

            minPoints +=
                5.5 * credit;

            maxAPoints +=
                8.5 * credit;

            maxAPlusPoints +=
                9 * credit;

            maxSPoints +=
                10 * credit;

        } else {

            minPoints +=
                gp * credit;

            maxAPoints +=
                gp * credit;

            maxAPlusPoints +=
                gp * credit;

            maxSPoints +=
                gp * credit;
        }
    });

    const actual =
        actualCredits
            ? (
                actualPoints /
                actualCredits
              ).toFixed(2)
            : "0.00";

    const minimum =
        actualCredits
            ? (
                minPoints /
                actualCredits
              ).toFixed(2)
            : "0.00";

    const maxA =
        actualCredits
            ? (
                maxAPoints /
                actualCredits
              ).toFixed(2)
            : "0.00";

    const maxAPlus =
        actualCredits
            ? (
                maxAPlusPoints /
                actualCredits
              ).toFixed(2)
            : "0.00";

    const maxS =
        actualCredits
            ? (
                maxSPoints /
                actualCredits
              ).toFixed(2)
            : "0.00";

    document.getElementById(
        "stats"
    ).innerHTML = `
<div class="stats-grid">

    <div class="stat-card" style="background:#b3e5ff">
        <div class="value">${actual}</div>
        <div class="label">📚 Current CGPA</div>
    </div>

    <div class="stat-card" style="background:#ffe680">
        <div class="value">${minimum}</div>
        <div class="label">😅 Minimum</div>
    </div>

    <div class="stat-card" style="background:#c9ffb3">
        <div class="value">${maxA}</div>
        <div class="label">🎯 Max A</div>
    </div>

    <div class="stat-card" style="background:#d7b3ff">
        <div class="value">${maxAPlus}</div>
        <div class="label">✨ Max A+</div>
    </div>

    <div class="stat-card" style="background:#ffb3d9">
        <div class="value">${maxS}</div>
        <div class="label">👑 Max S</div>
    </div>

    <div class="stat-card" style="background:#ffb0b0">
        <div class="value">${backlog}</div>
        <div class="label">💀 Backlogs</div>
    </div>

</div>
`;
}

function downloadCSV(data){

    let csv =
    "Semester,Subject,Grade,Credit\n";

    data.forEach(r => {

        csv +=
        `"${r.semester}","${r.subject}","${r.grade}",${r.credit}\n`;
    });

    const blob =
        new Blob(
            [csv],
            {type:'text/csv'}
        );

    const url =
        URL.createObjectURL(blob);

    const a =
        document.createElement('a');

    a.href = url;

    a.download =
        'ktu-grades.csv';

    a.click();
}