async function leaderFeed(){
   selectGroups();
    let data = await listOutData();
    createCards(data);    
}

async function selectGroups(){
    let groups = await getData(`/app/feed/getGroups`);
    groups = await groups.json();

    var pickerDevice = appF7.picker.create({
        inputEl: '#inpGroup',
        cols: [{
            textAlign: 'center',
            values: groups.groups,
        }],
        toolbarCloseText: 'Ferdig'
    });
}

async function postToWp(){
    let selected = document.querySelector('#inpGroup');

    let title = getId("postTitle");
    let content = getId("postTxt");
    
    let postData = {
        title: title.value,
        cont: content.value,
        groups: selected.value
    } 

    if (!title.checkValidity()){
        $$('#btnPost').on('click', alert());
    }
    if (!content.checkValidity()){
        $$('#btnPost').on('click', alert());
    }
   if (selected.value ==""){
        $$('#btnPost').on('click', alert());
    }
    else{
       $$('#btnPost').on('click', alertDone());
        let res = await sendData(postData, `/app/feed/createPost`);
        res = await res.json();
        eval(res.event);        
        title.value = ""; content.value = ""; selected.value = "";
    }

    function alert() {
        appF7.dialog.alert("Vennligst fyll ut alle felter");
     }

    function alertDone() {
        appF7.dialog.alert('Innlegget er publisert!', function () {
            location.reload();
        });
    }
 } 

//hente ned og viser posts --------------------------------
async function listOutData(){
    let data = await getData(`/app/feed/showPosts`);
    data = await data.json();
    return data;
}

function createCards(data){
    data.posts.sort(function(a,b){
        let dataA = new Date(a.date), dateB = new Date(b.date)
        return dateB - dataA  ;
    });

    for (let i = 0; i < data.posts.length; i++){
        let card = document.createElement("div");
        let header = document.createElement("div");
        let cardCont = document.createElement("div");
        let footer = document.createElement("div");

        card.classList.add("card");
        getId("showPostCont").appendChild(card);

        header.classList.add("card-header");
        card.appendChild(header); 
       
        cardCont.classList.add("card-content", "card-content-padding");
        card.appendChild(cardCont); 
        
        footer.classList.add("card-footer");
        card.appendChild(footer);

        let d = new Date(`${data.posts[i].date}`);
        let  date = d.toDateString();

        header.innerHTML += `<p>${data.posts[i].customFields[0].value}</p> `;
        
        if (data.posts[i].customFields[1].value == "leader"){
            let btnDel = document.createElement("i");
            btnDel.innerHTML = "delete";
            btnDel.classList.add("material-icons");
            btnDel.id = data.posts[i].id;
            btnDel.addEventListener("click", deletePost);
            header.appendChild(btnDel);
        }

        if (data.posts[i].customFields[1].value == "org"){
            card.style.backgroundColor = "#dbdbdb";
        }
        
        cardCont.innerHTML += `<h3>${data.posts[i].title}</h3><p>${data.posts[i].content}</p> `
        footer.innerHTML = `<p>${date}</p>`
        card.id = `post-${i}`;
    }
}

//slett post --------------------------------
async function deletePost(evt) {
    let currentPost = {postId: evt.currentTarget.id};
    appF7.dialog.alert('Innlegget er slettet!', function () {
        location.reload();
    });

    let res = await sendData(currentPost, `/app/feed/deletePost`);
    res = await res.json();
    eval(res.event); 
}

