const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmarks-container');

let bookmarks=[];


//show modal,focus on input
function showModal() {
   modal.classList.add('show-modal');
   websiteNameEl.focus();
}

// modal event listener
modalShow.addEventListener('click',showModal);
modalClose.addEventListener('click',()=>modal.classList.remove('show-modal'));
window.addEventListener('click',(e)=>(e.target===modal ? modal.classList.remove('show-modal'):false));

//validate Form
function validate(nameValue,urlValue){
    const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    const regex = new RegExp(expression);
    if(!nameValue||!urlValue){
        alert('please submit values for both fields');
    }
    if(!urlValue.match(regex)){
     alert('please entere a valid web address');
     return false;
    }
    return true;
}
//bulid bookmarks Dom
function buildBookmarks(){
    //remove all bookmarks elements
    bookmarksContainer.textContent='';
    //build items
    bookmarks.forEach((bookmark)=>{
        const {name,url}=bookmark;
        //items
        const item = document.createElement('div');
        item.classList.add('item');
        //close icon
        const closeIcon = document.createElement('i');
        closeIcon.classList.add('fas','fa-times');
        closeIcon.setAttribute('title','Delete Bookmarks');
        closeIcon.setAttribute('onclick',`deleteBookmark('${url}')`);
        //favicon /link contaner
        const linkInfo = document.createElement('div');
        linkInfo.classList.add('name');
        //favicon
        const favicon = document.createElement('img');
        favicon.setAttribute('src',`https://s2.googleusercontent.com/s2/favicons?domain=${url}`);
        favicon.setAttribute('alt','favicon');
        //link 
        const link = document.createElement('a');
        link.setAttribute('href',`${url}`);
        link.setAttribute('target','-blank');
        link.textContent=name;
        //append to bookmarks container
        linkInfo.append(favicon,link);
        item.append(closeIcon,linkInfo);
        bookmarksContainer.appendChild(item);
    });
}




// Delete bookmarks
function deleteBookmark(url){
    bookmarks.forEach((bookmark,i)=>{
        if (bookmark.url===url){
            bookmarks.splice(i,1);
        }
    });
    //update bookmarks array in localstorage , repopulate dom
    localStorage.setItem('bookmarks',JSON.stringify(bookmarks));
    fetchBookmarks();
}




//fetch bookmarks 
function fetchBookmarks() {
    //get bookmarks from localstorage if available
    if(localStorage.getItem('bookmarks')){
        bookmarks=JSON.parse(localStorage.getItem('bookmarks'));
    }else{
        //creat bookmarks array in localstorage
        bookmarks=[
            
        ];
        localStorage.setItem('bookmarks',JSON.stringify(bookmarks));
    }
    buildBookmarks();
}




//handle data form 
function storeBookmark(e) {
    e.preventDefault();
    const nameValue = websiteNameEl.value;
    let urlValue = websiteUrlEl.value;
    if(!urlValue.includes('http://')&& !urlValue.includes('https://')){
        urlValue=`https://${urlValue}`;
    }
    if(!validate(nameValue,urlValue)){
        return false;
    } 
    const bookmark={
        name:nameValue,
        url:urlValue,
    };
    bookmarks.push(bookmark);
    console.log(bookmarks);
    localStorage.setItem('bookmarks',JSON.stringify(bookmarks));
    fetchBookmarks();
    bookmarkForm.reset();
    websiteNameEl.focus();
}



//even listener
bookmarkForm.addEventListener('submit',storeBookmark);

//on load
fetchBookmarks();