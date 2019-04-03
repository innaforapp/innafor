
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
  $$(document).on('page:init', '.page[data-name="create-survay"]', function (e) {
    loadSurvayOptions();
});

let tempObj = {};
let ageGroups = ['9-12', '13-19'];

async function loadSurvayOptions(){
    console.log("createSurvay");

    let getQ = await getData(`/app/survey/getQuestionSets`);
    getQ = await getQ.json();

    let getC = await getData(`/app/survey/getCategory`);
    getC = await getC.json();




for (j = 0; j < ageGroups.length; j++) {
tempObj[ageGroups[j]] = {}

    for (i = 0; i < getC.category.length; i++) {
        let currentCategoryIndex = getC.category[i].category

        if(!(currentCategoryIndex in tempObj[ageGroups[j]])){
            tempObj[ageGroups[j]][getC.category[i].category] = {}

            let questions = []
            for (k = 0; k < getQ.questionSet.length; k++){
                if(getC.category[i].category == getQ.questionSet[k].category && ageGroups[j] == getQ.questionSet[k].agegroup){
                    questions.push(getQ.questionSet[k]);
                    tempObj[ageGroups[j]][getC.category[i].category] = questions
                    }

                }

            }

        }

}



console.log(tempObj);

let optionContainer = getId("survayOptions")

for (i = 0; i < ageGroups.length; i++) {
    let div = document.createElement("h2");
    div.className = "list";

    let ageGroupTitle = document.createElement("h2");
    ageGroupTitle.innerHTML = ageGroups[i];
    div.appendChild(ageGroupTitle);

    let ul = document.createElement("ul");

    optionContainer.appendChild(div);
    }


 };




 