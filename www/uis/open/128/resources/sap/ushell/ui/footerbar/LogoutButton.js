/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2013 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.ushell.ui.footerbar.LogoutButton");jQuery.sap.require("sap.ushell.library");jQuery.sap.require("sap.m.Button");sap.m.Button.extend("sap.ushell.ui.footerbar.LogoutButton",{metadata:{library:"sap.ushell"}});
// Copyright (c) 2013 SAP AG, All Rights Reserved
(function(){"use strict";jQuery.sap.declare("sap.ushell.ui.footerbar.LogoutButton");jQuery.sap.require("sap.ushell.resources");sap.ushell.ui.footerbar.LogoutButton.prototype.init=function(){this.setIcon('sap-icon://log');this.setTooltip(sap.ushell.resources.i18n.getText("logoutBtn_tooltip"));this.setWidth('100%');this.setText(sap.ushell.resources.i18n.getText("logoutBtn_title"));this.attachPress(this.logout);this.setEnabled();if(sap.m.Button.prototype.init){sap.m.Button.prototype.init.apply(this,arguments)}};sap.ushell.ui.footerbar.LogoutButton.prototype.logout=function(){jQuery.sap.require('sap.m.MessageBox');var s=true,i=false,l=new sap.ushell.ui.launchpad.LoadingDialog({text:""});sap.ushell.Container.getGlobalDirty().done(function(d){s=false;if(i===true){l.exit();l=new sap.ushell.ui.launchpad.LoadingDialog({text:""})}var a=sap.ui.getCore().byId("shell");if(a){var c=a.getModel().getProperty("/currentState/stateName");if(d===sap.ushell.Container.DirtyState.MAYBE_DIRTY&&((c==="home"||c==="catalog"))){d=sap.ushell.Container.DirtyState.CLEAN}}var L=_(d);sap.m.MessageBox.show(L.message,L.icon,L.messageTitle,[sap.m.MessageBox.Action.OK,sap.m.MessageBox.Action.CANCEL],function(A){if(A===sap.m.MessageBox.Action.OK){l.openLoadingScreen();l.showAppInfo(sap.ushell.resources.i18n.getText('beforeLogoutMsg'),null);sap.ushell.Container.logout()}},sap.ui.core.ElementMetadata.uid("confirm"))});if(s===true){l.openLoadingScreen();i=true}};sap.ushell.ui.footerbar.LogoutButton.prototype.setEnabled=function(e){if(!sap.ushell.Container){if(this.getEnabled()){jQuery.sap.log.warning("Disabling 'Logout' button: unified shell container not initialized",null,"sap.ushell.ui.footerbar.LogoutButton")}e=false}sap.m.Button.prototype.setEnabled.call(this,e)};var _=function(d){var l={},r=sap.ushell.resources.i18n;if(d===sap.ushell.Container.DirtyState.DIRTY||d===sap.ushell.Container.DirtyState.MAYBE_DIRTY){l.message=r.getText('unsaved_data_warning_popup_message');l.icon=sap.m.MessageBox.Icon.WARNING;l.messageTitle=r.getText("unsaved_data_warning_popup_title")}else{l.message=r.getText('logoutConfirmationMsg');l.icon=sap.m.MessageBox.Icon.QUESTION;l.messageTitle=r.getText("title_confirm")}return l}}());