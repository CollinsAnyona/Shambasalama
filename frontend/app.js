// app.js

document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    form.addEventListener("submit", function (e) {
        e.preventDefault(); // Prevent page reload on form submission
        alert("Thank you for contacting us!");
        form.reset();
    });
});

function myMenuFunction() {
    var i = document.getElementById("navMenu");

    if(i.className === "navMenu") {
        i.className += "responsive";
    } else {
        i.className = "nav-menu";
    }
}

var a = document.getElementById("loginBtn");
var b = document.getElementById("registerBtn");
var x = document.getElementById("login");
var y = document.getElementById("register");

function login() {
    x.style.left = "4px";
    y.style.left = "-520px";
    a.className += "white-btn";
    b.className = "btn";
    x.style.opacity = 1;
    y.style.opacity = 0;
}

function register() {
    x.style.left = "-510px";
    y.style.left = "5px";
    a.className = "btn";
    b.className += "white-btn";
    x.style.opacity = 0;
    y.style.opacity = 1;
}