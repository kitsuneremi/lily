import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage'


//dev storage
// const firebaseConfig = {
//     apiKey: "AIzaSyDYfwvxtgq5vpK2Z7rO16nBE0uYSptaAsY",
//     authDomain: "carymei.firebaseapp.com",
//     projectId: "carymei",
//     storageBucket: "carymei.appspot.com",
//     messagingSenderId: "54149547459",
//     appId: "1:54149547459:web:880d66a094bbcdfcb7a976",
//     measurementId: "G-3RNZ8HGFGW",
//     crossOriginIsolatedStorage: true,
// };

//production storage
const firebaseConfig = {
    apiKey: "AIzaSyDcRyg91ZqxgEYawLqs6jtvYzzmyrTtflY",
    authDomain: "carymei-ed858.firebaseapp.com",
    projectId: "carymei-ed858",
    storageBucket: "carymei-ed858.appspot.com",
    messagingSenderId: "238077882454",
    appId: "1:238077882454:web:626875d8ee2b8b1b5c8bf7",
    measurementId: "G-0PQMNRNSZK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app)