/*
Script to transfer email value from the form in index.html into the contact form from the sign-up.html 
*/

var textOneValue;

    function redirectToForm() {

        textOneValue = document.getElementById("myemail").value; 
        localStorage.setItem("textOneValue",textOneValue)

        window.location.href = "https://8000-f4447182-a851-46b0-8c4f-86dba08431a7.ws-eu01.gitpod.io/sign-up.html"; 
    } 