import { io } from "socket.io-client"; //import socket

let displayMessages = document.getElementById("messege-container");
let form = document.getElementById('form');
let messege = document.getElementById("messege-input");
let sendMessege = document.getElementById("send-button");
let room = document.getElementById("room-input");
let joinRoom = document.getElementById("room-button");

//const socket = io('http://localhost:3000'); //connect client socket to the server
const socket = io('http://localhost:4000');

//for operation result we do socket.on
socket.on('connect', () => {
    console.log(socket.id);
    displayMessege(socket.id,"room");
  });

//result of receive-messege event created by server
socket.on('receive-messege',(messege)=>{
    displayMessege(messege);
})

form.addEventListener('submit',(e)=>{
    e.preventDefault();

    if(messege.value == '')return
    displayMessege(messege.value,'me');
    //for creae operation we do socket.emit
    //socket.emit('send-messege',messege.value);//send messege all user
    socket.emit('send-messege',messege.value,room.value);//send messege to the entered room user

    messege.value = '';
});

sendMessege.addEventListener('click',(e)=>{
    console.log(e);
});

joinRoom.addEventListener('click',(e)=>{
    //event for join roo
    // socket.emit('join-room',room.value);
    socket.emit('join-room',room.value,(messege)=>{ //send callback to receive inforation
        displayMessege(messege);
    });
})

function displayMessege(messege,sender) {
    let div = document.createElement("div");
    div.classList.add("container");
    let p = document.createElement("p");
    p.appendChild(document.createTextNode((sender?(sender):"Friend")+" : "+messege));
    div.appendChild(p);
    displayMessages.append(div)
}