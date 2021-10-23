# web_socket_crypto_chat
Text from terminal in secure way using asymmetric and symmetric encyrytion

This project is a secure chat using the ws (web socket) protocol. It is possible
to send encrypted messages that guarantee the protection of the message content
and the authenticity of the user who sends the message. 2 types of encryption are
performed: the first encryption is asymmetric with a public key (from client.js)
after the chatroom will use the user's private key to decrypt the message.
The second encryption is symmetrical and is used to create a single block after the
username has been associated to the asymmetric encripted message.
Finally only one block of information will be send to the chatroom.
