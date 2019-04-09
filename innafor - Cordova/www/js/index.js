let appF7 = new Framework7({
    // App root element
    root: '#app',
    // App Name
    name: 'Innafor',
    // App id
    id: 'com.myapp.test',
    // Enable swipe panel
    panel: {
        swipe: 'left',
    },

    swipeout: {
        noFollow: true,
        removeElements: true
    },
    // Add default routes
    routes: [
        {
            name: `login`,
            path: '/login-screen/',
            url: 'pages/login.html'
      },
        {
            name: 'tabsMembers',
            // Page main route
            path: '/tabsMembers/',
            // Will load page from tabs/index.html file
            url: './pages/Members/tabsMembers.html',
            // Pass "tabs" property to route, must be array with tab routes:
            tabs: [
            // First (default) tab has the same url as the page itself
                {
                    // Tab path
                    path: '/',
                    // Tab id
                    id: 'tab-1',
                    url: 'pages/Members/mainPageMembers.html'
            },
            // Second tab
                {
                    path: '/tab-2/',
                    id: 'tab-2',
                    url: 'pages/Members/siIfraMembers.html'
            },

            // Third tab
                {
                    path: '/more/',
                    id: 'more',
                    url: 'pages/more/more.html'
            },
                {
                    path: '/getInTouch/',
                    id: 'getInTouch',
                    url: 'pages/Members/getInTouch.html'
            },
                {
                    path: '/siIfraFrontpage/',
                    id: 'siIfraFrontpage',
                    url: 'pages/Members/siIfraFrontpage.html'
            },
                {
                    path: '/chat/',
                    id: 'chat',
                    url: 'pages/Members/chat.html'
            },
          ],
        },
        {
            name: 'tabsAdmin',
            path: '/tabsAdmin/',
            url: './pages/Admin/tabsAdmin.html',
            tabs: [
                {
                    path: '/',
                    id: 'mainPageAdmin',
                    url: 'pages/Admin/mainPageAdmin.html'
            },
                {
                    path: '/registerOrg/',
                    id: 'registerOrg',
                    url: 'pages/Admin/registerOrg.html'
            },
                {
                    path: '/questionBank/',
                    id: 'questionBank',
                    url: 'pages/Admin/questions.html'
            },
                {
                    path: '/more/',
                    id: 'more',
                    url: 'pages/more/more.html'
            },
          ],
        },
        {
            name: 'tabsOrg',
            path: '/tabsOrg/',
            url: './pages/Organisation/tabsOrg.html',
            tabs: [
                {
                    path: '/',
                    id: 'mainPageOrg',
                    url: 'pages/Organisation/mainPageOrg.html'
            },
                {
                    path: '/registerLeader/',
                    id: 'registerLeader',
                    url: 'pages/Organisation/registerLeader.html'
            },
                {
                    path: '/resultsOrg/',
                    id: 'resultsOrg',
                    url: 'pages/Organisation/resultsOrg.html'
            },
                {
                    path: '/more/',
                    id: 'more',
                    url: 'pages/more/more.html'
            },
          ],
        },
        {
            name: 'tabsLeader',
            path: '/tabsLeader/',
            url: './pages/Leader/tabsLeader.html',
            tabs: [
                {
                    path: '/',
                    id: 'mainPageLeader',
                    url: 'pages/Leader/mainPageLeader.html'
                 },
                {
                    path: 'registerMember/',
                    id: 'registerMember',
                    url: 'pages/Leader/registerMember.html'
            },
                {
                    path: '/resultsLeaderMenu/',
                    id: 'resultsLeaderMenu',
                    url: 'pages/Leader/resultsLeaderMenu.html'
            },
                {
                    path: '/feed',
                    id: 'leaderFeed',
                    url: 'pages/Leader/feed.html'
             },
                {
                    path: '/more/',
                    id: 'more',
                    url: 'pages/more/more.html'
            },
          ],
        },
        {
            name: 'about',
            path: '/about/',
            url: 'pages/more/about.html'
        },
        {
            name: 'privacy',
            path: '/privacy/',
            url: 'pages/more/privacy.html'
        },
        {
            name: 'report',
            path: '/report/',
            url: 'pages/more/report.html'
        },
        {
            name: 'mypage',
            path: '/mypage/',
            url: 'pages/more/mypage.html'
        },
        {
            name: 'support',
            path: '/support/',
            url: 'pages/more/support.html'
        },
        {
            name: 'si-ifra-survay',
            path: '/si-ifra-survay/',
            url: 'pages/Members/si-ifra-survay.html'
        },
        {
            name: 'create-survay',
            path: '/create-survay/',
            url: 'pages/Leader/create-survay.html'
        },
        {
            name: 'resultsLeader',
            path: '/resultsLeader/',
            url: 'pages/Leader/resultsLeader.html'
        }
      ]
});

let mainView = appF7.views.create('.view-main');

let appCordova = {
    // Application Constructor
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function () {
        //  this.receivedEvent('deviceready');
        navigator.splashscreen.hide();
        mainView.router.navigate({
            name: 'tabsAdmin'
        });
    },

    /*   // Update DOM on a Received Event
       receivedEvent: function (id) {


       }*/
};

appCordova.initialize();

//Hjelpefunksjoner======================
function getId(id) {
    return document.getElementById(id);
}

function getCurrentIndex(target) {
    let getNr = target.match(/\d+/g).map(Number);
    return parseInt(getNr);
}


//let url = "https://innaforapp.no"
let url = "http://localhost:3000"

function sendData(data, endpoint) {

    console.log(data, endpoint);
    return fetch(url + endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "x-access-auth": localStorage.getItem("token")
        },
        body: JSON.stringify(data)
    }).then(data => {
        return data;
    });
};

function getData(endpoint) {
    console.log(url + endpoint)
    return fetch((url + endpoint), {
        method: "GET",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "x-access-auth": localStorage.getItem("token")
        }
    });
};

async function updateUser(value, column, endpoint) {

    let data = {
        'column': column,
        'value': value
    }
    console.log(data, endpoint);

    return fetch(url + endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "x-access-auth": localStorage.getItem("token")
        },
        body: JSON.stringify(data)
    }).then(async function (data) {

        if (data.status === 200) {
            res = await data.json();

            if (res.token) {
                localStorage.setItem("token", res.token);
                localStorage.setItem("firstname", res.firstname);
                localStorage.setItem("email", res.email);
            };

            showCurrentEmail(res.email);

            appF7.dialog.alert(res.msg, 'Endre e-post');

        } else {
            res = await res.json();
            appF7.dialog.alert(res.msg, 'Noe gikk galt');
        };


    });
}

async function updatePassword(password, endpoint) {

    let data = {
        'password': password,
    }
    console.log(data, endpoint);

    return fetch(url + endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "x-access-auth": localStorage.getItem("token")
        },
        body: JSON.stringify(data)
    }).then(async function (data) {

        if (data.status === 200) {
            res = await data.json();

            appF7.dialog.alert(res.msg, 'Endre passord');

        } else {
            res = await res.json();
            appF7.dialog.alert(res.msg, 'Noe gikk galt');
        };


    });
}

async function checkPassword(password, endpoint) {
    let data = {
        'password': password,
        'email': window.localStorage.getItem('email')
    }
    console.log(data, endpoint);

    return fetch(url + endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "x-access-auth": localStorage.getItem("token")
        },
        body: JSON.stringify(data)
    }).then(async function (data) {

        if (data.status === 200) {
            res = await data.json();

            appF7.dialog.password('Skriv nytt passord',
                'Endre passord',
                function (password) {
                    updatePassword(password, `/app/brukere/update/password`);
                });

        } else {
            res = await data.json();
            appF7.dialog.alert(res.msg, 'Noe gikk galt');
        };


    });
};

//=====================================

//Send in ID til form, endpoint, og ID på tekstfelt som skal skrive ut feedback
async function sendForm(formId, endpoint, feedbackMsg) {

    let form = getId(formId);
    let data = {};

    if (localStorage.getItem("token")) {
        data["token"] = localStorage.getItem("token");
    };
    for (i = 0; i < form.length; i++) {
        data[form.elements[i].name] = form.elements[i].value;
    };
    let res = await sendData(data, endpoint);

    if (res.status === 200) {
        res = await res.json();

        if (res.token) {
            localStorage.setItem("token", res.token);
            localStorage.setItem("firstname", res.firstname);
            localStorage.setItem("email", res.email);
        };

        if (res.event) {
            let event = eval(res.event);
        };

    } else {
        res = await res.json();
        appF7.dialog.alert(res.feedback);
    };
};

var $$ = Dom7;

// si i fra survay - frontpage
$$(document).on('tab:init', '.tab[id="si-ifra-frontpage"]', function (e) {
    let test = getId("si-ifra-cont");
    console.log(test);
});

//MEMBER page event Si ifra
//Når en side åpnes så kjører denne. I dette tilfelle about siden
/*
$$(document).on('page:init', '.page[data-name="si-ifra-survay"]', function (e) {
    init();
});
*/

//feed-leader
$$(document).on('tab:init', '.tab[id="leaderFeed"]', function (e) {
    feedPage();
});

//Kjøres hver gang man skifter side/tab
$$(document).on('page:afterin', function (e) {
    onTabOpen();
});

//Kjøres når hjem-side åpnes
$$(document).on('tab:init', '.tab[data-name="home"]', function (e) {
    welcome();
});

//MEMBER page event åpne iFrame
$$(document).on('tab:init', '.tab[data-name="chat"]', function (e) {
    console.log('kjører script for page CHAT');
    iframe();
});

//Kjøres når min side åpnes
$$(document).on('page:afterin', '.page[data-name="resultsLeader"]', function (e) {
    createChart();
});

//Kjøres når min side åpnes
$$(document).on('page:afterin', '.page[data-name="mypage"]', function (e) {
    //Legg til current epost på liste
    showCurrentEmail();

    //Endre e-post
    $$('.open-prompt').on(
        'click',
        function () {
            appF7.dialog.prompt(
                'Skriv inn ny e-postadresse',
                'Endre e-post',
                function (email) {
                    appF7.dialog.confirm(
                        'Ønsker du å endre e-postadresse til ' + email + '?',
                        'Endre e-post',
                        function () {
                            updateUser(email, 'epost', `/app/brukere/update/email`);
                        });
                });
        });

    //Endre passord
    $$('.open-password').on(
        'click',
        function () {
            appF7.dialog.password(
                'Skriv inn gammelt passord',
                'Endre passord',
                function (password) {
                    checkPassword(password, `/app/brukere/checkPassword`);
                });
        });
});







//Kjøres når siden bli kontaktet åpnes
$$(document).on('tab:init', '.tab[id="getInTouch"]', function (e) {
    //Legger til onclick på "bli kontaktet"-knapp
    $$('.open-confirm').on(
        'click',
        function () {
            appF7.dialog.confirm(
                'Jeg vil at trener skal kontakte meg for en prat.',
                'Vennligst bekreft',
                function () {
                    appF7.dialog.alert(
                        'Treneren din har fått beskjed.',
                        'Melding sendt');
                },
                function () {
                    appF7.dialog.alert(
                        'Det går fint. Det er lov å ombestemme seg.',
                        'Handling avbrutt');
                });
        });
});

//Overlay som sier ifra at bruker er registrert 
var toatsUserRegister = appF7.toast.create({
    icon: app.theme === 'ios' ? '<i class="f7-icons">star</i>' : '<i class="material-icons">star</i>',
    text: 'Bruker registrert, passord er sendt på epost',
    position: 'center',
    closeTimeout: 2000,
});

//Overlay som sier ifra at spørsmål er lagt til
var toastQuestionAdded = appF7.toast.create({
    icon: app.theme === 'ios' ? '<i class="f7-icons">star</i>' : '<i class="material-icons">star</i>',
    text: 'Spørsmål er lagt til',
    position: 'center',
    closeTimeout: 2000,
});
