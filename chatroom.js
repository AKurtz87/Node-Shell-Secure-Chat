// IMPORT MODULES
//
const colors = require("colors");
const fs = require("fs");
const crypto = require("crypto");
const path = require("path");
//websocket
const WebSocket = require("ws");
const ws = new WebSocket("ws://localhost:6969");
//
// COLORS OBJECT
//
colors.setTheme({
  info: "bgGreen",
  help: "bgCyan",
  warn: "blue",
  success: "bgBlue",
  error: "red",
  bold: "bold",
});
//
//-------------------------------------------------------------
// GENERATES ARRAY OF 16 AND 32 NUMBERS
//
const generateKey = function decrypt(size) {
  const arr = [];
  for (let i = 0; i < size; i++) {
    arr.push(Math.floor(Math.random() * 10));
  }
  return arr;
};
// HOW USE genrateKey FUNCTION TO GENERATE AN ARRAY FOR BUFFER
//const initVector = Buffer.from(generateKey(16));
//-------------------------------------------------------------
//
// DECIFRATURA SIMMETRICA (UNICO BLOCCO CIFRATO CHE INTEGRA UTENTE E MESSAGGIO)
//
const algorithm = "aes-256-cbc";
//
//const initVector = crypto.randomBytes(16); // metodo di crypto per generare un buffer
const initVector = Buffer.from([
  8, 6, 7, 5, 3, 0, 9, 6, 8, 6, 7, 5, 3, 0, 9, 6,
]);
//console.log(initVector);
//
//const Securitykey = crypto.randomBytes(32);
const Securitykey = Buffer.from([
  8, 6, 7, 5, 3, 0, 9, 6, 8, 6, 7, 5, 3, 0, 9, 6, 8, 6, 7, 5, 3, 0, 9, 6, 8, 6,
  7, 5, 3, 0, 9, 6,
]);
//console.log(Securitykey);
//
// FUNZIONE PER DECIFRARE A CHAVE SIMMETRICA
//
const decifra02 = function (message) {
  const decipher = crypto.createDecipheriv(algorithm, Securitykey, initVector);

  let decryptedData = decipher.update(message, "hex", "utf-8");

  decryptedData += decipher.final("utf8");

  return decryptedData;
};
//
// FUNZIONE PER DECIFRARE A CHAVE ASIMMETRICA (CHIAVE PRIVATA)
//
function priDecrypt(toDecrypt, keyPath) {
  //
  const privateKey = fs.readFileSync(
    path.join(__dirname, "private.pem"),
    "utf8"
  );
  const buffer = Buffer.from(toDecrypt, "base64");
  const decrypted = crypto.privateDecrypt(
    {
      key: privateKey.toString(),
      passphrase: "",
    },
    buffer
  );
  return decrypted.toString("utf8");
}
//
// (CHIAVE PUBBLICA)
//
function pubDecrypt(toDecrypt, keyPath) {
  //
  const publicKey = fs.readFileSync(path.join(__dirname, "public.pem"), "utf8");
  const buffer = Buffer.from(toDecrypt, "base64");
  const decrypted = crypto.publicDecrypt(
    {
      key: publicKey.toString(),
      passphrase: "",
    },
    buffer
  );
  return decrypted.toString("utf8");
}
//
console.log("");
console.log("____________ SHELL CHATROOM ___________".help.bold);
console.log("                                       ".success);
console.log("    ___  ***  *  *  ****  *****  __    ".success);
console.log("  _____ *     ****  ****    *    ____  ".success);
console.log("_______  ***  *  *  *  *    *    ______".success);
console.log("                                       ".success);
console.log("                                       ".help);
console.log("");
//
//WEBSOCKET CONNECTIONS AND RENDERING
//
ws.onmessage = function (e) {
  const enc = e.data;
  //
  const dec01 = decifra02(enc);
  //
  const utente = dec01.slice(-4); // da implementare con regex
  const dec02 = pubDecrypt(dec01, `<public.pem>`);
  const x = utente;
  const y = "  >  ";
  const z = dec02;
  console.log(x.bold + y.warn.bold + z);
  console.log("");
};

ws.onclose = function (e) {
  console.log("Disconnected", e.code);
};

ws.onerror = function (e) {
  console.log("Error", e.data);
};
