const jq = require('jquery');
const DataTables = require('datatables.net-bs5');
const Buttons = require('datatables.net-buttons-bs5');
const ColVis = require('datatables.net-buttons/js/buttons.colVis.js');
const RowReorder = require('datatables.net-rowreorder-bs5');
const Select = require('datatables.net-select-bs5');
const FixedColumns = require('datatables.net-fixedcolumns-bs5');

import { GetCheckedSolvers, GetComparisonArray } from "../Solvers/UsedSolvers";
import { TableData, TableDataTrc } from "./TableData";

import { SelectAllButton, FilterSelectionButton, SaveLocalStorageButton, DownloadCSVButtonLayer } from '../Elements/Elements';

/**
 * Display the data in the div with the id "dataTable" when clicking on the view all results or selection button.
 */
export function TableDisplay(Instance: string, Solvers: string[], InstanceLabels: string | any[], DataLabels: any[], ProblemList: string | any[], ResultsData: any[]) {
    setTimeout(() => {
    let CheckedSolvers = GetCheckedSolvers();
    let ComparisonArray = GetComparisonArray(CheckedSolvers, Solvers);

    /**
     * Create the table with the provided data.
     */
    TableData(Instance, CheckedSolvers, InstanceLabels, DataLabels, ProblemList, ResultsData, ComparisonArray);

    /**
     * Apply the DataTables plugin DataTables plugin. Applied as a layer over the generated table.
     */
    jq(document).ready(function () {
        DataTablesConfiguration();('#dataTableGenerated_wrapper');
    });

    /**
     * Set the button statuses.
     */
    SelectAllButton.disabled = false;
    FilterSelectionButton.disabled = false;
    SaveLocalStorageButton.disabled = false;
    DownloadCSVButtonLayer.disabled = false;
    }, 500)
}

/**
 * Display the data in the div with the id "dataTable" when clicking on the view all results or selection button.
 * @param TrcData 
 */
export function TableDisplayTrc(TrcData: any[]) {
    setTimeout(() => {
    /**
     * Create the table with the trc data.
     */
    TableDataTrc(TrcData);
    
    /**
     * Apply the DataTables plugin. Applied as a layer over the generated table.
     */
    jq(document).ready(function () {
        DataTablesConfiguration();
    });

    SelectAllButton.disabled = false;
    FilterSelectionButton.disabled = false;
    SaveLocalStorageButton.disabled = false;
    DownloadCSVButtonLayer.disabled = false;
    }, 500)
}

/**
 * DataTables settings.
 */
function DataTablesConfiguration() {
    //jq.fn.dataTable.ext.errMode = 'none';
    // try {
    //     if (jq.fn.dataTable.isDataTable(table)) {
    //         table.destroy();
    //     }
    // }
    // catch {

    // }
    var table = jq("#dataTableGenerated").DataTable({
        destroy: true,
        stateSave: true,
        dom:
            "<'row'<'col-sm-12 col-md-6'l><'col-sm-12 col-md-6'f>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
        lengthChange: true,
        lengthMenu: [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
        select: {
            style: 'os',
            blurable: true,
            className: 'bg-primary row-selected-problems'
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
        scrollY: "",
        scrollX: true,
        scrollCollapse: true,
        paging: true,
        // fixedColumns: {
        //     left: 1
        // },
        fixedColumns: true,
        buttons: ['copy', 'excel', 'pdf', 'colvis']
    });

    jq('.dataTables_length select').addClass('custom-select custom-select-sm');
    table.buttons().container().appendTo('#dataTableGenerated_wrapper');
}