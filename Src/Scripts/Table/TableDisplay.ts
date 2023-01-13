const jq = require('jquery');
const DataTables = require('datatables.net-bs5');
const Buttons = require('datatables.net-buttons-bs5');
const ColVis = require('datatables.net-buttons/js/buttons.colVis.js');
const RowReorder = require('datatables.net-rowreorder-bs5');
const Select = require('datatables.net-select-bs5');

import { GetCheckedSolvers, GetComparisonArray } from "../Solvers/UsedSolvers";
import { TableData } from "./TableData";

import { SelectAllButton, FilterSelectionButton, SaveLocalStorageButton, DownloadCSVButtonLayer } from '../Elements/Elements';

export function TableDisplay(Instance: string, Solvers: string[], InstanceLabels: string | any[], DataLabels: any[], ProblemList: string | any[], ResultsData: any[]) {
    let CheckedSolvers = GetCheckedSolvers();
    let ComparisonArray = GetComparisonArray(CheckedSolvers, Solvers);

    /**
     * @param TableData Display the data in the div with the id "dataTable" when clicking on the view selection button.
     */
    TableData(Instance, CheckedSolvers, InstanceLabels, DataLabels, ProblemList, ResultsData, ComparisonArray);

    /**
     * DataTables plugin settings.
     */
    jq(document).ready(function () {
        var table = jq("#dataTableGenerated").DataTable({
            dom:
                "<'row'<'col-sm-12 col-md-6'l><'col-sm-12 col-md-6'f>>" +
                "<'row'<'col-sm-12'tr>>" +
                "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
            lengthChange: true,
            lengthMenu: [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
            select: {
                style: 'os',
                blurable: true,
                className: 'bg-primary text-light row-selected-problems'
            },
            responsive: {
                details: {
                    type: 'column',
                    target: 'tr'
                },
                breakpoints: [
                    { name: 'desktop', width: Infinity },
                    { name: 'tablet', width: 1200 },
                    { name: 'fablet', width: 768 },
                    { name: 'phone', width: 480 }
                ]
            },
            buttons: ['copy', 'excel', 'pdf', 'colvis']
        });

        jq('.dataTables_length select').addClass('custom-select custom-select-sm');
        table.buttons().container().appendTo('#dataTableGenerated_wrapper');
    });


    SelectAllButton.disabled = false;
    FilterSelectionButton.disabled = false;
    SaveLocalStorageButton.disabled = false;
    DownloadCSVButtonLayer.disabled = false;
}