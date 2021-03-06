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
            name: 'infoAboutBullying',
            path: '/infoAboutBullying/',
            url: 'pages/more/infoOmMobbing.html'
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
            name: 'create-survay',
            path: '/create-survay/',
            url: 'pages/Leader/create-survay.html'
        },
        {
            name: 'resultsLeader',
            path: '/resultsLeader/',
            url: 'pages/Leader/resultsLeader.html'
        },
        {
            name: 'si-ifra-survay',
            path: '/si-ifra-survay/',
            url: 'pages/Members/si-ifra-survay.html',
            on: {
                pageAfterOut: function (e, page) {
                    openedSurvey = {};
                },
            },
        },
        {
            name: 'myGroupsLeader',
            path: '/myGroupsLeader/',
            url: 'pages/Leader/myGroupsLeader.html'
        },
        {
            name: 'myGroupsOrg',
            path: '/myGroupsOrg/',
            url: 'pages/Organisation/myGroupsOrg.html'
        },
        {
            name: 'orgOverview',
            path: '/orgOverview/',
            url: 'pages/Admin/orgOverview.html'
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
    onDeviceReady: async function () {
        //  this.receivedEvent('deviceready');
        let autoLogin = await getData(`/app/brukere/autoLogin`);

        if (autoLogin.status == 200) {
            autoLogin = await autoLogin.json();
            eval(autoLogin.event)
            navigator.splashscreen.hide();
        } else {
            mainView.router.navigate({
                name: 'login'
            });
            navigator.splashscreen.hide();
        }




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

function isEmpty(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

function getSum(total, num) {
    return total + num;
  }


//let url = "https://innaforapp.no"
let url = "http://localhost:3000"

function sendData(data, endpoint) {
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
            localStorage.setItem("groups", res.groups);
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
});

//Kjøres hver gang man skifter side/tab
$$(document).on('page:afterin', function (e) {
    onTabOpen();
});

//Kjøres når hjem-side åpnes - leader
$$(document).on('tab:init', '.tab[data-name="homeLeader"]', function (e) {
    welcome();
    leaderFeed();
});

//Kjøres når hjem-side åpnes - org
$$(document).on('tab:init', '.tab[data-name="homeOrg"]', function (e) {
    welcome(); 
    orgFeed();
});

//Kjøres når hjem-side åpnes - member
$$(document).on('tab:init', '.tab[data-name="homeMembers"]', function (e) {
    welcome();
    memberFeed();
});

//MEMBER page event åpne iFrame
$$(document).on('tab:init', '.tab[data-name="chat"]', function (e) {
    iframe();
});

//Kjøres når min side åpnes
$$(document).on('page:afterin', '.page[data-name="resultsLeader"]', function (e) {
    createChart();
});

//Kjøres når ny registerMember åpnes
$$(document).on('tab:init', '.tab[data-name="registerMember"]', function (e) {
    initRegisterMember();
});

//Kjøres når ny gruppeoversikt åpnes
$$(document).on('page:afterin', '.page[data-name="myGroupsLeader"]', function (e) {
    initMyGroupsLeader();
});

$$(document).on('page:afterin', '.page[data-name="myGroupsOrg"]', function (e) {
    initMyGroupsOrg();
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

//Kjøres når siden "rapporter et problem" åpnes
$$(document).on('page:afterin', '.page[data-name="report"]', function (e) {

    //Endre e-post
    $$('.open-alert').on(
        'click',
        function () {
            appF7.dialog.alert(
                'Melding sendt',
                'Takk for henvendelsen!'
            );
        });

    mainView.router.navigate({
        name: 'more'
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
                async function () {
                    
                    appF7.dialog.alert(
                            'Treneren din har fått beskjed.',
                            'Melding sendt');
                    
                    let data = {
                        name: localStorage.getItem('firstname'),
                        group: localStorage.getItem('groups')
                    };

                    await sendData(data, `/app/support/sendMailtoLeader`);

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

//Overlay som sier ifra at bruker er lagt til 
var toatsUserAddToGrp = appF7.toast.create({
    icon: app.theme === 'ios' ? '<i class="f7-icons">star</i>' : '<i class="material-icons">star</i>',
    text: 'Bruker er lagt til gruppe',
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


//Overlay som sier ifra at spørsmål er lagt til
var toastSurvayCreated = appF7.toast.create({
    icon: app.theme === 'ios' ? '<i class="f7-icons">star</i>' : '<i class="material-icons">star</i>',
    text: 'Spørreundersøkelsen er oprettet',
    position: 'center',
    closeTimeout: 2000,
});
