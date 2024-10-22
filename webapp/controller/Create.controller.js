sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel"
],
    function (Controller, MessageBox, JSONModel) {
        "use strict";

        return Controller.extend("zmaterial.controller.Create", {
            onInit: function () {
                var CreateModel = new JSONModel();
                this.getView().setModel(CreateModel, "CreateModel");

                var oLineItem = {
                    "aLineItem": []
                }
                var LineItemModel = new JSONModel(oLineItem);
                this.getView().setModel(LineItemModel, "LineItemModel"); // LineItemModel Model Name
            },
            onPressCreateNavBack: function () {
                this.onPressClear();
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteHomeView");
            },
            onChangeCompetator: function (oEvent) {
                var value = oEvent.getSource().getValue();
                if (value.length !== 4) {
                    oEvent.getSource().setValueState("Error");
                    oEvent.getSource().setValueStateText("This Value Should be 4 numbers");
                    this.competator = false;
                } else {
                    oEvent.getSource().setValueState("Information");
                    oEvent.getSource().setValueStateText("This Field Validated");
                    this.competator = true;
                }
            },
            onChangeVolume: function (oEvent) {
                var value = oEvent.getSource().getValue();
                oEvent.getSource().setValue(Number(value).toFixed(3));
            },
            onPressClear: function () {
                var CreateModel = this.getView().getModel("CreateModel");
                CreateModel.setProperty("/Mat_Des", "");
                CreateModel.setProperty("/Industry", "");
                CreateModel.setProperty("/Mat_Group", "");
                CreateModel.setProperty("/Mat_Type", "");
                CreateModel.setProperty("/Base_Unit", "");
                CreateModel.setProperty("/Volum", "");
                CreateModel.setProperty("/Prod_Hiearchy", "");
                CreateModel.setProperty("/Cust_No", "");
                this.getView().byId("idCreateComp").setValueState("None");

                var LineItemModel = this.getView().getModel("LineItemModel");
                LineItemModel.getData().aLineItem = [];
                LineItemModel.updateBindings(true)

            },
            onPressAdd: function () {
                var LineItemModel = this.getView().getModel("LineItemModel");
                var LineItemModelData = LineItemModel.getData().aLineItem;
                var newObject = {
                    "Mfg_No": "",
                    "Net_Content": "",
                    "Packag_Mat": "",
                    "Strg_Condition": "",
                    "Trans_Group": "",
                    "Supply_Source": ""
                };

                LineItemModelData.push(newObject);
                LineItemModel.updateBindings(true);
            },
            onPressDelete: function (oEvent) {
                var LineItemModel = this.getView().getModel("LineItemModel"); //model
                var LineItemModelData = LineItemModel.getData().aLineItem; //Array
                var selectedPath = oEvent.getSource().getBindingContext("LineItemModel").getPath().split("/")[2]; //Selected Path
                var index = Number(selectedPath); //Index

                LineItemModelData.splice(index, 1);
                LineItemModel.updateBindings(true);
            },
            onPressSave: function () {
                var oView = this.getView();
                var oModel = oView.getModel();
                var LineItemModel = this.getView().getModel("LineItemModel");
                var LineItemModelData = LineItemModel.getData().aLineItem;

                var payload = {
                    "Created_On": new Date(),
                    "Mat_Des": oView.byId("idCreateMatDesc").getValue(),
                    "Industry": oView.byId("idCreateIndustry").getValue(),
                    "Mat_Group": oView.byId("idCreateMatGrp").getValue(),
                    "Mat_Type": oView.byId("idCreateMatType").getValue(),
                    "Base_Unit": oView.byId("idCreateBaseUnit").getValue(),
                    "Volum": oView.byId("idCreateVolume").getValue(),
                    "Prod_Hiearchy": oView.byId("idCreatePrdHier").getValue(),
                    "Cust_No": oView.byId("idCreateComp").getValue(),
                    "Unit_of_Weight": oView.byId("idCreateUOW").getValue(),
                    "Volume_unit": oView.byId("idCreateVolumeUnit").getValue(),
                    "mattransportdetnav": {
                        "results": LineItemModelData
                    }
                }

                if (this.competator) {
                    sap.ui.core.BusyIndicator.show();
                    oModel.create("/Material_DetSet", payload, {
                        success: function (Response) {
                            var successMessage = "Material " + Response.Mat_No + " Created Successfully"
                            MessageBox.success(successMessage);

                            sap.ui.core.BusyIndicator.hide();
                            this.onPressCreateNavBack();
                        }.bind(this),
                        error: function (error) {
                            console.log(error)
                            sap.ui.core.BusyIndicator.hide();
                        }
                    })
                } else {
                    MessageBox.error("Please Provide Proper Data to Create")
                }
            }
        });
    });
