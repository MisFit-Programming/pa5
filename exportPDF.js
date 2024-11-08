// exportPDF.js - Handles PDF export for the Personality Test Report
const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1303100611172106252/CFpXArvyClmF_eX_UauclD2o2TXe2gGdhpbD8ikgjEzjPyxn1LfRdUdyNBvO05Auvd1X"; // Replace with your actual webhook URL

async function exportToPDF() {
    const element = document.getElementById('final-report');

    // Apply custom inline styles for PDF generation to match print layout
    const inlineStyles = `
    body {
        margin: 0;
        padding: 0;
        background-color: white !important;
    }
    .button {
        display: none !important;
    }
    #final-report {
        display: block !important;
        width: 100% !important;
        max-width: none !important;
        width: 612px; /* Exact width for 8.5x11 inches */
        height: 792px; /* Exact height for 8.5x11 inches */
        height: auto;
        padding: 0.25in; /* Further reduced padding */
        box-sizing: border-box;
        font-size: 0.8em; /* Slightly smaller font size */
        line-height: 1.05; /* Further reduced line-height */
    }
    .final-report-container {
        display: flex;
        width: 100%;
        margin: 0;
        padding: 0;
        gap: 4px; /* Slightly smaller gap */
    }
    .report-left, .report-right {
        padding: 0.08in;
        margin-bottom: 0;
    }
    .chart-container, .trait-column {
        width: 100% !important;
        max-width: none;
        box-sizing: border-box;
        padding: 0;
        margin-bottom: 0.05in;
    }
    .chart-container canvas {
        width: 100% !important;
        height: 125px !important; /* Reduced chart height further */
    }
    #facet-scores {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 3px; /* Reduced gap between trait columns */
        width: 100%;
        margin: 0 auto;
        padding: 0;
    }
    .trait-column {
        display: inline-block;
        width: calc(100% / 3 - 0.05in);
        padding: 0.03in; /* Further reduced padding within each trait column */
        box-sizing: border-box;
        vertical-align: top;
        margin: 0;
    }
    .trait-column .facet-row {
        font-size: 0.75em; /* Further reduced font size within facet rows */
        padding: 1px 0; /* Added minimal padding to keep readability */
    }
    .trait-column.trait-openness { background-color: #fefa92 !important; }
    .trait-column.trait-conscientiousness { background-color: #80c7aa !important; }
    .trait-column.trait-extraversion { background-color: #ffe9bc !important; }
    .trait-column.trait-agreeableness { background-color: #bbeaff !important; }
    .trait-column.trait-neuroticism { background-color: #e0cedd !important; }
    .trait-column.trait-stability { background-color: #d3d3f5 !important; }
    `;

    // Create a style tag with inline styles
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = inlineStyles;
    document.head.appendChild(styleSheet);

    // Show loading indicator
    document.getElementById('pdf-loading').style.display = 'block';

    const options = {
        margin: 0,
        filename: 'Final_Report.pdf',
        image: { type: 'jpeg', quality: 1.0 },
        html2canvas: {
            scale: 3,
            useCORS: true,
            logging: false,
            letterRendering: true,
            scrollY
        },
        jsPDF: { unit: 'pt', format: 'letter', orientation: 'portrait' }
    };

    try {
        // Generate PDF
        await html2pdf().set(options).from(element).save();
    } catch (error) {
        console.error("Error during PDF generation: ", error);
    } finally {
        // Hide loading indicator
        document.getElementById('pdf-loading').style.display = 'none';
        document.getElementById('pdf-loading').textContent = '';
        // Remove the style element after export to clean up
        document.head.removeChild(styleSheet);
    }
}
