export function CreateChart(dataLabel, dataLabels, data1, data2, data3) {

    //console.log("Label set to: ", dataLabel);
    //console.log("Data 1: ", data1);
    //console.log("Data 2: ", data2);
    //console.log("Data 3: ", data3);

    function RemoveNullEmptyResults(dataSet) {
        for (var i = dataSet.length - 1; i >= 0; i--) {
            if (
                dataSet[i] === "inf" |
                dataSet[i] === "-inf" |
                dataSet[i] === "--"
            ) {
                dataSet.splice(i, 1);
            }
        }
    }

    RemoveNullEmptyResults(data1);
    RemoveNullEmptyResults(data2);
    RemoveNullEmptyResults(data3);

    const ctx = document.getElementById('dataChartExample');
    const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            // Labels for the data.
            labels: dataLabels,
            datasets: [{
                // Data label.
                label: dataLabel,
                // Data related to the labels.
                data: [data1.length, data2.length, data3.length],
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