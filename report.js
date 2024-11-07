// Define chart instances at the top to ensure global access across functions
let barBig5ChartInstance = null;
let barBig10ChartInstance = null;
let pieBig5ChartInstance = null;
let pieBig10ChartInstance = null;

// Display the final report and render all charts
function showFinalReport() {
    const finalReport = document.getElementById("final-report");

    document.getElementById("test-section").style.display = "none";
    document.getElementById("score-header").style.display = "none";

    // Show and render the report, with pdf export class added for consistent layout
    finalReport.classList.add("pdf-export");
    finalReport.style.display = "block";

    // Render charts and facet scores
    renderAllCharts();
    renderGroupedFacetScores();

    // Log content to check if it’s being populated
    setTimeout(() => {
        console.log("Final Report InnerHTML:", finalReport.innerHTML);
        
        // Remove the pdf-export class after rendering for print preview consistency
        finalReport.classList.remove("pdf-export");
    }, 1000); // Adding a 1-second delay to ensure content loads before logging
}



// Define colors for Big 5 traits and their respective Big 10 aspects
const traitColors = {
    Openness: "#fefa92",
    Conscientiousness: "#80c7aa",
    Extraversion: "#ffe9bc",
    Agreeableness: "#bbeaff",
    Neuroticism: "#e0cedd", Stability: "#e0cedd"
};

const aspectColors = {
    Intellect: traitColors.Openness,
    Receptivity: traitColors.Openness,
    Industriousness: traitColors.Conscientiousness,
    Orderliness: traitColors.Conscientiousness,
    Enthusiasm: traitColors.Extraversion,
    Assertiveness: traitColors.Extraversion,
    Compassion: traitColors.Agreeableness,
    Politeness: traitColors.Agreeableness,
    Volatility: traitColors.Neuroticism,
    Withdrawal: traitColors.Neuroticism
};

// Render all charts (Big 5 Traits and Big 10 Clusters in both bar and pie formats)
async function renderAllCharts() {
    destroyCharts([barBig5ChartInstance, barBig10ChartInstance, pieBig5ChartInstance, pieBig10ChartInstance]);
    const big5Traits = ["Openness", "Conscientiousness", "Extraversion", "Agreeableness", "Neuroticism"];
    const big10Clusters = ["Intellect", "Receptivity", "Industriousness", "Orderliness", "Enthusiasm", "Assertiveness", "Compassion", "Politeness", "Volatility", "Withdrawal"];

    const barBig5Data = big5Traits.map(trait => scores[trait] || 0);
    const barBig10Data = big10Clusters.map(cluster => scores[cluster] || 0);

    // Create and store new chart instances
    barBig5ChartInstance = createBarChart('barBig5Chart', big5Traits, barBig5Data, 'Big 5 Traits Scores', big5Traits.map(trait => traitColors[trait]));
    barBig10ChartInstance = createBarChart('barBig10Chart', big10Clusters, barBig10Data, 'Big 10 Clusters Scores', big10Clusters.map(cluster => aspectColors[cluster]));
}

// Function to destroy existing chart instances
function destroyCharts(charts) {
    charts.forEach(chart => chart?.destroy());
}

// Function to create a bar chart without title and legend
function createBarChart(chartId, labels, data, title, colors) {
    const ctx = getCanvasContext(chartId);
    if (!ctx) return null;

    return new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 2,
            scales: {
                x: {
                    display: true, // Display x-axis
                    ticks: {
                        display: true,
                        autoSkip: false, // Prevent skipping labels
                        maxRotation: 90, // Ensures label rotation
                        minRotation: 90, // Set minimum rotation to 90 degrees
                        align: 'start', // Align labels to the start of each bar for better readability
                    }},
                y: {
                    display: true, // Hide y-axis labels
                    beginAtZero: true
                }
            },
            plugins: {
                title: {
                    display: false // Hide the chart title
                },
                legend: {
                    display: false // Hide the legend
                },
                tooltip: {
                    enabled: false // Disable tooltips for a cleaner look
                }
            }
        }
    });
}



// Helper function to get the 2D context of a canvas element by its ID
function getCanvasContext(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        console.warn(`Canvas with ID ${canvasId} not found.`);
        return null;
    }
    return canvas.getContext("2d");
}

async function renderGroupedFacetScores() {
    const container = document.getElementById("facet-scores");
    container.innerHTML = "";

    Object.keys(facetScores).forEach(trait => {
        const sortedFacets = Object.entries(facetScores[trait])
            .sort(([, scoreA], [, scoreB]) => scoreB - scoreA);  // Sort descending by score

        sortedFacets.forEach(([facet, score]) => {
            const facetRow = document.createElement("div");
            facetRow.className = "facet-grid-row";
            facetRow.innerHTML = `<div class="facet-name">${facet}</div>
                                  <div class="facet-score">${score.toFixed(2)}</div>`;
            container.appendChild(facetRow);
        });
    });
}

function printFinalReport() {
    const finalReport = document.getElementById("final-report");

    // Log content before printing to verify it exists
    console.log("Final Report Content for Printing:", finalReport.innerHTML);

    if (!finalReport || finalReport.innerHTML.trim() === "") {
        console.error("Final report content is missing or not rendered.");
        alert("The final report content is missing. Please ensure it is generated before printing.");
        return;
    }

    // Open a new window for printing
    const printWindow = window.open("", "_blank");

    // Write the full HTML structure into the new window
    printWindow.document.write(`
        <html>
            <head>
                <title>Final Report</title>
                <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
                <style>
                    body {
                        margin: 0;
                        padding: 0;
                        font-family: 'Roboto', sans-serif;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                    #final-report {
                        display: block;
                        width: 8.5in;
                        max-width: 100%;
                        padding: 0.5in;
                        font-size: 0.9em;
                        line-height: 1.2;
                        box-sizing: border-box;
                    }
                    .trait-column, .user-info, .facet-row, .chart-container {
                        padding: 4px;
                        margin: 0;
                    }
                    /* Ensure the progress bar fits */
                    #progress-bar {
                        width: 100%;
                        height: 10px;
                    }
                    /* Prevent page breaks in key sections */
                    .trait-column {
                        page-break-inside: avoid;
                    }
                </style>
            </head>
            <body>
                <div id="final-report">
                    ${finalReport.innerHTML}
                </div>
            </body>
        </html>
    `);

    printWindow.document.close();

    // Add a small delay before printing to ensure content is fully rendered
    setTimeout(() => {
        printWindow.focus();
        printWindow.print();
        printWindow.close();
    }, 500);
}
