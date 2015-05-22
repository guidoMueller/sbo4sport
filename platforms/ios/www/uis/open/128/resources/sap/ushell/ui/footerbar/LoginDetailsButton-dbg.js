/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2013 SAP AG. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.control, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides control sap.ushell.ui.footerbar.LoginDetailsButton.
jQuery.sap.declare("sap.ushell.ui.footerbar.LoginDetailsButton");
jQuery.sap.require("sap.ushell.library");
jQuery.sap.require("sap.m.Button");


/**
 * Constructor for a new ui/footerbar/LoginDetailsButton.
 * 
 * Accepts an object literal <code>mSettings</code> that defines initial 
 * property values, aggregated and associated objects as well as event handlers. 
 * 
 * If the name of a setting is ambiguous (e.g. a property has the same name as an event), 
 * then the framework assumes property, aggregation, association, event in that order. 
 * To override this automatic resolution, one of the prefixes "aggregation:", "association:" 
 * or "event:" can be added to the name of the setting (such a prefixed name must be
 * enclosed in single or double quotes).
 *
 * The supported settings are:
 * <ul>
 * <li>Properties
 * <ul></ul>
 * </li>
 * <li>Aggregations
 * <ul></ul>
 * </li>
 * <li>Associations
 * <ul></ul>
 * </li>
 * <li>Events
 * <ul></ul>
 * </li>
 * </ul> 
 *
 * 
 * In addition, all settings applicable to the base type {@link sap.m.Button#constructor sap.m.Button}
 * can be used as well.
 *
 * @param {string} [sId] id for the new control, generated automatically if no id is given 
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * Add your documentation for the newui/footerbar/LoginDetailsButton
 * @extends sap.m.Button
 * @version 1.24.5
 *
 * @constructor
 * @public
 * @name sap.ushell.ui.footerbar.LoginDetailsButton
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.m.Button.extend("sap.ushell.ui.footerbar.LoginDetailsButton", { metadata : {

	library : "sap.ushell"
}});


/**
 * Creates a new subclass of class sap.ushell.ui.footerbar.LoginDetailsButton with name <code>sClassName</code> 
 * and enriches it with the information contained in <code>oClassInfo</code>.
 * 
 * <code>oClassInfo</code> might contain the same kind of informations as described in {@link sap.ui.core.Element.extend Element.extend}.
 *   
 * @param {string} sClassName name of the class to be created
 * @param {object} [oClassInfo] object literal with informations about the class  
 * @param {function} [FNMetaImpl] constructor function for the metadata object. If not given, it defaults to sap.ui.core.ElementMetadata.
 * @return {function} the created class / constructor function
 * @public
 * @static
 * @name sap.ushell.ui.footerbar.LoginDetailsButton.extend
 * @function
 */


// Start of sap/ushell/ui/footerbar/LoginDetailsButton.js
// Copyright (c) 2013 SAP AG, All Rights Reserved
/*global jQuery, sap*/

(function () {
    "use strict";
    /*global jQuery, sap, window*/

    jQuery.sap.require("sap.ui.layout.form.SimpleForm");
    jQuery.sap.require("sap.m.Label");
    jQuery.sap.require("sap.m.Text");
    jQuery.sap.require("sap.m.Input");
    jQuery.sap.require("sap.m.Dialog");
    jQuery.sap.require("sap.m.Button");
    jQuery.sap.require("sap.ushell.resources");
    jQuery.sap.require("sap.ushell.services.Container");

    jQuery.sap.declare("sap.ushell.ui.footerbar.LoginDetailsButton");

    /**
     * LoginDetailsButton
     *
     * @name sap.ushell.ui.footerbar.LoginDetailsButton
     * @private
     * @since 1.16.0
     */
    sap.ushell.ui.footerbar.LoginDetailsButton.prototype.init = function () {
        this.setIcon('sap-icon://person-placeholder');
        this.setWidth('100%');
        this.setText(sap.ushell.resources.i18n.getText("userPreferences"));
        this.setTooltip(sap.ushell.resources.i18n.getText("userPreferences_tooltip"));
        this.attachPress(this.showLoginDetailsDialog);
        this.setEnabled();  // disables button if shell not initialized
        //call the parent sap.m.Button init method
        if (sap.m.Button.prototype.init) {
            sap.m.Button.prototype.init.apply(this, arguments);
        }
    };

    sap.ushell.ui.footerbar.LoginDetailsButton.prototype.showLoginDetailsDialog = function () {

        var aItems = [],
            aThemes,
            oSimpleForm,
            okButton,
            cancelButton,
            oModel = sap.ui.getCore().byId("shell").getModel(),
            bThemeSelectionEnabled,
            currentThemeId,
            getThemesPromise,
            loadingThemesItem,
            simpleFormContext,
            that = this;

        try {
            this.userInfoService = sap.ushell.Container.getService("UserInfo");
            this.oUser = this.userInfoService.getUser();
        } catch (e) {
            jQuery.sap.log.error("Getting UserInfo service failed");
            this.oUser = sap.ushell.Container.getUser();
        }

        this.translationBundle = sap.ushell.resources.i18n;

        bThemeSelectionEnabled = this.oUser.isSetThemePermitted();
        currentThemeId = this.oUser.getTheme();

        loadingThemesItem = new sap.ui.core.Item({/*id : "themeItem_" + aThemes[index] , */text : sap.ushell.resources.i18n.getText('themesLoading'), enabled : true});

        // Construct themes drop-down list
        that.themeSelection = new sap.m.Select({
            id: "themesDropdown",
            enabled: !!oModel.getProperty("/setTheme"),
            visible: true,
            name: "Our Drop-Down",
            items: loadingThemesItem
        });

        simpleFormContext = [new sap.m.Text("userName", {text: that.oUser.getFullName() || ''})];
        if (that.oUser.getEmail()) {
            simpleFormContext.push(new sap.m.Label(''));
            simpleFormContext.push(new sap.m.Text("userEmail", {text: that.oUser.getEmail()}));
        }
        simpleFormContext = simpleFormContext.concat(
            new sap.m.Label("selectedTheme", {required: true, text: " " + this.translationBundle.getText("theme")}),
            that.themeSelection,
            new sap.m.Label("serverNameLbl", {text: this.translationBundle.getText("serverFld")}),
            new sap.m.Text("serverNameTxt", {text: window.location.host }),
            new sap.m.Label("languageLbl", {text: this.translationBundle.getText("languageFld")}),
            new sap.m.Text("languageTxt", {text: that.oUser.getLanguage() || ''})
        );

        oSimpleForm = new sap.ui.layout.form.SimpleForm({
            content: simpleFormContext
        });
        okButton = new sap.m.Button({
            id: "okButton",
            text: this.translationBundle.getText("okBtn"),
            press: that._dialogOkButtonHandler.bind(that),
            enabled: false
        });
        cancelButton = new sap.m.Button({
            id: "cancelButton",
            text: this.translationBundle.getText("cancelBtn"),
            press: function () {
                that.oDialog.close();
            }.bind(that)
        });

        that.oDialog = new sap.m.Dialog({
            id: "loginDetailsDialog",
            title: this.translationBundle.getText("userPreferences"),
            contentWidth: "300px",
            content: oSimpleForm,
            beginButton: okButton,
            endButton: cancelButton,
            afterClose: function () {
                that.themeSelection.destroy();
                that.oDialog.destroy();
                this.oUser.resetChangedProperties();
            }.bind(that)
        });

        that.oDialog.open();

        if (bThemeSelectionEnabled) {
            getThemesPromise = this.userInfoService.getThemeList();

            getThemesPromise.done(function (oData) {
                var index,
                    themeName;

                aThemes = oData.options || [];

                // Fill themes array from the result of userInfoService.getThemeList()
                for (index = 0; index < aThemes.length; index++) {
                    themeName =  aThemes[index].name;
                    if (themeName) {
                        aItems[index] = new sap.ui.core.Item({id: aThemes[index].id, text: themeName, enabled: true, key: themeName});
                    }
                }
                if (aThemes.length > 1) {
                    // Sort the array of themes according to theme name
                    aItems.sort(function (theme1, theme2) {
                        var theme1Name = theme1.getText().toLowerCase(),
                            theme2Name = theme2.getText().toLowerCase();
                        if (theme1Name < theme2Name) { //sort string ascending
                            return -1;
                        }
                        if (theme1Name > theme2Name) {
                            return 1;
                        }
                        return 0; //default return value (no sorting)
                    });
                }
                okButton.setEnabled();
            });

            getThemesPromise.fail(function () {
                // In case getThemeList failed - only currentTheme is relevant
                //  and theme selection is disabled in the UI
                aItems[0] = new sap.ui.core.Item({id: currentThemeId, text: currentThemeId, enabled: true, key: currentThemeId});
                bEnableThemeSelection = false;
            });
            getThemesPromise.always(jQuery.proxy(this._setThemeSelection, this, aItems, currentThemeId));
        } else {
            // In case theme selection is disabled by userInfoService - only currentTheme is relevant
            //  and theme selection is disabled in the UI
            that.themeSelection.addItem(new sap.ui.core.Item({id: currentThemeId, text: currentThemeId, enabled: true, key: currentThemeId}));
            that.themeSelection.setSelectedKey(currentThemeId);
            that.themeSelection.setEnabled(false);
        }
    };

    sap.ushell.ui.footerbar.LoginDetailsButton.prototype._setThemeSelection = function (aItems, currentThemeId) {
        var index,
            currentTheme,
            sCurrentThemeName;

        if (aItems) {
            this.themeSelection.removeAllItems();
            for (index = 0; index < aItems.length; index++) {
                this.themeSelection.addItem(aItems[index]);
            }
            // Themes drop-down list shows the current theme name - find theme name by theme Id
            currentTheme = aItems.filter(function (theme) {
                return theme.getId() === currentThemeId;
            });
            sCurrentThemeName = currentTheme.length ? currentTheme[0].getText() : {};

            if (sCurrentThemeName) {
                this.themeSelection.setSelectedKey(sCurrentThemeName);
            }
        }
    };

    sap.ushell.ui.footerbar.LoginDetailsButton.prototype._restoreUserPreferencesProperties = function (sErrorMessage) {
        //currently THEME is the only user preferences editable property
        var messageSrvc,
            oldTheme = this.oUser.getChangedProperties().filter(function (ChangedProperty) {
                return ChangedProperty.name === "THEME";
            })[0].oldValue;

        // Apply the previous theme to the user
        this.oUser.setTheme(oldTheme);
        messageSrvc = sap.ushell.Container.getService("Message");
        messageSrvc.error(this.translationBundle.getText("changeThemeFailed"));
        jQuery.sap.log.error(sErrorMessage);
    };

    sap.ushell.ui.footerbar.LoginDetailsButton.prototype._dialogOkButtonHandler = function () {
        this.oDialog.close();

        var currentTheme = this.oUser.getTheme(),
            oUserPreferencesPromise,
            message;

        if (this.themeSelection.getSelectedItemId() !== currentTheme) {

            // Apply the selected theme
            this.oUser.setTheme(this.themeSelection.getSelectedItemId());

            // In case that userInfoService is not available - this code will not be called because
            //  themeSelection.getSelectedKey() equals currentTheme
            oUserPreferencesPromise = this.userInfoService.updateUserPreferences(this.oUser);

            oUserPreferencesPromise.done(function () {
                message = this.translationBundle.getText("savedChanges");

                jQuery.sap.require("sap.m.MessageToast");
                sap.m.MessageToast.show(message, {
                    duration: 3000,
                    width: "15em",
                    my: "center bottom",
                    at: "center bottom",
                    of: window,
                    offset: "0 -50",
                    collision: "fit fit"
                });

                this.oUser.resetChangedProperties();
            }.bind(this));

            oUserPreferencesPromise.fail(function (sErrorMessage) {
                this._restoreUserPreferencesProperties(sErrorMessage);
            }.bind(this));
        }
    };

    sap.ushell.ui.footerbar.LoginDetailsButton.prototype.setEnabled = function (bEnabled) {
        if (!sap.ushell.Container) {
            if (this.getEnabled()) {
                jQuery.sap.log.warning(
                    "Disabling 'Login Details' button: unified shell container not initialized",
                    null,
                    "sap.ushell.ui.footerbar.LoginDetailsButton"
                );
            }
            bEnabled = false;
        }
        sap.m.Button.prototype.setEnabled.call(this, bEnabled);
    };

}());
