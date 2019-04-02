async function feedPage(){
    getId("btnSendPost").onclick = postToWp();
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
let author = localStorage.getItem("firstname");

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

async function postToWp(){
    console.log("sendt");
    var fdata = new FormData();
        fdata.append("title", getId("postTitle").value);
        fdata.append("image", getId("inpImg").files[0]);
        fdata.append("postCont", getId("postTxt").value);

    var cfg = { //fetchSettings
        method: "POST",
        body: fdata
    }

    let url = "https://feed.innaforapp.no";   
    await fetch(url+"/api/get_nonce/?controller=posts&method=create_post", function (response){
        var nonce = response.nonce;
        var frmdata = "nonce=" + nonce + "&" + getId("postFormt").serialize() + "&status=publish";

        await fetch(url + "/api/posts/create_post/", frmdata, function (response) {
            let newPost = await response.json();
            console.log(newPost); 
        });
    });    
}

/*
        jQuery.post(ajaxurl + "/api/get_nonce/?controller=posts&method=create_post", function (response) {
            //debugger;
            var nonce = response.nonce;
            var frmdata = "nonce=" + nonce + "&" + jQuery("#frmCreateNewWpPost").serialize() + "&status=publish";

            jQuery.post(ajaxurl + "/api/posts/create_post/", frmdata, function (response) {

*/

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

        header.innerHTML = `<p>${author}</p>`
        cardCont.innerHTML = `<h3>${data.posts[i].title}</h3><p>${data.posts[i].content}</p> `//<img  src=${posts[i].img} height="200" >
        footer.innerHTML = `<p>${data.posts[i].date}</p>`
        card.id = `post${i}`;
        console.log("lager cards"); 
    }
}


