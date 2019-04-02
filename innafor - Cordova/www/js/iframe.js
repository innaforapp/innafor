function iframe() {
    let btn = document.querySelector('#btnIframe');
    btn.onclick = function() {
        console.log('klikket på knapp');
        showHelp('http://apache.org');

    };
    

    
    //let ref = cordova.InAppBrowser.open('http://apache.org', '_blank', 'location=yes,hidden=no');

}



var inAppBrowserRef;

function showHelp(url) {

    var target = "_blank";

    var options = "location=yes,hidden=yes,beforeload=yes";

    inAppBrowserRef = cordova.InAppBrowser.open(url, target, options);

    inAppBrowserRef.addEventListener('loadstart', loadStartCallBack);

    inAppBrowserRef.addEventListener('loadstop', loadStopCallBack);

    inAppBrowserRef.addEventListener('loaderror', loadErrorCallBack);

    inAppBrowserRef.addEventListener('beforeload', beforeloadCallBack);

    inAppBrowserRef.addEventListener('message', messageCallBack);
}

function loadStartCallBack() {


}

function loadStopCallBack() {

    if (inAppBrowserRef != undefined) {

        inAppBrowserRef.insertCSS({ code: "body{font-size: 25px;" });

        inAppBrowserRef.executeScript({ code: "\
            var message = 'this is the message';\
            var messageObj = {my_message: message};\
            var stringifiedMessageObj = JSON.stringify(messageObj);\
            webkit.messageHandlers.cordova_iab.postMessage(stringifiedMessageObj);"
        });


        inAppBrowserRef.show();
    }

}

function loadErrorCallBack(params) {


    var scriptErrorMesssage =
       "alert('Sorry we cannot open that page. Message from the server is : "
       + params.message + "');"

    inAppBrowserRef.executeScript({ code: scriptErrorMesssage }, executeScriptCallBack);

    inAppBrowserRef.close();

    inAppBrowserRef = undefined;

}

function executeScriptCallBack(params) {

    if (params[0] == null) {

    }

}

function beforeloadCallBack(params, callback) {

    if (params.url.startsWith("http://www.example.com/")) {

        // Load this URL in the inAppBrowser.
        callback(params.url);
    } else {

       
    }

}

function messageCallBack(params){
}
