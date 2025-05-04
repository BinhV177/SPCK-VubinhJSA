import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, setPersistence, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBgXxvRVHxGgGN-vFy_XZqFkrCUOAHjTQo",
    authDomain: "chicboutique-c8e10.firebaseapp.com",
    projectId: "chicboutique-c8e10",
    storageBucket: "chicboutique-c8e10.appspot.com",
    messagingSenderId: "1098126851548",
    appId: "1:1098126851548:web:0a8e6c4a2a3ee5e5e49c8f"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Thiết lập persistence để duy trì trạng thái đăng nhập
setPersistence(auth, browserLocalPersistence);

export { auth, db }; 
