(function () {
    "use strict";
    /*global jQuery, sap */
    jQuery.sap.declare( "uniorg.bonvendo.ui.ushell.User" );

    jQuery.sap.require( "uniorg.bonvendo.ui.ushell.utils" );

    // "private" methods (static) without need to access properties -------------

    /**
     * Determines the theme root for the given theme
     * @params {string} theme
     * @params {string} system theme root
     * @returns {string} theme root for the given theme
     *
     * @private
     */
    function determineThemeRoot( sTheme, sSystemThemeRoot ) {
        if ( sTheme.indexOf( "sap_" ) === 0 ) {
            // SAP theme
            return "";
        }
        return sSystemThemeRoot;
    }

    /**
     * Clone a JSON object.
     *
     * @param {object} object to clone
     * @returns {object} copy of the input object
     *
     * @private
     */
    function clone( oObject ) {
        if ( oObject === undefined ) {
            return undefined;
        }
        try {
            return JSON.parse( JSON.stringify( oObject ) );
        } catch ( e ) {
            return undefined;
        }
    }

    // "public class" -----------------------------------------------------------

    /**
     * Constructs a new representation (wrapper) of the user object as loaded by the
     * startup service.
     *
     * @param {object} oContainerAdapterConfig
     *    the result of the startup service call
     * @class A representation of a user
     * @constructor
     * @since 1.15.0
     */
    sap.ushell.User = function ( oContainerAdapterConfig ) {
        // actually the parameter contains the container adapter config

        // constructor code -------------------------------------------------------
        var aChangedProperties = [],
            sSystemThemeRoot = oContainerAdapterConfig.themeRoot || "",
            oCurrentTheme = oContainerAdapterConfig.bootTheme || {theme: "", root: ""},
            oNextStartupTheme = oCurrentTheme;
        // theme + theme root returned by the startup service when the launchpad is started next time

        // "private" or hidden methods --------------------------------------------


        // "public" methods -------------------------------------------------------

        /**
         * Returns this user's email address.
         *
         * @returns {string}
         *   this user's email address
         * @since 1.15.0
         */
        this.getEmail = function () {
            return oContainerAdapterConfig.email;
        };

        /**
         * Returns this user's first name.
         *
         * @returns {string}
         *   this user's first name
         * @since 1.15.0
         */
        this.getFirstName = function () {
            return oContainerAdapterConfig.firstName;
        };

        /**
         * Returns this user's full name.
         *
         * @returns {string}
         *   this user's full name
         * @since 1.15.0
         */
        this.getFullName = function () {
            return oContainerAdapterConfig.fullName;
        };

        /**
         * Returns this user's ID.
         *
         * @returns {string}
         *   this user's ID
         * @since 1.15.0
         */
        this.getId = function () {
            return oContainerAdapterConfig.id;
        };

        /**
         * Returns this user's language.
         *
         * @returns {string}
         *   this user's language
         * @since 1.15.0
         */
        this.getLanguage = function () {
            return oContainerAdapterConfig.language;
        };

        /**
         * Returns this user's language tag as defined by this
         * <a href="http://tools.ietf.org/html/bcp47">spec</a>.
         *
         * @returns {string}
         *   this user's language tag according to BCP 47
         * @since 1.15.0
         */
        this.getLanguageBcp47 = function () {
            return oContainerAdapterConfig.languageBcp47;
        };

        /**
         * Returns this user's last name.
         *
         * @returns {string}
         *   this user's last name
         * @since 1.15.0
         */
        this.getLastName = function () {
            return oContainerAdapterConfig.lastName;
        };

        /**
         * Returns a URI to this user's image.
         *
         * @returns {string}
         *   a URI to this user's image
         * @since 1.21.1
         */
        this.getImage = function () {
            return oContainerAdapterConfig.image;
        };

        /**
         * Returns <code>true</code> if SAP Jam is active for this user.
         *
         * @returns {boolean}
         *   <code>true</code> if SAP Jam is active for this user
         * @since 1.15.0
         */
        this.isJamActive = function () {
            return oContainerAdapterConfig.isJamActive === true;
        };

        /**
         * Returns this user's selected theme.
         *
         * @returns {string}
         *   this user's selected theme
         * @since 1.15.0
         */
        this.getTheme = function () {
            return oCurrentTheme.theme;
        };

        /**
         * Sets this user's selected theme and applies it.
         * Also the theme is prepared to be stored as next start theme on the front-end server.
         * The save itself has to be triggered by method updateUserPreferences of the UserInfo service.
         * The theme root where the theme to be applied is read from is determined considering the
         * theme name. If the theme starts with sap_ the theme is read from the standard UI5
         * theme path. For all other themes the front-end server's system theme root is used.
         *
         * @since 1.15.0
         */
        this.setTheme = function ( sNewTheme ) {
            if ( this.isSetThemePermitted() === false ) {
                throw new Error( "setTheme not permitted" );
            }
            if ( sNewTheme !== oNextStartupTheme.theme ) {
                // The current theme is not relevant here
                this.setChangedProperties( "THEME", oNextStartupTheme.theme, sNewTheme );
                oNextStartupTheme.theme = sNewTheme;
                // This leads to a consistent state only if UserInfo.updateUserPreferences is called!
            }
            oCurrentTheme.theme = sNewTheme;
            oCurrentTheme.root = determineThemeRoot( sNewTheme, sSystemThemeRoot );
            // Apply the selected theme in UI5
            if ( oCurrentTheme.root ) {
                sap.ui.getCore().applyTheme( oCurrentTheme.theme, oCurrentTheme.root + "/UI5/" );
            } else {
                sap.ui.getCore().applyTheme( oCurrentTheme.theme );
            }
        };

        /**
         * Returns <code>true</code> if accessibility is active for this user.
         *
         * @returns {boolean}
         *   <code>true</code> if accessibility is active for this user
         * @since 1.15.0
         */
        this.getAccessibilityMode = function () {
            return oContainerAdapterConfig.accessibility;
        };

        /**
         * Set this user's Accessibility mode.
         *
         * @since 1.15.0
         */
        this.setAccessibilityMode = function ( accessibility ) {
            if ( this.isSetAccessibilityPermitted() === false ) {
                jQuery.sap.log.error( "setAccessibilityMode not permitted" );
                throw true;
            }

            oContainerAdapterConfig.accessibility = accessibility;
        };

        /**
         * Return <code>true</code> if user is permitted to modify accessibility property.
         *
         * @returns {boolean}
         *   <code>true</code> if user is permitted to modify accessibility property.
         * @since 1.15.0
         */
        this.isSetAccessibilityPermitted = function () {
            return oContainerAdapterConfig.setAccessibilityPermitted;
        };

        /**
         * Return <code>true</code> if user is permitted to modify theme property.
         *
         * @returns {boolean}
         *   <code>true</code> if user is permitted to modify theme property.
         * @since 1.15.0
         */
        this.isSetThemePermitted = function () {
            return oContainerAdapterConfig.setThemePermitted;
        };

        /**
         * Returns this user's array of changed properties.
         *
         * @returns {string}
         *   this user's array of changed properties
         * @since 1.23.0
         */
        this.getChangedProperties = function () {
            return clone( aChangedProperties );
        };

        /**
         * Updates the ChangedProperties attributes array on each setter invocation
         *
         * @since 1.23.0
         */
        this.setChangedProperties = function ( propertyName, currentValue, newValue ) {
            aChangedProperties.push( {name: propertyName, oldValue: currentValue, newValue: newValue} );
        };

        /**
         * Cleans the ChangedProperties array
         *
         * @since 1.23.0
         */
        this.resetChangedProperties = function () {
            aChangedProperties = [];
        };
        // TODO Would a resetChangedProperty - reset a specific property instead of the whole array -  not make more sense?
    };
}());