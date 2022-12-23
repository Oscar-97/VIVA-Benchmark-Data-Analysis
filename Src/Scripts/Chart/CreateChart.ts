export function CreateChart(Solvers: string | any[], ResultsData: string | any[], ComparisonArray: any[]) {
    // Create x and y data.
    function CreateXAndYData(LoopCount: number) {
        let TempData = [];
        let TempData2 = [];
        let IndexOfPrimGap = LoopCount * 8 + 10;
        for (var i = 0; i < ResultsData.length; i++) {
            TempData.push(ResultsData[i][IndexOfPrimGap])
        }
        for (var i = 0; i < ResultsData.length; i++) {
            TempData2.push({ x: TempData[i], y: i })
        }
        return TempData2;
    }

    // Add a random color for the dataset.
    function PickColor() {
        const Hex = Math.floor(Math.random() * 16777215).toString(16);
        let Color = '#' + Hex;
        return Color;
    }

    // Fetch data for the selected solvers.
    const SelectedSolvers = [];
    for (let i = 0; i < Solvers.length; i++) {
        console.log("Status: ", ComparisonArray[i]);
        // Only run if the solvers are used.
        if (ComparisonArray[i] === "Used") {
            console.log("Creating dataset for: ", Solvers[i]);
            // Push the label and the data to the dataset.
            SelectedSolvers.push({ label: Solvers[i], data: CreateXAndYData(i), backgroundColor: PickColor() });
        }
    }
    console.log("Dataset content: ", SelectedSolvers);

    // Dataset to be used in the chart.
    const CreatedDataset = {
        datasets: SelectedSolvers
    }

    // Create the data chart.
    const DataChartElement = document.getElementById('dataChart');
    // @ts-ignore
    const myChart = new Chart(DataChartElement, {
        type: 'scatter',
        data: CreatedDataset,
        //data: { datasets: SelectedSolvers },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Absolute performance profile (PrimalGap)'
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'PrimalGap'
                    }
                },
                y: {
                    //beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of instances.'
                    }
                }
            }
        }
    });

    const ViewPlotsButton = document.getElementById('viewPlotsButton');
    // Destroy the canvas on button click to be able to create a new canvas.
    ViewPlotsButton.addEventListener("click", function () {
        myChart.destroy();
    })
}