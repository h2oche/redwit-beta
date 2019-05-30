import * as firebase from "firebase";
var firebaseConfig = {
  apiKey: "AIzaSyAQCdTsIrJDJZx7EdmjT-qjhP_0WmLPzWE",
  authDomain: "redwit-beta.firebaseapp.com",
  databaseURL: "https://redwit-beta.firebaseio.com",
  projectId: "redwit-beta",
  storageBucket: "redwit-beta.appspot.com",
  messagingSenderId: "933383641774",
  appId: "1:933383641774:web:daf170894f747edf"
};
firebase.initializeApp(firebaseConfig);
export default { DB: firebase.database(), Storage : firebase.storage()}