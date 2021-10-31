const myTable=document.querySelector("#myTable");
const bookForm=document.querySelector("#bookForm");
const submitButton=document.querySelector('input[type=submit]');
const title=document.querySelector('#title');
const author=document.querySelector('#author');
const pages=document.querySelector("#pages");
const radios=Array.from(document.querySelectorAll("input[type=radio]"));
const rows=myTable.getElementsByTagName("tr");
const errorP=Array.from(document.querySelectorAll(".error"));
const titleDiv=document.querySelector(".title-div");
const authorDiv=document.querySelector(".author-div");
const pagesDiv=document.querySelector(".pages-div");
let item,items,buttonCell,changeCell;
let myLibrary=[
    
];

class Book{//constructor
    constructor(title,author,pages,read){
        this.title=title;
        this.author=author;
        this.pages=pages,
        this.read=read;
    }    
}

function showError(type,index){
    
   if(type.name==="pages"){
       console.log(type.validity)
       console.log("sad")
       if(type.validity.rangeUnderflow){
           console.log("XD")
        errorP[index].textContent = `${type.name} should be at between ${type.min} and ${type.max} characters; you entered ${ type.value }.`;
       }else if(type.validity.rageOverFlow){
           console.log(type.value)
       }
   }
    if(type.validity.valueMissing) {
        
        errorP[index].textContent = 'You need to enter an e-mail address.';
      }else if(type.validity.tooShort) {
        // If the data is too short,
        // display the following error message.
        errorP[index].textContent = `${type.name} should be at least ${ type.minLength } characters; you entered ${ type.value.length }.`;
      }
    
      // Set the styling appropriately
      errorP[index].style.display='block';
    }


title.addEventListener("input",(e)=>{
    if(title.validity.valid){
        authorDiv.style.border="";
        errorP[0].style.display='none'
    }
    if(title.validity.tooShort){        
        showError(title,0)
    }
});

author.addEventListener("input",e=>{
    if(author.validity.valid){
        authorDiv.style.border="";
        errorP[1].style.display='none'
    }
    if(author.validity.tooShort){        
        showError(author,1)
    }
})

pages.addEventListener("input",e=>{
    if(pages.validity.valid){
        
        pagesDiv.style.border="";
        errorP[2].style.display='none'
    }
    if(!pages.validity.valid){   
        
        showError(pages,2)
    }
})

function validation(){    
    let valid=true;    
    if(title.value<2){  
        valid=false;     
        titleDiv.style.border="1px solid red";
        errorP[0].style.display='block';
        
        
    }else{        
        titleDiv.style.border="";
        errorP[0].style.display='none'
    }

    if(author.value<2){
        valid=false;
        errorP[1].style.display='block';
        authorDiv.style.border="1px solid red";
    }else{
        errorP[1].style.display='none';
        authorDiv.style.border="";
    }
    
    if(parseInt(pages.value)<5 || parseInt(pages.value)>9999 || !parseInt(pages.value)){
        valid=false;
        pagesDiv.style.border="1px solid red";
        errorP[2].style.display='block';
    }else{
        pagesDiv.style.border="";
        errorP[2].style.display='none';
    }
    return valid;
}

function deleteItem(item){  
    let value = parseInt(item.target.value);
    myLibrary.splice(value, 1);
    myTable.deleteRow(value + 1);
    for(i=value+1;i<rows.length;i++){        
        item = rows[i].getElementsByTagName("button");
        console.log(item[0].setAttribute("value",i-1));
    }
    window.localStorage.setItem('localBooks',JSON.stringify(myLibrary));
}
function changeStatus(item){
    let index=parseInt(item.target.value);
    let value=myLibrary[index].read;
    item=rows[index+1].getElementsByTagName('td');
    if(value==="no"){
        myLibrary[index].read='yes';
        item[3].textContent="yes";
    }else{
        myLibrary[index].read='no';
        item[3].textContent="no";
    }
    window.localStorage.setItem('localBooks',JSON.stringify(myLibrary));
}

function listBooks() {    
    if(localStorage.getItem('localBooks')){
        myLibrary=JSON.parse(localStorage.getItem('localBooks'));
        myLibrary.forEach(book => {
            let row = document.createElement("tr");
            let keys = Object.keys(book);
            keys.forEach(key => {
                let cell = document.createElement('td');
                cell.textContent = book[key];
                if (typeof book[key] === 'number') {
                    cell.style.textAlign = 'right';
                }
                row.appendChild(cell);
            })
            buttonCell = document.createElement("button");
            changeCell = document.createElement("button");
            buttonCell.setAttribute("value", myLibrary.indexOf(book));
            buttonCell.classList.add("deleteButton");
            buttonCell.textContent = "Delete";
            changeCell.setAttribute("value", myLibrary.indexOf(book));
            changeCell.classList.add("changeButton");
            changeCell.textContent = "Status";
    
    
            row.appendChild(buttonCell);
            row.appendChild(changeCell);
            myTable.appendChild(row);
            buttonCell.addEventListener('click', deleteItem);
            changeCell.addEventListener('click', changeStatus);               
    
        });
    }
  
}

function addBookToLibrary(e){    
    e.preventDefault();
    let titleValue=title.value;
    let authorValue=author.value;
    let pagesValue=pages.value;
    let readItValue="no";    
    if(validation()){        
        radios.forEach(radio=>{
            if(radio.checked){
                readItValue=radio.value;
            }
        });
    
        let newBook= new Book(titleValue,authorValue,pagesValue,readItValue);                
        myLibrary.push(newBook);        
        window.localStorage.setItem('localBooks',JSON.stringify(myLibrary));
              
         
        buttonCell=document.createElement("button"); 
        changeCell=document.createElement("button");
        buttonCell.textContent="Delete";              
        buttonCell.setAttribute("value",myLibrary.indexOf(newBook));
        buttonCell.classList.add("deleteButton"); 
        changeCell.setAttribute("value",myLibrary.indexOf(newBook));
        changeCell.classList.add("changeButton");
        changeCell.textContent="Status";
        newBook.pages=parseInt(newBook.pages)
        let row= document.createElement('tr');    
        let keys=Object.keys(newBook)        
        keys.forEach(key=>{
            let cell=document.createElement('td');            
            cell.textContent=newBook[key];        
            if(typeof newBook[key]==='number'){
                cell.style.textAlign='right';                
            }
            row.appendChild(cell);
        })
       
        row.appendChild(buttonCell);
        row.appendChild(changeCell);
         
        myTable.appendChild(row);   
    }
    title.value=author.value=pages.value="";    
    buttonCell.addEventListener('click',deleteItem);
    changeCell.addEventListener('click',changeStatus);
    for (let i = 1; i < rows.length; i++) {
        items = rows[i].getElementsByTagName("td");     
        for (let n = 0; n < items.length; n++) {
            items[n].onclick = function () {
                console.log(items[n]);
                myLibrary[i-1].info();                
             }             
        }        
    }
    

}

function saveLibraryToLocal(newItem){    
    myLibrary=JSON.parse(localStorage.getItem('localBooks'));
    myLibrary.push(newItem);
    window.localStorage.setItem('localBooks',JSON.stringify(myLibrary));
      
}
function searchLocalLibrary(){
    if(window.localStorage.getItem('localBooks')){
        myLibrary=JSON.parse(localStorage.getItem('localBooks'));
        listBooks();
    }
}


listBooks();


submitButton.addEventListener('click',addBookToLibrary);

