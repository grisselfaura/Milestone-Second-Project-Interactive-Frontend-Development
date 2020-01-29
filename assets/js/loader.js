$("#submitted-data").click(function (){ /*code to show loader */
    $(this).html(
        `<div id="loader">
        <img src="assets/css/loader.gif" alt="loading..." />
        </div>`);
        return false });
)


/*code to refresh after send to be updated*/
function suscription() {
  $("#exampleInputName").val("");
  $("#exampleInputLastName").val("");
}
