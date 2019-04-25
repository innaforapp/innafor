$$(document).on('page:init', '.page[data-name="orgOverview"]', async function (e) {
    let orgs = await getData(`/app/brukere/getOrgs`);
    orgs = await orgs.json();
    console.log(orgs)

    loadOrgs(orgs)

});


function loadOrgs(orgs){


    let orgContainer = document.querySelector('#orgContainer');
    orgContainer.innerHTML = '';
    let div = document.createElement('div');
    div.classList.add('list');
    div.classList.add('inset');
    let ul = document.createElement('ul');
    //ul.style.textTransform = 'capitalize';
    
    for (let i = 0; i < orgs.length; i++) {
            let listElement =
            `<li id='org${orgs[i].brukerid}' class="swipeout">`+
                `<div class="item-content swipeout-content">`+
                    `<div class="item-media">`+
                        `<i class="icon material-icons">person</i>`+
                    `</div>`+
                    `<div class="item-inner">`+
                        `<div class="item-title" style="textTransform:capitalize">${orgs[i].navn}</div>`+
                        `<div class="item-after">${orgs[i].epost}</div>`+
                    `</div>`+
                `</div>`+
                `<div class="swipeout-actions-right">`+
                    `<a href="#" class="swipeout-delete" data-confirm="Er du sikker på at du vil fjerne organisasjonen og all data knyttet til den?" data-confirm-title="Slette?">Slett</a>`+
                `</div>`+
            `</li>`;
        
        ul.innerHTML += listElement;
    }

    div.appendChild(ul);
    orgContainer.appendChild(div);


}




async function  deleteOrg(id){
    console.log(id)

}
