import { useState } from "react";
import logo from './logo.svg';
import { io } from "socket.io-client"; //import socket
import './App.css';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import InputGroup from 'react-bootstrap/InputGroup';

import Form from 'react-bootstrap/Form';
//const socket = io('http://localhost:4000');
const socket = io('https://pradipta-socket-server.herokuapp.com');

socket.on('connect', () => {
  //console.log(socket.id,"room");
});

socket.on('receive-messege',(messege)=>{
  //console.log(1);
  displayMessege(messege);
})

let displayMessege = (messege,sender) => {
  sender = (sender?(sender):"Friend")
  //console.log(messege,sender);
  let div = document.createElement("div");
  div.classList.add("containerMessege");
  let p = document.createElement("p");
  let span = document.createElement("SPAN");
  let img = document.createElement('img');
  img.src = logo;
  img.style.width = '100%'
  if(sender === 'Friend')
  {
    img.classList.add("right");
    span.classList.add("time-left");
    div.classList.add("darker");
  }
  else
  {
    span.classList.add("time-right");
  }
  span.appendChild(document.createTextNode(new Date().toLocaleString()));
  p.appendChild(document.createTextNode(`${sender} : ${messege}`));
  div.appendChild(img);
  div.appendChild(p);
  div.appendChild(span);
  document.getElementById("messege-container").prepend(div);
}

let displayContent = (messege,time) =>{
  return (
    <div className="containerMessege">
      <img src={{logo}} alt="Avatar" style={{width:"100%"}}/>
      <p>{messege}</p>
      <span className="time-right">{time}</span>
    </div>
  )
}

function App() {
  
  let [messege, setMessege] = useState("");
  let [room, setRoom] = useState("");

  let sendMessege = () =>{
    //console.log(2);
    //console.log(messege);
    if(messege !== '')
    {
      socket.emit('send-messege',messege,room);
      displayMessege(messege,'me');
    }
  }

  let joinRoom = () => {
    //console.log(3);
    //console.log(room);
    socket.emit('join-room',room,(messege)=>{ //send callback to receive inforation
      displayMessege(messege);
  });
  }

  return (<>
  <Container>
  <h2>Chat Messages</h2>

  <div id="messege-container" aria-readonly style={{overflowY:"scroll", height:"400px", background:"gray"}}>
    
  </div>
     <InputGroup className="mb-3">
        <Form.Control
          placeholder="Messege"
          aria-label="Messege"
          aria-describedby="basic-addon2"
          name="messege"
          onChange={(e) => setMessege(e.target.value)}
        />
        <Button variant="outline-secondary" id="button-addon2" onClick={sendMessege}>
          Send
        </Button>
      </InputGroup>
      <InputGroup className="mb-3">
        <Form.Control
          placeholder="Room"
          aria-label="Room"
          aria-describedby="basic-addon2"
          name="room"
          onChange={(e) => setRoom(e.target.value)}
        />
        <Button variant="outline-secondary" id="button-addon2" onClick={joinRoom}>
          Join
        </Button>
      </InputGroup>
      </Container>
    </>);
}

export default App;
