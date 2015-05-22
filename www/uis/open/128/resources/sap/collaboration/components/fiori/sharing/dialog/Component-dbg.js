/*!
 * @copyright@
 */

jQuery.sap.require("sap.collaboration.components.utils.OdataUtil");
jQuery.sap.require("sap.collaboration.components.utils.CommonUtil");
jQuery.sap.require("sap.ui.core.UIComponent");
jQuery.sap.require("sap.m.MessageToast");

jQuery.sap.declare("sap.collaboration.components.fiori.sharing.dialog.Component");

/**
* Constructor for the share dialog component
* @since version 1.16
* @constructor
* @param {sap.ui.core.URI} [oDataServiceUrl] DEPRECATED The OData service URL will no longer be taken into account.
* @param {object} [object] A JSON object passed to the share component. This object contains the following properties:
*		<ul>
* 			<li>id (optional): is the object Id to be shared in SAP Jam, i.e a URL that navigates back to the same object in the application</li>
*			<li>display (optional): is a UI5 control to be displayed in the component UI</li>
*			<li>share (optional): is a note that will be displayed in the component UI and shared to SAP Jam too</li>
*		</ul>
* @param {object} [externalObject]  A Business Object such as an Opportunity, Sales Order, Account, etc. from the back-end that will be shared as a Featured External Object in a Group in Jam.
* <code>
* <ul>
* 	<li>{string} appContext: The application context. Example: "CRM", "SD", etc.</li>
*	<li>{string} odataServicePath: The relative path to the OData Service.  Example: "/sap/opu/odata/sap/ODATA_SRV"</li>
* 	<li>{string} collection: The name of the OData Collection. Example: "Account", "Opportunity", etc.</li>
* 	<li>{string} key: The key to identify a particular instance of the Business Object. It can be a simple ID or a compound key. Example: "123", "ObjectID='123'", "ObjectID='123',ObjectType='BUS000123'", etc.</li>
* 	<li>{string} name: The short name of the Business Object. Example: "Sales Order 123", "Opportunity 123", "Account 123", etc.</li>
* </ul>
* </code>
* These attributes are not enforced by the UI (missing or incorrect values are not validated), but they are required to make the integration work.
* These attributes also should be mapped in the Back-end System and Jam in order to make the External Object work.
* <br><b>Note:</b> the externalObject is dependent on object.id, therefore, the object.id must also be passed to the Share Component. See the parameter "object" for more information.
* @param {object} [attachments] When you want to provide the user with the option to share file attachments, then the following properties need to be specified:
* <ul>
*   <li>attachmentsArray: An array of {@link sap.collaboration.components.fiori.sharing.attachment.Attachment} objects. This array offers users a list of files they can attach.</li>
* </ul>

* @class Share Dialog Component
* 
* A Share Dialog Component is a ui5 component that applications 
* can use to render the share component in a dialog and then can 
* be used to share information to SAP Jam
* @name sap.collaboration.components.fiori.sharing.dialog.Component
* @public
*/


sap.ui.core.UIComponent.extend("sap.collaboration.components.fiori.sharing.dialog.Component", 
		/** @lends sap.collaboration.components.fiori.sharing.dialog.Component */ 
		{		
	
		metadata: {
			includes: ["../../../css/Sharing.css"],
			properties: {
				attachments: {type: "object"},
				object: {type: "object"},
				externalObject: {type: "object"}
			},
			
			aggregations: {
			},
			
			events: {
			}
		},
		systemSettings: {
			width: "400px", 
			height: "", 
			oDataServiceUrl: "/sap/opu/odata/sap/SM_INTEGRATION_V2_SRV",
			collaborationHostODataServiceUrl: "/sap/bc/ui2/smi/rest_tunnel/Jam/api/v1/OData",
			collaborationHostRestService: { url:"/sap/bc/ui2/smi/rest_tunnel/Jam/api/v1",
											urlParams: "" }
		},
		/**
		* Initialization of the Component
		* @private
		*/
		init: function(){
			this.oCommonUtil = new sap.collaboration.components.utils.CommonUtil();	
			this.oLangBundle = this.oCommonUtil.getLanguageBundle();
		},

		/**
		* Setter for the Component settings.
		* @param {object} oSettings A JSON object used to set the component settings, this object should contains the same 
		* properties used in the constructor. 
		* @public
		*/
		setSettings : function(oSettings) {
			this.setObject(oSettings.object);
			this.setAttachments(oSettings.attachments);
			//Treat an empty external object as undefined.
			if(JSON.stringify(oSettings.externalObject)=== '{}'){
				this.setExternalObject(undefined);
			} else {
				this.setExternalObject(oSettings.externalObject);
			}
		},
		
		/**
		 * Creates the sharing view
		 * @private
		 */
		createSharingView : function() {
			var self = this;
			
			var oObjectDisplay;
			var sObjectShare;
			var sObjectId;
			var oObject = this.getObject();
			if (oObject){
				sObjectId = oObject.id;
				oObjectDisplay = oObject.display; 
				sObjectShare = oObject.share; 
			}
			
			var fNoGroupsCallBack = function() {
				self.close();
				self.openoNoGroupsDialog(self.oSharingView.getController().sJamUrl);
			}
			if(!this.oSharingView)
			{
				this.oSharingView = sap.ui.view({
					id: this.getId() + "_SharingView",
					viewData : {
						controlId: this.getId(),
						odataServiceUrl: this.systemSettings.oDataServiceUrl,
						collaborationHostODataServiceUrl: this.systemSettings.collaborationHostODataServiceUrl,
						collaborationHostRestService: this.systemSettings.collaborationHostRestService,
						langBundle: this.oLangBundle,
						jamGroups: this.aJamGroups,
						sharingDialog: this.oSharingDialog,
						noGroupsCallBack: fNoGroupsCallBack,
						objectDisplay: oObjectDisplay,
						objectShare: sObjectShare,
						objectId: sObjectId,
						attachments: this.getAttachments(),
						externalObject: this.getExternalObject()
					},
					type: sap.ui.core.mvc.ViewType.JS, 
					viewName: "sap.collaboration.components.fiori.sharing.Sharing"
				});
			}
			else{
				this.oSharingView.getViewData().objectId = sObjectId;
				this.oSharingView.getViewData().objectShare = sObjectShare;
				this.oSharingView.getViewData().objectDisplay = oObjectDisplay;
				this.oSharingView.getViewData().externalObject = this.getExternalObject();
				this.oSharingView.getViewData().attachments = this.getAttachments();
				//**** Note: we dont rerender the view here because when the component container rerender this component, it deleted the domRef and the rerender
				//**** for the view can not be accomplished without the domRef, so we depend on the "placeAt" to do the trick
			}
		},
		
		/**
		 * Creates the sharing component dialog
		 * @private
		 */
		createSharingDialog: function() {
			var oSharingDialog = new sap.m.Dialog(this.getId() + "_SharingDialog", {
				title: this.oLangBundle.getText("SHARING_PAGE_TITLE"),
				contentWidth: this.systemSettings.width,
				stretch: false,
				afterClose : function(){
					// TODO: Here is where we execute the code responsible
					// for sharing the files.
				}
			}).addStyleClass("sapUiPopupWithPadding");
			
			return oSharingDialog;
		},
		
		/**
		 * Creates a dialog for the case where there are no groups
		 * @param {string} sJamUrl The Jam Url
		 * @private
		 */
		createNoGroupsDialog : function(sJamUrl) {
			if(!this.oNoGroupsView){
				this.oNoGroupsView = sap.ui.view({
					id: this.getId() + "_NoGroupsView",
					viewData : {
						controlId: this.getId(),
						langBundle: this.oLangBundle,
						jamUrl: sJamUrl
					},
					type: sap.ui.core.mvc.ViewType.JS, 
					viewName: "sap.collaboration.components.fiori.sharing.NoGroups"
				});
			}
			
			var oNoGroupsDialog = new sap.m.Dialog(this.getId() + "_NoGroupsDialog", {
				title: this.oLangBundle.getText("SHARING_PAGE_TITLE"),
				stretch: false,
				content : this.oNoGroupsView,
				beginButton : new sap.m.Button(this.getId() + "_CloseButton", {
					text: this.oLangBundle.getText("CLOSE_BUTTON_TEXT"),
					press : function() {
						oNoGroupsDialog.close();
					}
				})
			}).addStyleClass("sapUiPopupWithPadding");
			
			return oNoGroupsDialog;
		},
		
		/**
		 * Opens the share component dialog
		 * @public
		 */
		open : function(){
			if(this.bStopRendering === undefined || this.bStopRendering  === false){
				if (!this.oSharingDialog){
					this.logComponentProperties();
					this.oSharingDialog = this.createSharingDialog();
				}
				
				this.createSharingView();
				this.oSharingDialog.addContent(this.oSharingView);
				this.oSharingDialog.setInitialFocus(this.oSharingView);
				this.createDialogButtons();
				
				if(sap.ui.Device.system.phone){
					this.oSharingDialog.setStretch(true);
				}
				
				try{
					this.oSharingDialog.open();
				}
				catch(oError){
					this.oCommonUtil.displayError();
				}
			}
		},
		
		/**
		 * closes the share component dialog
		 * @private
		 */
		close : function() {
			if (this.oSharingDialog){
				this.oSharingDialog.close();
			}
		},
		
		/**
		 * Opens the dialog for the case where there are no groups
		 * @param {string} sJamUrl The Jam Url
		 * @private
		 */
		openoNoGroupsDialog : function(sJamUrl) {
			this.oSharingDialog.removeAllContent();
			if (!this.oNoGroupsDialog){
				this.oNoGroupsDialog = this.createNoGroupsDialog(sJamUrl);
			}
			
			this.oNoGroupsDialog.open();
		},
		
		/**
		 * create the sharing component dialog buttons
		 * @private
		 */
		createDialogButtons : function() {
			var self = this;
			if (!sap.ui.getCore().byId(this.getId() + "_LeftButton")){
				this.oLeftButton = new sap.m.Button(this.getId() + "_LeftButton", {
					text: this.oLangBundle.getText("OK_BUTTON_TEXT"),
					enabled: false,
					press : function() {
						//self.oSharingDialog.getBeginButton().setEnabled(false);
						self.oSharingView.getController().shareToJam();
						self.oSharingDialog.close();
					}
				});
				this.oSharingDialog.setBeginButton(this.oLeftButton);
			}
			/*else{
				this.oLeftButton.setText(this.oLangBundle.getText("OK_BUTTON_TEXT"));
			}*/
				
			
			if(!this.oRightButton){
				this.oRightButton = new sap.m.Button(this.getId() + "_RightButton", {
					text: this.oLangBundle.getText("CANCEL_BUTTON_TEXT"),
					press : function() {
						self.oSharingDialog.close();
					}
				});
				this.oSharingDialog.setEndButton(this.oRightButton);
			}
		},
		
		/**
		 * Sets the begin and end buttons for the dialog
		 * @private
		 */
		setDialogButtons : function() {
			//this.oSharingDialog.setBeginButton(this.oLeftButton);
			//this.oLeftButton.setEnabled(true);
			//this.oRightButton.setEnabled(true);
			//this.oSharingDialog.setEndButton(this.oRightButton);
		},
		
		/**
		 * Sets the end buttons for the dialog in case there are no groups
		 * @private
		 */
		setCloseButton : function() {
			this.oSharingDialog.destroyBeginButton();
			this.oSharingDialog.setEndButton(this.oCloseButton);
		},
		
		/**
		 * Logs the properties of the component
		 * @private
		 */
		logComponentProperties: function(){
			jQuery.sap.log.debug("Share Component properties:", "", 
					"sap.collaboration.components.fiori.sharing.Component.logComponentProperties()");
			jQuery.sap.log.debug("width: " + this.systemSettings.width);
	        jQuery.sap.log.debug("height: " + this.systemSettings.height);
	        jQuery.sap.log.debug("oDataServiceUrl: " + this.systemSettings.oDataServiceUrl);
	        jQuery.sap.log.debug("collaborationHostODataServiceUrl: " + this.systemSettings.collaborationHostODataServiceUrl);
	        jQuery.sap.log.debug("collaborationHostRestService: " + this.systemSettings.collaborationHostRestService.url +this.systemSettings.collaborationHostRestService.urlParams );
	        
	        
	        if(this.getObject()) {
	        	jQuery.sap.log.debug("object->id: " + this.getObject().id);
	        	jQuery.sap.log.debug("object->display: " + this.getObject().display);
	        	jQuery.sap.log.debug("object->share: " + this.getObject().share);
	        } else {
	        	jQuery.sap.log.debug("object: undefined");
	        }
	        
	        if(this.getAttachments() && this.getAttachments().attachmentsArray){
	        	jQuery.sap.log.debug("Attachments:");
	        	var attachmentsArray = this.getAttachments().attachmentsArray;
	        	for(var i=0; i<attachmentsArray.length; i++){
	        		jQuery.sap.log.debug("Attachments" + (i+1) + ":");
	        		jQuery.sap.log.debug(attachmentsArray[i].mimeType);
	        		jQuery.sap.log.debug(attachmentsArray[i].name);
	        		jQuery.sap.log.debug(attachmentsArray[i].url);
	        	}
	    	}
	        else{
	        	jQuery.sap.log.debug("attachments: undefined");
	        }
	        
	        if(this.getExternalObject()){
	        	jQuery.sap.log.debug("externalObject->appContext: " + this.getExternalObject().appContext);
	        	jQuery.sap.log.debug("externalObject->odataServicePath: " + this.getExternalObject().odataServicePath);
	        	jQuery.sap.log.debug("externalObject->collection: " + this.getExternalObject().collection);
	        	jQuery.sap.log.debug("externalObject->key: " + this.getExternalObject().key);
	        	jQuery.sap.log.debug("object->name: " + this.getExternalObject().name);
	        	jQuery.sap.log.debug("object->summary: " + this.getExternalObject().summary);
	        } else {
	        	jQuery.sap.log.debug("externalObject: undefined");
	        }
		}
	}
);
