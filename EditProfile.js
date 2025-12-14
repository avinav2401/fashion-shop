import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

// Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyC3pjIbJKS6GqTUtQNG9eXvv8ygD1Fe10",
    authDomain: "hostel-zone.firebaseapp.com",
    projectId: "hostel-zone",
    storageBucket: "hostel-zone.appspot.com",
    messagingSenderId: "86399762110",
    appId: "1:86399762110:web:95a0f8b35bf14c042e68f",
    measurementId: "G-5MKDWLVSQF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Function to Save Profile Data
document.getElementById("saveProfile").addEventListener("click", async () => {
    const user = auth.currentUser;
    if (!user) {
        console.error("❌ User not logged in!");
        alert("You must be logged in to save profile!");
        return;
    }

    try {
        const userRef = doc(db, "users", user.uid);
        const profileData = {
            fullName: document.getElementById("fullName").value.trim(),
            github: document.getElementById("github").value.trim(),
            linkedin: document.getElementById("linkedin").value.trim(),
            portfolio: document.getElementById("portfolio").value.trim()
        };

        await setDoc(userRef, profileData);
        console.log("✅ Profile saved successfully!");
        alert("Profile Saved!");
    } catch (error) {
        console.error("🔥 Error saving profile:", error);
        alert("Failed to save profile.");
    }
});

// Function to Load Profile Data
onAuthStateChanged(auth, async (user) => {
    if (user) {
        console.log("🔹 User logged in:", user.email);
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);
        
        if (docSnap.exists()) {
            console.log("📜 Profile Data Found:", docSnap.data());
            const data = docSnap.data();
            document.getElementById("fullName").value = data.fullName || "";
            document.getElementById("github").value = data.github || "";
            document.getElementById("linkedin").value = data.linkedin || "";
            document.getElementById("portfolio").value = data.portfolio || "";
        } else {
            console.warn("⚠️ No profile data found for user.");
        }
    } else {
        console.warn("⚠️ No user logged in.");
    }
});
