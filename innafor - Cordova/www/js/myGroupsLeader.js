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


async function loadGroup() {
    let inputGroup = document.querySelector('#inputGroup');
    window.localStorage.setItem('deleteUserFromGroup', inputGroup.value);

    console.log(inputGroup.value);
    
    // CREATE GROUP LIST
    
    let users = await getUsers(`/app/brukere/getUsersInGroup`, inputGroup.value);
    users = await users.json();
    
    console.log(users);
    
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
                        `<div class="item-after">${users[i].rolle}</div>`+
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
                        `<div class="item-after">${users[i].rolle}</div>`+
                    `</div>`+
                `</div>`+
                `<div class="swipeout-actions-right">`+
                    `<a href="#" class="swipeout-delete">Slett</a>`+
                `</div>`+
            `</li>`;
        
        ul.innerHTML += listElement;
        }
    }
    
    
    div.appendChild(ul);
    groupContainer.appendChild(div);
    
}

function getUsers(endpoint, groupId) {
    console.log(url + endpoint);
    console.log(groupId);
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