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
                    path: '/questions/',
                    id: 'questions',
                    content: `
                <div class="block">
                  <h3>Tab 2</h3>
                  <p>...</p>
                </div>
              `
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
              path: '/questions/',
              id: 'questions',
              content: `
                <div class="block">
                  <h3>Tab 2</h3>
                  <p>...</p>
                </div>
              `
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
            name: 'login'
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

//server URL

let url = "https://innaforapp.no"
//let url = "http://localhost:3000"

function sendData(data, endpoint) {
    console.log(data, endpoint);
    return fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(data)
    }).then(data => {
        return data;
    });
}

function getData(endpoint) {
    return fetch((url+endpoint), {
        method: "GET",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "x-access-auth": localStorage.getItem("token")
        }     
    });
}
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
    let res = await sendData(data, url + endpoint);

    if (res.status === 200) {
        res = await res.json();

        if (res.token) {
            localStorage.setItem("token", res.token);
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

// si i fra survay
$$(document).on('tab:init', '.tab[id="si-ifra-frontpage"]', function (e) {
  let test = getId("si-ifra-cont");
 console.log(test);
});

//Når en side åpnes så kjører denne. I dette tilgelle about siden
$$(document).on('page:init', '.page[data-name="si-ifra-survay"]', function (e) {
    init();
});

//ADMIN tabs event
$$(document).on('tab:init', '.tab[id="questionBank"]', function (e) {
    listOutQuestions()
  });

//MEMBER tab event Si ifra
$$(document).on('page:init', function (e) {
    onTabOpen();
  });



  $$(document).on('swipeout:deleted', function (e) {
    console.log(e.target.Id);
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