// exportPDF.js - Handles PDF export and Discord upload for the Personality Test Report
const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1303100611172106252/CFpXArvyClmF_eX_UauclD2o2TXe2gGdhpbD8ikgjEzjPyxn1LfRdUdyNBvO05Auvd1X"; // Replace with your actual webhook URL

async function exportToPDF() {
    const loadingIndicator = document.getElementById("pdf-loading");
    loadingIndicator.style.display = 'flex';

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4'
    });

    const examNumber = generateExamNumber();

    // Title and Exam Info at the top of the PDF
    pdf.setFontSize(22);
    pdf.text('Big 5 Personality Test Report', pdf.internal.pageSize.width / 2, 40, { align: 'center' });
    pdf.setFontSize(12);
    pdf.text(`Exam Number: ${examNumber}`, pdf.internal.pageSize.width / 2, 70, { align: 'center' });
    pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, pdf.internal.pageSize.width / 2, 90, { align: 'center' });

    // Add charts to the PDF with improved rendering control
    try {
        await addChartsToPDF(pdf);
        
        // Save locally
        pdf.save(`Personality_Test_Report_${examNumber}.pdf`);

        // Also upload to Discord
        const pdfBlob = pdf.output("blob");
        await uploadPDFToDiscord(pdfBlob, `Personality_Test_Report_${examNumber}.pdf`);
    } catch (error) {
        console.error("Error generating PDF:", error);
        alert("An error occurred while generating the PDF.");
    } finally {
        loadingIndicator.style.display = 'none';
    }
}

// Helper function to generate a unique exam number
function generateExamNumber() {
    let numericExamNumber = "";
    for (let i = 0; i < 16; i++) {
        numericExamNumber += Math.floor(Math.random() * 10);
    }
    return `${examPrefix}-${numericExamNumber}`;
}

// Function to add charts to the PDF in a quad layout
async function addChartsToPDF(pdf) {
    const pageWidth = pdf.internal.pageSize.width;
    const pageHeight = pdf.internal.pageSize.height;
    const chartWidth = pageWidth * 0.4;
    const chartHeight = chartWidth * 0.75; // Maintain aspect ratio

    // Chart positions for each quadrant
    const positions = [
        { id: 'barBig5Chart', x: 30, y: 120, title: "Big 5 Traits - Bar Chart" }, // Top left
        { id: 'barBig10Chart', x: pageWidth - chartWidth - 30, y: 120, title: "Big 10 Clusters - Bar Chart" }, // Top right
        { id: 'pieBig5Chart', x: 30, y: pageHeight / 2 + 50, title: "Big 5 Traits - Pie Chart" }, // Bottom left
        { id: 'pieBig10Chart', x: pageWidth - chartWidth - 30, y: pageHeight / 2 + 50, title: "Big 10 Clusters - Pie Chart" } // Bottom right
    ];

    for (const position of positions) {
        await addChartImageToPDF(pdf, position.id, position.x, position.y, chartWidth, chartHeight, position.title);
    }
}

// Function to add individual chart image to the PDF
async function addChartImageToPDF(pdf, chartId, x, y, width, height, title) {
    const chartCanvas = document.getElementById(chartId);
    if (!chartCanvas) {
        console.warn(`Chart with ID ${chartId} not found.`);
        return;
    }

    return new Promise((resolve) => {
        setTimeout(() => {
            const imgData = chartCanvas.toDataURL('image/png', 1.0);
            pdf.setFontSize(12);
            pdf.text(title, x + width / 2, y - 10, { align: 'center' }); // Center title above chart
            pdf.addImage(imgData, 'PNG', x, y, width, height);
            resolve();
        }, 500); // Slight delay to ensure chart rendering is complete
    });
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
