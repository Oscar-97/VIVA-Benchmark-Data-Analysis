export function CreateChart(Solvers, DataLabels, ResultsData) {
    console.log("Solvers: ", Solvers);
    console.log("DataLabels: ", DataLabels);
    console.log("ResultsData: ", ResultsData);
    
    const ctx = document.getElementById('dataChartExample');
    const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            // Labels for the data.
            labels: DataLabels,
            datasets: [{
                // Data label.
                label: 'Insert Solver Name Here',
                // Data related to the labels.
                data: 'Insert Result  Category',
                // For each row, set a color.
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                ],
                borderWidth: 2
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}