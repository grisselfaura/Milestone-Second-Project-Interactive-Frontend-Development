/*Script send email code from code course adapted for this*/

function sendMail(contactForm) {
    emailjs.send("gmail", "grissel_resumen_test", {
        "from_name": contactForm.fullname.value,
        "from_email": contactForm.emailaddress.value,
        "project_request": contactForm.projectsummary.value
    })
    .then(
        function(response) {
            console.log("SUCCESS", response);
        },
        function(error) {
            console.log("FAILED", error);
        });
}