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
                    path: '/si-ifra/',
                    id: 'si-ifra',
                    url: 'pages/Members/si-ifra.html'
            },
            // Third tab
                {
                    path: '/more/',
                    id: 'more',
                    url: 'pages/more.html'
            },
          ],
        },
        {
          name: 'tabsAdmin',
          // Page main route
          path: '/tabsAdmin/',
          // Will load page from tabs/index.html file
          url: './pages/Admin/tabsAdmin.html',
          // Pass "tabs" property to route, must be array with tab routes:
          tabs: [
            // First (default) tab has the same url as the page itself
            {
              // Tab path
              path: '/',
              // Tab id
              id: 'mainPageAdmin',
              // Fill this tab content from content string
              url: 'pages/Admin/mainPageAdmin.html'
            },
            // Second tab
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
            // Third tab
            {
              path: '/more/',
              id: 'more',
              url: 'pages/more.html'
            },
          ],
        },
        {
          name: 'tabsOrg',
          // Page main route
          path: '/tabsOrg/',
          // Will load page from tabs/index.html file
          url: './pages/Organisation/tabsOrg.html',
          // Pass "tabs" property to route, must be array with tab routes:
          tabs: [
            // First (default) tab has the same url as the page itself
            {
              // Tab path
              path: '/',
              // Tab id
              id: 'mainPageOrg',
              // Fill this tab content from content string
              url: 'pages/Organisation/mainPageOrg.html'
            },
            // Second tab
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
            // Third tab
            {
              path: '/more/',
              id: 'more',
              url: 'pages/more.html'
            },
          ],
        },
        {
          name: 'tabsLeader',
          // Page main route
          path: '/tabsLeader/',
          // Will load page from tabs/index.html file
          url: './pages/Leader/tabsLeader.html',
          // Pass "tabs" property to route, must be array with tab routes:
          tabs: [
            // First (default) tab has the same url as the page itself
            {
              // Tab path
              path: '/',
              // Tab id
              id: 'mainPageLeader',
              // Fill this tab content from content string
              url: 'pages/Leader/mainPageLeader.html'
            },
            // Second tab
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
            // Third tab
            {
              path: '/more/',
              id: 'more',
              url: 'pages/more.html'
            },
          ],
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
let url = "http://localhost:3000"

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
        if(feedbackMsg){
        msg.innerHTML = res.feedback
        }
        appF7.dialog.alert(res.feedback);
    };

};

var $$ = Dom7;


$$(document).on('tab:init', '.tab[id="si-ifra"]', function (e) {
  let test = getId("containter");
 console.log(test);
})  

/*
//Når en side åpnes så kjører denne. I dette tilgelle about siden
$$(document).on('page:init', '.page[data-name="about"]', function (e) {
 
})
*/