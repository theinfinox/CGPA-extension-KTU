document.addEventListener(
    "DOMContentLoaded",
    () => {

        const btn =
            document.getElementById(
                "exportPdf"
            );

        if (!btn)
            return;

        btn.addEventListener(
            "click",
            exportStyledPDF
        );
    }
);

async function exportStyledPDF() {

    const btn =
        document.getElementById(
            "exportPdf"
        );

    const originalText =
        btn.innerHTML;

    btn.innerHTML =
        "⏳ Generating PDF...";

    try {

        const {
            jsPDF
        } = window.jspdf;

        const pdf =
            new jsPDF(
                "p",
                "mm",
                "a4"
            );

        const pages = [];

        // COVER PAGE

        const cover =
            document.createElement(
                "div"
            );

        cover.style.width =
            "794px";

        cover.style.minHeight =
            "1123px";

        cover.style.padding =
            "20px";

        cover.style.boxSizing =
            "border-box";

        cover.style.background =
            "#fff8f0";

        cover.style.position =
            "absolute";

        cover.style.left =
            "-99999px";

        cover.style.top =
            "0";

        const hero =
            document
            .querySelector(".hero")
            ?.cloneNode(true);

        const subtitle =
            document
            .querySelector(".subtitle")
            ?.cloneNode(true);

        const stats =
            document
            .getElementById("stats")
            ?.cloneNode(true);

        const vibe =
            document
            .querySelector(".vibe-banner")
            ?.cloneNode(true);

        if (hero)
            cover.appendChild(hero);

        if (subtitle)
            cover.appendChild(
                subtitle
            );

        if (stats)
            cover.appendChild(stats);

        if (vibe)
            cover.appendChild(vibe);

        document.body.appendChild(
            cover
        );

        pages.push(cover);

        // SEMESTER PAGES

        document
            .querySelectorAll(
                ".semester-card"
            )
            .forEach(card => {

                const page =
                    document.createElement(
                        "div"
                    );

                page.style.width =
                    "794px";

                page.style.minHeight =
                    "1123px";

                page.style.padding =
                    "20px";

                page.style.boxSizing =
                    "border-box";

                page.style.background =
                    "#fff8f0";

                page.style.position =
                    "absolute";

                page.style.left =
                    "-99999px";

                page.style.top =
                    "0";

                page.appendChild(
                    card.cloneNode(true)
                );

                document.body.appendChild(
                    page
                );

                pages.push(page);
            });

        // RENDER PAGES

        for (
            let i = 0;
            i < pages.length;
            i++
        ) {

            const canvas =
                await html2canvas(
                    pages[i],
                    {
                        scale: 2,
                        backgroundColor:
                            "#fff8f0",
                        useCORS: true
                    }
                );

            const imgData =
                canvas.toDataURL(
                    "image/png"
                );

            if (i > 0) {
                pdf.addPage();
            }

            const pageWidth =
                pdf.internal
                    .pageSize
                    .getWidth();

            const pageHeight =
                pdf.internal
                    .pageSize
                    .getHeight();

            pdf.addImage(
                imgData,
                "PNG",
                0,
                0,
                pageWidth,
                pageHeight
            );
        }

        pdf.save(
            "KTU-Academic-Report.pdf"
        );

        pages.forEach(
            page => page.remove()
        );

    } catch (err) {

        console.error(err);

        alert(
            "PDF generation failed."
        );

    } finally {

        btn.innerHTML =
            originalText;
    }
}