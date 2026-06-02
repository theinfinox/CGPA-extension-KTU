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

    const COLORS = {
        pink:[255,179,217],
        purple:[215,179,255],
        yellow:[255,230,128],
        green:[201,255,179],
        blue:[179,229,255],
        red:[255,176,176]
    };

    const GP = window.GP;

    let actualPoints=0, actualCredits=0;
    let minPoints=0,maxAPoints=0,maxAPlusPoints=0,maxSPoints=0;
    let backlog=0;

    semesterData.forEach(s=>{
        const credit=Number(s.credit)||0;
        const grade=(s.grade||"").trim();
        const isBacklog=["F","AB","FE"].includes(grade);

        if(isBacklog) backlog++;

        if(credit<=0) return;

        const gp=GP[grade] ?? 0;

        actualCredits+=credit;
        actualPoints+=gp*credit;

        if(isBacklog){
            minPoints+=5.5*credit;
            maxAPoints+=8.5*credit;
            maxAPlusPoints+=9*credit;
            maxSPoints+=10*credit;
        }else{
            minPoints+=gp*credit;
            maxAPoints+=gp*credit;
            maxAPlusPoints+=gp*credit;
            maxSPoints+=gp*credit;
        }
    });

    const stats=[
        ["Current", (actualPoints/actualCredits).toFixed(2), COLORS.blue],
        ["Minimum", (minPoints/actualCredits).toFixed(2), COLORS.yellow],
        ["Max A", (maxAPoints/actualCredits).toFixed(2), COLORS.green],
        ["Max A+", (maxAPlusPoints/actualCredits).toFixed(2), COLORS.purple],
        ["Max S", (maxSPoints/actualCredits).toFixed(2), COLORS.pink],
        ["Backlogs", String(backlog), COLORS.red],
    ];

    function card(x,y,w,h,color,title,val){
        pdf.setFillColor(...color);
        pdf.setDrawColor(17,17,17);
        pdf.roundedRect(x,y,w,h,3,3,"FD");
        pdf.setFontSize(14);
        pdf.text(val,x+4,y+8);
        pdf.setFontSize(8);
        pdf.text(title,x+4,y+15);
    }

    pdf.setFillColor(...COLORS.pink);
    pdf.roundedRect(10,10,190,16,4,4,"FD");
    pdf.setFontSize(18);
    pdf.text("KTU CGPA Calculator",18,20);

    let sx=10, sy=35;

    stats.forEach((s,i)=>{
        card(sx,sy,45,20,s[2],s[0],s[1]);

        sx += 50;

        if((i+1)%3===0){
            sx=10;
            sy+=25;
        }
    });

    pdf.setFillColor(...COLORS.yellow);
    pdf.roundedRect(10,90,190,10,3,3,"FD");
    pdf.setFontSize(10);
    pdf.text("Academic Comeback Arc",75,97);

    const grouped={};

    semesterData.forEach(s=>{
        (grouped[s.semester] ||= []).push(s);
    });

    const semesters =
        Object.keys(grouped)
        .sort(
            (a,b)=>
            parseInt(a.replace("S","")) -
            parseInt(b.replace("S",""))
        );

    semesters.forEach(sem=>{

        pdf.addPage();

        let y=15;

        pdf.setFillColor(...COLORS.purple);

        pdf.roundedRect(
            10,
            y,
            190,
            14,
            3,
            3,
            "FD"
        );

        pdf.setFontSize(16);

        pdf.text(
            sem,
            16,
            y+9
        );

        y += 20;

        grouped[sem].forEach(sub=>{

            if(y>275){

                pdf.addPage();

                y=15;
            }

            pdf.setDrawColor(
                17,
                17,
                17
            );

            pdf.roundedRect(
                10,
                y,
                190,
                16,
                2,
                2,
                "S"
            );

            const parts =
                (sub.subject || "")
                .split("-");

            const code =
                (parts[0] || "")
                .trim();

            const name =
                parts
                .slice(1)
                .join("-")
                .trim();

            pdf.setFontSize(8);

            pdf.text(
                code,
                14,
                y+5
            );

            pdf.setFontSize(10);

            pdf.text(
                name || code,
                14,
                y+11
            );

            pdf.setFontSize(8);

            pdf.text(
                `${sub.credit} cr`,
                145,
                y+10
            );

            let gradeColor =
                COLORS.red;

            if(sub.grade==="S")
                gradeColor =
                    COLORS.pink;

            else if(
                sub.grade==="A+"
            )
                gradeColor =
                    COLORS.green;

            else if(
                sub.grade==="A"
            )
                gradeColor =
                    COLORS.blue;

            else if(
                sub.grade==="B+"
            )
                gradeColor =
                    COLORS.yellow;

            pdf.setFillColor(
                ...gradeColor
            );

            pdf.roundedRect(
                165,
                y+3,
                20,
                8,
                2,
                2,
                "FD"
            );

            pdf.text(
                String(
                    sub.grade
                ),
                171,
                y+8
            );

            y += 18;
        });
    });

    pdf.save(
        "KTU-Academic-Report.pdf"
    );
});

}