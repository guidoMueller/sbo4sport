/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.control, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides control sap.zen.dsh.dsh.
jQuery.sap.declare("sap.zen.dsh.dsh");
jQuery.sap.require("sap.zen.dsh.library");
jQuery.sap.require("sap.ui.core.Control");


/**
 * Constructor for a new dsh.
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
 * <ul>
 * <li>{@link #getDshAppName dshAppName} : string</li>
 * <li>{@link #getDshBaseUrl dshBaseUrl} : sap.ui.core.URI</li>
 * <li>{@link #getDshBaseAppUrl dshBaseAppUrl} : sap.ui.core.URI</li>
 * <li>{@link #getDshBaseAppUrl2 dshBaseAppUrl2} : sap.ui.core.URI</li>
 * <li>{@link #getDshHost dshHost} : string</li>
 * <li>{@link #getDshPort dshPort} : string</li>
 * <li>{@link #getHanaAlias hanaAlias} : string</li>
 * <li>{@link #getWidth width} : sap.ui.core.CSSSize</li>
 * <li>{@link #getHeight height} : sap.ui.core.CSSSize</li>
 * <li>{@link #getEmbedded embedded} : boolean</li>
 * <li>{@link #getDeployment deployment} : string</li>
 * <li>{@link #getProtocol protocol} : string</li>
 * <li>{@link #getClient client} : string</li>
 * <li>{@link #getLanguage language} : string</li></ul>
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
 * @param {string} [sId] id for the new control, generated automatically if no id is given 
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * Add your documentation for the newdsh
 * @extends sap.ui.core.Control
 *
 * @author  
 * @version 14.0.1-SNAPSHOT
 *
 * @constructor   
 * @public
 * @name sap.zen.dsh.dsh
 */
sap.ui.core.Control.extend("sap.zen.dsh.dsh", { metadata : {

	// ---- object ----
	publicMethods : [
		// methods
		"addParameter", "executeScript", "getDataSource", "getComponent", "getPage"
	],

	// ---- control specific ----
	library : "sap.zen.dsh",
	properties : {
		"dshAppName" : {type : "string", group : "Misc", defaultValue : null},
		"dshBaseUrl" : {type : "sap.ui.core.URI", group : "Misc", defaultValue : null},
		"dshBaseAppUrl" : {type : "sap.ui.core.URI", group : "Misc", defaultValue : null},
		"dshBaseAppUrl2" : {type : "sap.ui.core.URI", group : "Misc", defaultValue : null},
		"dshHost" : {type : "string", group : "Misc", defaultValue : null},
		"dshPort" : {type : "string", group : "Misc", defaultValue : null},
		"hanaAlias" : {type : "string", group : "Misc", defaultValue : null},
		"width" : {type : "sap.ui.core.CSSSize", group : "Misc", defaultValue : null},
		"height" : {type : "sap.ui.core.CSSSize", group : "Misc", defaultValue : null},
		"embedded" : {type : "boolean", group : "Misc", defaultValue : null},
		"deployment" : {type : "string", group : "Misc", defaultValue : null},
		"protocol" : {type : "string", group : "Misc", defaultValue : null},
		"client" : {type : "string", group : "Misc", defaultValue : null},
		"language" : {type : "string", group : "Misc", defaultValue : null}
	}
}});


/**
 * Creates a new subclass of class sap.zen.dsh.dsh with name <code>sClassName</code> 
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
 * @name sap.zen.dsh.dsh.extend
 * @function
 */


/**
 * Getter for property <code>dshAppName</code>.
 * 
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>dshAppName</code>
 * @public
 * @name sap.zen.dsh.dsh#getDshAppName
 * @function
 */

/**
 * Setter for property <code>dshAppName</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sDshAppName  new value for property <code>dshAppName</code>
 * @return {sap.zen.dsh.dsh} <code>this</code> to allow method chaining
 * @public
 * @name sap.zen.dsh.dsh#setDshAppName
 * @function
 */


/**
 * Getter for property <code>dshBaseUrl</code>.
 * 
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {sap.ui.core.URI} the value of property <code>dshBaseUrl</code>
 * @public
 * @name sap.zen.dsh.dsh#getDshBaseUrl
 * @function
 */

/**
 * Setter for property <code>dshBaseUrl</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {sap.ui.core.URI} sDshBaseUrl  new value for property <code>dshBaseUrl</code>
 * @return {sap.zen.dsh.dsh} <code>this</code> to allow method chaining
 * @public
 * @name sap.zen.dsh.dsh#setDshBaseUrl
 * @function
 */


/**
 * Getter for property <code>dshBaseAppUrl</code>.
 * 
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {sap.ui.core.URI} the value of property <code>dshBaseAppUrl</code>
 * @public
 * @name sap.zen.dsh.dsh#getDshBaseAppUrl
 * @function
 */

/**
 * Setter for property <code>dshBaseAppUrl</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {sap.ui.core.URI} sDshBaseAppUrl  new value for property <code>dshBaseAppUrl</code>
 * @return {sap.zen.dsh.dsh} <code>this</code> to allow method chaining
 * @public
 * @name sap.zen.dsh.dsh#setDshBaseAppUrl
 * @function
 */


/**
 * Getter for property <code>dshBaseAppUrl2</code>.
 * 
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {sap.ui.core.URI} the value of property <code>dshBaseAppUrl2</code>
 * @public
 * @name sap.zen.dsh.dsh#getDshBaseAppUrl2
 * @function
 */

/**
 * Setter for property <code>dshBaseAppUrl2</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {sap.ui.core.URI} sDshBaseAppUrl2  new value for property <code>dshBaseAppUrl2</code>
 * @return {sap.zen.dsh.dsh} <code>this</code> to allow method chaining
 * @public
 * @name sap.zen.dsh.dsh#setDshBaseAppUrl2
 * @function
 */


/**
 * Getter for property <code>dshHost</code>.
 * 
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>dshHost</code>
 * @public
 * @name sap.zen.dsh.dsh#getDshHost
 * @function
 */

/**
 * Setter for property <code>dshHost</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sDshHost  new value for property <code>dshHost</code>
 * @return {sap.zen.dsh.dsh} <code>this</code> to allow method chaining
 * @public
 * @name sap.zen.dsh.dsh#setDshHost
 * @function
 */


/**
 * Getter for property <code>dshPort</code>.
 * 
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>dshPort</code>
 * @public
 * @name sap.zen.dsh.dsh#getDshPort
 * @function
 */

/**
 * Setter for property <code>dshPort</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sDshPort  new value for property <code>dshPort</code>
 * @return {sap.zen.dsh.dsh} <code>this</code> to allow method chaining
 * @public
 * @name sap.zen.dsh.dsh#setDshPort
 * @function
 */


/**
 * Getter for property <code>hanaAlias</code>.
 * 
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>hanaAlias</code>
 * @public
 * @name sap.zen.dsh.dsh#getHanaAlias
 * @function
 */

/**
 * Setter for property <code>hanaAlias</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sHanaAlias  new value for property <code>hanaAlias</code>
 * @return {sap.zen.dsh.dsh} <code>this</code> to allow method chaining
 * @public
 * @name sap.zen.dsh.dsh#setHanaAlias
 * @function
 */


/**
 * Getter for property <code>width</code>.
 * 
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {sap.ui.core.CSSSize} the value of property <code>width</code>
 * @public
 * @name sap.zen.dsh.dsh#getWidth
 * @function
 */

/**
 * Setter for property <code>width</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {sap.ui.core.CSSSize} sWidth  new value for property <code>width</code>
 * @return {sap.zen.dsh.dsh} <code>this</code> to allow method chaining
 * @public
 * @name sap.zen.dsh.dsh#setWidth
 * @function
 */


/**
 * Getter for property <code>height</code>.
 * 
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {sap.ui.core.CSSSize} the value of property <code>height</code>
 * @public
 * @name sap.zen.dsh.dsh#getHeight
 * @function
 */

/**
 * Setter for property <code>height</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {sap.ui.core.CSSSize} sHeight  new value for property <code>height</code>
 * @return {sap.zen.dsh.dsh} <code>this</code> to allow method chaining
 * @public
 * @name sap.zen.dsh.dsh#setHeight
 * @function
 */


/**
 * Getter for property <code>embedded</code>.
 * 
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {boolean} the value of property <code>embedded</code>
 * @public
 * @name sap.zen.dsh.dsh#getEmbedded
 * @function
 */

/**
 * Setter for property <code>embedded</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {boolean} bEmbedded  new value for property <code>embedded</code>
 * @return {sap.zen.dsh.dsh} <code>this</code> to allow method chaining
 * @public
 * @name sap.zen.dsh.dsh#setEmbedded
 * @function
 */


/**
 * Getter for property <code>deployment</code>.
 * 
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>deployment</code>
 * @public
 * @name sap.zen.dsh.dsh#getDeployment
 * @function
 */

/**
 * Setter for property <code>deployment</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sDeployment  new value for property <code>deployment</code>
 * @return {sap.zen.dsh.dsh} <code>this</code> to allow method chaining
 * @public
 * @name sap.zen.dsh.dsh#setDeployment
 * @function
 */


/**
 * Getter for property <code>protocol</code>.
 * 
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>protocol</code>
 * @public
 * @name sap.zen.dsh.dsh#getProtocol
 * @function
 */

/**
 * Setter for property <code>protocol</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sProtocol  new value for property <code>protocol</code>
 * @return {sap.zen.dsh.dsh} <code>this</code> to allow method chaining
 * @public
 * @name sap.zen.dsh.dsh#setProtocol
 * @function
 */


/**
 * Getter for property <code>client</code>.
 * 
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>client</code>
 * @public
 * @name sap.zen.dsh.dsh#getClient
 * @function
 */

/**
 * Setter for property <code>client</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sClient  new value for property <code>client</code>
 * @return {sap.zen.dsh.dsh} <code>this</code> to allow method chaining
 * @public
 * @name sap.zen.dsh.dsh#setClient
 * @function
 */


/**
 * Getter for property <code>language</code>.
 * 
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>language</code>
 * @public
 * @name sap.zen.dsh.dsh#getLanguage
 * @function
 */

/**
 * Setter for property <code>language</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sLanguage  new value for property <code>language</code>
 * @return {sap.zen.dsh.dsh} <code>this</code> to allow method chaining
 * @public
 * @name sap.zen.dsh.dsh#setLanguage
 * @function
 */


/**
 * 
 *
 * @name sap.zen.dsh.dsh.prototype.addParameter
 * @function
 * @param {string} 
 *         sName
 *         
 * @param {string} 
 *         sValue
 *         

 * @type string
 * @public
 */


/**
 * 
 *
 * @name sap.zen.dsh.dsh.prototype.executeScript
 * @function
 * @param {string} 
 *         sScript
 *         

 * @type void
 * @public
 */


/**
 * 
 *
 * @name sap.zen.dsh.dsh.prototype.getDataSource
 * @function
 * @param {string} 
 *         sName
 *         

 * @type object
 * @public
 */


/**
 * 
 *
 * @name sap.zen.dsh.dsh.prototype.getComponent
 * @function
 * @param {string} 
 *         sName
 *         

 * @type object
 * @public
 */


/**
 * 
 *
 * @name sap.zen.dsh.dsh.prototype.getPage
 * @function

 * @type object
 * @public
 */


// Start of sap\zen\dsh\dsh.js
jQuery.sap.require("sap.zen.crosstab.Crosstab");

/**
 * This file defines behavior for the control,
 */

sap.zen.dsh.dsh.prototype.init = function() {
	this.initial = true;
	this.parameters = {};
	this.defaultDshBaseUrlHana = "/sap/bi/aas/rt";
	this.defaultDshBaseAppUrlHana = "/designstudio";
	this.defaultDshBaseAppUrlBW = "/sap/bw/Mime";
	this.defaultDshBaseUrlBW = "/sap/bw/Mime/TEMP_TEST";
};

sap.zen.dsh.dsh.prototype.doInit = function() {

	var that = this;
	
	if(sap.zen.dsh.scriptLoaded){
		that.doIt();
	} else {
		var rootUrl = "";
		
		var deployment = that.getDeployment();
		if((deployment==null) || (deployment.length==0)){
			deployment = "hana";
		}
		
		if(deployment=="hana"){
			rootUrl = this.defaultDshBaseUrlHana;
		} else if(deployment=="bw"){
			rootUrl = this.defaultDshBaseUrlBW;
		}		
		
		if(this.getDshBaseUrl().length > 0){
			rootUrl = this.getDshBaseUrl();
		}

		$.ajax({
			  url: rootUrl+"/all.js",
			  dataType: 'script',
			  async: false,
			  cache: true
			})
			.done(function() {
				that.doIt()
				})
			.fail(function(jqXHR, textStatus, errorThrown) {
				alert("error");
				});
	}
	
};


sap.zen.dsh.dsh.prototype.doIt = function() {
	
	sap.zen.dsh.scriptLoaded= true; 
	
	var that = this;
	{
		var language = that.getLanguage();
		if(language == ""){
			language = navigator.language;
		} 

		var client = that.getClient();
		if(client == ""){
			var cookies = document.cookie.split("&");
			for(var i=0; i<cookies.length;i++){
				var cookie = cookies[i];
				if(cookie.indexOf("sap-client")==0){
					 client = cookie.substring(11);
					 break;
				}
			}		
		} 
		
		var protocol = that.getProtocol();
		if(protocol == ""){
			if(window.location.protocol.indexOf("https") != -1){
				protocol = "https";
			} else {
				protocol = "http";
			}
		}

		var deployment = that.getDeployment();
		if((deployment==null) || (deployment.length==0)){
			deployment = "hana";
		}

		var app = that.getDshAppName();

		document.title = " Design Studio App: " + app;

		var repoUrl = "";
		var runtimeUrl = "";

		if(deployment=="hana"){
			repoUrl = this.defaultDshBaseAppUrlHana;
			runtimeUrl = this.defaultDshBaseUrlHana;
		} else if(deployment=="bw"){
			repoUrl = this.defaultDshBaseAppUrlBW;
			runtimeUrl = this.defaultDshBaseUrlBW;
		}		

		if(this.getDshBaseUrl().length > 0){
			runtimeUrl = this.getDshBaseUrl();
		}
		
		var path = "";
		if(this.getDshBaseAppUrl().length > 0){
			repoUrl = this.getDshBaseAppUrl();
			path = repoUrl + "/" + app;
		} else if(this.getDshBaseAppUrl2().length > 0){
			repoUrl = this.getDshBaseAppUrl2();
			path = repoUrl + "/" + app + "/content.biapp?" +  new Date().getTime();
		} else {
			path = repoUrl + "/" + app + "/content.biapp?" +  new Date().getTime();
		}

		var urlParams= sap.firefly.XHashMapByString.create();
		for (var key in this.parameters) {
			urlParams.put(key, this.parameters[key]);
		}

//		var sdkLoader = new sap.zen.SDKLoader();
//		sdkLoader.setRelativePath("");

		var designStudio = new sap.zen.DesignStudio();
		designStudio.setHost(document.location.hostname);
		designStudio.setPort(document.location.port);
		designStudio.setProtocol(document.location.protocol.split(":")[0]);
		designStudio.setClient(client);
		designStudio.setLanguage(language);
		designStudio.setApplicationPath(repoUrl);
		designStudio.setApplicationName(app);			
		designStudio.setUrlParameter(urlParams);
		designStudio.setSdkLoaderPath("");
		designStudio.setHanaMode(true);
		designStudio.setDshControlId(that.getId())

		var page = designStudio.createPage();	
		
		window[that.getId()+"Buddha"] = page;
		
		jQuery(window).bind('beforeunload', function () {
			this.page.exec("APPLICATION.logoff()");
		});	
		
		var sapbi_page = sapbi_page || {};
		sapbi_page.staticMimeUrlPrefix = runtimeUrl +"/";
		sapbi_page.getParameter = function(){return "";};
		sapbi_MIMES_PIXEL = "";
		
		window.sapbi_page = sapbi_page;
		
		var theme = page.getApplicationPropertiesComponent().getTheme();
		if (!theme) {
			theme = "sap_platinum";
		}
//		sap.ui.getCore().applyTheme(theme);

		var customCSS = page.getApplicationPropertiesComponent().getCustomCSSName();
		if (customCSS) {
			var fileref = document.createElement('link');
			fileref.setAttribute("type", "text/css");
			fileref.setAttribute("rel", "stylesheet");
			fileref.setAttribute("href", page.getRelativePathToApp()
					+ customCSS);
			document.getElementsByTagName("head")[0].appendChild(fileref);
		}

		if(this.getEmbedded()==false){
			setTimeout(function() {
				page.executeInitialRendering();
			}, 1);
		}

	};
};

sap.zen.dsh.dsh.prototype.exit = function(){
	var doSomeThing = "";
};

sap.zen.dsh.dsh.prototype.addParameter = function(name, value) {
	this.parameters[name] = value;
};

sap.zen.dsh.dsh.prototype.executeScript = function(script){
	this.page.exec(script);
};

sap.zen.dsh.dsh.prototype.getDataSource = function(name){
	return this.page.getDataSource(name);
};

sap.zen.dsh.dsh.prototype.getComponent = function(name){
	return this.page.getComponent(name);
};

sap.zen.dsh.dsh.prototype.getPage = function(){
	return this.page;
};
