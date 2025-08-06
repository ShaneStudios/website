import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut as firebaseSignOut, sendEmailVerification } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { initializeAppCheck, ReCaptchaV3Provider } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app-check.js";
import { firebaseConfig, RECAPTCHA_SITE_KEY } from './config.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider(RECAPTCHA_SITE_KEY),
  isTokenAutoRefreshEnabled: true
});

export async function signUp(email, password, username, displayName) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await setDoc(doc(db, "profiles", user.uid), {
            id: user.uid,
            username: username,
            display_name: displayName,
            bio: "",
            role: 0,
            created_at: new Date().toISOString(),
            member_id: Date.now()
        });
        await sendEmailVerification(user);
        return { data: userCredential, error: null };
    } catch (error) {
        return { data: null, error: error };
    }
}

export async function signIn(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        if (!userCredential.user.emailVerified) {
            await firebaseSignOut(auth);
            return { data: null, error: { message: "Please verify your email before logging in." } };
        }
        return { data: userCredential, error: null };
    } catch (error) {
        return { data: null, error: error };
    }
}

export async function signOut() {
    try {
        await firebaseSignOut(auth);
        return { error: null };
    } catch (error) {
        return { error: error };
    }
}

export function onAuthStateChange(callback) {
    return onAuthStateChanged(auth, callback);
}

export async function getCurrentUser() {
    await auth.authStateReady();
    const user = auth.currentUser;
    if (!user) return null;
    if (!user.emailVerified) {
        return { ...user, isVerified: false };
    }
    const profileRef = doc(db, "profiles", user.uid);
    const profileSnap = await getDoc(profileRef);
    if (profileSnap.exists()) {
        return { ...user, profile: profileSnap.data(), isVerified: true };
    } else {
        return { ...user, isVerified: true };
    }
}
