import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBFlbBsq3-rWryBFJT-6SjT4efZ_5RXniI",
    authDomain: "test-assignment-f1eac.firebaseapp.com",
    databaseURL: "https://test-assignment-f1eac-default-rtdb.asia-southeast1.firebasedatabase.app/",
    projectId: "test-assignment-f1eac",
    storageBucket: "test-assignment-f1eac.appspot.com",
    messagingSenderId: "525826356312",
    appId: "1:525826356312:web:e3ce7e24a3ed62b360062d"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const auth = getAuth(app);