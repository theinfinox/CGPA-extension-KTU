function extractSemesterData() {

    const semesterData = [];

    const semesterPanels =
        document.querySelectorAll(
            '[id^="collapseFiveS"]'
        );

    semesterPanels.forEach(panel => {

        const semester =
            panel.id.replace('collapseFive','');

        const rows =
            panel.querySelectorAll(
                'tbody tr'
            );

        rows.forEach(row => {

            const cols = row.querySelectorAll('td');

            if(cols.length < 9) return;

            const subjectText =
                cols[1].innerText.trim();

            const credit =
                parseFloat(cols[2].innerText.trim()) || 0;

            const grade =
                cols[7].innerText.trim();

            semesterData.push({
                semester,
                subject: subjectText,
                grade,
                credit
            });

        });
    });

    chrome.storage.local.set({
        semesterData
    });
}

extractSemesterData();