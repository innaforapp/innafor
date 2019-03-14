//Hjelpefunksjoner
function getId(id) {
    return document.getElementById(id);
}

function getClass(className) {
    return document.getElementsByClassName(className);
}


function sendData(data, endpoint) {
    return fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(data)
    }).then(data => {
        return data;
    });
}


//Send in ID til form, endpoint, og ID på tekstfelt som skal skrive ut feedback
// TODO: If-statment underder data for å sjekke om det finnes en token i localstorage og legg til i Data-object. If-statment hvis res.token kommer fra server, sett denne i localstorage.
async function sendForm(formId, endpoint, feedbackMsg){

    let form = getId(formId);
    let data = {};
  
    for (i = 0; i < form.length ;i++){
        data[form.elements[i].name] = form.elements[i].value;
    }
   
    let res = await sendData(data, endpoint);

    if (res.status === 200){
        res = await res.json();
        localStorage.setItem("token", res.token);
    }else{
        res = await res.json();
        let msg = getId(feedbackMsg);
        msg.innerHTML = res.feedback
    }
    
   // mainView.router.navigate({ name: 'main' });
  }
  





