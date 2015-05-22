sap.ui.define( [
        "sap/ui/base/ManagedObject",
        "sap/ui/core/util/File"
    ],
    /**
     *
     * @param {sap.ui.base.ManagedObject} ManagedObject
     * @param {sap.ui.core.util.File}     File
     */
    function ( ManagedObject, File ) {
        "use strict";

        var SapShortcut = ManagedObject.extend( "uniorg.ui.core.util.download.SapShortcut", {
            /** @lends uniorg.ui.core.util.download.SapShortcut  **/
            metadata: {
                properties: {
                    client:       {type: "string"},
                    systemName:   {type: "string"},
                    userName:     {type: "string"},
                    userLanguage: {type: "string"},
                    title:        {type: "string"},
                    command:      {type: "string"},
                    type:         {type: "string", defaultValue: "Transaction"}
                }
            }
        } );

        /**
         *
         * @returns {string} string representation of shortcut file
         */
        SapShortcut.prototype.toString = function () {
            return "[System]\n" +
                "Name=" + this.getSystemName() + "\n" +
                "Client=" + this.getClient() + "\n" +
                "[User]\n" +
                "Name=" + this.getUserName() + "\n" +
                "Language=" + this.getUserLanguage() + "\n" +
                "[Function]\n" +
                "Title=" + this.getTitle() + "\n" +
                "Command=" + this.getCommand() + "\n" +
                "Type=" + this.getType() + "\n";
        };

        /**
         * <p>Triggers a download / save action for the given file</p>
         *
         * @param {string} sFilename file name
         * @returns {*} start download...
         */
        SapShortcut.prototype.save = function ( sFilename ) {
            var sContent = this.toString();
            return File.save(
                sContent,
                sFilename,
                "sap",
                "application/x-sapshortcut",
                "utf-8"
            );
        };

        return SapShortcut;

    }, /*bExport */ true );