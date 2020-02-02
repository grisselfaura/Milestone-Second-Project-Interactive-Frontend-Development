$("#submitted-data").click(function() { /*code to show loader */
    $(this).html(
        `<div id="loader">
        <img src="assets/css/loader.gif" alt="loading..." />
        </div>`
    );
});

/*
var myLoader = $("#loading");
$("#user-data").submit(function sendEmail(signInForm) { /*code to show loader 
    setTimeout(function(){
        let loading = document.getElementById("loading").value;
        console.log(loading);
        $("#loading").hide();
    })
})*/

/*
var myLoader;
$("#user-data").submit(function sendEmail(signInForm) { /*code to show loader 
     myLoader = setTimeout(showPage, 1000);
    document.getElementById("loading").value;
        console.log(loading);
    }*/

/*
$("#user-data").onsubmit(function sendEmail(signInForm) { /*code to show loader 
    setTimeout(function(){
        let loading = document.getElementById("loading").value;
        console.log(loading);
        $("#loading").hide();
    })
})*/


/*
var myLoader;
$("#user-data").onsubmit(function sendEmail(signInForm) { /*code to show loader 
     myLoader = setTimeout(showPage, 1000);
    document.getElementById("loading").value;
        console.log(loading);
});

/*
var myLoader;
function sendEmail() {
    myLoader = setTimeout(showPage, 1000);
}
function showPage() {
    document.getElementById("loading").show(); 
    return true;
};*/


/*
$(document).ready(function() {
setTimeout(function(){
        let loading = document.getElementById('loading').value;
        console.log(loading);
        let content = document.getElementById('isItLoaded');
        if (isItLoaded == undefined) {
          let newDiv = `
          <div class="letter">l</div>
          `;
          loading.innerHTML = newDiv;
          loading.className = 'displayIt';
        }
        else if (isItLoaded !== undefined) {
          loading.innerHTML = "";
          loading.className = 'noDisplay';
        }
      },10);
})/*

