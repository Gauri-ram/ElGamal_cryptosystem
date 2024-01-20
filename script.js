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
        console.log(data);
        document.getElementById("encrypted").innerText = `${data.c1}, ${data.c2}`;
    });
}

function decryptMessage() {
    const c1 = parseInt(prompt("Enter s1:"));
    const c2 = parseInt(prompt("Enter s2:"));
    fetch(url + "/decrypt", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ c1: parseInt(c1), c2: parseInt(c2) })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("decrypted").innerText = data.decrypted;
    });
}