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

function showCurrentEmail() {
    let email = window.localStorage.getItem('email');
    let mailTextBox = document.querySelector('#currentEmail');

    console.log(email);
    console.log(mailTextBox);
    mailTextBox.innerHTML = email;
}
