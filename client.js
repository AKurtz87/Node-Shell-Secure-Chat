// IMPORT MODEULES
//
const colors = require("colors");
const fs = require("fs");
const crypto = require("crypto");
const path = require("path");
const WebSocket = require("ws");
const prompt = require("prompt");
const { message } = require("prompt");
const { exit } = require("process");
const ws = new WebSocket("ws://localhost:6969");
//
// COLORS OBJECT
//
colors.setTheme({
  info: "bgGreen",
  help: "bgCyan",
  warn: "yellow",
  success: "bgBlue",
  error: "blue",
  bold: "bold",
});
//
// UTENTI AUTORIZZATI
//
const alessio = { username: "alex", password: "secret" };
const marco = { username: "mark", password: "secret" };
//
// CIFRATURA SIMMETRICA (INTEGRA UTENTE E MESSAGGIO IN UN UNICO BLOCCO)
//
const algorithm = "aes-256-cbc";
//
//const initVector = crypto.randomBytes(16);
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
// FUNZIONE PER CIFRARE A CHAVE SIMMETRICA
//
const cifra02 = function (message) {
  //
  const cipher = crypto.createCipheriv(algorithm, Securitykey, initVector);

  let encryptedData = cipher.update(message, "utf-8", "hex");

  encryptedData += cipher.final("hex"); // coding finale

  //console.log("Encrypted message: " + encryptedData);

  return encryptedData;
};
//
// FUNZIONE PER CIFRARE A CHAVE SIMMETRICA
// GARANTISCE SICUREZZA DEL MESSAGGIO
//
function pubEncrypt(toEncrypt, keyPath) {
  const publicKey = fs.readFileSync(path.join(__dirname, "public.pem"), "utf8");
  const buffer = Buffer.from(toEncrypt, "utf8");
  const encrypted = crypto.publicEncrypt(publicKey, buffer);
  return encrypted.toString("base64");
}
//
// FUNZIONE PER CIFRARE A CHAVE SIMMETRICA
// GARANTISCE SICUREZZA DEL MESSAGGIO
//
function priEncrypt(toEncrypt, keyPath) {
  const privateKey = fs.readFileSync(
    path.join(__dirname, "private.pem"),
    "utf8"
  );
  const buffer = Buffer.from(toEncrypt, "utf8");
  const encrypted = crypto.privateEncrypt(privateKey, buffer);
  return encrypted.toString("base64");
}

//  CALLBACK OPTION (WELCOME TO CALLBACK HELL!)
//
const takeCreds = function () {
  prompt.get(["username", "password"], function (err, result) {
    //

    const u = result.username;
    const p = result.password;

    if ((u === alessio.username) & (p === alessio.password)) {
      console.log("");
      console.log("________ WELCOME TO SHELL CHAT ________".help.bold);
      console.log("                                       ".success);
      console.log("    ___  ***  *  *  ****  *****  __    ".success);
      console.log("  _____ *     ****  ****    *    ____  ".success);
      console.log("_______  ***  *  *  *  *    *    ______".success);
      console.log("                                       ".success);
      console.log("                                       ".help);
      console.log("");
      userID = alessio.username;
      //fs.writeFile("user.txt", userID, function (err) {
      //if (err) throw err;
      //console.log("Saved!");
      //});
      input();
    } else if ((u === marco.username) & (p === marco.password)) {
      console.log("");
      console.log("________ WELCOME TO SHELL CHAT ________".help.bold);
      console.log("                                       ".success);
      console.log("    ___  ***  *  *  ****  *****  __    ".success);
      console.log("  _____ *     ****  ****    *    ____  ".success);
      console.log("_______  ***  *  *  *  *    *    ______".success);
      console.log("                                       ".success);
      console.log("                                       ".help);
      console.log("");
      userID = marco.username;
      //fs.writeFile("user.txt", userID, function (err) {
      //if (err) throw err;
      //});
      input();
    } else {
      console.log("Wrong Credentials!");
      takeCreds();
    }
  });
};
//
const input = function input_message() {
  //console.log(userID);
  prompt.get("testo", function (err, result) {
    let cleartext = result.testo;
    const enc02 = priEncrypt(cleartext, `<private.pem>`);
    //fs.readFile("user.txt", "utf8", function (err, data) {
    const enc01 = cifra02(enc02 + userID);
    ws.send(enc01);
    input();
    //});
  });
};
//

takeCreds();
