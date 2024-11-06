// exportPDF.js - Handles PDF export for the Personality Test Report
const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1303100611172106252/CFpXArvyClmF_eX_UauclD2o2TXe2gGdhpbD8ikgjEzjPyxn1LfRdUdyNBvO05Auvd1X"; // Replace with your actual webhook URL

async function exportToPDF() {
    const reportElement = document.getElementById("final-report");
    const options = {
        filename: `Personality_Test_Report_${examPrefix}-${Date.now()}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    // Generate PDF
    html2pdf().set(options).from(reportElement).save();
}




// Remove addPieChartsToPDF function entirely if not used elsewhere


// Function to add bar charts on the first page in a top-bottom layout
async function addBarChartsToPDF(pdf) {
    const pageWidth = pdf.internal.pageSize.width;
    const chartWidth = pageWidth * 0.8;
    const chartHeight = chartWidth * 0.6; // Maintain aspect ratio

    // Positions for top and bottom charts
    const topY = 120; // Positioned below the title
    const bottomY = topY + chartHeight + 60; // Space between top and bottom charts

    await addChartImageToPDF(pdf, 'barBig5Chart', (pageWidth - chartWidth) / 2, topY, chartWidth, chartHeight, "Big 5 Traits - Bar Chart");
    await addChartImageToPDF(pdf, 'barBig10Chart', (pageWidth - chartWidth) / 2, bottomY, chartWidth, chartHeight, "Big 10 Clusters - Bar Chart");
}

// Function to add individual chart images to the PDF
async function addChartImageToPDF(pdf, chartId, x, y, width, height, title) {
    const chartCanvas = document.getElementById(chartId);
    if (!chartCanvas) {
        console.warn(`Chart with ID ${chartId} not found.`);
        return;
    }

    return new Promise((resolve) => {
        setTimeout(() => {
            const imgData = chartCanvas.toDataURL('image/png', 1.0);
            pdf.setFontSize(16);
            pdf.text(title, pdf.internal.pageSize.width / 2, y - 10, { align: 'center' });
            pdf.addImage(imgData, 'PNG', x, y, width, height);
            resolve();
        }, 500); // Slight delay to ensure chart rendering is complete
    });
}

// Helper function to generate a unique exam number
function generateExamNumber() {
    let numericExamNumber = "";
    for (let i = 0; i < 16; i++) {
        numericExamNumber += Math.floor(Math.random() * 10);
    }
    return `${examPrefix}-${numericExamNumber}`;
}

// Add sorted facet scores with styling to fit all 72 facets on a single page
function addStyledFacetScores(pdf) {
    const sortedFacetScores = Object.entries(facetScores).sort((a, b) => b[1] - a[1]);
    const pageWidth = pdf.internal.pageSize.width;
    const colWidth = pageWidth / 3 - 20; // Three columns layout
    let x = 20;
    let y = 60;
    let currentColumn = 0;
    const maxRowsPerColumn = 24; // 24 rows per column for a total of 72 facets

    pdf.setFontSize(18);
    pdf.text('Facet Scores (Highest to Lowest)', pageWidth / 2, 40, { align: 'center' });
    pdf.setFontSize(10);

    sortedFacetScores.forEach(([facet, score], index) => {
        const aspect = findAspectForFacet(facet);
        const color = aspectColors[aspect] || "#cccccc"; // Default color if no match

        // Draw background rectangle for each facet score
        pdf.setFillColor(color);
        pdf.roundedRect(x, y, colWidth - 10, 20, 3, 3, 'F');

        // Draw facet name and score in black text
        pdf.setTextColor(0, 0, 0); // Black text color for facet name and score
        pdf.text(facet, x + 5, y + 15);
        pdf.text(score.toFixed(2), x + colWidth - 15, y + 15, { align: 'right' });

        y += 25; // Move down for next item

        // Switch to next column if max rows per column reached
        if ((index + 1) % maxRowsPerColumn === 0) {
            y = 60;
            x += colWidth + 20; // Move to next column
            currentColumn++;
        }
    });

    pdf.setTextColor(0, 0, 0); // Reset text color to black
}

// Helper function to find the aspect for a given facet
function findAspectForFacet(facetName) {
    const question = questions.find(q => q.facet.name === facetName);
    return question ? question.aspect : null;
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
