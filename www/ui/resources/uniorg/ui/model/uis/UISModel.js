sap.ui.define(
    ["sap/ui/model/json/JSONModel"],

    function ( BaseModel ) {
        "use strict";

        var UISModel = BaseModel.extend( "uniorg.ui.model.uis.UISModel", {

            /**
             * @param {string} sServiceUrl  server host url
             * @param {string} [sUser]      optional username for http auth
             * @param {string} [sPassword]  optional password for http auth
             * @param {object} [mHeaders]   optional set of headers
             * @contructor
             * @returns {void}
             */
            constructor: function ( sServiceUrl, sUser, sPassword, mHeaders, sTokenEndpoint ) {

                BaseModel.prototype.constructor.apply( this );

                this.sServiceUrl = sServiceUrl;

                if ( sUser !== undefined && sUser !== null ) {
                    this.sUser = sUser;
                }

                if ( sPassword !== undefined && sPassword !== null ) {
                    this.sPassword = sPassword;
                }

                if ( sTokenEndpoint ) {
                    if ( sTokenEndpoint !== "FUNCTION" ) {
                        this.sTokenEndpoint = sTokenEndpoint;
                    }
                } else {
                    this.sTokenEndpoint = "XSRF.xsjs";
                }

                this.mHeaders = {};
                if ( typeof mHeaders === "object" ) {
                    this.mHeaders = mHeaders;
                }

                this._waitingForToken = false;
                this._requestQueue = [];
                this.oData = {};

                this._dataLoading = {};
                this._dataPromise = {};
            }

        } );

        /**
         * Calls a rfc function and returns a promise for receiving the result.
         *
         * @param {string} sName       RFC Name
         * @param {object} mParameters RFC Parameters
         * @param {string} [sMethod]   optional RFC Method (GET|POST|PUT|DELETE|...)
         * @returns {jQuery.Deferred}  promise
         */
        UISModel.prototype.callFunction = function ( sName, mParameters, sMethod ) {

            var oRequest = this.buildRequest( sName, mParameters, sMethod );
            var $promise = new jQuery.Deferred();
            this.sendRequest( oRequest, $promise );

            return $promise.promise();
        };

        /**
         * Calls a rfc function and returns a promise for receiving the result.
         * Also stores the result in the model to be used by bindings.
         * The binding path will start with sAlias (which defaults to sName).
         *
         * @param {string} sName         RFC Name
         * @param {object} [mParameters] optional RFC Parameters
         * @param {string} [sMethod]     optional RFC Method (GET|POST|PUT|DELETE|...). Defaults to GET.
         * @param {string} [sAlias]      optional binding path alias (defaults to sName)
         * @returns {jQuery.Deferred}    promise
         */
        UISModel.prototype.loadData = function ( sName, mParameters, sMethod, sAlias ) {

            if ( !sAlias ) {
                sAlias = sName;
            }
            if ( this._dataLoading[sAlias] ) {
                return this._dataPromise[sAlias];
            }

            this._dataLoading[sAlias] = true;

            if ( !sMethod ) {
                sMethod = "GET";
            }
            var oRequest = this.buildRequest( sName, mParameters, sMethod );
            var $promise = new jQuery.Deferred();
            var that = this;
            this._dataPromise[sAlias] = $promise;

            this.sendRequest( oRequest ).promise()
                .done( function ( oData ) {
                    that._dataLoading[sAlias] = false;
                    that.oData[sAlias] = oData;
                    $promise.resolve.apply( $promise, arguments );
                    that.updateBindings( true );
                } )
                .fail( function () {
                    that._dataLoading[sAlias] = false;
                    $promise.reject.apply( $promise, arguments );
                } );

            return $promise.promise();

        };

        /**
         * @see sap.ui.model.Model.prototype.bindProperty
         * @returns {sap.ui.model.json.JSONPropertyBinding} the new binding
         */
        UISModel.prototype.bindProperty = function () {
            var aArguments = Array.prototype.slice.apply( arguments );
            aArguments = this.rewriteBinding.apply( this, aArguments );
            return BaseModel.prototype.bindProperty.apply( this, aArguments );
        };

        /**
         * @see sap.ui.model.Model.prototype.bindList
         * @returns {sap.ui.model.json.JSONListBinding} the new binding
         */
        UISModel.prototype.bindList = function () {
            var aArguments = Array.prototype.slice.apply( arguments );
            var aRewritten = this.rewriteBinding.apply( this, [aArguments[0], aArguments[1], aArguments[4]] );

            aArguments[0] = aRewritten[0];
            aArguments[1] = aRewritten[1];
            aArguments[4] = aRewritten[2];

            return BaseModel.prototype.bindList.apply( this, aArguments );
        };

        /**
         * changes the binding path for a new binding by replacing the service name with an alias and calls the service for data
         *
         * @see loadData
         * @see bindProperty
         * @see bindList
         * @param {string} sBindingPath  the original binding path
         * @param {object} [oContext]    optional context
         * @param {object} [mParameters] optional binding parameters
         * @private
         * @returns {array}  [sBindingPath, oContext, mParameters]
         */
        UISModel.prototype.rewriteBinding = function ( sBindingPath, oContext, mParameters ) {
            if ( sBindingPath.indexOf( ":" ) >= 0 ) {
                var aParts = sBindingPath.split( ":", 2 );
                var sFunctionName = aParts[0];
                var sPrefix = mParameters && mParameters.alias || this.createBindingAlias( sFunctionName );
                sBindingPath = "/" + sPrefix + aParts[1];
                var oParams = mParameters ? mParameters.parameters : undefined;
                var sMethod = mParameters ? mParameters.method : undefined;
                this.loadData( sFunctionName, oParams, sMethod, sPrefix );
            }

            return [sBindingPath, oContext, mParameters];
        };

        /**
         * creates a (semi) random binding alisa for a given service name
         * @param {string} sFunctionName name of the service (URL)
         * @returns {string} the new alias
         * @private
         */
        UISModel.prototype.createBindingAlias = function ( sFunctionName ) {
            var sRandom = Math.random() * 10e8 >> 0;

            return (sFunctionName + "_" + sRandom).replace( "/", "_" ).replace( ".", "_" );
        };

        /**
         * sends a request or puts it in the request queueu
         *
         * @param {object}          oRequest request parameters
         * @param {jQuery.Deferred} $promise request promise
         * @returns {jQuery.Deferred} requet promise
         * @private
         */
        UISModel.prototype.sendRequest = function ( oRequest, $promise ) {

            if ( !$promise ) {
                $promise = new jQuery.Deferred();
            }

            if ( this._waitingForToken ) {
                this._requestQueue.push( [oRequest, $promise] );
                return $promise;
            }

            var that = this;
            jQuery.ajax( oRequest )
                .done( $promise.resolve.bind( $promise ) )
                .fail( function ( xhr ) {
                    var sToken = xhr.getResponseHeader( "x-csrf-token" );
                    sToken = sToken && sToken.toLowerCase();
                    if ( xhr.status === 403 && sToken === "required" ) {
                        that.updateCsrfToken( oRequest._params.name );
                        that.sendRequest( oRequest, $promise );
                    } else {
                        $promise.reject( xhr );
                    }
                } );

            return $promise;

        };

        /**
         * creates settings for a request object
         *
         * @private
         * @param {string} sUrl        URL to the RFC Service
         * @param {object} mParameters GET/POST Parameters
         * @param {string} sMethod     HTTP Method
         * @returns {object} Request parameters
         */
        UISModel.prototype.buildRequest = function ( sUrl, mParameters, sMethod ) {
            if ( !sMethod ) {
                sMethod = "POST";
            }
            sMethod = sMethod.toUpperCase();

            return {
                url:       this.sServiceUrl + "/" + sUrl,
                type:      sMethod,
                username:  this.sUser,
                password:  this.sPassword,
                headers:   this.mHeaders,
                data:      mParameters,
                xhrFields: {
                    withCredentials: true
                },
                _params:   {
                    name: sUrl
                }
            };
        };

        /**
         * re-triggers all queued requests
         *
         * @private
         * @returns {void}
         */
        UISModel.prototype.runQueue = function () {

            var aQueue = this._requestQueue.slice();
            this._requestQueue = [];

            while ( aQueue.length > 0 ) {
                var aArguments = aQueue.pop();
                this.sendRequest.apply( this, aArguments );
            }
        };

        /**
         * refetches the csrf token and resumes all failed requests on success
         *
         * @private
         * @param {string} sName service name to fetch the token from
         * @returns {void}
         */
        UISModel.prototype.updateCsrfToken = function ( sName ) {

            if ( this.sTokenEndpoint !== "FUNCTION" ) {
                sName = this.sTokenEndpoint;
            }

            if ( this._waitingForToken ) {
                return;
            }
            this._waitingForToken = true;
            this.mHeaders["x-csrf-token"] = "Fetch";
            var that = this;
            var oRequest = this.buildRequest( sName, undefined, "GET" );

            jQuery.ajax( oRequest )
                .done( function ( body, result, xhr ) {
                    that.mHeaders["x-csrf-token"] = xhr.getResponseHeader( "x-csrf-token" );
                    that._waitingForToken = false;
                    that.runQueue();
                } )
                .fail( function () {
                    jQuery.sap.log.fatal( "Error fetching CSRF-Token." );
                    that._waitingForToken = false;
                } );
        };

        return UISModel;
    },
    true
);