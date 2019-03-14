let appF7 = new Framework7({
    // App root element
    root: '#app',
    // App Name
    name: 'My App',
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
            name: 'main',
            // Page main route
            path: '/main/',
            // Will load page from tabs/index.html file
            url: './pages/main.html',
            // Pass "tabs" property to route, must be array with tab routes:
            tabs: [
              // First (default) tab has the same url as the page itself
              {
                // Tab path
                path: '/',
                // Tab id
                id: 'tab-1',
                // Fill this tab content from content string
                content: `
                  <div class="block">
                    <h3>Tab 1</h3>
                    <p>...</p>
                  </div>
                `
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
                path: '/tab-3/',
                id: 'tab-3',
                url: `./pages/more.html`
              },
            ],
          }
        ] 
    });

let mainView = appF7.views.create('.view-main');

let appCordova = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
      //  this.receivedEvent('deviceready');
         navigator.splashscreen.hide();
        mainView.router.navigate({ name: 'login' });
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {


    }
};

appCordova.initialize();

//Hjelpefunksjoner======================
function getId(id) {
    return document.getElementById(id);
}


//=====================================

//server URL
let url = "http://localhost:3000"

function sendData(data, endpoint) {
  console.log(endpoint);
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

//Send in ID til form, endpoint, og ID på tekstfelt som skal skrive ut feedback
async function sendForm(formId, endpoint, feedbackMsg){

  let form = getId(formId);
  let data = {};

  for (i = 0; i < form.length ;i++){
      data[form.elements[i].name] = form.elements[i].value;
  }
 
  //let res = await sendData(data, url+endpoint);
  //console.log(data);
  mainView.router.navigate({ name: 'main' });
}
