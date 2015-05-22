if (!window.sap) {
    window.sap = {};
}

if (!sap.logon) {
	sap.logon = {};
}

sap.logon.Notification = function (onActionCallback) {

    if (typeof jQuery === 'undefined' || typeof jQuery.sap === 'undefined') {
        getLocalizedString = function(key){
            return key;
        }
    }
    else {
        jQuery.sap.require("jquery.sap.resources");
        var locale = sap.ui.getCore().getConfiguration().getLanguage();
        var i18n = jQuery.sap.resources({'url' : "../i18n/i18n.properties", 'locale': locale});
        var i18nProvider = jQuery.sap.resources({'url' : "../i18n/i18n.provider.properties", 'locale': locale});

        getLocalizedString = function(key){
            var localizedValue = i18n.getText(key);
            if (localizedValue == key){
               //try to get the localized string from provider's resource to get value
               localizedValue = i18nProvider.getText(key);
            }
            return localizedValue;
        }
    }

	var show = function (notificationKey,notificationMessage,notificationTitle) {
    	jQuery.sap.require("sap.m.MessageBox");
        var message = getLocalizedString(notificationKey + '_MSG');
        if( message == null || message.trim().length == 0 ) {
            message = notificationMessage != null ? notificationMessage : '';
        }
        var title = getLocalizedString(notificationKey + '_TITLE');
        if( title == null || title.trim().length == 0 ) {
            title = notificationTitle != null ? notificationTitle : '';
        }
		sap.m.MessageBox.show(
		        message,
    		    sap.m.MessageBox.Icon.NONE,
    		    title,
    		    [sap.m.MessageBox.Action.OK],
    		    function(oResponse) { 
    				if (oResponse === sap.m.MessageBox.Action.OK) {
                        onActionCallback('ERRORACK', JSON.stringify({'key':notificationKey}));
                        setTimeout(function(){$('#BTN_SUBMIT').focus()}, 150);
    				}
    			}
    		);
    }    

	this.show = show;
}
