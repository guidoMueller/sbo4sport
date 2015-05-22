(function () {
    "use strict";
    /*global self*/
    //use a XHR to load any resource
    function loadResource(sUrl, fnSuccess, fnError) {
        var oXHR = new XMLHttpRequest();
        oXHR.open("GET", sUrl, true);
        oXHR.onreadystatechange = function () {
            if (this.readyState !== 4) {
                return; // not yet DONE
            }
            if (this.status === 200) {
                fnSuccess(oXHR.responseText);
            } else {
                fnError(oXHR.responseText);
            }
        };
        oXHR.send();
    }

    //general listener for messages to this Web Worker
    //any message sent to this Worker will get to this listener
    //this Worker can be extended to do more actions by extending the switch
    self.onmessage = function (oEvent) {
        if (oEvent.data.action) {
            switch (oEvent.data.action) {
            case 'loadResource':
                loadResource(oEvent.data.url,
                    function (response) {
                        self.postMessage(response);
                    },
                    function (message) {
                        self.postMessage({error: message});
                    }
                    );
                break;
            }
        }
    };
}());
