/*Script send email code from code course adapted for this*/

function sendEmail(signInForm) {
    emailjs.send("gmail", "template_vuxmZcCD", {
        "from_name": signInForm.exampleInputName.value,
        "from_email": signInForm.exampleInputEmail.value,
        "from_last_name": signInForm.exampleInputLastName.value,
        "from_country": signInForm.exampleInputCountry.value,
        })

        /*IF 
        $("#submitted-data").click(function (){ /*code to show loader 
            $(this).html(
            `<div id="loader">
            <img src="assets/css/loader.gif" alt="loading..." />
            </div>`
            );
        return false });*/

        .then (
            function(response) {
            alert("Your mail is sent!", response);
            console.log("SUCCESS!", response);
            },
            function(error) {
            alert("Oops...", error);    
            console.log("FAILED...", error);
            },
        )
           
        .then ( /*this function still not working : i also tried 
            document.getElementById("user-data").reset();*/
            function(resetForm) {
            $(':input').not(':button, :submit, :reset, :hidden, :checkbox, :radio').val('');
            $(':checkbox, :radio').prop('checked', false);
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