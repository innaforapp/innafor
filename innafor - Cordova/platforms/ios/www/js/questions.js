async function listOutQuestions(){

  let getCategory = await getData(`/app/survey/getCategory`);
  getCategory = await getCategory.json();

  let getQuestions = await getData(`/app/survey/getQuestions`);
  getQuestions = await getQuestions.json();

  let list = getId("list");
  list.innerHTML = "";
  document.getElementById("themeSelected").getElementsByClassName("item-after")[0].innerHTML = ""

  console.log(getCategory);
  console.log(getQuestions);

  let categorySelect = getId("categorySelect");
  categorySelect.innerHTML = "";


  let selectOption = "";

  for (i = 0; i < getCategory.category.length; i++) {

    if(i==0){
      selectOption += `<option value="${getCategory.category[i].category}" selected>${getCategory.category[i].category}</option>`
    }
    else{
      selectOption += `<option value="${getCategory.category[i].category}">${getCategory.category[i].category}</option>`
    }
  }

  categorySelect.innerHTML = `${selectOption}`
  document.getElementById("themeSelected").getElementsByClassName("item-after")[0].innerHTML = getCategory.category[0].category
 

  


 let ageGroups = ["9-12", "13-19"];
 let orgType = ["Idrett", "Skole"];
 let questions = getQuestions.questions;

 for (j = 0; j < orgType.length; j++){
  let title = document.createElement("h1")
  title.innerHTML = orgType[j];
  let div = document.createElement("div");
  div.className = "list";
  div.id = orgType[j];
  div.appendChild(title);

  for (i = 0; i < ageGroups.length; i++){
    let ageGroupTitle = document.createElement("h2");
    ageGroupTitle.innerHTML = ageGroups[i];
    div.appendChild(ageGroupTitle);
    let ul = document.createElement("ul");
    ul.id = (orgType[j]+"-"+ageGroups[i])
    div.appendChild(ul);

    for (x = 0; x < getCategory.category.length; x++){
      let item = "";

      for(k = 0; k < questions.length; k++){

        let questionCodeX = `${orgType[j]}-${getCategory.category[x].category}-${ageGroups[i]}`

        let questionCodeY = `${questions[k].type}-${questions[k].category}-${questions[k].agegroup}`
        

        if(questionCodeX == questionCodeY){
          item += `
          <li class="swipeout" id="delQuestionId${questions[k].id}">
          <div class="item-content swipeout-content">
          <div class="item-inner">
            <div class="item-title">${questions[k].question} (${questions[k].weight}%)</div>
          </div>
        </div>
        <div class="swipeout-actions-right">
          <a href="#" class="open-more-actions">Rediger</a>
          <a href="#" class="swipeout-delete" data-confirm="Er du sikker på at du vil slette dette spørsmålet?" data-confirm-title="Slette?">Delete</a>
        </div>
        </li>`

        } 

      }


      let li = document.createElement("li");
      li.className = "accordion-item";
      li.innerHTML = `                    
      <a href="#" class="item-content item-link">
      <div class="item-inner">
          <div class="item-title">${getCategory.category[x].category}</div>
      </div></a>
      <div class="accordion-item-content">
          <div class="block">
          ${item}
          </div>
      </div>
      `
      
      ul.appendChild(li);

      

    }

 }
  list.appendChild(div);
}


let categoryList = getId("categoryEdit");
let catLi = ""
for (l = 0; l < getCategory.category.length; l++){
  catLi += `
  <li class="swipeout" id="delCategoryId${getCategory.category[l].id}">
  <div class="item-content swipeout-content">
    <div class="item-media"><i class="icon icon-f7"></i>
    </div>
    <div class="item-inner">
      <div class="item-title">${getCategory.category[l].category}</div>
    </div>
  </div>
  <div class="swipeout-actions-right">
    <a href="#" data-confirm="Alle spørsmål under denne kategorien vil bli slettet. Vil du slette kategorien?" class="swipeout-delete">Delete</a>
  </div>
</li>
  `
}

categoryList.innerHTML=catLi;



}

async function addQuestion(formId, endpoint){

  let form = getId(formId);
  let questionScale = getId("question-scale");
  let data = {};

  for (i = 0; i < form.length; i++) {
    data[form.elements[i].name] = form.elements[i].value;
};

data["questionScale"]= questionScale.getElementsByTagName("DIV")[2].innerText;

console.log(data);
  
let res = await sendData(data, url + endpoint);
res = await res.json();

eval(res.event);

}


async function deleteQuestion(id){

let token = localStorage.getItem("token");
let data = {
  id: id, 
  token: token
};

let res = await sendData(data, url + `/app/survey/deleteQuestion`);


}


async function deleteCategory(id, cat){

  let token = localStorage.getItem("token");
  let data = {
    id: id,
    category: cat,
    token: token
  };
  
  let res = await sendData(data, url + `/app/survey/deleteCategory`);
  res = await res.json();
  eval(res.event);

  
  }


var toastCategoryAdded = appF7.toast.create({
  icon: app.theme === 'ios' ? '<i class="f7-icons">star</i>' : '<i class="material-icons">star</i>',
  text: 'Tema er lagt til',
  position: 'center',
  closeTimeout: 2000,
});



