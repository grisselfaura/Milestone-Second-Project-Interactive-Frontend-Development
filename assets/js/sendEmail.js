/*Script send email code from code course adapted for this*/

document.getElementById("exampleInputEmail").value = localStorage.getItem("textOneValue");

/*Script for sendemail*/
function sendEmail(signInForm) {
    
    $("#submitted-data").html( /*Script for loader*/
        `<div id="loader">
        <img src="assets/css/loader.gif" alt="loading..." />
        </div>`
        );

    emailjs.send("gmail", "template_vuxmZcCD", {
        "from_name": signInForm.exampleInputName.value,
        "from_email": signInForm.exampleInputEmail.value,
        "from_last_name": signInForm.exampleInputLastName.value,
        "from_country": signInForm.exampleInputCountry.value,
        })

        .then (
            function(response) { 
            $("#submitted-data").html(
            `<button id="submitted-data" onclick="suscribe()" class="btn btn-dark btn-lg btn-block" value="Submit">I am in!</button>`
            );
            alert("Your mail is sent!", response);
            console.log("SUCCESS!", response);
            $(':input').not(':button, :submit, :reset, :hidden, :checkbox, :radio').val('');
            $(':checkbox, :radio').prop('checked', false);
            },
            function(error) {
            $("#submitted-data").html(
            `<button id="submitted-data" onclick="suscribe()" class="btn btn-dark btn-lg btn-block" value="Submit">I am in!</button>`
            );
            alert("Oops...", error);    
            console.log("FAILED...", error);
            },
        )
           
        
    return false;
}  
