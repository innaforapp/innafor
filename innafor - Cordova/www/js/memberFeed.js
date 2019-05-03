async function memberFeed(){
    let data = await listOutPosts();
    createCardsPost(data); 
}

//hente ned og viser posts --------------------------------
async function listOutPosts() {
    let data = await getData(`/app/feed/showPosts`);
    data = await data.json();
    return data;
}
function createCardsPost(data) {
    data.posts.sort(function (a, b) {
        let dataA = new Date(a.date), dateB = new Date(b.date)
        return dateB - dataA;
    });

    for (let i = 0; i < data.posts.length; i++) {
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

        let d = new Date(`${data.posts[i].date}`);
        let date = d.toDateString();

        header.innerHTML += `<p>${data.posts[i].customFields[0].value}</p> `;

        if (data.posts[i].customFields[1].value == "org") {
            card.style.backgroundColor = "#dbdbdb";
        }

        cardCont.innerHTML += `<h3>${data.posts[i].title}</h3><p>${data.posts[i].content}</p> `
        footer.innerHTML = `<p>${date}</p>`
        card.id = `post-${i}`;
    }
}