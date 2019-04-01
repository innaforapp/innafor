
async function feedPage(){
    let data = await loadData();
    createCards(data);
    
}

var postsTemp = [
    {
        header: "Ola Nordmann",
        post: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        img: '../img/logo.png',
        footer: "27.03.2017"
    },
    {
        header: "Kari Nordmann",
        post: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        img: '../img/soccer_beach.jpg',
        footer: "27.03.2017"
    },
    {
        header: "Solveig Bekkens",
        post: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        img: '../img/soccer_friendship_s.jpg',
        footer: "27.03.2017"
    }    
];


async function loadData() {
    let url = "https://feed.innaforapp.no/api/get_posts/";
    try {
        let data = await fetch(url);
        data = await data.json();        
        
        return data;
    } 
    catch(error) {
        console.log(error);
    }
}

let form = getId("postForm");

function createCards(data){
    console.log(data.posts);
    for(let i=0; i < data.posts.length; i++){
        let card = document.createElement("div");
        let header = document.createElement("div");
        let cardCont = document.createElement("div");
        let footer = document.createElement("div");

        card.classList.add("car");
        getId("showPostCont").appendChild(card);

        header.classList.add("card-header");
        card.appendChild(header); 
       
        cardCont.classList.add("card-content");
        card.appendChild(cardCont); 
        
        footer.classList.add("card-footer");
        card.appendChild(footer);

        header.innerHTML = `<p>${data.posts[i]}</p>`
        /*scardCont.innerHTML = `<p>${posts[i].post}</p> <img  src=${posts[i].img} height="200" >`
        footer.innerHTML = `<p>${posts[i].footer}</p>`*/
        card.id = `post${i}`;
        console.log("lager cards"); 
    }
}

