// app.js

document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    form.addEventListener("submit", function (e) {
        e.preventDefault(); // Prevent page reload on form submission
        alert("Thank you for contacting us!");
        form.reset();
    });
});

