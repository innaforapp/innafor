async function feedPage(){
   selectGroups();
    let data = await listOutData();
    createCards(data);    
}

//TODO: sorter post etter dato

//TODO refresh post-innhold når man har sendt inn en ny post

async function selectGroups(){
    let groups = await getData(`/app/feed/getGroups`);
    groups = await groups.json();
    //console.log(groups.groups);
    
    var pickerDevice = appF7.picker.create({
        inputEl: '#inpGroup',
        cols: [{
            textAlign: 'center',
            values: groups.groups,
        }],
        toolbarCloseText: 'Ferdig'
    });
}

//lag ny post til wordpress --------------------------------
async function uploadeImg() {
    let filename = getId("inpImg").files[0].name;
    console.log(filename);

   /*let res = await sendData(filename, `/app/feed/uploadeImg`);
    res = await res.json();
    eval(res.event);*/
}

async function postToWp(){
    let selected = document.querySelector('#inpGroup');
    console.log(selected.value);

    let title = getId("postTitle");
    let content = getId("postTxt");
    
    let postData = {
        title: title.value,
        groups: selected.value
    } 

    if (!title.checkValidity()){
        $$('#btnPost').on('click', alert());
    }
    if (!content.checkValidity()){
        getId("checkValidity").innerHTML = content.validationMessage + "Innhold";
        $$('#btnPost').on('click', alert());
    }
    if (selected.value ==""){
        $$('#btnPost').on('click', alert());
    } 
    else{
        let res = await sendData(postData, `/app/feed/createPost`);
        res = await res.json();
        eval(res.event);
        title.value = ""; content.value = ""; selected.value = "";
        createCards(data);    
    }   

    function alert() {
        console.log("trykk")
        appF7.dialog.alert("Vennligst fyll ut alle felter");
     }
 } 

//hente ned og viser posts --------------------------------
async function listOutData(){
    let data = await getData(`/app/feed/showPosts`);
    data = await data.json();
    return data;
}

function createCards(data){
    console.log(data.fromOrg);    

    for (let i = 1; i < data.posts.length; i++) {
        var posts = data.posts[0].concat(data.posts[i]);        
    }
    console.log(posts);

    for (let i = 0; i < posts.length; i++){
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

        let d = new Date(`${posts[i].date}`);
        let  date = d.toDateString();

        header.innerHTML = `<p>${posts[i].customFields[0].value}</p> `;
        let btnDel = document.createElement("i"); btnDel.innerHTML = "delete";
        btnDel.classList.add("material-icons"); btnDel.id = posts[i].id;
        btnDel.addEventListener("click", deletePost);
        header.appendChild(btnDel);
        
        cardCont.innerHTML += `<h3>${posts[i].title}</h3><p>${posts[i].content}</p> `
        footer.innerHTML = `<p>${date}</p>`
        card.id = `post-${i}`;
    }
    
    for (let i = 0; i < data.fromOrg.length; i++) {
        let card = document.createElement("div");
        let header = document.createElement("div");
        let cardCont = document.createElement("div");
        let footer = document.createElement("div");

        card.classList.add("card");
        card.style.backgroundColor = "#dbdbdb";
        getId("showPostCont").appendChild(card);

        header.classList.add("card-header");
        card.appendChild(header);

        cardCont.classList.add("card-content", "card-content-padding");
        card.appendChild(cardCont);

        footer.classList.add("card-footer");
        card.appendChild(footer);

        var d = new Date(`${data.fromOrg[i].date}`);
        let date = d.toDateString();

        header.innerHTML = `<p>${posts[i].customFields[0].value}</p> `;
        let btnDel = document.createElement("i"); btnDel.innerHTML = "delete";
        btnDel.classList.add("material-icons"); btnDel.id = posts[i].id;
        btnDel.addEventListener("click", deletePost);
        header.appendChild(btnDel);

        cardCont.innerHTML = `<h3>${data.fromOrg[i].title}</h3><p>${data.fromOrg[i].content}</p> `
        footer.innerHTML = `<p>${date}</p>`
        card.id = `post-${i}`
    }
}

//slett post --------------------------------
async function deletePost(evt) {
    let currentPost = evt.currentTarget.id;
    console.log("slett " + currentPost);

   /* let res = await sendData(currentPost, `/app/feed/deletePost/`);
    res = await res.json();
    eval(res.event);
    //listOutData();*/
}

