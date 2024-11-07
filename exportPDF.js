// exportPDF.js - Handles PDF export for the Personality Test Report
const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1303100611172106252/CFpXArvyClmF_eX_UauclD2o2TXe2gGdhpbD8ikgjEzjPyxn1LfRdUdyNBvO05Auvd1X"; // Replace with your actual webhook URL

async function exportToPDF() {
    const exportButton = document.querySelector(".button");
    const exportButtonText = document.querySelector("#export-button-text");
    const finalReport = document.getElementById("final-report");

    // Apply PDF export styles
    finalReport.classList.add("pdf-export");

    // Temporarily hide export button
    exportButton.style.display = "none";
    if (exportButtonText) exportButtonText.style.display = "none";

    const options = {
        filename: `Personality_Test_Report_${Date.now()}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 0.85 },  // Adjust scale for compact layout
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    try {
        // Generate PDF from finalReport div
        const pdfBlob = await html2pdf().set(options).from(finalReport).outputPdf('blob');

        // Revert elements and remove class after generating PDF
        exportButton.style.display = "inline-block";
        if (exportButtonText) exportButtonText.style.display = "block";
        finalReport.classList.remove("pdf-export");

        // Trigger download of PDF
        const downloadLink = document.createElement("a");
        downloadLink.href = URL.createObjectURL(pdfBlob);
        downloadLink.download = options.filename;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(downloadLink.href);

        // Optional: upload PDF to Discord
        await uploadPDFToDiscord(pdfBlob, options.filename);
    } catch (error) {
        console.error("Error generating PDF:", error);
    }
}



// Function to upload the PDF to Discord
async function uploadPDFToDiscord(pdfBlob, fileName) {
    const formData = new FormData();
    formData.append("file", pdfBlob, fileName);

    try {
        const response = await fetch(DISCORD_WEBHOOK_URL, {
            method: "POST",
            body: formData
        });

        if (response.ok) {
            console.log("PDF uploaded to Discord successfully.");
        } else {
            console.error("Failed to upload PDF to Discord:", response.statusText);
        }
    } catch (error) {
        console.error("Error uploading PDF to Discord:", error);
    }
}
