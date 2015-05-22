/*!
 * @copyright@
 */

/*************************************************************
* JamUtil helper class
*
* Is responsible for the integration and communication with the
* JAM APIs
**************************************************************/

jQuery.sap.declare("sap.collaboration.components.fiori.sharing.helper.ShareUtil");

sap.ui.base.Object.extend("sap.collaboration.components.fiori.sharing.helper.ShareUtil",{
	
	/**
	 * @constructor
	 */
	constructor: function(oLangBundle, oODataUtil, oSMIODataModel, oCommonUtil, oJamODataModel, oCollaborationHostRestService) {
		this.oLangBundle = oLangBundle;
		this.oODataUtil = oODataUtil;
		this.oSMIODataModel = oSMIODataModel;
		this.oJamODataModel = oJamODataModel;
		this.oCollaborationHostRestService = oCollaborationHostRestService;
		this.oCommonUtil = oCommonUtil;
		this.bShareError = false;
		this.bShareBusinessObjShared;
		this.bFileUploaded;
		this.aUploadAttachmentsUploaded = [];
		this.IdisplaySuccessMessageIntervalId;
	},
	
	/**
	 * Method that performs either the sequence of steps a.* or b.*. The b.* sequence occurs when oSharingData.mappedExternalObject isn't specified.
	 * a.1. Creates an ExternalObject in Jam corresponding for the business object being shared.
	 * a.2. Features the created ExternalObject to a Jam Group.
	 * a.3. Creates a SharedExternalObject feed entry on the Group's wall. See {@link _createGroupFeedEntry_SharedExternalObject} to know what a SharedExternalObject feed entry is.
	 * b.1. Creates a SharedObjectLink feed entry on the Group's wall. See {@link _createFeedEntry_ShareObjectLink} to know what a SharedObjectLink feed entry is. 
	 * @map {object} oSharingData - Share data needed for this method.
	 * @param {string} oSharingData.groupId - The Jam Id of the Group in which to feature the ExternalObject.
	 * @param {string} oSharingData.groupName - The name of the Group in which to feature the ExternalObject.
	 * @param {string} oSharingData.folderId - This is the Jam Id of the Folder in which to upload the attachment's.
	 * @param {object} oSharingData.feedContent - Data to create a feed entry in a Jam Group.
	 * @param {string} oSharingData.feedContent.uiUrl - The URL to navigate to after clicking on the link in the feed entry. This URL points to the Fiori app's view of the business object.
	 * @param {string} oSharingData.feedContent.note - The comment to add to the feed entry.
	 * @param {array} oSharingData.aFilesToUpload - Array of files (attachments) to upload to Jam.
	 * @param {object} oSharingData.mappedExternalObject - Set of URLs used by Jam to 
	 * @param {string} oSharingData.mappedExternalObject.Exid - OData URL of the business object being shared. This URL is URL for the OData service that exposes the business object that is in the SAP system.
	 * @param {string} oSharingData.mappedExternalObject.ODataLink - Same as Exid.
	 * @param {string} oSharingData.mappedExternalObject.ObjectType - OData service's metadata URL appended with a hash (#) symbol and the business object's entity set. 
	 * @param {string} oSharingData.mappedExternalObject.ODataMetadata - Same as ObjectType.
	 * @param {string} oSharingData.mappedExternalObject.ODataAnnotations - Annotations URL. Specifies to Jam what to display of the business object.
	 */
	shareBusinessObject: function(oSharingData) {
		var self = this;
		// Share external object
		if(oSharingData.mappedExternalObject && oSharingData.feedContent.uiUrl){
			this.oJamODataModel.create( '/ExternalObjects', 
				 oSharingData.mappedExternalObject,
				 {	async: true,  
					success: function(oData,response){
					 	self._featureExternalObjectToGroup(oSharingData, oData.results.Id);
				 	},
				 	error : function(oError){
				 		self.displayErrorMessage();
				 	}
				 });
		}
		// Share object link
		else {
			this._createFeedEntry_ShareObjectLink(oSharingData);
		}
	},
	
	/**
	 * Method that performs the following.
	 * 1. Features a Jam ExternalObject to a Jam Group.
	 * 2. Creates a feed entry on the Group's wall.
	 * @param {object} oSharingData - See the parameter of the same name for method {@link shareBusinessObject}
	 * @param {string} externalObjectId - Jam's Id for the ExternalObject being featured to the Group.
	 * @private
	 */
	_featureExternalObjectToGroup: function(oSharingData, externalObjectId){
		var self = this;
		this.oJamODataModel.create( "/Groups('"+oSharingData.groupId+"')/$links/FeaturedExternalObjects", 
				 { uri: "ExternalObjects('"+externalObjectId+"')" },
				 { async: true,
				   success: function(oData,response){
					 self._createGroupFeedEntry_SharedExternalObject(oSharingData);
				 	},
				   error : function(oError){
					   if (oError.response.statusCode == 409 || oError.response.statusCode == 400 || oError.response.statusCode == 404) {
						   self._createGroupFeedEntry_SharedExternalObject(oSharingData);
					   }
					   else {
						   self.displayErrorMessage();
					   }
				 	}
				 });
	},
	
	/**
	 * Method that creates a SharedExternalObject feed entry. A SharedExternalObject feed entry is a feed entry with a QuickView.
	 * @param {object} oSharingData - See the parameter of the same name for method {@link shareBusinessObject}.
	 * @private
	 */
	_createGroupFeedEntry_SharedExternalObject: function(oSharingData){

		var xmlPayload =
			'<?xml version="1.0" encoding="UTF-8"?>' +
			'<feed xmlns="http://www.w3.org/2005/Atom" xmlns:activity="http://activitystrea.ms/spec/1.0/">' +
				'<entry>' +
					'<title> </title>' +
					'<content type="html">'+ jQuery.sap.encodeXML(oSharingData.feedContent.note)+'</content>' +
					'<author>' +
						'<email>'+ jQuery.sap.encodeXML(oSharingData.memberEmail)+'</email>' +
						'<activity:object-type>http://activitystrea.ms/schema/1.0/person</activity:object-type>' +
					'</author>' +
					'<activity:verb>http://activitystrea.ms/schema/1.0/share</activity:verb>' +
					'<activity:object>' +
						'<id>'+ jQuery.sap.encodeXML(oSharingData.mappedExternalObject.Exid) +'</id>' +
						'<title type="html">'+ jQuery.sap.encodeXML(oSharingData.externalObject.name) + '</title>' +
						'<activity:object-type>'+ jQuery.sap.encodeXML(oSharingData.mappedExternalObject.ObjectType) +'</activity:object-type>' +
						'<link type="text/html" rel="alternate" href="'+ jQuery.sap.encodeXML(oSharingData.feedContent.uiUrl) +'"/>' +
						'<link rel="http://www.odata.org" href="'+ jQuery.sap.encodeXML(oSharingData.mappedExternalObject.ODataLink) +'"/>' +
					    '<link rel="http://www.odata.org/metadata" href="'+ jQuery.sap.encodeXML(oSharingData.mappedExternalObject.ODataMetadata) +'"/>' +
					    '<link rel="http://www.odata.org/annotation" href="'+ jQuery.sap.encodeXML(oSharingData.mappedExternalObject.ODataAnnotations) +'"/>' +
			        	'<source>' +
			        		'<id>tag:www.cubetree.com,2013:/groups/' + jQuery.sap.encodeXML(oSharingData.groupId) + '</id>' +
			        	'</source>' +
			        '</activity:object>' +
			    '</entry>' +
		    '</feed>';
		
		var self = this;
		var fnOnReadyStateChange = function() {
			if (this.readyState == 4) {
				if(this.status == 200){
					self.bShareBusinessObjShared = true;
					self.displaySuccessMessage(oSharingData.groupName);
				}
				else{
					self.displayErrorMessage();
				}
			}
		};
		
		this._createFeedEntryViaRestAPI( xmlPayload, fnOnReadyStateChange );
	},

	/**
	 * Method that creates a SharedObjectLink feed entry. A SharedObjectLink usually has a link back to the Fiori application's view of the Object.
	 * @param {object} oSharingData - See the parameter of the same name for method {@link shareBusinessObject}. 
	 * @private
	 */
	_createFeedEntry_ShareObjectLink: function(oSharingData){
		// Build the feed content to be posted. The feed content can either be 
		// - Note + Object Id
		// - Note only
		// - Object Id only 
		this.bShareBusinessObjShared = false;

		// If feed content is not empty, add request to batch and execute
		if (oSharingData.feedContent){
			
			if(oSharingData.feedContent.note !== undefined){
				
				var sContent = oSharingData.feedContent.note;
				if(oSharingData.feedContent.uiUrl){
					sContent = sContent + "<br/><a href='" + oSharingData.feedContent.uiUrl.replace(/'/g, "&apos;" ) + "'>" 
								+  this.oLangBundle.getText("SHARE_OBJECT_LINK") + '</a>';				
				}
			
				var xmlPayload =
					'<?xml version="1.0" encoding="UTF-8"?>' +
					'<feed xmlns="http://www.w3.org/2005/Atom" xmlns:activity="http://activitystrea.ms/spec/1.0/">' +
						'<entry>' +
							'<title>' + jQuery.sap.encodeXML(this.oLangBundle.getText("SHARE_OBJECT_LINK_TITLE")) + '</title>' +
							'<content type="html">'+ jQuery.sap.encodeXML(sContent) +'</content>' +
							'<author>' +
								'<email>'+ jQuery.sap.encodeXML(oSharingData.memberEmail)+'</email>' +
								'<activity:object-type>http://activitystrea.ms/schema/1.0/person</activity:object-type>' +
							'</author>' +
							'<activity:verb>http://activitystrea.ms/schema/1.0/share</activity:verb>' +
							'<activity:object>' +
					        	'<source>' +
					        		'<id>tag:www.cubetree.com,2013:/groups/' + jQuery.sap.encodeXML(oSharingData.groupId) + '</id>' +
					        	'</source>' +
					        '</activity:object>' +
					    '</entry>' +
				    '</feed>';
				
				var self = this;
				var fnOnReadyStateChange = function() {
					if (this.readyState == 4) {
						if(this.status == 200){
							self.bShareBusinessObjShared = true;
							self.displaySuccessMessage(oSharingData.groupName);
						}
						else{
							self.displayErrorMessage();
						}
					}
				};
				
				this._createFeedEntryViaRestAPI( xmlPayload, fnOnReadyStateChange );
				
			}else{
				jQuery.sap.log.debug("feedContent.note parameter should not be undefined", "sap.collaboration.components.fiori.sharing.Component.createFeedEntry()");
				this.displayErrorMessage();
			}
		}
		else{
			jQuery.sap.log.debug("feedContent parameter should not be undefined", "sap.collaboration.components.fiori.sharing.Component.createFeedEntry()");
			this.displayErrorMessage();
		}
	},
	
	/**
	 * Creates a feed entry using Jam's REST API.
	 * @param {string} sXMLPayload - XML payload that will be in the HTTP request's body. 
	 * @callback {XMLHttpRequest#onreadystatechange} fnOnReadyStateChange
	 */
	_createFeedEntryViaRestAPI: function(sXMLPayload, fnOnReadyStateChange){
	
		if(!this.oJamODataModel.getHeaders()['x-csrf-token']){
			this.oJamODataModel.refreshSecurityToken();
		}
		
		var atomHeaders = {
				'Accept':'application/atom+xml',
				'Content-Type':'application/atom+xml',
				'x-csrf-token': this.oJamODataModel.getHeaders()['x-csrf-token']
		};
		
		var sFeedPostURL = this.oCollaborationHostRestService.url + "/feed/post";
		if(this.oCollaborationHostRestService.urlParams != undefined && this.oCollaborationHostRestService.urlParams != "" ){
			sFeedPostURL = sFeedPostURL + "?" + this.oCollaborationHostRestService.urlParams;
		}
		
		var xmlHttpRequest = new window.XMLHttpRequest();
		xmlHttpRequest.open("POST",	sFeedPostURL, true );
		for (var headerField in atomHeaders) {
			xmlHttpRequest.setRequestHeader(headerField, atomHeaders[headerField]);
		}
		xmlHttpRequest.onreadystatechange = fnOnReadyStateChange;
		xmlHttpRequest.send(sXMLPayload);
	},
	/**
	* Uploads the attachments
	* @private
	*/
	uploadAttachments: function(oSharingData) {
		var self = this;
		var sGroupId = oSharingData.groupId;
		var sFolderId = oSharingData.folderId;
		
		
		for(var i in oSharingData.aFilesToUpload){
			this.oSMIODataModel.create( '/UploadTargetFile', null,
					 {	async 	: true,  
						success : function(oData,response){
						 
							jQuery.sap.log.debug('File was uploaded', "sap.collaboration.components.fiori.sharing.Component.uploadAttachments()" );
					 	},
					 	error 	: function(oError){
					 		jQuery.sap.log.debug('Error, file was not uploaded', "sap.collaboration.components.fiori.sharing.Component.uploadAttachments()");
					 	},
					 	urlParameters : {
					 		FileMimeType : "'" + oSharingData.aFilesToUpload[i].mimeType + "'",
					 		FileName : "'" + oSharingData.aFilesToUpload[i].name + "'",
					 		FileURL : "'" + oSharingData.aFilesToUpload[i].url + "'",
					 		FolderId : "'" + oSharingData.folderId + "'",
					 		GroupId : "'" + oSharingData.groupId + "'"
					 	} 
					 });
		}
	},
	/**
	 * Create Group Selection Dialog
	 * @private
	 */
	createGroupSelectionDialog: function(sPrefixId, aGroupsLinkedToBo, fSelectGroupCallback, iWidth, iHeight, oOdataModel){
		
		var self = this;
		var oCancelButton = new sap.m.Button(sPrefixId + "_GroupSelectionDialogCancelButton", {
			text: this.oLangBundle.getText("CANCEL_BUTTON_TEXT"),
			press: function(evt){ 
				self.oGroupSelectionDialog.close();
			}
		});
		
		var oGroupSelectionDialogContent = this.createGroupSelectionView(sPrefixId, aGroupsLinkedToBo, fSelectGroupCallback, iWidth, iHeight, oOdataModel);
		
		this.oGroupSelectionDialog = new sap.m.Dialog(sPrefixId + "_GroupSelectionDialog", {
			title:this.oLangBundle.getText("GROUP_SELECTION_DIALOG_TITLE"),
			content: oGroupSelectionDialogContent,
			beginButton: oCancelButton
		}).addStyleClass("sapUiPopupWithPadding");
		
		if(sap.ui.Device.system.phone){
			this.oGroupSelectionDialog.setStretch(true);
		}
		
		this.oGroupSelectionDialog.refresh = function(aGroups) {
			//var oGroupSelectionView = this.getContent()[0];
			//oGroupSelectionView.getController().aJamGroups = aGroups;
			//oGroupSelectionView.rerender();
		}
		
		return this.oGroupSelectionDialog;
	},
	
	/**
	* Creates the group selection view
	* @private
	*/
	createGroupSelectionView : function(sPrefixId, aGroupsLinkedToBo, fSelectGroupCallback, iWidth, iHeight, oOdataModel) {
		var oGroupView = sap.ui.view({
			id: sPrefixId + "_GroupSelectionView",
			viewData : {
				controlId: sPrefixId,
				groupsLinkedToBO: aGroupsLinkedToBo,
				selectGroupCallback: fSelectGroupCallback,
				oDataModel : oOdataModel
			}, 
			type: sap.ui.core.mvc.ViewType.JS, 
			viewName: "sap.collaboration.components.fiori.sharing.GroupSelection"
		});
		
		if(iWidth){
			oGroupView.setWidth(iWidth.toString() + "px");
		}
		
		if(iHeight){
			oGroupView.setHeight(iHeight.toString() + "px");
		}
		
		return oGroupView;
	},
	
	/**
	* Displays Success Message in case the share operation (BO + attachments) was processed successfully
	* @private
	*/
	displaySuccessMessage : function(sGroupName) {
		var bBoShareOk = true;
		//check if the BO is shared
		if(!(this.bShareBusinessObjShared === true || this.bShareBusinessObjShared === undefined)){
			bBoShareOk = false;
		}
		
		var bFileUploadOk = true;
		//check if all files are uploaded
		/*for(var i=0; i<this.aUploadAttachmentsUploaded.length; i++){
			if(this.aUploadAttachmentsUploaded[i].uploaded === false){
				bFileUploadOk = false;
				break;
			}
		}*/
		
		if(!(this.bFileUploaded === true || this.bFileUploaded === undefined)){
			bBoShareOk = false;
		}
		
		if(this.bShareError === false){
			if(bBoShareOk === true && bFileUploadOk === true){
				this.oCommonUtil.showMessage(this.oLangBundle.getText("SHARING_SUCCESS_MSG", [sGroupName]), {width: "20em", autoClose: false});
				clearInterval(this.IdisplaySuccessMessageIntervalId);
			}
		}
		else{
			clearInterval(this.IdisplaySuccessMessageIntervalId);
		}
	},
	
	/**
	* Displays Error Message in case one of the attachments was not uploaded successfully
	* @private
	*/
	displayErrorMessage : function() {
		if(!this.bShareError){
			var sErrorMessage = this.oLangBundle.getText("SHARING_FAILURE_MSG");
			this.oCommonUtil.displayError(sErrorMessage);
		}
		this.bShareError = true;
	}
	
	
});
