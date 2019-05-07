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
        //eval(res.event);        
        
    }

    function alert() {
        appF7.dialog.alert("Vennligst fyll ut alle felter");
     }

    function alertDone() {
        appF7.dialog.alert('Innlegget er publisert!', async function () {
            //location.reload();
            let data = await listOutData();
            createCards(data);
            title.value = ""; content.value = ""; selected.value = "";
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
    getId("showPostCont").innerHTML = "";

    let mediaList = document.createElement("div");
    mediaList.className = "list media-list inset";//??
    let ul = document.createElement("ul");
    mediaList.appendChild(ul);

    for (let i = 0; i < data.posts.length; i++) {
        const post =  data.posts[i];
        let name = data.posts[i].customFields[0].value;
        let group = "";

        let li = document.createElement("li");
        li.className ="item-content";

        let d = new Date(`${post.date}`);
        let date = d.toDateString();
        
        if (post.customFields[1].value == "org") {
            let editName = name.split("-");
            name = editName[1]  
            li.style.backgroundColor = "#F9F9F9";
        }
        else{
            let editGroupName = post.terms[0].name.split("-");
            console.log(editGroupName)
            group = editGroupName[1]+"-"+editGroupName[2]+"-"+editGroupName[3]
        }




        //Profile Img
        let profileImg = document.createElement("div");
        profileImg.className = "item-media"
        profileImg.innerHTML = `<i class="icon material-icons">person</i>`  
        li.appendChild(profileImg);
        //

        //Post content
        let postContent = document.createElement("div");
        postContent.className = "item-inner";
        let postOwner = document.createElement("div");
        postOwner.className = "item-title-row"
        postOwner.innerHTML = ` <div class="item-title">${name}</div>`
        postOwner.style.textTransform = "capitalize"
        postContent.appendChild(postOwner);


        if (post.customFields[1].value == "leader"){
            let btnDel = document.createElement("i");
            btnDel.innerHTML = "delete";
            btnDel.classList.add("material-icons");
            btnDel.id = post.id;
            btnDel.addEventListener("click", deletePost);
            postOwner.appendChild(btnDel);
        }

        let toGroup = document.createElement("div");
        toGroup.className = "item-subtitle";
        toGroup.innerHTML = group;
        toGroup.style.textTransform = "capitalize"
        postContent.appendChild(toGroup);
        
        let title = document.createElement("div");
        title.className = "item-subtitle";
        title.innerHTML = date;
        postContent.appendChild(title);

        let h3 = document.createElement("h4");
        h3.innerHTML = post.title;
        postContent.appendChild(h3);
        let text = document.createElement("p");
        text.innerHTML = post.content
        postContent.appendChild(text);
        ///
        li.appendChild(postContent);
        ul.appendChild(li);
        
    }
    getId("showPostCont").appendChild(mediaList);




    /*
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
    }*/
}

//slett post --------------------------------
async function deletePost(evt) {
    let currentPost = {postId: evt.currentTarget.id};
    appF7.dialog.alert('Innlegget er slettet!', async function () {
        //location.reload();
        let data = await listOutData();
        createCards(data);
    });
    console.log("hey2")
    let res = await sendData(currentPost, `/app/feed/deletePost`);
    res = await res.json();
    //eval(res.event); 

}

