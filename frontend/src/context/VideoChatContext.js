import { createContext, useState, useRef, useEffect, useContext } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();

export function useVideoChatContext() {
  return useContext(SocketContext);
}

const socket = io("http://localhost:8080");
const VideoChatProvider = ({ children }) => {
  const { currentUser, currentUserToken } = useAuth();

  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);

  const [isReceivingCall, setIsReceivingCall] = useState(false);

  const [callerData, setCallerData] = useState(); //will hold the customer mongoId
  const [callerSignal, setCallerSignal] = useState();

  const [stream, setStream] = useState({});
  const [name, setName] = useState("");
  const [call, setCall] = useState({});
  const [me, setMe] = useState("");

  const myVideo = useRef();
  const userVideo = useRef();

  const connectionRef = useRef();
  console.log("connectionRef", connectionRef);
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        if (myVideo.current) {
          myVideo.current.srcObject = stream;
        }
      })
      .catch((e) => {
        console.error("Failed to get local stream: ", e.message);
      });

    if (currentUser && currentUser.isVet) {
      socket.emit("registerVet", { token: currentUserToken });
      socket.on("callFromClient", (data) => {
        console.log("callFromClient", data);
        setIsReceivingCall(true);
        setCallerData(data); //callerData type {signalData,fromSocketId,mongoDbId}
        setCallerSignal(data.signalData);
        //here should add the socket id of the user that we got the call from
      });
    }
  }, []);

  //Will be used by the Vet
  const answerCall = () => {
    setCallAccepted(true);
    try {
      console.log("stream before new peer for vet", stream);
      const peer = new Peer({ initiator: false, trickle: false, stream });
      peer.on("signal", (data) => {
        socket.emit("answerCall", {
          signal: data,
          to: callerData.fromSocketId,
        });
      });
      peer.on("stream", (currentStream) => {
        if (currentStream == null) {
          leaveCall();
        } else {
          userVideo.current.srcObject = currentStream;
        }
      });
      peer.on("error", (err) => {
        console.error("Peer connection error:", err);
        leaveCall(); // Ensure cleanup on error
      });
      peer.signal(callerSignal);
      connectionRef.current = peer;
    } catch (e) {
      console.log(e);
    }
  };

  //Will be used by the User
  const callVet = (id) => {
    try {
      const peer = new Peer({ initiator: true, trickle: false, stream });
      peer.on("signal", (data) => {
        console.log("signall!!!1");
        socket.emit("callVet", {
          signalData: data,
          name: currentUser.name,
          mongoDbId: currentUser.id, //later will send the token for actual confirmation
        });
      });
      peer.on("stream", (currentStream) => {
        userVideo.current.srcObject = currentStream;
      });
      peer.on("error", (err) => {
        console.error("Peer connection error:", err);
        leaveCall(); // Ensure cleanup on error
      });
      socket.on("callAccepted", (signal) => {
        setCallAccepted(true);
        peer.signal(signal);
      });
      connectionRef.current = peer;
    } catch (e) {}
  };

  //Will be used by both the User and the Vet
  const leaveCall = () => {
    setCallEnded(true);
    // connectionRef.current.destroy();
    window.location.reload();
  };

  return (
    <SocketContext.Provider
      value={{
        call,
        callAccepted,
        myVideo,
        userVideo,
        stream,
        name,
        setName,
        callEnded,
        me,
        callVet,
        leaveCall,
        answerCall,
        isReceivingCall,
        callerData,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
export { VideoChatProvider, SocketContext };
