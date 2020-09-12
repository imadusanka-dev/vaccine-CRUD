import firebase from "firebase";
import "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyA3zFbzh3G29jix-UAfz5fTX1-Qkaatpew",
    authDomain: "vaccine-b1e72.firebaseapp.com",
    databaseURL: "https://vaccine-b1e72.firebaseio.com",
    projectId: "vaccine-b1e72",
    storageBucket: "vaccine-b1e72.appspot.com",
    messagingSenderId: "481293094964",
    appId: "1:481293094964:web:d7544f62b12e344d5a3a61"
};

firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();

export default firebase;