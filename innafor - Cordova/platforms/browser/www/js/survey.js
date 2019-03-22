
var scale;

let survayQA = {
    "besvarelse": [
    {
        question: "Det er ingen andre som blir mobbet på mitt lag.",
        answer: "",
        tag: "Transformasjonsledelse"
    },
    {
        question: "Jeg opplever at på laget mitt er det viktig å spille bedre enn de andre.",
        answer: "",
        tag: "Motivasjonsklima"
    }
    ]
};

createSurvay(survayQA.besvarelse);

function createSurvay(array) {
let survayCont = document.getElementById("survayDiv");

for (let i = 0; i < array.length; i++) {
    let questionSet = document.createElement("div");
    let question = `<hr><p class="questionTxt" alt="Spørsmål ${(i+1)}">${array[i].question}</p>`

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

        let answers = `<button class="material-icons buttonRow${i}" onclick="select(${scale},${i})" alt="Knapp for å svare ${scaleText} på spørsmål ${array[i].question}">${scaleText}</button>`
        question += answers;
    }
    questionSet.className = "questionsSet";
    questionSet.id = `questionsSet${i}`;
    questionSet.innerHTML = question;
    survayCont.appendChild(questionSet);
}
}

function select(scale, rowIndex) {
survayQA.besvarelse[rowIndex].answer = scale;
let buttonRow = document.getElementsByClassName(`buttonRow${rowIndex}`)
for (i = 0; i < buttonRow.length; i++) {
    buttonRow[i].className = buttonRow[i].className.replace(" selected", "");
}
buttonRow[scale - 1].className += " selected";
console.log(survayQA.besvarelse);
}

/*document.getElementById("btn").onclick = function(){
    //addResultsToDb();
// console.log(rateVal);      
}*/

/*function addResultsToDb(){
    let token;
    let request = {
        method: "POST",
        body: JSON.stringify({
            result: rateVal,
            whatToDo: "new survay results"
        }),
        headers: {
                "Content-Type": "application/json; charset=utf-8"
            }
    };

    cosole.log("sender data til db");
    fetch("/sendData/",request).then(data=>{
        if(data.status < 400){
            return data.json();
        }
    })
}*/