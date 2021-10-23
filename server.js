// IMPORT MODEULES
//
const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const path = require("path");
const fs = require("fs");

// VARIABLE DECLARATION
//
const port = 6969;
const server = http.createServer(express);
const wss = new WebSocket.Server({ server });

// WSOCKET SERVER (RELAY MESSAGEs)
//
wss.on("connection", (ws) => {
  ws.on("message", (data) => {
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        let msg = data.toString("utf8");
        //console.log(msg);
        client.send(msg);
      }
    });
  });
});

// SERTVER LISTENING
//
server.listen(port, function () {
  console.log(`Server is listening on ${port}!`);
});
