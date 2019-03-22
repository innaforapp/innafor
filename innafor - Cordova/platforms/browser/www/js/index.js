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
<<<<<<< HEAD
                    path: '/si-ifra-fontpage/',
                    id: 'si-ifra-frontpage',
                    url: 'pages/Members/si-ifra-frontpage.html'
=======
                    path: '#',
                    id: 'tab-2',
                    url: '#'
>>>>>>> 4bf2d5949f166bb8b20661208ca8bbdfafaf1613
            },
            
            // Third tab
                {
                    path: '/more/',
                    id: 'more',
                    url: 'pages/more/more.html'
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
            name: 'suport',
            path: '/suport/',
            url: 'pages/more/suport.html'
        },
        {
            name: 'si-ifra-frontpage',
            path: '/si-ifra-frontpage/',
            url: 'pages/Members/si-ifra-frontpage.html'
        },
        {
            name: 'si-ifra-surway',
            path: '/si-ifra-surway/',
            url: 'pages/Members/si-ifra-surway.html'
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
            name: 'tabsMembers'
        });
    },

    // Update DOM on a Received Event
    receivedEvent: function (id) {


    }
};

appCordova.initialize();

//Hjelpefunksjoner======================
function getId(id) {
    return document.getElementById(id);
}

//server URL

//let url = "https://innaforapp.no/webserver"
let url = "https://innafor-test04.herokuapp.com/"
//let url = "http://localhost:5000"

function sendData(data, endpoint) {
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
    console.log(data);
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
        let msg = getId(feedbackMsg);
        if (feedbackMsg) {
            msg.innerHTML = res.feedback
        }
        appF7.dialog.alert(res.feedback);
    };

};

var $$ = Dom7;

// si i fra survay
$$(document).on('tab:init', '.tab[id="si-ifra-frontpage"]', function (e) {
  let test = getId("si-ifra-cont");
 console.log(test);
}) ;

//Når en side åpnes så kjører denne. I dette tilgelle about siden
$$(document).on('page:init', '.page[data-name="si-ifra-survay"]', function (e) {
    init();
});
