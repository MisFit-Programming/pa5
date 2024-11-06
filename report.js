// Define chart instances at the top to ensure global access across functions
let barBig5ChartInstance = null;
let barBig10ChartInstance = null;
let pieBig5ChartInstance = null;
let pieBig10ChartInstance = null;

// Display the final report and render all charts
function showFinalReport() {
    document.getElementById("test-section").style.display = "none";
    document.getElementById("score-header").style.display = "none";
    document.getElementById("final-report").style.display = "block";
    renderAllCharts();
    renderGroupedFacetScores()
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
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                title: {
                    display: false  // Hide the chart title
                },
                legend: {
                    display: false  // Hide the legend
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
    container.innerHTML = ""; // Clear previous content

    // Loop through each trait and its facets
    Object.keys(facetScores).forEach(trait => {
        // Create a header for each trait
        const traitHeader = document.createElement("div");
        traitHeader.className = "facet-grid-header";
        traitHeader.innerHTML = `<strong>${trait}</strong>`;
        container.appendChild(traitHeader);

        // Render each facet under the current trait
        Object.keys(facetScores[trait]).forEach(facet => {
            const facetRow = document.createElement("div");
            facetRow.className = "facet-grid-row";

            // Create and style the facet name and score cells
            const facetName = document.createElement("div");
            facetName.className = "facet-grid-item";
            facetName.textContent = facet;
            facetName.style.backgroundColor = traitColors[trait]; // Use existing color mapping

            const facetScore = document.createElement("div");
            facetScore.className = "facet-grid-item";
            facetScore.textContent = facetScores[trait][facet].toFixed(2);

            // Append cells to row, then add row to container
            facetRow.appendChild(facetName);
            facetRow.appendChild(facetScore);
            container.appendChild(facetRow);
        });
    });
}
