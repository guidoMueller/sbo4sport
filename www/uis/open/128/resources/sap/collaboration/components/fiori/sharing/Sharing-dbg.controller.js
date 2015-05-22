/*!
 * @copyright@
 */

jQuery.sap.require("sap.collaboration.components.utils.CommonUtil");
jQuery.sap.require("sap.collaboration.components.utils.OdataUtil");
jQuery.sap.require("sap.collaboration.components.fiori.sharing.helper.ShareUtil");
jQuery.sap.require("sap.collaboration.components.fiori.sharing.helper.AttachmentsUtil");
jQuery.sap.require("sap.m.MessageToast");

sap.ui.controller("sap.collaboration.components.fiori.sharing.Sharing", {

	/**
	 * Called when a controller is instantiated and its View controls (if available) are already created.
	 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
	 * Initialize class variables
	 * @memberOf Sharing
	 */
	onInit: function() {
		// References to the View's controls needed by the Sharing controller.
		this.oNoteTextArea = this.getView().oNoteTextArea;
		this.oAttachmentsInput = this.getView().oAttachmentsInput;
		this.oTargetFolderInput = this.getView().oTargetFolderInput;
		
		this.oODataUtil = undefined;
		this.sPrefixId = this.getView().getViewData().controlId;
		this.oLangBundle = this.getView().getViewData().langBundle;
		this.aJamGroups = this.getView().getViewData().jamGroups;
		this.aGroupsLinkedToBo = [];
		this.iJamGroupsCount = 0;
		//Share Object and External Object
		this.sObjectId = this.getView().getViewData().objectId;
		this.sObjectShare = this.getView().getViewData().objectShare;
		this.oObjectDisplay = this.getView().getViewData().objectDisplay;
		this.oExternalObject = undefined;
		this.oMappedExternalObject = undefined;
		this.sMemberEmail = undefined; // remove after jam implements feed entry after sharing BO
		
		this.oSharingDialog = this.getView().getViewData().sharingDialog;
		this.fNoGroupsCallBack = this.getView().getViewData().noGroupsCallBack;
		
		this.oCommonUtil = new sap.collaboration.components.utils.CommonUtil();
		
		// Variables for Attachment Selection
		this.oAttachments = this.getView().getViewData().attachments;
		this.bAttachmentsCB = false;
		this.aFiles = [];
		this.aSelectedFiles = [];
		this.sSelectedFolderId = '';
		
	},
	
	/**
	* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
	* (NOT before the first rendering! onInit() is used for that one!).
	* @memberOf Sharing
	*/
	onBeforeRendering: function() {
		try{
			// Variables for Group Selection, has to be in the onBeforerendering to be reset each time the component is loaded
			this.sSelectedGroupId = '';
			
			// Initialize Utility Classes
			if (!this.oSMIODataModel)
				this.initializeOdataModel();
			if (!this.oODataUtil)
				this.initializeOdataUtils();
			if(!this.oAttachmentsUtil)
				this.initializeAttachmentsUtil();
			// the share util has to be initialized each time the dialog opens to handle the upload correctly
			this.initializeShareUtil();
			
			//setup to be done on the controls before rendering
			this.preRenderSetup();
			// Fetch data needed for the Share view
			this.fetchData();
			
			

			
			
			// Attachments Initialization ***********************************************
			this.clearAttachmentsData();
			this.oAttachments = this.getView().getViewData().attachments;

			if(this.oAttachments && this.oAttachments.attachmentsArray){
				this.aFiles = this.oAttachments.attachmentsArray;
				// Enable/Disable attachment selection
				if(this.aFiles.length > 0){
					this.getView().oAttachmentsInput.setEnabled(true);
				}
				else{
					this.getView().oAttachmentsInput.setEnabled(false);
				}
				
				// update the attachments dialog
				if(this.oFileSelectionDialog){
					var oAttachmentsModel = this.oAttachmentsUtil.createAttachmentsModel(this.aFiles);
					this.oFileSelectionDialog.setModel(oAttachmentsModel);
				}
							
				// show attachments fields
				this.showAttachmentsFields(true);
			}
			else{
				// hide attachments button
				this.showAttachmentsFields(false);
			}
			//***************************************************************************

			
			//in case the view was rerendered (ie it was created previously and then reused again), we have to reset the field for note
			if(this.sObjectId != this.getView().getViewData().objectId){
				this.sObjectId = this.getView().getViewData().objectId;
			}
			
			//in case the view was rerendered (ie it was created previously and then reused again) or the 
			//user changed the note, we have to reset the field for note
			if(this.sObjectShare != this.getView().getViewData().objectShare || 
					sap.ui.getCore().byId(this.sPrefixId + "_NoteTextArea").setValue !== this.getView().getViewData().objectShare){
				this.sObjectShare = this.getView().getViewData().objectShare;
				sap.ui.getCore().byId(this.sPrefixId + "_NoteTextArea").setValue(this.sObjectShare);
			}
			
			// in case of rerendering when display object was different than previous one, there are two possible scenarios:
			// 1. the previous display object existed, in this case remove the previous one then add the new item
			// 2. the previous display object did not exist, in this case just add the new item
			if (this.oObjectDisplay != this.getView().getViewData().objectDisplay){
				if(this.oObjectDisplay != undefined){
					this.getView().oSharingVBox.removeItem(0);
				}
				this.oObjectDisplay = this.getView().getViewData().objectDisplay;
				this.getView().oSharingVBox.insertItem(this.oObjectDisplay, 0);		
			}

		}
		catch(oError){	
			if(this.oSharingDialog){
				throw oError;
			}
			this.oCommonUtil.displayError(oError);
		}
	},
	
	/**
	* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
	* This hook is the same one that SAPUI5 controls get after being rendered.
	* @memberOf Sharing
	*/
	onAfterRendering: function() {
		/*if(this.oSharingDialog){
			this.iShareDialogHeight = this.oSharingDialog.getContent()[0].getDomRef().offsetHeight;
			this.iShareDialogWidth = this.oSharingDialog.getContent()[0].getDomRef().offsetWidth;
		}*/
		
		// After some investigation, we noticed that setting the focus without a delay only
		// worked on browsers other than Chrome. So to get the focus to appear on the select
		// control in as many browsers as possible, we make the call to the focus function
		// with some delay for all browsers.
		setTimeout(function() {sap.ui.getCore().byId(this.sPrefixId + "_GroupSelect").focus();}.bind(this), 1);
	},
	
	/**
	* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
	* @memberOf Sharing
	*/
	onExit: function() {
		this.getView().destroyContent();
	},
	
	/**
	* Does some setup required on some control (i.e disable/enable, set text ...) 
	* @private
	*/
	preRenderSetup : function() {
		this.getView().oGroupSelect.setEnabled(false);
		this.setGroupSelectionText("");
		if(this.oAttachments && this.oAttachments.attachmentsArray){
			this.getView().oTargetFolderInput.setEnabled(false);
		}
		this.getView().oNoteTextArea.setEnabled(false);
		// if Share is in dialog
		if(this.oSharingDialog){
			this.oSharingDialog.getBeginButton().setEnabled(false);
		}
	},
	/**
	* Fetches the data needed for the component rendering
	* @private
	*/
	fetchData : function() {
		
		var self = this;

		var gettingGroupCount = new jQuery.Deferred();
		gettingGroupCount.done(function(count){
			self.iJamGroupsCount = count;
			if(self.iJamGroupsCount > 0){
				self.postFetchSetup();
			}
			else{
				if(self.fNoGroupsCallBack){
					self.fNoGroupsCallBack();
				};
			};
		}); 
		var gettingCollaborationHostUrl = new jQuery.Deferred();
		gettingCollaborationHostUrl.done(function(url){
			if(!self.sJamUrl){
				self.sJamUrl = url;
			}
		});
		var mappingInternalBOToExternalBO = new jQuery.Deferred();
		mappingInternalBOToExternalBO.done(function(externalBO){
			self.oMappedExternalObject = externalBO;
		});
		mappingInternalBOToExternalBO.fail(function(){
			self.oMappedExternalObject = undefined;
			jQuery.sap.log.debug('Mapping Internal BO to External BO failed');
		});
		
		var gettingEmail = new jQuery.Deferred();
		gettingEmail.done(function(email){
			if(!self.sMemberEmail){
				self.sMemberEmail = email;
			}
		});
		
		
		
		jQuery.when(gettingGroupCount,gettingCollaborationHostUrl,mappingInternalBOToExternalBO).fail(function(){
			if(self.oSharingDialog){
				self.oSharingDialog.close();
			}
			self.oCommonUtil.displayError();	
		});
		
		
		// Get group count
		this.oJamODataModel.read( '/Groups/$count', { 
			success: function(oData, response){
				gettingGroupCount.resolve(parseInt(response.body));
			},
			error: function(oError){
				gettingGroupCount.reject();
			}
		});

		// Get email
		this.oJamODataModel.read( '/Self', { 
			success: function(oData, response){
				gettingEmail.resolve(oData.results.Email);
			},
			error: function(oError){
				gettingEmail.reject();
			}
		});			
		// Get collaboration host url
		if(!this.sJamUrl){
			this.oSMIODataModel.read('/GetCollaborationHostURL',{ 
				success: function(oData, response){
					gettingCollaborationHostUrl.resolve(oData.GetCollaborationHostURL.URL);
				},
				error: function(oError){
					gettingCollaborationHostUrl.reject();
				} 
			});
		}else{
			gettingCollaborationHostUrl.resolve();	
		}
		
		// Map internal bo to external bo
		this.oExternalObject = this.getView().getViewData().externalObject; 		// Update external object from view data
		if(this.oExternalObject) {
			this.oSMIODataModel.read('/MapInternalBOToExternalBO',{
				urlParameters: { ApplicationContext: "'"+self.oExternalObject.appContext+"'",
								 ODataCollection: "'"+self.oExternalObject.collection+"'",
								 ODataKeyPredicate: "'"+self.oExternalObject.key+"'",
								 ODataServicePath: "'"+self.oExternalObject.odataServicePath+"'" },
				success: function(oData,response){
					mappingInternalBOToExternalBO.resolve(oData.MapInternalBOToExternalBO);
				},
				error: function(oError){
					mappingInternalBOToExternalBO.reject();
				}
			});
		}
	},
	/**
	* Does some setup required on some control (i.e disable/enable ...) 
	* @private
	*/
	postFetchSetup : function() {
		this.setGroupSelectionEnabled(true);
	},
	/**
	 * Initializes the OData Model
	 * @private
	 */
	initializeOdataModel : function() {
		var asJson = true;
        this.sSMIODataServiceUrl = this.getView().getViewData().odataServiceUrl;
    	this.oSMIODataModel = new sap.ui.model.odata.ODataModel(this.sSMIODataServiceUrl, asJson);
    	
    	this.sJamODataServiceUrl = this.getView().getViewData().collaborationHostODataServiceUrl;
    	this.oJamODataModel = new sap.ui.model.odata.ODataModel(this.sJamODataServiceUrl, asJson);
    	this.oJamODataModel.setDefaultCountMode(sap.ui.model.odata.CountMode.Inline);
	},
	/**
	 * Initialize the OData Utility Class
	 * @private
	 */
	initializeOdataUtils : function() {
		this.oODataUtil = new sap.collaboration.components.utils.OdataUtil();
	},
	/**
	 * Initialize the Attachments Utility Class
	 * @private
	 */
	initializeAttachmentsUtil : function(){
		this.oAttachmentsUtil = new sap.collaboration.components.fiori.sharing.helper.AttachmentsUtil(this.oLangBundle, this.oODataUtil, this.oJamODataModel);
	},
	/**
	 * Initialize the Share Utility Class
	 * @private
	 */
	initializeShareUtil : function(){
		this.oShareUtil = new sap.collaboration.components.fiori.sharing.helper.ShareUtil(this.oLangBundle, this.oODataUtil, this.oSMIODataModel, this.oCommonUtil,
				this.oJamODataModel, this.getView().getViewData().collaborationHostRestService );
	},
	/**
	 * Set Group Selection Text
	 * @private
	 */
	setGroupSelectionText: function(sText){
		var oGroupSelect = sap.ui.getCore().byId( this.sPrefixId + "_GroupSelect");
		oGroupSelect.setValue(sText);
	},
	/**
	 * Set Group Selection Enabled
	 * @private
	 */
	setGroupSelectionEnabled: function(bEnabled){
		var oGroupSelect = sap.ui.getCore().byId( this.sPrefixId + "_GroupSelect");
		oGroupSelect.setEnabled(bEnabled);
	},
	/**
	 * Set Group Selection Enabled
	 * @private
	 */
	setFolderSelectionEnabled: function(bEnabled){
		this.oTargetFolderInput.setEnabled(bEnabled);
	},
	/**
	 * Show/Hide fields for attachments
	 * @private
	 */
	showAttachmentsFields : function(bVisibility){
		this.getView().AttachmentsInputLayout.setVisible(bVisibility);
		this.getView().oTargetFolderInputLayout.setVisible(bVisibility);
		this.getView().oAttachmentCB.setVisible(bVisibility);		
	},
	/**
	 * Clear data for attachments
	 * @private
	 */
	clearAttachmentsData : function(){
		// Clear previous attachments data, buttons, texts
		this.aFiles = [];
		this.aSelectedFiles = [];
		this.sSelectedFolderId = '';
		this.bAttachmentsCB = false;
		
		// reset text of button
		this.oAttachmentsInput.setValue("");
		// Clear Attachments Only checkbox
		this.getView().oAttachmentCB.setSelected(this.bAttachmentsCB);
		this.getView().oAttachmentCB.setEnabled(false);
		// Clear folder selection
		this.oTargetFolderInput.setValue("");
		if(this.oFolderSelectionDialog){
			this.oAttachmentsUtil.resetFolderSelection(this.getSelectedGroupId());
		}				
	},
	/**
	* Event Handler for the attachment value help
	* @private
	*/
	onAttachmentsValueHelpPress : function(oControlEvent){
		
		if(this.oSharingDialog){
			var iShareDialogHeight = this.oSharingDialog.getContent()[0].getDomRef().offsetHeight;
			//var iShareDialogWidth = this.oSharingDialog.getContent()[0].getDomRef().offsetWidth;
			var iShareDialogWidth = this.oSharingDialog.getDomRef().offsetWidth;
		}
		
		// create the file selection dialog
		if (!this.oFileSelectionDialog) {
			var oAttachmentsModel = this.oAttachmentsUtil.createAttachmentsModel(this.aFiles);
			this.oFileSelectionDialog = this.oAttachmentsUtil.createFileSelectionDialog(this.sPrefixId, oAttachmentsModel, this.onFileSelectionDialogConfirm(), iShareDialogWidth, iShareDialogHeight);
		}
		
		// clear the filter on the binding
		var oBinding = this.oFileSelectionDialog.getBinding("items");
		oBinding.filter([]);
	
		// open dialog
		this.oFileSelectionDialog.open();
	},
	/**
	 * This function is called when the OK button of the files selection dialog is clicked.
	 * @private
	 */
	onFileSelectionDialogConfirm: function() {
		var self = this;
		
		return function(oEvent){
						
			self.aSelectedFiles = [];
			var aContexts = oEvent.getParameter("selectedContexts");
			for(var i=0; i<aContexts.length; i++){
				self.aSelectedFiles.push(aContexts[i].getObject());
			}
			
			// Set the text of the Attachments button (ex: Attachments(5) when there are 5 attachments selected)
			if (self.aSelectedFiles && self.aSelectedFiles.length > 0) {
				self.postFileSelectionSetup(true);
			}
			else{
				self.postFileSelectionSetup(false);
			}
		};
	},	
	/**
	* Does some setup required on some control (i.e disable/enable, set text ...) 
	* @private
	*/
	postFileSelectionSetup : function(filesSelected) {
		if(filesSelected === true){
			if(this.aSelectedFiles.length == 1){
				this.oAttachmentsInput.setValue(this.oLangBundle.getText("SELECTED_ATTACHMENT_FIELD_TEXT", [this.aSelectedFiles.length]));
			}
			else {
				this.oAttachmentsInput.setValue(this.oLangBundle.getText("SELECTED_ATTACHMENTS_FIELD_TEXT", [this.aSelectedFiles.length]));
			}
			
			this.getView().oAttachmentCB.setEnabled(true);
			
			if(this.sSelectedGroupId !== '') {
				this.setFolderSelectionEnabled(true);
			}
		}
		else{
			this.oAttachmentsInput.setValue("");
			this.bAttachmentsCB = false;
			this.getView().oAttachmentCB.setSelected(this.bAttachmentsCB);
			this.postAttachmentCheckBoxSelection();
			this.getView().oAttachmentCB.setEnabled(false);
			this.setFolderSelectionEnabled(false);
		}
	},

	
	/**
	* Event Handler for the group value help
	* @private
	*/
	onGroupSelectValueHelpPress: function(oEvent){
		
		if(this.oSharingDialog){
			var iShareDialogHeight = this.oSharingDialog.getContent()[0].getDomRef().offsetHeight;
			var iShareDialogWidth = this.oSharingDialog.getContent()[0].getDomRef().offsetWidth;
		}
		
		var self = this;
		var onSelectGroupCallback = function(oEvent, oSelectedGroup){
			self.postGroupSelectionSetup(oSelectedGroup);
			self.oGroupSelectionDialog.close();
		};
		
		if(!this.oGroupSelectionDialog){
			this.oGroupSelectionDialog = this.oShareUtil.createGroupSelectionDialog(this.sPrefixId, this.aGroupsLinkedToBo, onSelectGroupCallback, iShareDialogWidth, iShareDialogHeight, this.oJamODataModel);
		}
		else{
			this.oGroupSelectionDialog.refresh(this.aJamGroups);
		}
		this.oGroupSelectionDialog.open();
	},
	/**
	* Does some setup required on some control (i.e disable/enable ...) 
	* @private
	*/
	postGroupSelectionSetup : function(oSelectedGroup) {
		// Save selected group id
		this.sSelectedGroupId = oSelectedGroup.Id.toString();
		this.setGroupSelectionText(oSelectedGroup.Name);

		if(this.oAttachments && this.oAttachments.attachmentsArray){
			// reset folder selection
			this.sSelectedFolderId = '';
			this.oAttachmentsUtil.resetFolderSelection(this.getSelectedGroupId());
			var oSelectedFolder = this.oAttachmentsUtil.getCurrentFolder();
			this.oTargetFolderInput.setValue(oSelectedFolder.name);
		}
		
		// if some attachments are already selected
		if (this.aSelectedFiles && this.aSelectedFiles.length > 0) {
			this.setFolderSelectionEnabled(true);
		}
		
		if(this.bAttachmentsCB === false){
			this.getView().oNoteTextArea.setEnabled(true);
		}
		// if Share is in dialog
		if(this.oSharingDialog){
			this.oSharingDialog.getBeginButton().setEnabled(true);
		}
	},
		
	/**
	* Event Handler for the attachment value help
	* @private
	*/
	onTargetFolderValueHelpPress : function(oControlEvent){
		if(this.oSharingDialog){
			var iShareDialogHeight = this.oSharingDialog.getContent()[0].getDomRef().offsetHeight;
			var iShareDialogWidth = this.oSharingDialog.getContent()[0].getDomRef().offsetWidth;
		}
		
		// Build folder dialog if not built yet
		if (!this.oFolderSelectionDialog) {
			this.oFolderSelectionDialog = this.oAttachmentsUtil.createFolderSelectionDialog(this.sPrefixId, this.getSelectedGroupId(), this.onFolderSelectionDialogConfirm(), this.onFolderSelectionDialogCancel(), iShareDialogWidth, iShareDialogHeight);
			this.sSelectedFolderId = '';
		}
		
		// Update the Dialog title before opening
		this.oFolderSelectionDialog.getContent()[0].oController.setFolderSelectionDialogTitle(this.oTargetFolderInput.getValue());
		this.oFolderSelectionDialog.open();
	},
	/**
	 * This function is called when the OK button of the folder selection dialog is clicked.
	 * @private
	 */
	onFolderSelectionDialogConfirm : function(oEvent){
		var self = this;
		return function(){
			var oSelectedFolder = self.oAttachmentsUtil.getCurrentFolder();
			self.sSelectedFolderId = oSelectedFolder.id;
			self.oTargetFolderInput.setValue(oSelectedFolder.name);
		};
	},
	/**
	 * This function is called when the Cancel button of the folder selection dialog is clicked.
	 * @private
	 */
	onFolderSelectionDialogCancel: function(oEvent) {
		var self = this;
		return function(oEvent){
			self.oAttachmentsUtil.setCurrentFolderId(self.sSelectedFolderId);	
		};
	},
	
	
	/**
	* Event Handler for the attachment checkBox
	* @private
	*/
	onAttachmentCheckBoxSelected : function() {
		// Toggle between checking and unchecking the Attachments Checkbox
		this.bAttachmentsCB = this.getView().oAttachmentCB.getSelected();
		this.postAttachmentCheckBoxSelection();
	},
	/**
	* Does some setup required on some control (i.e disable/enable ...) 
	* @private
	*/
	postAttachmentCheckBoxSelection : function() {
		if(this.bAttachmentsCB === true){
			this.getView().oNoteTextArea.setEnabled(false);
		}
		else{
			if(this.sSelectedGroupId !== ''){
				this.getView().oNoteTextArea.setEnabled(true);
			}
		}
	},
	
	/**
	* Gets the form data that can be used by other class to share some info to Jam
	* @private
	*/
	getSharingData : function() {
		var oFeedContent;
		
		if((this.oNoteTextArea.getValue() !== undefined && this.oNoteTextArea.getValue() !== "") || (this.sObjectId !== undefined && this.sObjectId !== "")){
			oFeedContent = 	{
								note: this.oNoteTextArea.getValue(),
								uiUrl: this.sObjectId
							};
		}
		if(JSON.stringify(this.oExternalObject)=== '{}'){
			this.oExternalObject = undefined;
		}
		
		return {
		 feedContent:						 oFeedContent,
		  groupId:                           this.getSelectedGroupId(),
		  folderId:							 this.getSelectedFolderId(),
		  aFilesToUpload:                    this.aSelectedFiles,
		  externalObject:					 this.oExternalObject,
		  mappedExternalObject:				 this.oMappedExternalObject,
		  groupName: 						 sap.ui.getCore().byId( this.sPrefixId + "_GroupSelect").getValue(),
		  memberEmail:						 this.sMemberEmail
		};
	},
	
	/**
	 * Gets the selected group's id
	 * @private
	 */
	getSelectedGroupId : function() {
		return this.sSelectedGroupId;
	},
	/**
	 * Gets the selected folder's id
	 * @private
	 */
	getSelectedFolderId : function() {
		return this.sSelectedFolderId;
	},	
	/**
	 * Shares the data to Jam group
	 *  We need the:
	 *  - Group
	 *  - Target Folder
	 *  - Attachments
	 *  - Comment
	 *  - The link to the BO
	 *  However, things are a little more complicated because there are different sharing scenarios:
	 *  		
	 *  Scenario 1 (BO only)
	 *  When BO only, then Group is set, the link to the BO is set,
	 *  and the comment is optional.
	 *  Scenario 1.1 BO (URL)
	 *  Scenario 1.2 BO (OData object)
	 *  		
	 *  Scenario 2 (Attachments only)
	 *  When Attachments only, then the Group is set, there is at least
	 *  one attachment selected, and the comment and target folder are optional.
	 *  
	 *  Scenario 3 (Both)
	 *  When both, then the Group is set, there is at least one attachment selected,
	 *  the link for the BO is set, and the comment and target folder are optional.
	 *  
	 * @private
	 */
	shareToJam : function() {
		var oSharingData = this.getSharingData();
		var self = this;
		
		//Nothing to share
		if (oSharingData.aFilesToUpload.length === 0 && (!oSharingData.feedContent || (!oSharingData.feedContent.uiUrl && oSharingData.feedContent.note.trim() === "")) && !oSharingData.externalObject){
			var sResultMessage = self.oLangBundle.getText("SHARING_NOTHING_TO_SHARE_MSG");
			this.oCommonUtil.showMessage(sResultMessage, {duration:3000, autoclose: false});
		}
		else{
			if (!this.bAttachmentsCB) {
				// For scenario 1 & 3.
				this.oShareUtil.shareBusinessObject(oSharingData);
				
			}	
			if (oSharingData.aFilesToUpload.length > 0) {
				// For scenario 2 & 3.
				this.oShareUtil.uploadAttachments(oSharingData);
				var sResultMessage = this.oLangBundle.getText("SHARING_ACKNOWLEDGMENT_MSG");
				// setTimeout to trigger the message toast 1/2 second after the dialog closes
				setTimeout(function(){self.oCommonUtil.showMessage(sResultMessage, {duration:3000, width:"30em", autoClose: false});}, 500);
			}
		}
	}
});
