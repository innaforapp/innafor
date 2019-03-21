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
                    path: '/tab-2/',
                    id: 'tab-2',
                    content: `
                <div class="block">
                  <h3>Tab 2</h3>
                  <p>...</p>
                </div>
              `
            },
            // Third tab
                {
                    path: '/functionsMembers/',
                    id: 'functionsMembers',
                    url: 'pages/Members/functionsMembers.html'
            },
            // Fourth tab
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
<<<<<<< HEAD
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
=======
            name: 'about',
            path: '/about/',
            url: 'pages/about.html'
>>>>>>> 5a291df1c0129889bb8c8d0ff9e1b97fa2bf19a1
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
            name: 'tabsOrg'
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
<<<<<<< HEAD
//let url = "https://innafor-test04.herokuapp.com/"
=======
//let url = "https://innaforapp.no/test3"
>>>>>>> 5a291df1c0129889bb8c8d0ff9e1b97fa2bf19a1
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
<<<<<<< HEAD
        if(feedbackMsg){
        msg.innerHTML = res.feedback
=======
        if (feedbackMsg) {
            msg.innerHTML = res.feedback
>>>>>>> 5a291df1c0129889bb8c8d0ff9e1b97fa2bf19a1
        }
        appF7.dialog.alert(res.feedback);
    };

};