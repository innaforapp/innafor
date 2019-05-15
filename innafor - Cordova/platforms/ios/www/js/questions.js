
$$(document).on('tab:init', '.tab[id="questionBank"]', function (e) {
    loadQuestionOptions()
    appF7.preloader.show();
});


$$(document).on('swipeout:deleted', function (e) {
    let targetId = e.target.id
    let id = getCurrentIndex(targetId);

    if (targetId.includes("delQuestionId")) {
        deleteQuestion(targetId);
    } else if (targetId.includes("delCategoryId")){
        let categoryName = e.target.getElementsByTagName("DIV")[2].innerText;
        deleteCategory(id, categoryName);
    } else if (targetId.includes("user")) {
        let group = window.localStorage.getItem('deleteUserFromGroup');
        deleteUser(id, group);
    } else if (targetId.includes("org")) {
        deleteOrg(id);
    }
});



async function loadQuestionOptions(){
    getId("addCategory").reset();
    getId("questionText").value=""

    let cat = await getData(`/app/survey/getCategory`);
    cat = await cat.json();

    let question = await getData(`/app/survey/getQuestions`);
    question = await question.json();


    

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
            let title = document.createElement("h1");
            title.classList.add('list-header');
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

