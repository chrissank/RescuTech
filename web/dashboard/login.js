window.onload = function () {
    var config = {
        apiKey: "AIzaSyDLCmGt8jbi8NcBTNosNCova9txARCJ1-Y",
        authDomain: "rescue-tech.firebaseapp.com",
        databaseURL: "https://rescue-tech.firebaseio.com",
        projectId: "rescue-tech",
        storageBucket: "",
        messagingSenderId: "63539586922"
    };
    firebase.initializeApp(config);
};

function signInOrg() {
    firebase.auth().signInWithEmailAndPassword(document.getElementById("email").value, document.getElementById("pass").value).then(function () {
        console.log(firebase.auth().currentUser);
        firebase.database().ref("users").child(firebase.auth().currentUser.uid).once("value", function (value) {
            if (value.val() === null) {
                $("#wrong").slideDown();
            } else {
                toastr.success("Login validated, redirecting..");
                setTimeout(function () {
                    window.location.replace('index.html');
                }, 1000);
            }
        });
    }).catch(function (error) {
        $("#wrong").slideDown();
        console.log("ERROR! " + error.code + " " + error.message);
    });
}
