
function feedPage(){
    createCards();
}

var ajaxurl = "<?php echo $site_url; ?>";

var posts = [
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
let form = getId("postForm");

jQuery(function () {
    console.log("hei");//pasrt 5
    
    jQuery('#postForm').on('submit', function(){
        /*var formData = jQuery(this).serialize();
        console.log("formDatat" + formData);*/
        jQuery.post(ajaxurl + "/api/get_nonce/?controller=posts&method=create_post", function(response){
            console.log(response);
            var nonce = response.nonce;
            var frmdata = "nonce=" + nonce + "&" + jQuery("#postForm").serialize() + "&status=publish";

            jQuery.post(ajaxurl + "/api/posts/create_post/", frmdata, function (response) {
                alert("Post has been created");
                /*setTimeout(function () {
                    location.reload();
                }, 1200);*/
            });
        });
    });
})

function createCards(){
    console.log(posts);
    for(let i=0; i < posts.length; i++){
        let card = document.createElement("div");
        let header = document.createElement("div");
        let cardCont = document.createElement("div");
        let footer = document.createElement("div");
        let div2;

        card.classList.add("car");
        getId("showPostCont").appendChild(card);

        header.classList.add("card-header");
        card.appendChild(header); 
       
        cardCont.classList.add("card-content");
        card.appendChild(cardCont); 
        
        footer.classList.add("card-footer");
        card.appendChild(footer);

        header.innerHTML = `<p>${posts[i].header}</p>`
        cardCont.innerHTML = `<p>${posts[i].post}</p> <img  src=${posts[i].img} height="200" >`
        footer.innerHTML = `<p>${posts[i].footer}</p>`
        card.id = `post${i}`;
        console.log("lager cards"); 
    }
}