/**
 * Bootstrap.
 */
import "bootstrap/dist/css/bootstrap.min.css";
/**
 * Only the components that the data attributes use. They share one registry with the Modal that the code imports.
 */
import "bootstrap/js/dist/collapse";
import "bootstrap/js/dist/dropdown";
import "bootstrap/js/dist/modal";
import "bootstrap/js/dist/toast";
import "bootstrap-icons/font/bootstrap-icons.css";

/**
 * DataTables and extensions.
 */
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";
import "datatables.net-buttons-bs5/css/buttons.bootstrap5.min.css";
import "datatables.net-fixedcolumns-bs5/css/fixedColumns.bootstrap5.min.css";
import "datatables.net-searchpanes-bs5/css/searchPanes.bootstrap5.min.css";
import "datatables.net-select-bs5/css/select.bootstrap5.min.css";
import "datatables.net-searchbuilder-bs5/css/searchBuilder.bootstrap5.css";
import "datatables.net-datetime/css";

/**
 * CSS.
 */
import "../CSS/style.css";

import { Bootstrap } from "./App/Bootstrap";

/**
 * Run the program.
 */
Bootstrap();
