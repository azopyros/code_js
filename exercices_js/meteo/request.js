function Request(config) {
    // Request URL
    this.url          = null ;
    // Request method
    this.method       = 'get' ;
    // Response mime type
    this.handleAs     = 'text' ;
    // Asynchronous request ?
    this.asynchronous = true ;
    // Request parameters
    this.parameters   = {} ;
    // AJAX transport (xmlHttpRequest object)
    this.transport    = null ;
    // On success callback
    this.onSuccess    = function() {console.log(arguments);} ;
    // On error callback
    this.onError      = function() {console.log(arguments);} ;
    // Cancel request method
    this.cancel       = function() {
        if (this.transport != null) {
            this.onError   = function() {} ;
            this.onSuccess = function() {} ;
            this.transport.abort() ;
        }
    } ;

    // Check config values
    if (typeof config != "object") {
        throw 'Request parameter should be an object' ;
    }

    // Check request URL parameter
    if (!config.url) {
        throw 'Request URL needed' ;
    }
    this.url = config.url ;

    // Check request method parameter
    if (config.method) {
        if(typeof config.method === "string") {
            var method = config.method.toLowerCase() ;
            if (method === "get" || method === "post")
                this.method = method ;
            else
                throw "'" + config.method + "' method not supported" ;
        }
        else {
            throw "'method' parameter should be a string" ;
        }
    }

    // Check request asynchrounous mode parameter
    if (config.asynchronous) {
        if (typeof config.asynchronous === "boolean") {
            this.asynchronous = config.asynchronous ;
        }
        else {
            throw "'asynchronous' parameter should be a boolean" ;
        }
    }

    // Check request parameters parameter
    if (config.parameters) {
        if (config.parameters instanceof Object) {
            this.parameters = config.parameters ;
        }
        else {
            throw "'parameters' parameter should be a object" ;
        }
    }

    // Check on success callback parameter
    if (config.onSuccess) {
        if (config.onSuccess instanceof Function) {
            this.onSuccess = config.onSuccess ;
        }
        else {
            throw "'onSuccess' parameter should be a function" ;
        }
    }

    // Check on error callback parameter
    if (config.onError) {
        if (config.onError instanceof Function) {
            this.onError = config.onError ;
        }
        else {
            throw "'onError' parameter should be a function" ;
        }
    }

    // Check response mime type parameter
    if (config.handleAs) {
        if (typeof config.handleAs === 'string') {
            var handleAs = config.handleAs.toLowerCase() ;
            if (['text', 'json', 'xml'].indexOf(handleAs) !== -1) {
                this.handleAs = handleAs ;
            }
            else {
                throw "handleAs format '" + config.handleAs + "' not supported" ;
            }
        }
        else {
            throw "handleAs parameter should be a string" ;
        }
    }

    // Build transport
    this.transport = GetXmlHttpObject() ;
    // Build response callback function
    // Closure for this
    var RequestThis = this ;
    this.transport.onreadystatechange = function() {
        // On complete
		if(RequestThis.transport.readyState == 4){
            // On success result
			if(RequestThis.transport.status === 200){
                try {
                    // Check response expected mime type
                    // Launch onSuccess callback with result parameter
					switch(RequestThis.handleAs){
						case "text" :RequestThis.onSuccess(RequestThis.transport.responseText);
						break;
						case "json" :RequestThis.onSuccess(JSON.parse(RequestThis.transport.responseText));
						break;
						case "xml" :RequestThis.onSuccess(RequestThis.transport.responseXML);
						break;
						default : throw "Erreur "+RequestThis.handleAs;
					}
                }
                catch (e) {
                    // Something went wrong with response mime type
                    throw "Error while processing '" + RequestThis.handleAs + "' result : " + e ;
                }
            }
            else {
                // Response code != 200 => error
				RequestThis.onError(RequestThis.transport.status,RequestThis.transport.responseText);
            }
        }
    }

    // Build parameters string
    var parameters = new Array() ;
    // Iterate on parameters
    for (var i in this.parameters) {
        // Escape parameters with encodeURIComponent()
		parameters.push(i+"="+encodeURIComponent(this.parameters[i]));
    }
    // Join escaped parameters with '&'
    var parametersString = parameters.join('&') ;
    if (this.method === 'get') {
    // Request method is 'get'		
        // Open transport
		this.transport.open("get",this.url+"?"+parametersString,true);
        // Send request
		this.transport.send();
    }
    else {
    // Request method is 'post'
        // Open transport
		this.transport.open("post",this.url,true);
        // Set content type request header
		this.transport.setRequestHeader('Content-Type','application/x-www-form-urlencoded') ;
        // Send request with parameters
		this.transport.send(parametersString);
    }

    // Get XmlHttpRequest object
    function GetXmlHttpObject() {
        // XmlHttpRequest object
        var xmlHttp = null ;

        try {
            // Firefox, Opera 8.0+, Safari, IE 7+
            xmlHttp = new XMLHttpRequest();
        } catch (e) {
            // Internet Explorer - old IE - prior to version 7
            try {
                xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
            } catch (e) {
                try {
                    xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
                } catch (e) {
                    throw "XMLHTTPRequest object not supported" ;
                }
            }
        }
        return xmlHttp ;
    }
}
