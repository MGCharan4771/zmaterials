sap.ui.define([
],
    function () {
        "use strict";

        return {
            netWeightStateChange: function (netweight) {
                if (netweight <= 10) {
                    return "Error";
                } else if (netweight < 50) {
                    return "Information"
                } else {
                    return "Success"
                }
            },
            FormatNetWeight: function (netweight) {
                var newValue = Number(netweight).toFixed(2);
                return newValue;
            },
            formatIndustryState: function (Industry) {
                if (Industry == 'M') {
                    return "Information"
                } else if (Industry == 'O') {
                    return "Warning"
                } else {
                    return "Success";
                }
            },
            formatIndustryIcon: function (Industry) {
                if (Industry == 'M') {
                    return "sap-icon://information"
                } else if (Industry == 'O') {
                    return "sap-icon://alert"
                } else {
                    return "sap-icon://sys-enter-2";
                }
            },
            HierarStateChange: function (value) {
                if (value == "KITCHEN & COOKING") {
                    return "Success"
                } else {
                    return "Error"
                }
            },
            formatDate: function (date) {
                if (date !== null) {
                    var date1 = date.toDateString()
                    return date1;
                } else {
                    return "Date Not Available"
                }
            },
            formatDesc: function (desc) {
                return desc.toUpperCase();
            },
            formatHierarchy: function (hierarchy) {
                var Hier = hierarchy.toLowerCase();
                return Hier;
            }
        };
    }
);