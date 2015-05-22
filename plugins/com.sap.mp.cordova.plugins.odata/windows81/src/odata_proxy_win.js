var NULL_STRING = "%[NULL]%";
	/* Command proxy for Windows */
	/* TODO: define all OData and OfflineStore functions here */
	/* TODO: these methods calls native functions */
	module.exports = {
		//exec(win, error, 'OData', 'openOfflineStore', [this, options ? options : {}]);
		//config: function () {
		//	var uri = new Windows.Foundation.Uri("ms-appx:///config.xml");
		//	var config = null;
		//	Windows.Storage.StorageFile.getFileFromApplicationUriAsync(uri).then(function (file) {
		//		Windows.Storage.FileIO.readTextAsync(file).then(function (text) {
		//			config = JSON.parse(text);
		//		});
		//	});
		//	return config;
		//},
		openOfflineStore: function (success, fail, options) {
			console.log("Open offline store");
			
			SAP.ODataOffline.OfflineStore.openStore(function (s) {
				success(s);
			},
			function (e) {
				fail(e);
			},
			options[0].serviceUri, // required
			JSON.stringify(options)
			);
		},
		//exec(win, error, 'OData', 'close', [this.serviceUri]);  
		close: function (success, fail, args) {
			console.log("Close offline store");
			// Make a call to functions defined in the winmd project. 
			SAP.ODataOffline.OfflineStore.closeStore(
				function (s) {
					success(s);
				},
				function (error) {
					fail(JSON.parse(error));
				},
				args[0]
				);
		},
		/*
			* @param {Object} request.headers - Object that contains the headers as name value pairs.
			* @param {String} request.requestUri  - OData endpoint URI.
			* @param {String} request.method - HTTP method.
			* @param {Object} request.data - Payload of the request. 
		*/
		//exec(successCallback, errorCallback, 'OData', 'request', [request]);
		request: function (success, fail, request) {
			console.log("requesting from offline store");
			SAP.ODataOffline.OfflineStore.request(
				function (s) {
				    var result = JSON.parse(s);
				    if (result.body) {
				        if (result.body.substr(0, 20) != "--+++++batchresponse")
    				        result.body = JSON.parse(result.body);
				    }
					success(result);
				},
				function (error) {
					fail(JSON.parse(error));
				},
				JSON.stringify(request)
				);
		},
		refresh: function (success, fail, args) {
			console.log("refresh the offline store with subset");
			var subset = args[1];
			if (subset == null || subset === "undefined") {
				subset = NULL_STRING;
			}
			SAP.ODataOffline.OfflineStore.refreshStore(
				function (s) {
					success(s);
				},
				function (error) {
					fail(JSON.parse(error));
				},
				args[0],
				JSON.stringify(subset)
				);
		},
		clear: function (success, fail, name) {
			console.log("clear the offline store");
			SAP.ODataOffline.OfflineStore.clearStore(
				function (s) {
					success(s);
				},
				function (error) {
					fail(JSON.parse(error));
				},
				name
			);
		},
		flush: function (success, fail, args) {
			console.log("flush the offline store");
			SAP.ODataOffline.OfflineStore.flushStore(
				function (s) {
					success(s);
				},
				function (error) {
					fail(JSON.parse(error));
				},
				args[0]
			  );
		}
	};

	require("cordova/windows8/commandProxy").add("OData", module.exports);
