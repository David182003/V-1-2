const firebaseConfig = {
  apiKey: "AIzaSyCwt9dyCf5iF13R2nhar6F2pKIUkT3Om7Q",
  authDomain: "paguinasweb-14611.firebaseapp.com",
  projectId: "paguinasweb-14611",
  storageBucket: "paguinasweb-14611.firebasestorage.app",
  messagingSenderId: "1083919701171",
  appId: "1:1083919701171:web:89d0063a1f9e6e357c4cc6"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const message = document.getElementById("message");

  firebase.firestore().collection("users")
    .where("email", "==", email)
    .where("password", "==", password)
    .get()
    .then(snapshot => {
      if (snapshot.empty) {
        message.style.color = "red";
        message.textContent = "Usuario o contraseña incorrectos.";
      } else {
        const userData = snapshot.docs[0].data();
        message.style.color = "green";
        message.textContent = `Bienvenido, rol: ${userData.role}`;

        // Redireccionar por rol
        if (userData.role === "admin") {
          window.location.href = "admin.html";
        } else {
          window.location.href = "empleado.html";
        }
      }
    })
    .catch(error => {
      message.style.color = "red";
      message.textContent = "Error: " + error.message;
    });
}


function register() {
  const email = document.getElementById("reg-email").value;
  const password = document.getElementById("reg-password").value;
  const message = document.getElementById("message");

  firebase.firestore().collection("users")
    .add({
      email: email,
      password: password,
      role: "empleado"
    })
    .then(() => {
      message.style.color = "green";
      message.textContent = "Empleado registrado correctamente.";
    })
    .catch((error) => {
      message.style.color = "red";
      message.textContent = "Error: " + error.message;
    });
}
