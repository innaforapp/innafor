async function initMyGroupsLeader() {

    let groups = await getData(`/app/brukere/getMyGroups`);
    groups = await groups.json();

    var pickerDevice = appF7.picker.create({
        inputEl: '#inputGroup',
        cols: [{
            textAlign: 'center',
            values: groups.groups,
        }],
        toolbarCloseText: 'Ferdig',
        on: {close: loadGroup}
    });

}


async function initMyGroupsOrg() {

    let groups = await getData(`/app/brukere/getOrgGroups`);
    groups = await groups.json();

    var pickerDevice = appF7.picker.create({
        inputEl: '#inputGroup',
        cols: [{
            textAlign: 'center',
            values: groups.groups,
        }],
        toolbarCloseText: 'Ferdig',
        on: {close: loadOrgGroups}
    });
}



async function loadGroup() {
    let inputGroup = document.querySelector('#inputGroup');
    window.localStorage.setItem('deleteUserFromGroup', inputGroup.value);

    
    // CREATE GROUP LIST
    
    let users = await getUsers(`/app/brukere/getUsersInGroup`, inputGroup.value);
    users = await users.json();
    
    
    let groupContainer = document.querySelector('#groupContainer');
    groupContainer.innerHTML = '';
    let div = document.createElement('div');
    div.classList.add('list');
    div.classList.add('inset');
    let ul = document.createElement('ul');
    ul.style.textTransform = 'capitalize';
    
    for (let i = 0; i < users.length; i++) {
        if (users[i].rolle == 'leader'){
            let listElement =
            `<li id='user${users[i].brukerid}' class="swipeout">`+
                `<div class="item-content swipeout-content">`+
                    `<div class="item-media">`+
                        `<i class="icon material-icons">person</i>`+
                    `</div>`+
                    `<div class="item-inner">`+
                        `<div class="item-title">${users[i].navn}</div>`+
                        `<div class="item-after">Trener</div>`+
                    `</div>`+
                `</div>`+
            `</li>`;
        
        ul.innerHTML += listElement;
        }
        
        
    }
    
    for (let i = 0; i < users.length; i++) {
        if (users[i].rolle == 'member'){
            let listElement =
            `<li id='user${users[i].brukerid}' class="swipeout">`+
                `<div class="item-content swipeout-content">`+
                    `<div class="item-media">`+
                        `<i class="icon material-icons">person</i>`+
                    `</div>`+
                    `<div class="item-inner">`+
                        `<div class="item-title">${users[i].navn}</div>`+
                        `<div class="item-after">Medlem</div>`+
                    `</div>`+
                `</div>`+
                `<div class="swipeout-actions-right">`+
                    `<a href="#" class="swipeout-delete" data-confirm="Er du sikker på at du vil fjerne denne personen fra gruppen din?" data-confirm-title="Fjerne person?">Fjern</a>`+
                `</div>`+
            `</li>`;
        
        ul.innerHTML += listElement;
        }
    }
    
    
    div.appendChild(ul);
    groupContainer.appendChild(div);
    
}


async function loadOrgGroups(){
    let inputGroup = document.querySelector('#inputGroup');
    window.localStorage.setItem('deleteUserFromGroup', inputGroup.value);

    
    // CREATE GROUP LIST
    
    let users = await getUsers(`/app/brukere/getUsersInGroup`, inputGroup.value);
    users = await users.json();
    
    
    let groupContainer = document.querySelector('#groupContainerOrg');
    groupContainer.innerHTML = '';
    let div = document.createElement('div');
    div.classList.add('list');
    div.classList.add('inset');
    let ul = document.createElement('ul');
    ul.style.textTransform = 'capitalize';
    
    for (let i = 0; i < users.length; i++) {
        if (users[i].rolle == 'leader'){
            let listElement =
            `<li id='user${users[i].brukerid}' class="swipeout">`+
                `<div class="item-content swipeout-content">`+
                    `<div class="item-media">`+
                        `<i class="icon material-icons">person</i>`+
                    `</div>`+
                    `<div class="item-inner">`+
                        `<div class="item-title">${users[i].navn}</div>`+
                        `<div class="item-after">Trener</div>`+
                    `</div>`+
                `</div>`+
                `<div class="swipeout-actions-right">`+
                `<a href="#" class="swipeout-delete" data-confirm="Er du sikker på at du vil fjerne denne personen fra gruppen din?" data-confirm-title="Fjerne person?">Fjern</a>`+
            `</div>`+
            `</li>`;
        
        ul.innerHTML += listElement;
        }
        
        
    }
    
    for (let i = 0; i < users.length; i++) {
        if (users[i].rolle == 'member'){
            let listElement =
            `<li id='user${users[i].brukerid}' class="swipeout">`+
                `<div class="item-content swipeout-content">`+
                    `<div class="item-media">`+
                        `<i class="icon material-icons">person</i>`+
                    `</div>`+
                    `<div class="item-inner">`+
                        `<div class="item-title">${users[i].navn}</div>`+
                        `<div class="item-after">Medlem</div>`+
                    `</div>`+
                `</div>`+
                `<div class="swipeout-actions-right">`+
                    `<a href="#" class="swipeout-delete" data-confirm="Er du sikker på at du vil fjerne denne personen fra gruppen din?" data-confirm-title="Fjerne person?">Fjern</a>`+
                `</div>`+
            `</li>`;
        
        ul.innerHTML += listElement;
        }
    }
    
    
    div.appendChild(ul);
    groupContainer.appendChild(div);
    
}




function getUsers(endpoint, groupId) {

    return fetch((url + endpoint), {
        method: "GET",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "x-access-auth": localStorage.getItem("token"),
            "Group": groupId
        }
    });
};

async function deleteUser (id, group) {
    let token = localStorage.getItem("token");
    let data = {
        id: id,
        group: group,
        token: token
    };

    let res = await sendData(data, `/app/brukere/delete`);
    res = await res.json();
    eval(res.event);
}