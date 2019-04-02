function iframe() {
    let btn = document.querySelector('#btnIframe');
    btn.onclick = function() {
        console.log('klikket på knapp');
        //showBrowser('http://snakkommobbing.no/');
        showBrowser('https://login.edialog24.com/chattemplate/SnakkOmMobbing_Main/index.html');

    };
    

    
    //let ref = cordova.InAppBrowser.open('http://apache.org', '_blank', 'location=yes,hidden=no');

}




function showBrowser(url) {
    
    var target = "_blank";

    var options = "location=yes";

    cordova.InAppBrowser.open(url, target, options);
}