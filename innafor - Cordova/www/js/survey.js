  //Leader

let calendar;


  $$(document).on('page:init', '.page[data-name="create-survay"]', function (e) {
    loadSurvayOptions();

    appF7.preloader.show();

    calendar = appF7.calendar.create({
        inputEl: '#dateSelect',
        dateFormat: 'dd M yyyy',
        rangePicker: true,
        footer: true,
        toolbarCloseText: 'Ferdig',
        monthNames: ['Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni', 'Juli', 'August' , 'September' , 'Oktober', 'Novmeber', 'Desember'],
        monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Des'],
        dayNames: ['Søndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag'],
        dayNamesShort: ['Søn', 'Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør'],
        
    });

});



let question;
async function loadSurvayOptions(){

    question = await getData(`/app/survey/getQuestionSets`);
    question = await question.json();


    let mainDiv = getId("survayOptions");
    mainDiv.innerHTML = "";

    let viewQuestions = getId("viewQuestions")
    viewQuestions.innerHTML = "";

    let groupSelect = getId("groupSelector");
    groupSelect.innerHTML = "";
    let groupOptions = "";
    for (i = 0; i < question.group.length; i++) {
        if (i == 0) {
            groupOptions += `<option value="${question.group[i]}" selected>${question.group[i]}</option>`
        } else {
            groupOptions += `<option value="${question.group[i]}">${question.group[i]}</option>`
        }
    }

    groupSelect.innerHTML = groupOptions;
    document.getElementById("groupSelected").getElementsByClassName("item-after")[0].innerHTML = question.group[0]
    

    for(i = 0; i < question.pool.length; i++) {


        if(getId(`${question.pool[i].agegroup}`) == null){
            let ageGroupTitle = document.createElement('div');
            ageGroupTitle.innerHTML = 'Aldersgruppe: ' + question.pool[i].agegroup;
            ageGroupTitle.className = "block-title";
            ageGroupTitle.id = `${question.pool[i].agegroup}`

            mainDiv.appendChild(ageGroupTitle);

            let listWrapper = document.createElement('div');
            listWrapper.className = "list inset";
            mainDiv.appendChild(listWrapper);

            let ul = document.createElement("ul");
            ul.id = `${question.pool[i].agegroup}-ul`;
            listWrapper.appendChild(ul);
        }

        if(getId(`${question.pool[i].agegroup}-${question.pool[i].category}`) == null){
            let ul = getId(`${question.pool[i].agegroup}-ul`);
            let li = document.createElement("li");
            li.className = "swipeout";
            li.id = `index-${i}`
            li.innerHTML =`
            <label class="item-checkbox item-content">
            <input type="checkbox" name="demo-checkbox" onchange="addToSurvay(${i})"/>
            <i class="icon icon-checkbox"></i>
            <div class="item-inner">
              <div class="item-title">${question.pool[i].category}</div>
            </div>
            <div class="swipeout-actions-right">
                  <a class="popup-open" href="#" data-popup=".popup-${question.pool[i].agegroup}-${question.pool[i].category}">Se spørsmål</a>
                </div>
            </label>
            `
            ul.appendChild(li);
            
        }

        let item = "";
        for(j = 0; j < question.pool[i].questions.length; j++) {
            item += `
            <li>
                <div class="item-content">
                    <div class="item-inner">
                        <div class="item-text" style="color: black">${question.pool[i].questions[j][0]} (${question.pool[i].questions[j][1]}%)</div>
                    </div>
                </div>
            </li>`
        }



        let popupDiv = document.createElement("div");
        popupDiv.className = `popup popup-${question.pool[i].agegroup}-${question.pool[i].category}`
        popupDiv.innerHTML = `
                    <div class="block">
                <p>${question.pool[i].agegroup}-${question.pool[i].category}</p>
                <!-- Close Popup -->
                <p><a class="link popup-close" href="#">Lukk</a></p>
                <div class="list">
                <ul>
                ${item}
                </ul>
              </div>
            </div>`
            
        viewQuestions.appendChild(popupDiv);


    }

    appF7.preloader.hide();
}

let survay = {};



function addToSurvay(index){
    let category = `${question.pool[index].agegroup}-${question.pool[index].category}`;
   
    if (category in survay){
        delete survay[category];
    }
    else{
        survay[category] = [];   
    
        for(j = 0; j < question.pool[index].questions.length; j++) {      
            let survayQuestions = {
                question: "",
                weight: "",
                answer: "" 
            };

            survayQuestions.question =  question.pool[index].questions[j][0]
            survayQuestions.weight =  question.pool[index].questions[j][1]
            survay[category].push(survayQuestions)
        }
    }

    
}

async function createSurvay(){

    if(isEmpty(survay)){
        appF7.dialog.alert(
            'Du har ikke valgt tema(er) for spørreundersøkelsen.', 'Mangler tema');
            return;
    }
    else if(calendar.getValue() == undefined){
        appF7.dialog.alert(
            'Velg periode spørreundersøkelsen skal kjøre.', 'Mangler periode');
            return;
    }else{
    let data = {
        survay: survay,
        group: getId("groupSelector").value,
        survayPeriod: calendar.getValue(),
        weekly: getId("weeklyfrequency").value
    }

    let res = await sendData(data, `/app/survey/createSurvay`);
    res = await res.json();
    eval(res.event)
    }
}




$$(document).on('tab:init', '.tab[id="siIfraFrontpage"]', async function (e) {
    appF7.preloader.show();

    let res = await getData(`/app/survey/getActiveSurvay`);
    res = await res.json();
    window.localStorage.setItem("surveys", JSON.stringify(res.survay));
    
    appF7.preloader.hide();
    listOutActiveSurveys(res);
});


function listOutActiveSurveys(res){
    let mainDiv = getId("activeSurveys");

    for(i = 0; i < res.survay.length; i++) {
        let fromDate  = new Date(res.survay[i].survayperiod[0]);
        let toDate  = new Date(res.survay[i].survayperiod[1]);
        

        let groupList = document.createElement("div");
        groupList.className ="list-group";
        let ul = document.createElement("ul");
        let li = document.createElement("li");
        
        
        if(res.survay[i].survay == undefined){
            li.innerHTML = `      
            <a class="item-link item-content">
            <div class="item-media"><i class="material-icons" style="color:red">highlight_off</i></div>
            <div class="item-inner">
              <div class="item-title">
                <div class="item-header">${fromDate.getDate()}.${fromDate.getMonth()}.${fromDate.getFullYear()} til ${toDate.getDate()}.${toDate.getMonth()}.${toDate.getFullYear()}</div>
                ${res.survay[i].group}
              </div>
              <div class="item-after">Start</div>
            </div>
          </a>`
        }
        else{
            li.innerHTML = `      
            <a onclick=openSurvey(${i}) class="item-link item-content">
            <div class="item-media"><i class="material-icons" style="color:green">thumb_up</i></div>
            <div class="item-inner">
              <div class="item-title">
                <div class="item-header">${fromDate.getDate()}.${fromDate.getMonth()}.${fromDate.getFullYear()} til ${toDate.getDate()}.${toDate.getMonth()}.${toDate.getFullYear()}</div>
                ${res.survay[i].group}
              </div>
              <div class="item-after">Start</div>
            </div>
          </a>`

        }
        


      mainDiv.appendChild(groupList)
      groupList.appendChild(ul)
      ul.appendChild(li);

    }

}


let openedSurvey;

async function openSurvey(surveyIndex){
    openedSurvey = JSON.parse(localStorage.getItem('surveys'))[surveyIndex];
    await mainView.router.navigate({name: "si-ifra-survay"});
}


$$(document).on('page:init', '.page[data-name="si-ifra-survay"]', function (e) {
    drawSurvay(openedSurvey);
});

 



function drawSurvay(res){
    
    let surveyPage = getId("surveyPage");

    for(i = 0; i < Object.keys(res.survay).length; i++) {
        let prevNextFinish = document.createElement("p");
        prevNextFinish.className = "row"

        let pageContent = document.createElement("div");
        pageContent.className = "page-content tab";
        pageContent.id = `survayPage-${i}`

        if(i == 0 && Object.keys(res.survay).length == 1){
            pageContent.className += " tab-active";
            prevNextFinish.innerHTML = `
            <a onclick=sendSurvay() class="col button button-large button-raised button-fill color-green">Fullfør</a>
            `
        }
        else if(i == 0){
            pageContent.className += " tab-active";
            prevNextFinish.innerHTML = `
            <a href="#survayPage-${i+1}" class="col button button-large button-raised button-fill color-gray tab-link">Neste</a>
            `
        }
        
        else if(i == Object.keys(res.survay).length-1){
            prevNextFinish.innerHTML = `
            <a href="#survayPage-${i-1}" class="col button button-large button-raised button-fill color-gray tab-link">Tilbake</a>
            <a onclick=sendSurvay() class="col button button-large button-raised button-fill color-green">Fullfør</a>
            `
        }
        else{
            prevNextFinish.innerHTML = `
            <a href="#survayPage-${i-1}" class="col button button-large button-raised button-fill color-gray tab-link">Tilbake</a>
            <a href="#survayPage-${i+1}" class="col button button-large button-raised button-fill color-gray tab-link">Neste</a>
            `

        }
        surveyPage.appendChild(pageContent);

        let divBlock = document.createElement("div");
        divBlock.className = "block";
        pageContent.appendChild(divBlock);

        let questionSet = Object.keys(res.survay)[i];

        for(j = 0; j < res.survay[questionSet].length; j++){

            let questionText = document.createElement("h1");
            questionText.innerHTML = res.survay[questionSet][j].question;
            divBlock.appendChild(questionText);

            let p = document.createElement("p");
            p.className="segmented segmented-raised";

            
            let buttons = `
            <button onclick="select(${j}, ${i}, 1)" class="button buttonRow${j}${i}">1</button>
            <button onclick="select(${j}, ${i}, 2)" class="button buttonRow${j}${i}">2</button>
            <button onclick="select(${j}, ${i}, 3)" class="button buttonRow${j}${i}">3</button>
            <button onclick="select(${j}, ${i}, 4)" class="button buttonRow${j}${i}">4</button>
            <button onclick="select(${j}, ${i}, 5)" class="button buttonRow${j}${i}">5</button>
            `

            p.innerHTML = buttons;
            divBlock.appendChild(p)
        }
        pageContent.appendChild(prevNextFinish);

    }


}





function select(btnRow,pageIndex, value) {


    let buttonRow = document.getElementsByClassName(`buttonRow${btnRow}${pageIndex}`)

    for (i = 0; i < buttonRow.length; i++) {
        buttonRow[i].className = buttonRow[i].className.replace(" button-active", "");
    }
    buttonRow[value - 1].className += " button-active";


    let questionSet = Object.keys(openedSurvey.survay)[pageIndex];
    
    openedSurvey.survay[questionSet][btnRow].answer = value




}


async function sendSurvay(){

    data = {
        surveyId: openedSurvey.id,
        weekInBetween: openedSurvey.week,
        results: openedSurvey.survay
    }
    appF7.preloader.show();
    let res = await sendData(data, `/app/survey/sendSurvay`);
        res = await res.json();
        eval(res.event);


  
}

//Overlay som sier ifra at spørsmål er lagt til
var toastSurveySendt = appF7.toast.create({
    icon: app.theme === 'ios' ? '<i class="f7-icons">star</i>' : '<i class="material-icons">star</i>',
    text: 'Takk',
    position: 'center',
    closeTimeout: 2000,
});


