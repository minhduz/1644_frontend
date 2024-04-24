// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCYV3eKBlO0dXGSpFzrhDz4XQ3wyTOeip8",
  authDomain: "imageupload-4ed13.firebaseapp.com",
  projectId: "imageupload-4ed13",
  storageBucket: "imageupload-4ed13.appspot.com",
  messagingSenderId: "775179346197",
  appId: "1:775179346197:web:a11c35e27d2ad2e195891c",
  measurementId: "G-XS65JTG7YP",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage();

export const uploadFileToFirebase = async (folder, file) => {
  const storageRef = ref(storage, folder + "/" + file.name);

  return new Promise((resolve, reject) => {
    uploadBytes(storageRef, file)
      .then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          resolve(url);
        });
      })
      .catch((err) => {
        reject(err);
      });
  });
};
