function logOut (){
    localStorage.removeItem('token');
    mainView.router.navigate({
            name: 'login'
        });
}