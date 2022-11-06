import { useState } from "react";
import logo from './logo.svg';
import me from './me.png';
import { io } from "socket.io-client"; //import socket
import './App.css';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import InputGroup from 'react-bootstrap/InputGroup';
import Compressor from 'compressorjs';
import Form from 'react-bootstrap/Form';
//const socket = io('http://localhost:4000');
const socket = io('https://pradipta-socket-server.herokuapp.com');

socket.on('connect', () => {
  //console.log(socket.id,"room");
});

socket.on('receive-messege',(messegeObj)=>{
  //console.log(1);
  //console.log(messegeObj);
  let blob = new Blob([messegeObj.body],{ type : messegeObj.type});
  //console.log(blob);
  messegeObj.blob = blob;
  displayMessege(messegeObj);
})

let displayMessege = (messegeObj,sender) => {
  sender = (sender?(sender):"Friend");
  //console.log(messege,sender);
  let div = document.createElement("div");
  div.classList.add("containerMessege");
  let p = document.createElement("p");
  let span = document.createElement("SPAN");
  let img = document.createElement('img');
  img.style.width = '100%'
  img.classList.add("img");
  if(sender === 'Friend')
  {
    span.classList.add("time-left");
    img.src = logo;
  }
  else
  {
    img.src = me;
    p.style.textAlign = 'right';
    img.classList.add("right");
    span.classList.add("time-right");
    div.classList.add("darker");
  }
  span.appendChild(document.createTextNode(new Date().toLocaleString()));
  p.appendChild(document.createTextNode(`${messegeObj.body}`));
  div.appendChild(img);
  if(messegeObj.type === 'text')
  {
    div.appendChild(p);
  }
  else
  {
    let myImage = document.createElement('img');
    myImage.style.width = '50%'
    myImage.style.height = '50%'
    myImage.src = URL.createObjectURL(messegeObj.blob);
    div.appendChild(myImage);
  }
  div.appendChild(span);
  document.getElementById("messege-container").append(div);
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
  let [file, setFile] = useState("");

  let sendMessege = () =>{
    //console.log(2);
    //console.log(messege);
    let messegeObj = {
      type:"text",
      body: messege,
    }
    if(messege !== '')
    {
      socket.emit('send-messege',messegeObj,room);
      displayMessege(messegeObj,'Me');
      setMessege('')
    }
  }

  let sendFile = () =>{
    //console.log(2);
    //console.log(messege);
    if(file)
    {
      let messegeObj = {
        type:"file",
        body: file,
        mimeType:file.type,
        fileName: file.name
      }
      socket.emit('send-messege',messegeObj,room);
  
      let blob = new Blob([messegeObj.body],{ type : messegeObj.type});
      messegeObj.blob = blob;
      displayMessege(messegeObj,'Me');
      setMessege('');
      setFile();
    }
  }

  let joinRoom = () => {
    //console.log(3);
    //console.log(room);
    socket.emit('join-room',room,(messege)=>{ //send callback to receive inforation
      let messegeObj = {
        type:"text",
        body: messege,
      }
      displayMessege(messegeObj);
  });
  }

  let selectFile = (e) =>{
    new Compressor(e.target.files[0], {
      quality: 0.8, // 0.6 can also be used, but its not recommended to go below.
      success: (compressedResult) => {
        // compressedResult has the compressed file.
        // Use the compressed file to upload the images to your server.        
        setFile(compressedResult)
      },
    });
    //console.log(e.target.files[0]);
  }

  return (<>
  <Container>
  <h2>Chat Messages</h2>

  <Container id="messege-container" aria-readonly style={{overflowY:"scroll", height:"400px", background:"gray"}}>
    
  </Container>
     <InputGroup className="mb-3"></InputGroup>
     <InputGroup className="mb-3">
        <Form.Control
          placeholder="Messege"
          aria-label="Messege"
          aria-describedby="basic-addon2"
          name="messege"
          value={messege}
          onChange={(e) => setMessege(e.target.value)}
        />
        <Button variant="outline-secondary" id="button-addon2" onClick={sendMessege}>
          Send
        </Button>
      </InputGroup>
      <InputGroup className="mb-3">
        <Form.Control
          placeholder="File"
          aria-label="File"
          aria-describedby="basic-addon2"
          name="file"
          type="file"
          onChange={(e)=>{selectFile(e)}}
        />
        <Button variant="outline-secondary" id="button-addon2" onClick={sendFile}>
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
