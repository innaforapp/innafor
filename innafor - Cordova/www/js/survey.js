
/*function init(){
    // createSurvay();  
 }
 
 var scale;
 let answersBtns;
 let survayQA =[
     {
         question: "Det er ingen andre som blir mobbet på mitt lag.",
         answer: "",
         tag: "Transformasjonsledelse"
     },
     {
         question: "Jeg opplever at på laget mitt er det viktig å spille bedre enn de andre.",
         answer: "",
         tag: "Motivasjonsklima"
     },
     { 
         question: "Jeg er fornøyd med måten treneren gir meg tilbakemelding.",
         answer: "",
         tag: "Tilfredshet"
     },
     {
         question: "Jeg er fornøyd med treningene.",
         answer: "",
         tag: "Tilfredshet"
     }
 ];
 
 function createSurvay() {    
     let survayCont = getId("survayDiv");
 
     //Tilfredshet------------------------------------------------
     let sortTags1 =  survayQA.filter(function(cat) { 
         return cat.tag == "Tilfredshet";
     });
 
     for (let i = 0; i < sortTags1.length; i++) {
         let questionSet1 = document.createElement("div");
         questionSet1.innerHTML = `<h3 alt="Spørsmål ${(i+1)}">${sortTags1[i].question}</h3><p>Tag: ${sortTags1[i].tag}</p>`
 
         let buttons = createButtons();
         questionSet1.innerHTML += buttons;
         questionSet1.id = `questionsSet${i}`;
         survayCont.appendChild(questionSet1);
     }
 
    //Motivasjonsklima------------------------------------
     let sortTags2 =  survayQA.filter(function(cat) {
         return cat.tag == "Motivasjonsklima";
     });
 
     for (let i = 0; i < sortTags2.length; i++) {
         questionSet2 = document.createElement("div");
         survayCont.appendChild(questionSet2);
         questionSet2.innerHTML= `<hr><h3 alt="Spørsmål ${(i+1)}">${sortTags2[i].question}</h3><p>Tag: ${sortTags2[i].tag}</p>`
 
         let buttons = createButtons();
         questionSet2.innerHTML += buttons;
         questionSet2.id = `questionsSet${i}`;
         survayCont.appendChild(questionSet2);;
     }
 
     //Transformasjonsledelse------------------------------------
     let sortTags3 =  survayQA.filter(function(cat) { 
         return cat.tag == "Transformasjonsledelse";
     });
 
     for (let i = 0; i < sortTags3.length; i++) {
         questionSet3 = document.createElement("div");
         survayCont.appendChild(questionSet3);
         questionSet3.innerHTML  = `<hr><h3 alt="Spørsmål ${(i+1)}">${sortTags3[i].question}</h3><p>Tag: ${sortTags3[i].tag}</p>`
     
         let buttons = createButtons();
         questionSet3.innerHTML += buttons;
         questionSet3.id = `questionsSet${i}`;
         survayCont.appendChild(questionSet3);       
     }
 }
 
 
 function createButtons(){
     let buttonRow = "";
 
     for (let j= 0; j < 5; j++) {
         let scaleText;
         let  scale = j + 1;
         
         if(scale==1){
             scaleText = "looks_one";                  
         }
         if(scale==2){
             scaleText = "looks_two";                  
         }
         if(scale==3){
             scaleText = "looks_3";                  
         }
         if(scale==4){
             scaleText = "looks_4";                  
         }
         if(scale==5){
             scaleText = "looks_5";                  
         }
         buttonRow +=  `<button class="material-icons buttonRow${i}" onclick="select(${scale},${i})">${scaleText}</button>`;
     }
     return buttonRow;
 }
 
 function select(scale, rowIndex) {
     survayQA[rowIndex].answer = scale;
     console.log("du trykket: " + scale);
     
     let buttonRow = document.getElementsByClassName(`buttonRow${rowIndex}`);
     for (i = 0; i < buttonRow.length; i++) {
         buttonRow[i].className = buttonRow[i].className.replace(" selected", "");
     }
     buttonRow[scale - 1].className += " selected";
     //console.log(survayQA);    
 }
 
 function sendBtn(){
     addResultsToDb();
    // console.log(survayQA);      
 }
 
 function addResultsToDb(){
     let inp = getId("inp").value;
     console.log(inp);
     let request = {
         headers: {
             "Content-Type": "application/json; charset=utf-8",
             "x-access-auth": localStorage.getItem("token")
         },
         method: "POST",
         body: JSON.stringify({
             result: inp
         })
     };
 
     console.log("sender data til db");
     fetch(url + "/app/survey/sendData", request).then(data=>{
         if(data.status < 400){
             return data.json();
         }
     }).catch(err =>{
         console.error(err);
         console.log("ånei");
     }); 
 }
*/
  //Leader

let calendar;


  $$(document).on('page:init', '.page[data-name="create-survay"]', function (e) {
    loadSurvayOptions();

    appF7.preloader.show();

    calendar = appF7.calendar.create({
        inputEl: '#dateSelect',
        dateFormat: 'dd M yyyy',
        rangePicker: true,
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

    console.log(question)

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
            ageGroupTitle.innerHTML = question.pool[i].agegroup;
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
             ${question.pool[i].questions[j][0]} (${question.pool[i].questions[j][1]}%)
            </li>`
        }



        let popupDiv = document.createElement("div");
        popupDiv.className = `popup popup-${question.pool[i].agegroup}-${question.pool[i].category}`
        popupDiv.innerHTML = `
                    <div class="block">
                <p>${question.pool[i].agegroup}-${question.pool[i].category}</p>
                <!-- Close Popup -->
                <p><a class="link popup-close" href="#">Lukk</a></p>
                <div class="list simple-list">
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

    console.log(survay)
    
}

async function createSurvay(){

    if(isEmpty(survay)){
        appF7.dialog.alert(
            'Du har ikke valgt tema(er) for spørreundersøkelsen');
            return;
    }
    else if(calendar.getValue() == undefined){
        appF7.dialog.alert(
            'Velg periode spørreundersøkelsen skal kjøre');
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

    let res = await getData(`/app/survey/getActiveSurvay`);
    res = await res.json();
    window.localStorage.setItem("surveys", JSON.stringify(res.survay));



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
        
        console.log(res.survay[i].survay)
        
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

        if(i == 0){
            pageContent.className += " tab-active";
            prevNextFinish.innerHTML = `
            <button href="#survayPage-${i+1}" class="col button button-large button-raised tab-link">Neste</button>
            `
        }
        else if(i == Object.keys(res.survay).length-1){
            prevNextFinish.innerHTML = `
            <button href="#survayPage-${i-1}" class="col button button-large button-raised tab-link">Tilbake</button>
            <button onclick=sendSurvay() class="col button button-large button-raised button-fill color-green">Fulfør</button>
            `
        }
        else{
            prevNextFinish.innerHTML = `
            <button href="#survayPage-${i-1}" class="col button button-large button-raised tab-link">Tilbake</button>
            <button href="#survayPage-${i+1}" class="col button button-large button-raised tab-link">neste</button>
            `

        }
        console.log(i)
        surveyPage.appendChild(pageContent);

        let divBlock = document.createElement("div");
        divBlock.className = "block";
        pageContent.appendChild(divBlock);

        let questionSet = Object.keys(res.survay)[i];

        console.log(res.survay[questionSet])
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

    console.log(btnRow, pageIndex, value)

    let buttonRow = document.getElementsByClassName(`buttonRow${btnRow}${pageIndex}`)

    for (i = 0; i < buttonRow.length; i++) {
        buttonRow[i].className = buttonRow[i].className.replace(" button-active", "");
    }
    buttonRow[value - 1].className += " button-active";


    let questionSet = Object.keys(openedSurvey.survay)[pageIndex];
    
    openedSurvey.survay[questionSet][btnRow].answer = value


    console.log(openedSurvey.survay[questionSet])


}


async function sendSurvay(){

    data = {
        surveyId: openedSurvey.id,
        weekInBetween: openedSurvey.week,
        results: openedSurvey.survay
    }

    let res = await sendData(data, `/app/survey/sendSurvay`);

    console.log(data)
}








/*
  //Leader
  $$(document).on('page:init', '.page[data-name="create-survay"]', function (e) {
    loadSurvayOptions();
});

let qSets = {};
let ageGroups = ['9-12', '13-19'];

async function loadSurvayOptions(){
    console.log("createSurvay");

    let getQ = await getData(`/app/survey/getQuestionSets`);
    getQ = await getQ.json();

    let getC = await getData(`/app/survey/getCategory`);
    getC = await getC.json();




for (j = 0; j < ageGroups.length; j++) {
qSets[ageGroups[j]] = {}

    for (i = 0; i < getC.category.length; i++) {
        let currentCategoryIndex = getC.category[i].category

        if(!(currentCategoryIndex in qSets[ageGroups[j]])){
            qSets[ageGroups[j]][getC.category[i].category] = {}

            let questions = []
            for (k = 0; k < getQ.questionSet.length; k++){
                if(getC.category[i].category == getQ.questionSet[k].category && ageGroups[j] == getQ.questionSet[k].agegroup){
                    questions.push(getQ.questionSet[k]);
                    qSets[ageGroups[j]][getC.category[i].category] = questions
                    }

                }

            }

        }

}



console.log(qSets);

let optionContainer = getId("survayOptions")

for (i = 0; i < ageGroups.length; i++) {
    let categories = Object.keys(qSets[ageGroups[i]])

    let div = document.createElement("div");
    div.className = "list";

    let ageGroupTitle = document.createElement("div");
    ageGroupTitle.className = "block-title";
    ageGroupTitle.innerHTML = ageGroups[i];
    div.appendChild(ageGroupTitle);

    let ul = document.createElement("ul");
    let li = "";
    for (j = 0; j < categories.length; j++) {
        li += `
        <li class="swipeout">
        <label class="item-checkbox item-content">
          <input type="checkbox" name="demo-checkbox" value=${ageGroups[i]}-${categories[j]}/>
          <i class="icon icon-checkbox"></i>
          <div class="item-inner">
            <div class="item-title">${categories[j]}</div>
          </div>
          <div class="swipeout-actions-right">
                <a href="#" class="open-more-actions">Se spørsmål</a>
              </div>
        </label>
      </li>
        ` 
    }
    ul.innerHTML = li;

    div.appendChild(ul);
    optionContainer.appendChild(div);
    }


 };

*/


 