async function listOutQuestions(){

  let res = await getData(`/app/survey/getQuestions`);
  res = await res.json();

  console.log(res.questions)

 let motivation = [];
 let affiliation = [];
 let wellbeing = [];

  for (i = 0; i < res.questions.length; i++) {

    if(res.questions[i].category == "Motivation"){
      motivation.push(res.questions[i])
    };

    if(res.questions[i].category == "Affiliation"){
      affiliation.push(res.questions[i])
    };

    if(res.questions[i].category == "Wellbeing"){
      wellbeing.push(res.questions[i])
    };

  }

  let motivationCard = getId("motivation");
  motivationCard.innerHTML = "";
  let motivationUl = document.createElement("ul")
  for (i = 0; i < motivation.length; i++) {

    let li = document.createElement("li");

    li.innerHTML = `
        <div class="item-content swipeout-content">
          <div class="item-inner">
            <div class="item-title">${motivation[i].question}</div>
          </div>
        </div>
        <div class="swipeout-actions-right">
          <a href="#" class="open-more-actions">Rediger</a>
          <a href="#" class="swipeout-delete" data-confirm="Er du sikker på at du vil slette dette spørsmålet?" data-confirm-title="Slette?">Delete</a>
        </div>
    `
    li.className = `swipeout`
    li.Id = `delQuestionId${motivation[i].id}`
    motivationUl.appendChild(li);

  }
 motivationCard.appendChild(motivationUl);


 let wellbeingCard = getId("wellbeing");
 wellbeingCard.innerHTML = "";
 let wellbeingUl = document.createElement("ul")
 for (i = 0; i < wellbeing.length; i++) {

   let li = document.createElement("li");

   li.innerHTML = `
       <div class="item-content swipeout-content">
         <div class="item-inner">
           <div class="item-title">${wellbeing[i].question}</div>
         </div>
       </div>
       <div class="swipeout-actions-right">
         <a href="#" class="open-more-actions">Rediger</a>
         <a href="#" class="swipeout-delete" data-confirm="Er du sikker på at du vil slette dette spørsmålet?" data-confirm-title="Slette?">Delete</a>
       </div>
   `
   li.className = `swipeout`
   li.Id = `delQuestionId${wellbeing[i].id}`
   wellbeingUl.appendChild(li);

 }
 wellbeingCard.appendChild(wellbeingUl);


 let affiliationCard = getId("affiliation");
 affiliationCard.innerHTML=""
 let affiliationUl = document.createElement("ul")
 for (i = 0; i < affiliation.length; i++) {

   let li = document.createElement("li");

   li.innerHTML = `
       <div class="item-content swipeout-content">
         <div class="item-inner">
           <div class="item-title">${affiliation[i].question}</div>
         </div>
       </div>
       <div class="swipeout-actions-right">
         <a href="#" class="open-more-actions">Rediger</a>
         <a href="#" class="swipeout-delete" data-confirm="Er du sikker på at du vil slette dette spørsmålet?" data-confirm-title="Slette?">Delete</a>
       </div>
   `
   li.className = `swipeout`
   li.Id = `delQuestionId${affiliation[i].id}`
   affiliationUl.appendChild(li);

 }
 affiliationCard.appendChild(affiliationUl);

}


async function deleteQuestion(id){

let token = localStorage.getItem("token");
let data = {
  id: id,
  token: token
};

let res = await sendData(data, url + `/app/survey/deleteQuestion`);

console.log(data);

}