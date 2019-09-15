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
    verifyLoggedIn();
};
function createDrone() {
    var nickname = document.getElementById("nicknamea").value;
    var s = "";
    var user = firebase.auth().currentUser;
    for (var i = 0; i < 6; ++i) {
        s += Math.floor(Math.random() * 9) + 1;
    }
    writeDroneData(nickname, user.uid, s);
    $("#nicknamea").val("");
    toastr.success("Drone created successfully");
}

function writeDroneData(nickname, userId, droneId) {
    firebase.database().ref('disasters/' + userId + '/drones/' + droneId).set({
        nickname: nickname,
        active: false,
        latitude: 0.1,
        longitude: 0.1
    });
}

function createVolunteer() {
    var config = {
        apiKey: "AIzaSyDLCmGt8jbi8NcBTNosNCova9txARCJ1-Y",
        authDomain: "rescue-tech.firebaseapp.com",
        databaseURL: "https://rescue-tech.firebaseio.com",
        projectId: "rescue-tech",
        storageBucket: "",
        messagingSenderId: "63539586922"
    };
    var secondaryApp = firebase.initializeApp(config, "creation");
    secondaryApp.auth().createUserWithEmailAndPassword(document.getElementById("userEmail").value, "123456").then(function (user) {
        secondaryApp.auth().signOut();
        console.log(firebase.auth().currentUser);
        firebase.auth().sendPasswordResetEmail(document.getElementById("userEmail").value);
        firebase.database().ref("disasters/" + firebase.auth().currentUser.uid + "/volunteers").push(user.user.uid);
        firebase.database().ref("users/" + user.user.uid).set(firebase.auth().currentUser.uid);
        $("#userEmail").val("");
        toastr.success("User made successfully");
    }).catch(function (e) {
        console.log("ERROR! " +
            e.code + " " +
            e.message);
    });
}

function verifyLoggedIn() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            if (firebase.database().ref('disasters/' + user.uid).once("value", function (created) {
                if (created.val() === null) {
                    window.location.replace("login.html");
                } else {
                    console.log("YUHHs");
                }
            }));
        } else {
            window.location.replace("login.html");
        }
    });
}