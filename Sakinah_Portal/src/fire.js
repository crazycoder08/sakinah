import firebase from "firebase";

const config = {
  apiKey: "AIzaSyCY0t7gcbcrovJmEj1Xs6MhNP9S5IFZNpc",
  authDomain: "balabharti-42bc1.firebaseapp.com",
  databaseURL: "https://balabharti-42bc1.firebaseio.com",
  projectId: "balabharti-42bc1",
  storageBucket: "balabharti-42bc1.appspot.com",
  messagingSenderId: "85021922231",
  appId: "1:85021922231:web:99b55a4c3ba32ddb344e32"
};
const fire = firebase.initializeApp(config);
const storage = firebase.storage();
export { storage, fire as default };

//export default fire,storage;
