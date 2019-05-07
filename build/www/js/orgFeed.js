async function orgFeed() {
    let data = await listOutDataOrg();
    createCardsOrg(data);
}

async function postToWpOrg() {

    let title = getId("postTitleOrg");
    let content = getId("postTxtOrg");

    let group = await getData(`/app/feed/getGroups`);
    group = await group.json();
    let grp = group.groups.toString();

    let postData = {
        title: title.value,
        cont: content.value,
        groups: grp
    }

    if (!title.checkValidity()) {
        $$('#btnPostOrg').on('click', alert());
    }
    if (!content.checkValidity()) {
        $$('#btnPostOrg').on('click', alert());
    }
    else {
        $$('#btnPostOrg').on('click', alertDone());
        let res = await sendData(postData, `/app/feed/createPost`);
        res = await res.json();
        eval(res.event);
        title.value = ""; content.value = "";
    }

    function alert() {
        appF7.dialog.alert("Vennligst fyll ut alle felter");
    }

    function alertDone() {
        appF7.dialog.alert('Innlegget er publisert!', async function () {
            //location.reload();
            let data = await listOutDataOrg();
            createCardsOrg(data);
        });
    }
}

//hente ned og viser posts --------------------------------
async function listOutDataOrg() {
    let data = await getData(`/app/feed/showPosts`);
    data = await data.json();
    return data;
}
function createCardsOrg(data) {
    data.posts.sort(function (a, b) {
        let dataA = new Date(a.date), dateB = new Date(b.date)
        return dateB - dataA;
    });
    getId("orgShowPosts").innerHTML ="";


    let mediaList = document.createElement("div");
    mediaList.className = "list media-list";//??
    let ul = document.createElement("ul");
    mediaList.appendChild(ul);

    for (let i = 0; i < data.posts.length; i++) {
        const post =  data.posts[i];
        let name = data.posts[i].customFields[0].value;

        let li = document.createElement("li");
        li.className ="item-content";

        let d = new Date(`${post.date}`);
        let date = d.toDateString();
        
 

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


        let btnDel = document.createElement("i");
        btnDel.innerHTML = "delete";
        btnDel.classList.add("material-icons");
        btnDel.id = post.id;
        btnDel.addEventListener("click", deletePost);
        postOwner.appendChild(btnDel);
    

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
    getId("orgShowPosts").appendChild(mediaList);

    /*
    for (let i = 0; i < data.posts.length; i++) {
        let card = document.createElement("div");
        let header = document.createElement("div");
        let cardCont = document.createElement("div");
        let footer = document.createElement("div");

        card.classList.add("card");
        getId("orgShowPosts").appendChild(card);

        header.classList.add("card-header");
        card.appendChild(header);

        cardCont.classList.add("card-content", "card-content-padding");
        card.appendChild(cardCont);

        footer.classList.add("card-footer");
        card.appendChild(footer);

        let d = new Date(`${data.posts[i].date}`);
        let date = d.toDateString();

        header.innerHTML += `<p>${data.posts[i].customFields[0].value}</p> `;
        let btnDel = document.createElement("i");
        btnDel.innerHTML = "delete";
        btnDel.classList.add("material-icons");
        btnDel.id = data.posts[i].id;
        btnDel.addEventListener("click", deletePostOrg);
        header.appendChild(btnDel);

        cardCont.innerHTML += `<h3>${data.posts[i].title}</h3><p>${data.posts[i].content}</p> `
        footer.innerHTML = `<p>${date}</p>`
        card.id = `post-${i}`;
    }*/
}

//slett post --------------------------------
async function deletePostOrg(evt) {
    let currentPost = { postId: evt.currentTarget.id };
    appF7.dialog.alert('Innlegget er slettet!', async function () {
        //location.reload();
        let data = await listOutDataOrg();
        createCardsOrg(data);
    });

    let res = await sendData(currentPost, `/app/feed/deletePost`);
    res = await res.json();
    eval(res.event);
}

