const dropDowns= document.querySelectorAll(".CustomDropdown")
console.log(dropDowns)

//Creates drop down feature for any div by the class dropdown
dropDowns.forEach(dropDown=>{
    var button = dropDown.querySelector('.dropdownButton')
    var content = dropDown.querySelector('.dropdownContent')
    content.style.display="none"
    button.addEventListener("click",()=>{
        console.log(dropDown)
        if(content.style.display=="none"){
            content.style.display="block"
        }else{
            content.style.display="none"
        }
    })
})

