/*Script send email code from code course adapted for this*/

function sendEmail(signInForm) {
    emailjs.send("gmail", "template_vuxmZcCD", {
        "from_name": signInForm.exampleInputName.value,
        "from_email": signInForm.exampleInputEmail.value,
        "from_last_name": signInForm.exampleInputLastName.value,
        "from_country": signInForm.exampleInputCountry.value,
        })
        .then (
            function(response) {
            alert("Your mail is sent!", response);
            console.log("SUCCESS!", response);
            },
            function(error) {
            alert("Oops...", error);    
            console.log("FAILED...", error);
            },
            .then (
                function(suscription) {
            $("#exampleInputName").val("");
            $("#exampleInputLastName").val("");
            }            
            );
    return false;
}  
/*Script to reset the form doesnt work
document.getElementById("user-data").reset();
*/
/*
.then (function (reset()))
*/