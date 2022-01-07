const faders = document.querySelectorAll(".fade-in");
const appearOptions = {
    threshold:0.5
}

//Home screen fade on scroll effect
const appearOnScroll = new IntersectionObserver(function (
    entries,
    appearOnScroll
){
    entries.forEach(entry =>{
        if(!entry.isIntersecting){
            return
        }else{
            entry.target.classList.add('appear')
        }
    })
},appearOptions)

faders.forEach(fader=>{
    appearOnScroll.observe(fader);
})