/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2013 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.ushell.ui.footerbar.ContactSupportButton");jQuery.sap.require("sap.ushell.library");jQuery.sap.require("sap.m.Button");sap.m.Button.extend("sap.ushell.ui.footerbar.ContactSupportButton",{metadata:{library:"sap.ushell"}});
// Copyright (c) 2013 SAP AG, All Rights Reserved
(function(){"use strict";jQuery.sap.require("sap.ushell.resources");jQuery.sap.declare("sap.ushell.ui.footerbar.ContactSupportButton");sap.ushell.ui.footerbar.ContactSupportButton.prototype.init=function(){this.setIcon('sap-icon://email');this.setWidth('100%');this.setText(sap.ushell.resources.i18n.getText("contactSupportBtn"));this.setTooltip(sap.ushell.resources.i18n.getText("contactSupportBtn_tooltip"));this.attachPress(this.showContactSupportDialog);this.setEnabled()};sap.ushell.ui.footerbar.ContactSupportButton.prototype.showContactSupportDialog=function(){jQuery.sap.require("sap.ushell.services.Container");jQuery.sap.require("sap.ui.layout.form.SimpleForm");jQuery.sap.require("sap.m.TextArea");jQuery.sap.require("sap.m.Link");jQuery.sap.require("sap.m.Label");jQuery.sap.require("sap.m.Text");jQuery.sap.require("sap.m.Dialog");jQuery.sap.require("sap.m.Button");jQuery.sap.require("sap.ushell.UserActivityLog");this.translationBundle=sap.ushell.resources.i18n;this.oClientContext=sap.ushell.UserActivityLog.getMessageInfo();this.oLink=new sap.m.Link({text:this.translationBundle.getText("technicalDataLink")});this.oBottomSimpleForm=new sap.ui.layout.form.SimpleForm("bottomForm",{editable:false,content:[this.oLink]});this.sendButton=new sap.m.Button("contactSupportSendBtn",{text:this.translationBundle.getText("sendBtn"),enabled:false,press:function(){var s=sap.ushell.Container.getService("SupportTicket"),t=this.oTextArea.getValue(),S={text:t,clientContext:this.oClientContext},p=s.createTicket(S);p.done(function(m){sap.ushell.Container.getService("Message").info(this.translationBundle.getText("supportTicketCreationSuccess"))}.bind(this));p.fail(function(m){sap.ushell.Container.getService("Message").error(this.translationBundle.getText("supportTicketCreationFailed"))}.bind(this));this.oDialog.close()}.bind(this)});this.cancelButton=new sap.m.Button("contactSupportCancelBtn",{text:this.translationBundle.getText("cancelBtn"),press:function(){this.oDialog.close()}.bind(this)});this.oTextArea=new sap.m.TextArea("textArea",{rows:7,liveChange:function(){if(/\S/.test(this.oTextArea.getValue())){this.sendButton.setEnabled(true)}else{this.sendButton.setEnabled(false)}}.bind(this)});this.oTopSimpleForm=new sap.ui.layout.form.SimpleForm("topForm",{editable:false,content:[this.oTextArea]});this.oDialog=new sap.m.Dialog({id:"ContactSupportDialog",title:this.translationBundle.getText("contactSupportBtn"),contentWidth:"300px",leftButton:this.sendButton,rightButton:this.cancelButton,initialFocus:"textArea",afterOpen:function(){$("#textArea").on("focusout",function(){window.scrollTo(0,0)})},afterClose:function(){this.oDialog.destroy()}.bind(this)});this.oTextArea.setPlaceholder(this.translationBundle.getText("txtAreaPlaceHolderHeader"));this.oLink.attachPress(this._embedLoginDetailsInBottomForm.bind(this));this.oDialog.addContent(this.oTopSimpleForm);this.oDialog.addContent(this.oBottomSimpleForm);this.oDialog.open()};sap.ushell.ui.footerbar.ContactSupportButton.prototype._embedLoginDetailsInBottomForm=function(){this.oDialog.removeContent(this.oBottomSimpleForm.getId());this.oBottomSimpleForm.destroy();var a="",u="",b="",B=[];if(this.oClientContext.navigationData.applicationInformation){a=this.oClientContext.navigationData.applicationInformation.applicationType;u=this.oClientContext.navigationData.applicationInformation.url;b=this.oClientContext.navigationData.applicationInformation.additionalInformation}B.push(new sap.m.Text({text:this.translationBundle.getText("loginDetails")}).addStyleClass('ushellContactSupportHeaderInfoText'));B.push(new sap.m.Label({text:this.translationBundle.getText("userFld")}));B.push(new sap.m.Text({text:this.oClientContext.userDetails.fullName||''}));B.push(new sap.m.Label({text:this.translationBundle.getText("serverFld")}));B.push(new sap.m.Text({text:window.location.host}));if(this.oClientContext.userDetails.eMail&&this.oClientContext.userDetails.eMail!==''){B.push(new sap.m.Label({text:this.translationBundle.getText("eMailFld")}));B.push(new sap.m.Text({text:this.oClientContext.userDetails.eMail||''}))}B.push(new sap.m.Label({text:this.translationBundle.getText("languageFld")}));B.push(new sap.m.Text({text:this.oClientContext.userDetails.Language||''}));B.push(new sap.m.Text({text:''}));B.push(new sap.m.Text({text:this.translationBundle.getText("navigationDataFld")}).addStyleClass('ushellContactSupportHeaderInfoText'));B.push(new sap.m.Label({text:this.translationBundle.getText("hashFld")}));B.push(new sap.m.Text({text:this.oClientContext.navigationData.navigationHash||''}));B.push(new sap.m.Text({text:''}));B.push(new sap.m.Text({text:this.translationBundle.getText("applicationInformationFld")}).addStyleClass('ushellContactSupportHeaderInfoText'));B.push(new sap.m.Label({text:this.translationBundle.getText("applicationTypeFld")}));B.push(new sap.m.Text({text:a}));B.push(new sap.m.Label({text:this.translationBundle.getText("urlFld")}));B.push(new sap.m.Text({text:u}));B.push(new sap.m.Label({text:this.translationBundle.getText("additionalInfoFld")}));B.push(new sap.m.Text({text:b}));this.oBottomSimpleForm=new sap.ui.layout.form.SimpleForm('technicalInfoBox',{layout:sap.ui.layout.form.SimpleFormLayout.ResponsiveLayout,content:B});if(sap.ui.Device.os.ios&&sap.ui.Device.system.phone){this.oBottomSimpleForm.addStyleClass("ushellContactSupportFixWidth")}var o=this.oBottomSimpleForm.onAfterRendering;this.oBottomSimpleForm.onAfterRendering=function(){o.apply(this,arguments);var n=jQuery(this.getDomRef());n.attr("tabIndex",0);jQuery.sap.delayedCall(700,n,function(){this.focus()})};this.oDialog.addContent(this.oBottomSimpleForm)};sap.ushell.ui.footerbar.ContactSupportButton.prototype.setEnabled=function(e){if(!sap.ushell.Container){if(this.getEnabled()){jQuery.sap.log.warning("Disabling 'Contact Support' button: unified shell container not initialized",null,"sap.ushell.ui.footerbar.ContactSupportButton")}e=false}sap.m.Button.prototype.setEnabled.call(this,e)}}());