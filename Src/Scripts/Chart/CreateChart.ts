export function CreateChart(Solvers: string | any[], ResultsData: string | any[], ComparisonArray: any[]) {
    /**
     * Create the X and Y data for Chart.js.
     * @param LoopCount 
     * @returns X and Y data.
     */
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
    /**
     * @param PickColor Color picker for the data.
     * @returns Random different colors for each solver.
     */
    function PickColor() {
        const Hex = Math.floor(Math.random() * 16777215).toString(16);
        let Color = '#' + Hex;
        return Color;
    }

    /**
     * Fetch data for the selected solvers.
     */
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

    /**
     * @param CreatedDataset Dataset to be used in the chart.
     */
    const CreatedDataset = {
        datasets: SelectedSolvers
    }

    /**
     * Create the data chart.
     * @param DataChartElement The data chart which will be displayed in the element with the id dataChart.
     */
    const DataChartElement = document.getElementById('dataChart');
    // @ts-ignore
    const myChart = new Chart(DataChartElement, {
        type: 'scatter',
        data: CreatedDataset,
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
                    title: {
                        display: true,
                        text: 'Number of instances.'
                    }
                }
            }
        }
    });

    /**
     * @param ViewPlotsButton Displays the plot in a canvas. Destroy the canvas on button click to be able to create a new canvas.
     */
    const ViewPlotsButton = document.getElementById('viewPlotsButton') as HTMLButtonElement;
    ViewPlotsButton.addEventListener("click", function () {
        myChart.destroy();
    })
}