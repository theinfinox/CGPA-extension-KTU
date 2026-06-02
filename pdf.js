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

        await document.fonts.ready;

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

        // --------------------
        // COVER PAGE
        // --------------------

        const cover =
            document.createElement(
                "div"
            );

        Object.assign(
            cover.style,
            {
                width: "1400px",
                minHeight: "1123px",
                padding: "20px",
                boxSizing: "border-box",
                background: "#fff8f0",
                position: "absolute",
                left: "-99999px",
                top: "0"
            }
        );

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

        // --------------------
        // SEMESTER PAGES
        // --------------------

        document
            .querySelectorAll(
                ".semester-card"
            )
            .forEach(card => {

                const page =
                    document.createElement(
                        "div"
                    );

                Object.assign(
                    page.style,
                    {
                        width: "1400px",
                        minHeight: "1123px",
                        padding: "20px",
                        boxSizing:
                            "border-box",
                        background:
                            "#fff8f0",
                        position:
                            "absolute",
                        left:
                            "-99999px",
                        top:
                            "0"
                    }
                );

                const cloned =
                    card.cloneNode(
                        true
                    );

                page.appendChild(
                    cloned
                );

                document.body.appendChild(
                    page
                );

                pages.push(page);
            });

        // --------------------
        // RENDER
        // --------------------

        for (
            let i = 0;
            i < pages.length;
            i++
        ) {

            await new Promise(
                resolve =>
                    requestAnimationFrame(
                        resolve
                    )
            );

            const imgData =
                await domtoimage
                    .toJpeg(
                        pages[i],
                        {
                            quality: 1,

                            bgcolor:
                                "#fff8f0",

                            width:
                                pages[i]
                                    .offsetWidth * 2,

                            height:
                                pages[i]
                                    .offsetHeight * 2,

                            style: {
                                transform:
                                    "scale(2)",

                                transformOrigin:
                                    "top left"
                            }
                        }
                    );

            if (i > 0)
                pdf.addPage();

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
                "JPEG",
                0,
                0,
                pageWidth,
                pageHeight,
                undefined,
                "FAST"
            );
        }

        pdf.save(
            "KTU-Academic-Report.pdf"
        );

        pages.forEach(
            page =>
                page.remove()
        );

    } catch (err) {

        console.error(
            err
        );

        alert(
            "PDF generation failed."
        );

    } finally {

        btn.innerHTML =
            originalText;
    }
}