sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/core/util/ExportTypeCSV",
    "zmaterial/model/formatter"
],
    function (Controller, Filter, FilterOperator, JSONModel, MessageBox, MessageToast, ExportTypeCSV, formatter) {
        "use strict";

        return Controller.extend("zmaterial.controller.HomeView", {
            f: formatter,
            onInit: function () {
                var TableModel = new JSONModel();
                this.getView().setModel(TableModel, "TableModel");

                var oCommonData = {
                    "UpdateEnabled": false,
                    "DeleteEnabled": false,
                    "Mat_Number": "",
                    "Mat_Desc": "",
                    "Mat_Group": "",
                    "Mat_Type": "",
                    "Mat_Industry": "",
                    "Mat_Hier": "",
                    "Mat_NetWeight": ""
                }
                var CommonModel = new JSONModel(oCommonData);
                this.getView().setModel(CommonModel, "CommonModel")
            },
            onPressGo: function () {
                var oModel = this.getView().getModel();
                var TableModel = this.getView().getModel("TableModel");

                var materialnumber = this.getView().byId("idMaterialNumber").getValue();
                var materialdescription = this.getView().byId("idMaterialDescription").getValue();
                var MaterialGroup = this.getView().byId("idMaterialGroup").getValue();
                var MaterialType = this.getView().byId("idMaterialType").getValue();

                var aFilters = [];
                if (materialnumber) {
                    aFilters.push(new Filter("Mat_No", FilterOperator.Contains, materialnumber));
                }
                if (materialdescription) {
                    aFilters.push(new Filter("Mat_Des", FilterOperator.Contains, materialdescription));
                }
                if (MaterialGroup) {
                    aFilters.push(new Filter("Mat_Group", FilterOperator.Contains, MaterialGroup));
                }
                if (MaterialType) {
                    aFilters.push(new Filter("Mat_Type", FilterOperator.Contains, MaterialType));
                }
                // if (aFilters && aFilters.length > 0) {
                sap.ui.core.BusyIndicator.show();
                oModel.read("/Material_DetSet", {
                    filters: aFilters,
                    success: function (Response) {
                        console.log(Response);
                        TableModel.setProperty("/", Response);
                        TableModel.updateBindings(true);
                        sap.ui.core.BusyIndicator.hide();
                    }.bind(this),
                    error: function (Error) {
                        console.log(Error);
                        sap.ui.core.BusyIndicator.hide();
                    }.bind(this)
                });
                // } else {
                //     MessageToast.show("Please Enter some inputs")
                //     MessageBox.error("Please Enter some inputs");
                // }
                // var table = this.getView().byId("idTable");
                // table.getBinding('items').filter(aFilters);
            },
            onMaterialNumberVH: function () {
                if (!this.MaterialNumberDialog) {
                    this.MaterialNumberDialog = sap.ui.xmlfragment("zmaterial.fragments.MaterialNumberVH", this);
                    this.getView().addDependent(this.MaterialNumberDialog);
                }
                this.MaterialNumberDialog.open();
            },
            onPressCloseMaterialNumber: function () {
                this.MaterialNumberDialog.close();
            },
            onMaterialDescVH: function () {
                if (!this.MaterialDescDialog) {
                    this.MaterialDescDialog = sap.ui.xmlfragment("zmaterial.fragments.MaterialDescVH", this);
                    this.getView().addDependent(this.MaterialDescDialog);
                }
                this.MaterialDescDialog.open();
            },
            onSelectChangeTable: function (oEvent) {
                var selected = oEvent.getSource().getSelectedItems();
                var CommonModel = this.getView().getModel("CommonModel");
                if (selected && selected.length == 1) {
                    // this.getView().byId("idUpdate").setEnabled(true);
                    CommonModel.setProperty("/UpdateEnabled", true);
                    CommonModel.setProperty("/DeleteEnabled", true);
                    CommonModel.updateBindings(true);
                } else {
                    MessageBox.error("Please Select Only One Record")
                }
            },
            onPressUpdate: function () {
                var CommonModel = this.getView().getModel("CommonModel");
                if (!this.UpdateDialog) {
                    this.UpdateDialog = sap.ui.xmlfragment("zmaterial.fragments.Update", this);
                    this.getView().addDependent(this.UpdateDialog);
                }
                var oSelectedObj = this.getView().byId("idTable").getSelectedContexts()[0].getObject();
                CommonModel.setProperty("/Mat_Number", oSelectedObj.Mat_No);
                CommonModel.setProperty("/Mat_Desc", oSelectedObj.Mat_Des);
                CommonModel.setProperty("/Mat_Group", oSelectedObj.Mat_Group);
                CommonModel.setProperty("/Mat_Type", oSelectedObj.Mat_Type);
                CommonModel.setProperty("/Mat_Industry", oSelectedObj.Industry);
                CommonModel.setProperty("/Mat_Hier", oSelectedObj.Prod_Hiearchy);
                CommonModel.setProperty("/Mat_NetWeight", oSelectedObj.Net_weight);
                CommonModel.updateBindings(true);
                // sap.ui.getCore().byId("idUpdateMatNo").setValue(oSelectedObj.Mat_No);
                // sap.ui.getCore().byId("idUpdateMatDesc").setValue(oSelectedObj.Mat_Des);
                // sap.ui.getCore().byId("idUpdateMatGroup").setValue(oSelectedObj.Mat_Group);
                // sap.ui.getCore().byId("idUpdateMatType").setValue(oSelectedObj.Mat_Type);
                // sap.ui.getCore().byId("idUpdateMatIndustry").setValue(oSelectedObj.Industry);
                // sap.ui.getCore().byId("idUpdateMatHier").setValue(oSelectedObj.Prod_Hiearchy);
                // sap.ui.getCore().byId("idUpdateNetWeight").setValue(oSelectedObj.Net_weight);
                this.UpdateDialog.open();
            },
            onPressDelete: function () {
                var that = this;
                var oModel = this.getView().getModel(),
                    table = this.getView().byId("idTable"),
                    oSelectedObj = table.getSelectedItem().getBindingContext("TableModel").getObject(),
                    materialnumber = oSelectedObj.Mat_No;
                //Delete Operation
                // sap.ui.core.BusyIndicator.show()
                // oModel.remove("/Material_DetSet('" + materialnumber + "')", {
                //     success: function (Response) {
                //         sap.ui.core.BusyIndicator.hide()
                //         MessageBox.success("Record Deleted Successfully");
                //         that.onPressGo();
                //         that.getView().byId("idTable").removeSelections(true);
                //     },
                //     error: function (error) {
                //         sap.ui.core.BusyIndicator.hide()
                //         MessageBox.error("Error While Deleting Record")
                //     }
                // });

                MessageBox.confirm("Are you sure want to Delete?", {
                    title: 'Dleteion Confirmation',
                    icon: sap.m.MessageBox.Icon.WARNING,
                    onClose: function (Action) {
                        if (Action === 'OK') {
                            sap.ui.core.BusyIndicator.show()
                            oModel.remove("/Material_DetSet('" + materialnumber + "')", {
                                success: function (Response) {
                                    sap.ui.core.BusyIndicator.hide()
                                    MessageBox.success("Record Deleted Successfully");
                                    that.onPressGo();
                                    that.getView().byId("idTable").removeSelections(true);
                                },
                                error: function (error) {
                                    sap.ui.core.BusyIndicator.hide()
                                    MessageBox.error("Error While Deleting Record")
                                }
                            });
                        }
                    },
                    actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
                    emphasizedAction: sap.m.MessageBox.Action.OK,
                    initialFocus: sap.m.MessageBox.Action.CANCEL
                })

            },
            onChangeUpdateNetWeight: function (oEvent) {
                var value = Number(oEvent.getSource().getValue()).toFixed(3);
                oEvent.getSource().setValue(value);
            },
            onPressUpdateUpdate: function () {
                var oModel = this.getView().getModel();
                var CommonModel = this.getView().getModel("CommonModel");
                // var Core = sap.ui.getCore();
                var materialnumber = CommonModel.getProperty("/Mat_Number")
                var payload = {
                    "Mat_No": materialnumber,
                    "Mat_Des": CommonModel.getProperty("/Mat_Desc"),
                    "Industry": CommonModel.getProperty("/Mat_Industry"),
                    "Mat_Group": CommonModel.getProperty("/Mat_Group"),
                    "Mat_Type": CommonModel.getProperty("/Mat_Type"),
                    "Prod_Hiearchy": CommonModel.getProperty("/Mat_Hier"),
                    "Net_weight": CommonModel.getProperty("/Mat_NetWeight")
                }
                sap.ui.core.BusyIndicator.show()
                oModel.update("/Material_DetSet('" + materialnumber + "')", payload, {
                    success: function (Response) {
                        MessageBox.success("Updated Successfully");
                        this.UpdateDialog.close();
                        this.onPressGo();
                        this.getView().byId("idTable").removeSelections(true);
                        sap.ui.core.BusyIndicator.hide();
                    }.bind(this),
                    error: function (error) {
                        sap.ui.core.BusyIndicator.hide();
                        MessageBox.error("Problem While Updating")
                    }
                });
            },
            onChangeUpdateMatType: function (oEvent) {
                var value = oEvent.getSource().getValue();
                var fomattedValue = value.toUpperCase()
                oEvent.getSource().setValue(fomattedValue);
            },
            onPressUpdateClose: function () {
                this.UpdateDialog.close();
            },
            onPressMaterialDescClose: function () {
                this.MaterialDescDialog.close();
            },
            onPressMaterialNumberRow: function (oEvent) {
                var materialNumber = oEvent.getSource().getBindingContext().getObject().Mat_No;
                this.getView().byId("idMaterialNumber").setValue(materialNumber);
                this.MaterialNumberDialog.close();
            },
            onPressMaterialDescRow: function (oEvent) {
                var MaterialDesc = oEvent.getSource().getBindingContext().getObject().Mat_Des;
                this.getView().byId("idMaterialDescription").setValue(MaterialDesc);
                this.onPressMaterialDescClose();
            },
            onPressRow: function (oEvent) {
                var selectedMatNo = oEvent.getSource().getBindingContext("TableModel").getObject().Mat_No;
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteDetail", {
                    materialnumber: selectedMatNo
                })
            },
            onPressCreate: function () {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteCreate");
            },
            onPressExport: function () {
                var oTable = this.getView().byId("idTable");  // get Table
                var oBinding = oTable.getBinding("items"); // Table Data

                var aData = [];
                var aTableArray = oBinding.getModel("TableModel").getProperty("/results")
                aTableArray.forEach(function (item) {
                    aData.push(
                        {
                            "Material Number": item.Mat_No,
                            "Description": item.Mat_Des,
                            "Industry": item.Industry,
                            "Material Group": item.Mat_Group,
                            "Material Type": item.Mat_Type,
                            "Product Hierarchy": item.Prod_Hiearchy,
                            "Net Weight": item.Net_weight
                        }
                    )
                });

                var oExport = new sap.ui.core.util.Export({
                    exportType: new ExportTypeCSV({
                        fileExtension: "csv",
                        separatorChar: ","
                    }),
                    models: new sap.ui.model.json.JSONModel({
                        items: aData
                    }),
                    rows: {
                        path: "/items"
                    },
                    columns: [{
                        name: "Material Number",
                        template: {
                            content: "{Material Number}"
                        }
                    }, {
                        name: "Material Description",
                        template: {
                            content: "{Description}"
                        }
                    }, {
                        name: "Industry",
                        template: {
                            content: "{Industry}"
                        }
                    }, {
                        name: "Material Group",
                        template: {
                            content: "{Material Group}"
                        }
                    }, {
                        name: "Material Type",
                        template: {
                            content: "{Material Type}"
                        }
                    }, {
                        name: "Product Hierarchy",
                        template: {
                            content: "{Product Hierarchy}"
                        }
                    }, {
                        name: "Net Weight",
                        template: {
                            content: "{Net Weight}"
                        }
                    }]
                });

                oExport.saveFile().catch(function (oError) {
                    alert("Error")
                }).then(function () {
                    oExport.destroy();
                })
            }
        });
    });