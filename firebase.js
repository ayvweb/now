// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBK47x2qAkDioP4qQa5hManG9ULuNAp7dI",
  authDomain: "now-fire-e0c41.firebaseapp.com",
  databaseURL: "https://now-fire-e0c41-default-rtdb.firebaseio.com/",
  projectId: "now-fire-e0c41",
  storageBucket: "now-fire-e0c41.firebasestorage.app",
  messagingSenderId: "772613763929",
  appId: "1:772613763929:web:d76eda394b2f3b60d49248",
  measurementId: "G-3PCY7N3FQJ"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
