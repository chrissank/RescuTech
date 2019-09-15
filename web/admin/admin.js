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
}
// function createUser(){
// 	var email = document.getElementById("orgEmail").value;
// 	var password = document.getElementById("orgPass").value;
// 	firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
// 		var errorCode = error.code;
// 		var errorMessage = error.message;
// 	});
// 	firebase.auth().onAuthStateChanged(function(user) {
// 		if(user){
// 			var name = document.getElementById("orgName").value;
// 			var email = document.getElementById("orgEmail").value;
// 			var ownername = document.getElementById("ownerName").value;
// 			if(email == null){
// 				return;
// 			}
// 			var uid = user.uid; 
// 			writeUserData(name, ownername, email, uid);
// 			document.getElementById("orgName").value="";
// 			document.getElementById("orgEmail").value="";
// 			document.getElementById("orgPass").value="";
// 			document.getElementById("ownerName").value="";
// 		}
// 	});	
// }
function createUser() {
    var config = {
        apiKey: "AIzaSyDLCmGt8jbi8NcBTNosNCova9txARCJ1-Y",
        authDomain: "rescue-tech.firebaseapp.com",
        databaseURL: "https://rescue-tech.firebaseio.com",
        projectId: "rescue-tech",
        storageBucket: "",
        messagingSenderId: "63539586922"
    };
    var secondaryApp = firebase.initializeApp(config, "creation");
    var disasterDisplay = document.getElementById("displayName").value;
    var type = document.getElementById("disasterType").value;
    var orgName = document.getElementById("orgName").value;
    var email = document.getElementById("orgEmail").value;
    var area = document.getElementById("operationArea").value;
    var bcLocation = document.getElementById("bcLocation").value;
    secondaryApp.auth().createUserWithEmailAndPassword(document.getElementById("orgEmail").value, document.getElementById("orgPass").value).then(function (user) {
        secondaryApp.auth().signOut();
        console.log(user.user.uid);
        if (email === null) {
            return;
        }
        document.getElementById("displayName").value = "";
        document.getElementById("disasterType").value = "";
        document.getElementById("orgName").value = "";
        document.getElementById("orgEmail").value = "";
        document.getElementById("operationArea").value = "";
        document.getElementById("bcLocation").value = "";
        document.getElementById("orgPass").value = "";
        firebase.database().ref("disasters/" + user.user.uid).set({
            name: disasterDisplay,
            type: type,
            org_name: orgName,
            email: email,
            area: area,
            base_camp: bcLocation
        });
        toastr.success("Disaster made successfully");
    }).catch(function (e) {
        console.log("ERROR! " +
            e.code + " " +
            e.message);
    });
}

