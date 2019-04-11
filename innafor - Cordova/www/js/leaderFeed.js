async function feedPage(){
   selectGroups();
    let data = await listOutData();
    createCards(data);  
}

async function selectGroups(){
    let groups = await getData(`/app/feed/getGroups`);
    groups = await groups.json();
    console.log(groups.groups[0]);
    var option;

    for (let i = 0; i < groups.groups.length; i++){
        option = document.createElement("option");
        option.value = groups.groups[i];
        option.innerHTML = groups.groups[i];
        getId("groupSelect").appendChild(option);  
    }
}

function sel(){
    let selected = document.querySelector("[type=radio]:checked"); // css selector
    console.log(selected);
    //return selected;
}

//lag ny post til wordpress --------------------------------
 async function postToWp(){
    let title = getId("postTitle").value;
    let content = getId("postTxt").value;
    let img = getId("inpImg").value;  
    getId("imgPreview").innerHTML = img;

    let postData = {
        title: title,
        content: content + img,
        status: "publish"
    }
    
    console.log(postData);
    let res = await sendData(postData, `/app/feed/createPost`);
    res = await res.json();
    eval(res.event);
 }

//hente ned og viser posts --------------------------------
async function listOutData() {
    let data = await getData(`/app/feed/showPosts`);
    data = await data.json();
    return data;
}

function createCards(data){
    console.log(data.sort); 
    for (let i = 0; i < data.sort.length ; i++){
        let card = document.createElement("div");
        let header = document.createElement("div");
        let cardCont = document.createElement("div");
        let footer = document.createElement("div");

        card.classList.add("card");
        getId("showPostCont").appendChild(card);

        header.classList.add("card-header");
        card.appendChild(header); 
       
        cardCont.classList.add("card-content");
        card.appendChild(cardCont); 
        
        footer.classList.add("card-footer");
        card.appendChild(footer);
        //header.innerHTML = `<p>${author}</p>`
        cardCont.innerHTML = `<h3>${data.sort[i].title}</h3><p>${data.sort[i].content}</p> `//<img  src=${posts[i].img} height="200" >
        footer.innerHTML = `<p>${data.sort[i].date}</p>`
        card.id = `post-${i}`
    }
}


