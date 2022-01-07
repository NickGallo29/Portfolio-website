
var carousel = document.getElementById("carouselExampleDark");
carousel.interval=false;

//Sets project preview in /projects to match the active project on the carousel
function setText(){
    var body = document.querySelector(".active div").innerText;
    var title=document.querySelector(".active h2").innerHTML;
    console.log(body)
    console.log('carousel')
    document.querySelector(".projectTitleActive").innerHTML=title
    document.querySelector(".projectBodyActive").innerHTML=body;
    document.querySelector(".readMore").href=`/projects/${document.querySelector(".carousel-inner .active").getAttribute("name")}`;
}

carousel.addEventListener("slid.bs.carousel",setText);
window.addEventListener('load',setText);

