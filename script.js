const header = document.querySelector("header");
const year = new Date().getFullYear();
const age = year - 2006;
const outputElement = document.getElementById("age");

outputElement.textContent = age;

window.addEventListener ("scroll", function() {
    header.classList.toggle ("sticky", window.scrollY >0);
});

let navbar = document.querySelector('.navbar');

const sr = ScrollReveal ({
    distance: '25px',
    duration: 250,
    reset: true
})

sr.reveal('.home-text',{delay:190, origin:'bottom'})

sr.reveal('.about,.services,.portfolio,.contact',{delay:200, origin:'bottom'})
