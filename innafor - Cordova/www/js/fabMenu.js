function onTabOpen() {

if(document.getElementById('myFab')){

    let myFab = document.getElementById('myFab');
    myFab.onclick = closeFab;

    let tab2 = document.getElementById('tab-2-btn');
    tab2.onclick = openFab;
    
    let tab1 = document.getElementById('tab-1-btn');
    tab1.onclick = closeFab;
    
    let tabMore = document.getElementById('more-btn');
    tabMore.onclick = closeFab;
    
    let overlay = document.querySelector('.overlay');
    overlay.onclick = closeFab;
}
}

function openFab() {
    console.log('openFab');
    
    let overlay = document.querySelector('.overlay');
    overlay.style.display = 'block';
    
    myFab.classList.add('fab-opened');
}

function closeFab() {
    console.log('closeFab');
    
    let overlay = document.querySelector('.overlay');
    overlay.style.display = 'none';
    
    myFab.classList.remove('fab-opened');
}

