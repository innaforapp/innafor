function logOut() {
    localStorage.removeItem('token');
    mainView.router.navigate({
        name: 'login'
    });
}

function welcome() {
    let name = window.localStorage.getItem('firstname');
    let textbox = document.querySelector('#welcomeText');

    textbox.innerHTML = `Velkommen, ${name}!`;
}

function showCurrentEmail(newEmail) {
    if (newEmail){
        window.localStorage.setItem('email', newEmail);
    }
    
    let email = window.localStorage.getItem('email');
    let mailTextBox = document.querySelector('#currentEmail');
    
    mailTextBox.innerHTML = email;
}
