/*Script send email code from code course adapted for this*/

function sendEmail(signInForm) {
    emailjs.send("gmail", "template_vuxmZcCD", {
        "from_name": signInForm.exampleInputName.value,
        "from_email": signInForm.exampleInputEmail.value,
        "from_last_name": signInForm.exampleInputLastName.value,
        "from_country": signInForm.exampleInputCountry.value,
        })

        
       .then (
            $("#submitted-data").click(function(resetForm){ /*code to show loader */
                $(this).html(
                    `<div id="loader">
                    <img src="assets/css/loader.gif" alt="loading..." />
                    </div>`);
                return false }),
        )

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
           
        .then ( 
            function(resetForm) {
            $(':input').not(':button, :submit, :reset, :hidden, :checkbox, :radio').val('');
            $(':checkbox, :radio').prop('checked', false);
            }            
        )
    return false;
}  
