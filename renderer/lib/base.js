import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/functions"

var firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: "localhost",
  databaseURL: process.env.databaseURL,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
  measurementId: process.env.measurementId
};
var app;
if (!firebase.apps.length) {
  app = firebase.initializeApp(firebaseConfig);
}else{
  app = firebase.apps[0]
}

export default app;