// exportPDF.js - Handles PDF export for the Personality Test Report

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

    // Title and Exam Info
    pdf.setFontSize(22);
    pdf.text('Big 5 Personality Test Report', pdf.internal.pageSize.width / 2, 50, { align: 'center' });
    pdf.setFontSize(12);
    pdf.text(`Exam Number: ${examNumber}`, pdf.internal.pageSize.width / 2, 80, { align: 'center' });
    pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, pdf.internal.pageSize.width / 2, 100, { align: 'center' });

    async function addChartToPDF(chartId, title) {
        const chartCanvas = document.getElementById(chartId);
        if (!chartCanvas) {
            console.warn(`Chart with ID ${chartId} not found.`);
            return;
        }

        return new Promise((resolve) => {
            setTimeout(() => {
                const imgData = chartCanvas.toDataURL('image/png', 1.0);
                const pageWidth = pdf.internal.pageSize.width;
                const pageHeight = pdf.internal.pageSize.height;
                
                // Centering chart in page
                const imgWidth = pageWidth * 0.8;  // Scaled width
                const aspectRatio = chartCanvas.width / chartCanvas.height;
                const imgHeight = imgWidth / aspectRatio;  // Scaled height

                const xOffset = (pageWidth - imgWidth) / 2;
                const yOffset = (pageHeight - imgHeight) / 2;

                pdf.addPage();
                pdf.setFontSize(16);
                pdf.text(title, pageWidth / 2, 40, { align: 'center' });
                pdf.addImage(imgData, 'PNG', xOffset, yOffset + 20, imgWidth, imgHeight);
                resolve();
            }, 200); // Delay to allow chart rendering
        });
    }

    try {
        await addChartToPDF('barBig5Chart', 'Big 5 Traits - Bar Chart');
        await addChartToPDF('barBig10Chart', 'Big 10 Clusters - Bar Chart');
        await addChartToPDF('pieBig5Chart', 'Big 5 Traits - Pie Chart');
        await addChartToPDF('pieBig10Chart', 'Big 10 Clusters - Pie Chart');

        pdf.save(`Personality_Test_Report_${examNumber}.pdf`);
    } catch (error) {
        console.error("Error generating PDF:", error);
        alert("An error occurred while generating the PDF.");
    } finally {
        loadingIndicator.style.display = 'none';
    }
}

// Generate a unique 16-digit exam number with prefix
function generateExamNumber() {
    let numericExamNumber = "";
    for (let i = 0; i < 16; i++) {
        numericExamNumber += Math.floor(Math.random() * 10);
    }
    return `${examPrefix}-${numericExamNumber}`;
}
