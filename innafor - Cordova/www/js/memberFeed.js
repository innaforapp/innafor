async function memberFeed(){
    let data = await listOutData();
    createCards(data);    
}

//hente ned og viser posts --------------------------------
async function listOutData() {
    let data = await getData(`/app/feed/showPosts`);
    data = await data.json();
    return data;
}

function createCards(data) {
    console.log(data.fromOrg);
    var posts = data.posts;

   /* if (data.posts.length > 1) {
        console.log("større enn")
        for (let i = 1; i < data.posts.length; i++) {
            posts = data.posts[0].concat(data.posts[i]);
            console.log(posts);
        }
    }*/
    console.log(data.posts[1]);

    /*for (let i = 0; i < posts.length; i++) {
        let card = document.createElement("div");
        let header = document.createElement("div");
        let cardCont = document.createElement("div");
        let footer = document.createElement("div");

        card.classList.add("card");
        getId("memberShowPosts").appendChild(card);

        header.classList.add("card-header");
        card.appendChild(header);

        cardCont.classList.add("card-content", "card-content-padding");
        card.appendChild(cardCont);

        footer.classList.add("card-footer");
        card.appendChild(footer);

        let d = new Date(`${posts[i].date}`);
        let date = d.toDateString();

        //header.innerHTML = `<p>${posts[i].customFields[0].value}</p> `;
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
        getId("memberShowPosts").appendChild(card);

        header.classList.add("card-header");
        card.appendChild(header);

        cardCont.classList.add("card-content", "card-content-padding");
        card.appendChild(cardCont);

        footer.classList.add("card-footer");
        card.appendChild(footer);

        var d = new Date(`${data.fromOrg[i].date}`);
        let date = d.toDateString();

        //header.innerHTML = `<p>${posts[i].customFields[0].value}</p> `;
        let btnDel = document.createElement("i"); btnDel.innerHTML = "delete";
        btnDel.classList.add("material-icons"); btnDel.id = posts[i].id;
        btnDel.addEventListener("click", deletePost);
        header.appendChild(btnDel);

        cardCont.innerHTML = `<h3>${data.fromOrg[i].title}</h3><p>${data.fromOrg[i].content}</p> `
        footer.innerHTML = `<p>${date}</p>`
        card.id = `post-${i}`
    }*/
}