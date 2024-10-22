sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox"
],
    function (Controller, JSONModel, MessageBox) {
        "use strict";

        return Controller.extend("zmaterial.controller.Detail", {
            onInit: function () {
                this.getOwnerComponent().getRouter().getRoute("RouteDetail").attachPatternMatched(this.onRouteMatched, this);

                var DetailModel = new JSONModel();
                this.getView().setModel(DetailModel, "DetailModel");
            },
            onRouteMatched: function (oEvent) {
                var MaterialNumber = oEvent.getParameter("arguments").materialnumber;
                var DetailModel = this.getView().getModel("DetailModel");

                var oModel = this.getView().getModel();
                oModel.read("/Material_DetSet('" + MaterialNumber + "')", {
                    urlParameters: {
                        "$expand": "mattransportdetnav"
                    },
                    success: function (Response) {
                        DetailModel.setProperty("/", Response);
                        DetailModel.updateBindings(true);
                    },
                    error: function (error) {
                        var errormessage = JSON.parse(error.responseText).error.message.value;
                        MessageBox.error(errormessage);
                    }
                })
            },
            onPressNavBack: function () {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteHomeView")
            }
        });
    });
