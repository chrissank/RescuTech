window.onload = function() {
	var config = {  
		apiKey: "AIzaSyDLCmGt8jbi8NcBTNosNCova9txARCJ1-Y",
		authDomain: "rescue-tech.firebaseapp.com",
		databaseURL: "https://rescue-tech.firebaseio.com",
		projectId: "rescue-tech",
		storageBucket: "",
		messagingSenderId: "63539586922"
	};
	firebase.initializeApp(config);
}

function signInOrg() {
	$("#wrong").slideUp();
    firebase.auth().signInWithEmailAndPassword(document.getElementById("orgEmail").value, document.getElementById("orgPass").value).then(function () {
		toastr.success("Login validated, redirecting..");
		setTimeout(function() {
			window.location.replace('organizations.html');
		}, 1000);
    }).catch(function (error) {
		$("#wrong").slideDown();
        console.log("ERROR! " + error.code + " " + error.message);
    });
}
