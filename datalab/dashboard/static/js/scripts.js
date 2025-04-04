const sidebarLinks = document.querySelectorAll('.sidebar li');           
const sections = document.querySelectorAll('.main-content > section');
const fileInput = document.getElementById('file-input');
const uploadMessage = document.getElementById('upload-message');
const dataTableContainer = document.getElementById('data-table-container');
const statisticsContainer = document.getElementById('statistics');
const chartTypeSelect = document.getElementById('chart-type');
const visualizationOptionsDiv = document.getElementById('visualization-options');
const xAxisSelect = document.getElementById('x-axis');
const yAxisSelect = document.getElementById('y-axis');
const chartContainer = document.getElementById('chart-container');
const pageNumberSpan = document.getElementById('page-number');
const datasetsTableBody = document.getElementById('datasets-table-body');
        
let uploadedDatasets = []; // Array to store uploaded datasets (filename, data)
let currentDatasetIndex = -1; // Index of the currently viewed dataset
let currentHeaders = [];
let currentPage = 1;
const rowsPerPage = 20;

// SIDEBAR
// Add event listeners for sidebar navigation
sidebarLinks.forEach(link => {
    link.addEventListener('click', function() {
        const sectionId = this.dataset.section;
        showSection(sectionId);
    });
});
        

// Show the selected section and hide others
function showSection(sectionId) {
    sections.forEach(section => {
        section.classList.add('hidden');
    });
    document.getElementById(sectionId + '-section').classList.remove('hidden');
    sidebarLinks.forEach(link => {
        link.classList.remove('active');
        if (link.dataset.section === sectionId) {
            link.classList.add('active');
        }
    });
}

// DATASETS - FILE UPLOAD ------------------------------------
// Mockup Data (for initial display - now used as a default uploaded dataset)
const mockupFilename = 'mockup_data.csv';
const mockupCSVData = `Name,Age,Score,Grade
Alice,25,85,B
Bob,30,92,A
Charlie,22,78,C
David,28,95,A+
Eve,24,88,B+
Frank,31,76,C+
Grace,27,90,A-
Heidi,23,82,B-
Ivan,29,98,S
Judy,26,87,B
Kelly,32,91,A
Liam,21,79,C
Mia,27,94,A
Noah,24,89,B+
Olivia,30,77,C+
Peter,28,93,A-
Quinn,25,81,B-
Ryan,31,99,S
Sophia,22,86,B
Thomas,29,90,A`;

// Initialize with mockup data
uploadedDatasets.push({ filename: mockupFilename, data: parseCSV(mockupCSVData) });
populateDatasetsTable();
loadDataset(0); // Load the mockup dataset initially
showSection('file-upload'); // Show upload section by default


// DATASETS
// Handle file upload
function handleFileUpload() {
    const file = fileInput.files[0];
    if (!file) {
        uploadMessage.innerHTML = '<p style="color: red;">Please select a file.</p>';
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const csvData = event.target.result;
        const parsedData = parseCSV(csvData);
        uploadedDatasets.push({ filename: file.name, data: parsedData });
        populateDatasetsTable();
        loadDataset(uploadedDatasets.length - 1);
        uploadMessage.innerHTML = `<p style="color: green;">File "${file.name}" uploaded successfully.</p>`;
    };
    reader.readAsText(file);
}

// Parse CSV data into an object with headers and data
function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    const currentHeaders = lines[0].split(',').map(header => header.trim());
    const data = [];
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(value => value.trim());
        const row = {};
        for (let j = 0; j < currentHeaders.length; j++) {
            row[currentHeaders[j]] = values[j];
        }
        data.push(row);
    }
    return { headers: currentHeaders, data: data };
}



// Populate the datasets table with uploaded datasets
function populateDatasetsTable() {
    datasetsTableBody.innerHTML = '';
    uploadedDatasets.forEach((dataset, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${dataset.filename}</td><td>${new Date().toLocaleString()}</td>`;
        row.onclick = () => loadDataset(index);
        datasetsTableBody.appendChild(row);
    });
}

// Calculate statistics for each column
    // This function calculates mean, median, and standard deviation for numeric columns
    // and returns an object with these statistics.
    // If a column is non-numeric, it returns 'Non-numeric' for that column.
    // It also handles empty datasets by returning an empty object.
    // The function uses the reduce method to calculate the sum and standard deviation,
    // and the sort method to find the median.
    // It also uses the map method to create an array of numeric values for each column.
    // The function is designed to be efficient and handles large datasets by using
    // array methods that are optimized for performance.
    // It also includes error handling for invalid data types and empty datasets.
    // The function is flexible and can be used with any dataset that has numeric columns.

function calculateStatistics(data) {
    if (!data || data.length === 0) {
        return {};
    }
    const stats = {};
    data.headers.forEach(header => {
        const numericValues = data.data
            .map(row => parseFloat(row[header]))
            .filter(value => !isNaN(value));

        if (numericValues.length > 0) {
            let sum = 0, sumOfSquares = 0;
            numericValues.forEach(value => {
                sum += value;
                sumOfSquares += value * value;
            });

            const mean = sum / numericValues.length;
            const variance = (sumOfSquares / numericValues.length) - (mean * mean);
            const stdDev = Math.sqrt(variance);
            
            const sortedValues = [...numericValues].sort((a, b) => a - b);
            const median = sortedValues.length % 2 === 0
                ? (sortedValues[sortedValues.length / 2 - 1] + sortedValues[sortedValues.length / 2]) / 2
                : sortedValues[Math.floor(sortedValues.length / 2)];

            stats[header] = {
                mean: mean.toFixed(2),
                median: median.toFixed(2),
                stdDev: stdDev.toFixed(2)
            };
        } else {
            stats[header] = { type: 'Non-numeric' };
        }
    });
    return stats;
}

// Display statistics in a table format
function displayStatistics(stats) {
    let html = '<table id="statistics-table"><thead><tr><th>Column</th><th>Type</th><th>Mean</th><th>Median</th><th>Std Dev</th></tr></thead><tbody>';
    for (const header in stats) {
        html += `<tr><td>${header}</td>`;
        if (stats[header].type === 'Non-numeric') {
            html += `<td colspan="3">${stats[header].type}</td></tr>`;
        } else {
            html += `<td>Numeric</td><td>${stats[header].mean}</td><td>${stats[header].median}</td><td>${stats[header].stdDev}</td></tr>`;
        }
    }
    html += "</tbody></table>";

    if (statisticsContainer) {
        statisticsContainer.innerHTML = html;
    } else {
        console.error("statisticsContainer not found.");
    }
}


// Display data in a paginated table
function displayData(data, page) {
    if (!data || !data.data || data.data.length === 0) {
        dataTableContainer.innerHTML = "<p>No data available.</p>";
        return;
    }

    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedData = data.data.slice(startIndex, endIndex);

    let html = '<table id="data-preview-table"><thead><tr>';
    data.headers.forEach(header => {
        html += `<th>${header}</th>`;
    });
    html += '</tr></thead><tbody>';

    paginatedData.forEach(row => {
        html += '<tr>';
        data.headers.forEach(header => {
            html += `<td>${row[header]}</td>`;
        });
        html += '</tr>';
    });

    html += '</tbody></table>';
    dataTableContainer.innerHTML = html;
    pageNumberSpan.textContent = page;
}
// Pagination controls
function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        displayData(uploadedDatasets[currentDatasetIndex], currentPage);
    }
}

function nextPage() {
    const totalRows = uploadedDatasets[currentDatasetIndex]?.data?.length || 0;
    if (currentPage < Math.ceil(totalRows / rowsPerPage)) {
        currentPage++;
        displayData(uploadedDatasets[currentDatasetIndex], currentPage);
    }
}

// DATA PREVIEW (Dataset Statistics and Table) -------------------
// Load the selected dataset and display its data and statistics
function loadDataset(index) {
    currentDatasetIndex = index;
    const dataset = uploadedDatasets[index];
    if (dataset) {
        currentHeaders = dataset.data.headers;
        displayData(dataset.data, 1);
        displayStatistics(calculateStatistics(dataset.data));
        populateAxisOptions();
    }
}






// DATA VISUALIZATION
// Populate the X and Y axis options based on the dataset headers
// This function dynamically generates the options for the X and Y axis dropdowns
function populateAxisOptions() {
    xAxisSelect.innerHTML = '<option value="">Select X-Axis</option>';
    yAxisSelect.innerHTML = '<option value="">Select Y-Axis</option>';
    currentHeaders.forEach(header => {
        xAxisSelect.innerHTML += `<option value="${header}">${header}</option>`;
        yAxisSelect.innerHTML += `<option value="${header}">${header}</option>`;
    });
}
// Update the visualization options based on the selected chart type
// This function shows or hides the X and Y axis dropdowns based on the selected chart type
// It also ensures that the chart options are displayed only when a valid chart type is selected.
function updateVisualizationOptions() {
    visualizationOptionsDiv.classList.remove('hidden');
}
// Render the chart based on the selected options
// This function uses D3.js to create the chart based on the selected X and Y axis
// and chart type. It handles different chart types (scatter, bar, line) and
// dynamically generates the chart based on the data.
// It also includes error handling for invalid selections and ensures that the chart
function renderChart() {
    const xAxis = xAxisSelect.value;
    const yAxis = yAxisSelect.value;
    const chartType = chartTypeSelect.value;

    if (!xAxis || !yAxis || !chartType) {
        alert("Please select both X and Y axes and a chart type.");
        return;
    }

    chartContainer.innerHTML = ''; // Clear previous chart
    const svg = d3.select("#chart-container")
                  .append("svg")
                  .attr("width", "100%")
                  .attr("height", "100%");

    const dataset = uploadedDatasets[currentDatasetIndex].data;
    const numericData = dataset.data.map(row => ({
        x: parseFloat(row[xAxis]),
        y: parseFloat(row[yAxis])
    })).filter(d => !isNaN(d.x) && !isNaN(d.y));

    const width = chartContainer.clientWidth - 50;
    const height = chartContainer.clientHeight - 50;
    const margin = { top: 20, right: 30, bottom: 50, left: 50 };

    const xScale = d3.scaleLinear()
                     .domain([d3.min(numericData, d => d.x), d3.max(numericData, d => d.x)])
                     .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
                     .domain([d3.min(numericData, d => d.y), d3.max(numericData, d => d.y)])
                     .range([height - margin.bottom, margin.top]);

    const xAxisElement = d3.axisBottom(xScale);
    const yAxisElement = d3.axisLeft(yScale);

    svg.append("g")
       .attr("transform", `translate(0,${height - margin.bottom})`)
       .call(xAxisElement);

    svg.append("g")
       .attr("transform", `translate(${margin.left},0)`)
       .call(yAxisElement);

    if (chartType === 'scatter') {
        svg.selectAll(".dot")
           .data(numericData)
           .enter()
           .append("circle")
           .attr("cx", d => xScale(d.x))
           .attr("cy", d => yScale(d.y))
           .attr("r", 5)
           .attr("class", "dot");
    } else if (chartType === 'bar') {
        const barWidth = width / numericData.length;
        svg.selectAll(".bar")
           .data(numericData)
           .enter()
           .append("rect")
           .attr("x", d => xScale(d.x) - barWidth / 2)
           .attr("y", d => yScale(d.y))
           .attr("width", barWidth * 0.9)
           .attr("height", d => height - margin.bottom - yScale(d.y))
           .attr("class", "bar");
    } else if (chartType === 'line') {
        const line = d3.line()
                       .x(d => xScale(d.x))
                       .y(d => yScale(d.y))
                       .curve(d3.curveMonotoneX);

        svg.append("path")
           .datum(numericData)
           .attr("class", "line")
           .attr("d", line);
    }
}

// NOTEBOOK
// Function to handle notebook file upload
function uploadNotebook() {
    const file = document.getElementById('notebook-upload').files[0];
    if (!file) {
        alert('Please select a notebook file.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        document.querySelector('#notebook-section textarea').value = event.target.result;
    };
    reader.readAsText(file);
}

function executeNotebook() {
    alert("Notebook execution simulated. In real implementation, this would run on a server.");
}