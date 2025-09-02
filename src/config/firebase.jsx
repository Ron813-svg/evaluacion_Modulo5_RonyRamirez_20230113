import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { API_KEY, AUTH_DOMAIN, PROJECT_ID, STORAGE_BUCKET, MESSAGING_SENDER_ID, APP_ID} from '@env';
 
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAiD8AjGsXR757Wg44lmPcw5h7Zg-vAYDs",
  authDomain: "evaluacion-e9df1.firebaseapp.com",
  projectId: "evaluacion-e9df1",
  storageBucket: "evaluacion-e9df1.firebasestorage.app",
  messagingSenderId: "306563545118",
  appId: "1:306563545118:web:c6bd1ab76bff497bc7960f"    
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getFirestore(app);
const storage = getStorage(app);
 
export { auth, database, storage }; 