sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast"
], function (Controller, ODataModel, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("com.incture.project1.controller.View1", {

        onInit: function () {
            
        },

        onSearch: function (oEvent) {
            var sQuery = oEvent.getParameter("newValue"); // Get the search value entered by the user
            
            // Create a filter based on the search value
            var oFilter = null;
            if (sQuery) {
                // Assuming you want to filter by CategoryID (numeric) or CategoryName (text)
                oFilter = new Filter("CategoryID", FilterOperator.EQ, parseInt(sQuery)); // Filtering by CategoryID (number)
                // If you want to filter by CategoryName, use the following line instead:
                // oFilter = new Filter("Category/CategoryName", FilterOperator.Contains, sQuery); // Filtering by CategoryName (text)
            }

            // Apply the filter to the OData model's binding for the table
            var oTable = this.byId("productTable");
            var oBinding = oTable.getBinding("rows");
            oBinding.filter(oFilter); // Apply the filter to table rows
        },
        onSort: function (oEvent) {
            var oTable = this.byId("productTable");
            var oBinding = oTable.getBinding("rows");

            var sSortKey = oEvent.getParameter("sortItem").getKey(); // Get the key for sorting
            var oSorter = new sap.ui.model.Sorter(sSortKey, false); // Sorting in ascending order (false)

            // Apply the sorter to table rows
            oBinding.sort(oSorter);

            // Reload the data (reset pagination)
            this._iPageIndex = 0;
            this._loadPage();
        },

        // Pagination control (Next Page)
        onNextPage: function () {
            this._iPageIndex++;
            this._loadPage();
        },

        // Pagination control (Previous Page)
        onPrevPage: function () {
            if (this._iPageIndex > 0) {
                this._iPageIndex--;
                this._loadPage();
            } else {
                MessageToast.show("You are already on the first page.");
            }
        },

        // Load data for the current page
        _loadPage: function () {
            var oTable = this.byId("productTable");
            var oBinding = oTable.getBinding("rows");

            var oTableBindingInfo = {
                $top: this.PAGE_SIZE, // Set the page size for $top
                $skip: this._iPageIndex * this.PAGE_SIZE // Calculate the skip value based on the current page index
            };

            // Apply pagination and sorting (if any)
            oBinding.filter([], true); // Reset any filters before applying new ones

            // Get the current sorters
            var aSorters = oBinding.getSorter();
            oBinding.sort(aSorters); // Apply any existing sorters

            // Apply the pagination binding info
            oBinding.refresh(true); // Refresh the binding
        }
    });
});
