/*Script send email code from code course adapted for this
I wanted to add a contact form so i can get in contact with interested users.
I use Email.js as it does not need a backend
*/

//Script which receives redirected the email entered on the quick contact form from the index.html to the expanded contact form in the sign up */
document.getElementById("exampleInputEmail").value = localStorage.getItem("textOneValue");

/*Script for sendemail*/
function sendEmail(signInForm) {
    //Code to show the loader similar to the code used in the course
    $("#submitted-data").html( 
        `<div id="loader">
        <img src="assets/css/loader.gif" alt="loading..." />
        </div>`
        );

    emailjs.send("gmail", "template_vuxmZcCD", { //add parameters
        "from_name": signInForm.exampleInputName.value,
        "from_email": signInForm.exampleInputEmail.value,
        "from_last_name": signInForm.exampleInputLastName.value,
        "from_country": signInForm.exampleInputCountry.value,
        })
        //Response code for the promise when the email is successfully sent
        .then (
            function(response) { 
            $("#submitted-data").html(
            `<button id="submitted-data" onclick="suscribe()" class="btn btn-dark btn-lg btn-block" value="Submit">I am in!</button>`
            );
            alert("Your mail is sent!", response); // success message
            console.log("SUCCESS!", response);
            $(':input').not(':button, :submit, :reset, :hidden, :checkbox, :radio').val('');
            $(':checkbox, :radio').prop('checked', false);
            },
            //Response code for the promise when the email failed to sent
            function(error) {
            $("#submitted-data").html(
            `<button id="submitted-data" onclick="suscribe()" class="btn btn-dark btn-lg btn-block" value="Submit">I am in!</button>`
            );
            alert("Oops...", error); // error message
            console.log("FAILED...", error);
            },
        )
    return false; // Prevent from loading a new page
}  
