
$$(document).on('tab:init', '.tab[id="questionBank"]', function (e) {
    loadQuestionOptions()
    appF7.preloader.show();
});


$$(document).on('swipeout:deleted', function (e) {
    let targetId = e.target.id
    let id = getCurrentIndex(targetId);

    if (targetId.includes("delQuestionId")) {
        deleteQuestion(targetId);
    } else if ("delCategoryId"){
        let categoryName = e.target.getElementsByTagName("DIV")[2].innerText;
        deleteCategory(id, categoryName);
    }
});




async function loadQuestionOptions(){
    
    let cat = await getData(`/app/survey/getCategory`);
    cat = await cat.json();

    let question = await getData(`/app/survey/getQuestions`);
    question = await question.json();

    console.log(question);

    

    //Update category selecter
    let categorySelect = getId("categorySelect");
    categorySelect.innerHTML = "";
    let selectOption = "";

    let categoryList = getId("categoryEdit");
    let catLi = ""

    for (i = 0; i < cat.category.length; i++) {
        if (i == 0) {
            selectOption += `<option value="${cat.category[i].category}" selected>${cat.category[i].category}</option>`
        } else {
            selectOption += `<option value="${cat.category[i].category}">${cat.category[i].category}</option>`
        }

        catLi += `
        <li class="swipeout" id="delCategoryId${cat.category[i].id}">
        <div class="item-content swipeout-content">
            <div class="item-media"><i class="icon icon-f7"></i>
            </div>
            <div class="item-inner">
            <div class="item-title">${cat.category[i].category}</div>
            </div>
        </div>
        <div class="swipeout-actions-right">
            <a href="#" data-confirm="Alle spørsmål under denne kategorien vil bli slettet. Vil du slette kategorien?" class="swipeout-delete">Delete</a>
        </div>
        </li>
  `



    }
    categorySelect.innerHTML = `${selectOption}`
    document.getElementById("themeSelected").getElementsByClassName("item-after")[0].innerHTML = cat.category[0].category
    categoryList.innerHTML = catLi;



    let list = getId("list");
    list.innerHTML = "";

    for(i = 0; i < question.pool.length; i++) {

        //Lager en ny overskrift på type

        if(getId(question.pool[i].type) == null){
            let title = document.createElement("h1")
            title.innerHTML = question.pool[i].type;
            let div = document.createElement("div");
            div.id = question.pool[i].type;
            div.appendChild(title);
            list.appendChild(div)
        }

    

        //Lager alders titel

        if(getId(`${question.pool[i].type}-${question.pool[i].agegroup}`) == null){
            let ageGroupTitle = document.createElement('div');
            ageGroupTitle.innerHTML = question.pool[i].agegroup;
            ageGroupTitle.className = "block-title";
            ageGroupTitle.id = `${question.pool[i].type}-${question.pool[i].agegroup}`

            let div = getId(question.pool[i].type);
            div.appendChild(ageGroupTitle);

            let listWrapper = document.createElement('div');
            listWrapper.className = "list inset";
            div.appendChild(listWrapper);

            let ul = document.createElement("ul");
            ul.id = `${question.pool[i].type}-${question.pool[i].agegroup}-ul`;
            listWrapper.appendChild(ul);
        }

        let item = "";
        for(j = 0; j < question.pool[i].questions.length; j++) {
            item += `
            <li class="swipeout" id="delQuestionId-${question.pool[i].id}-${question.pool[i].questions[j][0]}-${question.pool[i].questions[j][1]}">
                <div class="item-content swipeout-content">
                    <div class="item-inner">
                        <div class="item-title">${question.pool[i].questions[j][0]} (${question.pool[i].questions[j][1]}%)
                        </div>
                    </div>
                </div>
                <div class="swipeout-actions-right">
                    <a href="#" class="open-more-actions">Rediger</a>
                    <a href="#" class="swipeout-delete" data-confirm="Er du sikker på at du vil slette dette spørsmålet?" data-confirm-title="Slette?">Delete</a>
                </div>
            </li>`
        }


        if(getId(`${question.pool[i].type}-${question.pool[i].agegroup}-${question.pool[i].category}`) == null){
            let ul = getId(`${question.pool[i].type}-${question.pool[i].agegroup}-ul`);
            let li = document.createElement("li");
            li.className = "accordion-item";
            li.id = `${question.pool[i].type}-${question.pool[i].agegroup}-${question.pool[i].category}-li`
            li.innerHTML =`
                <a href="#" class="item-content item-link">
                    <div class="item-inner">
                        <div class="item-title">${question.pool[i].category}</div>
                    </div>
                </a>
                <div class="accordion-item-content">
                    <div class="block">
                        ${item}
                    </div>
                </div>
            `
            ul.appendChild(li);
            
        }


    }
    appF7.preloader.hide();
}



async function addQuestion(endpoint) {

    let data = {
        category: getId("categorySelect").value,
        agegroup: getId("questionAgeGroup").value,
        type: getId("questionType").value,
        question: getId("questionText").value,
        weight: getId("question-scale").getElementsByTagName("DIV")[2].innerText

    }

    let res = await sendData(data, endpoint);
    res = await res.json();

    eval(res.event);




}

async function deleteCategory(id, cat) {

    let token = localStorage.getItem("token");
    let data = {
        id: id,
        category: cat,
        token: token
    };

    let res = await sendData(data, `/app/survey/deleteCategory`);
    res = await res.json();
    eval(res.event);


}


async function deleteQuestion(id) {

    let questionInfo = id.split('-');

    let data = {
        id: questionInfo[1],
        question: questionInfo[2],
        weight: questionInfo[3]
        
    };

    let res = await sendData(data, `/app/survey/deleteQuestion`);
    res = await res.json();
    eval(res.event);
}


var toastCategoryAdded = appF7.toast.create({
    icon: app.theme === 'ios' ? '<i class="f7-icons">star</i>' : '<i class="material-icons">star</i>',
    text: 'Tema er lagt til',
    position: 'center',
    closeTimeout: 2000,
});

/*
async function listOutQuestions() {

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

        if (i == 0) {
            selectOption += `<option value="${getCategory.category[i].category}" selected>${getCategory.category[i].category}</option>`
        } else {
            selectOption += `<option value="${getCategory.category[i].category}">${getCategory.category[i].category}</option>`
        }
    }

    categorySelect.innerHTML = `${selectOption}`
    document.getElementById("themeSelected").getElementsByClassName("item-after")[0].innerHTML = getCategory.category[0].category





    let ageGroups = ["9-12", "13-19"];
    let orgType = ["Idrett", "Skole"];
    let questions = getQuestions.questions;

    for (j = 0; j < orgType.length; j++) {
        let title = document.createElement("h1")
        title.innerHTML = orgType[j];
        let div = document.createElement("div");
        div.id = orgType[j];
        div.appendChild(title);

        for (i = 0; i < ageGroups.length; i++) {
            let ageGroupTitle = document.createElement('div');
            ageGroupTitle.innerHTML = ageGroups[i];
            ageGroupTitle.className = "block-title";
            div.appendChild(ageGroupTitle);
            let listWrapper = document.createElement('div');
            listWrapper.className = "list inset";
            div.appendChild(listWrapper);
            let ul = document.createElement("ul");
            ul.id = (orgType[j] + "-" + ageGroups[i]);
            listWrapper.appendChild(ul);

            for (x = 0; x < getCategory.category.length; x++) {
                let item = "";

                for (k = 0; k < questions.length; k++) {

                    let questionCodeX = `${orgType[j]}-${getCategory.category[x].category}-${ageGroups[i]}`

                    let questionCodeY = `${questions[k].type}-${questions[k].category}-${questions[k].agegroup}`


                    if (questionCodeX == questionCodeY) {
                        item += `
                                <li class="swipeout"
                                    id="delQuestionId${questions[k].id}">
                                    <div class="item-content swipeout-content">
                                        <div class="item-inner">
                                            <div class="item-title">${questions[k].question} (${questions[k].weight}%)
                                            </div>
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
                        </div>
                    </a>
                    <div class="accordion-item-content">
                        <div class="block">
                            ${item}
                        </div>
                    </div>
                `

                ul.appendChild(li);
            }
        }

        if (j+1 < orgType.length) {
            let hr = document.createElement('hr');
            hr.classList = 'container-divider';
            div.appendChild(hr);
            console.log('la til hr');
        }

        list.appendChild(div);
    }


    let categoryList = getId("categoryEdit");
    let catLi = ""
    for (l = 0; l < getCategory.category.length; l++) {
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

    categoryList.innerHTML = catLi;



}

async function addQuestion(formId, endpoint) {

    let form = getId(formId);
    let questionScale = getId("question-scale");
    let data = {};

    for (i = 0; i < form.length; i++) {
        data[form.elements[i].name] = form.elements[i].value;
    };

    data["questionScale"] = questionScale.getElementsByTagName("DIV")[2].innerText;

    console.log(data);

    let res = await sendData(data, endpoint);
    res = await res.json();

    eval(res.event);

}


async function deleteQuestion(id) {

    let token = localStorage.getItem("token");
    let data = {
        id: id,
        token: token
    };

    let res = await sendData(data, `/app/survey/deleteQuestion`);


}


async function deleteCategory(id, cat) {

    let token = localStorage.getItem("token");
    let data = {
        id: id,
        category: cat,
        token: token
    };

    let res = await sendData(data, `/app/survey/deleteCategory`);
    res = await res.json();
    eval(res.event);


}


var toastCategoryAdded = appF7.toast.create({
    icon: app.theme === 'ios' ? '<i class="f7-icons">star</i>' : '<i class="material-icons">star</i>',
    text: 'Tema er lagt til',
    position: 'center',
    closeTimeout: 2000,
});
*/