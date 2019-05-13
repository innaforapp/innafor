function iframe() {
    let btn = document.querySelector('#btnIframe');
    btn.onclick = function () {
        console.log('klikket på knapp');
        //addIframe();

    };


    // Create dynamic Popup
    let url = 'https://login.edialog24.com/chattemplate/SnakkOmMobbing_Main/index.html';
    
    var dynamicPopup = appF7.popup.create({
        content:
        '<div class="popup popup-tablet-fullscreen">' +
        '<div class="page">' +
        
            '<div class="navbar">' +
                '<div class="navbar-inner sliding">' +
                    '<div class="left">' +
                        '<a href="#" class="link popup-close">' +
                            '<i class="icon material-icons">close</i>' +
                            '<span class="ios-only">Lukk</span>' +
                        '</a>' +
                    '</div>' +
                    '<div class="title"></div>' +
                '</div>' +
            '</div>' +
        
            '<div class="page-content">' +
                '<div class="iframe-container">' +
                    `<iframe class="iframe" src="${url}" frameborder="0"></iframe>` +
                '</div>' +
            '</div>' +
        '<div class="tabbar-spacer"></div>' +
        '</div>' +
        '</div>',
        // Events
        on: {
            open: function (popup) {
                console.log('Popup open');
            },
            opened: function (popup) {
                console.log('Popup opened');
            },
        }
    });
    // Events also can be assigned on instance later
    dynamicPopup.on('close', function (popup) {
        console.log('Popup close');
    });
    dynamicPopup.on('closed', function (popup) {
        console.log('Popup closed');
    });

    // Open dynamic popup
    $$('.dynamic-popup').on('click', function () {
        dynamicPopup.open();
    });




}



function showBrowser(url) {

    var target = "_blank";

    var options = "location=yes,presentationstyle=pagesheet";

    cordova.InAppBrowser.open(url, target, options);
}

function addIframe() {
    let url = 'https://login.edialog24.com/chattemplate/SnakkOmMobbing_Main/index.html';

    let html = `<iframe src="${url}" height="100%" width="100%" frameborder="0"></iframe>`;
    console.log(html);

    let container = document.querySelector('.iframe-container');

    container.innerHTML = html;
}
