const url = 'http://localhost:3000';

function encryptMessage() {
    const message = document.getElementById("message").value;
    console.log(message);
    fetch(url + "/encrypt", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: parseInt(message) })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("encrypted").innerText = `${data.msg}, ${data.p}`;
    });
}

function decryptMessage() {
    const s1 = parseInt(prompt("Enter s1:"));
    const s2 = parseInt(prompt("Enter s2:"));
    fetch(url + "/decrypt", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ s1: parseInt(s1), s2: parseInt(s2) })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("decrypted").innerText = data.decrypted;
    });
}