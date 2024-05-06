import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { BiPhoneCall, BiCheck } from "react-icons/bi";
import {
  Button,
  Spinner,
} from "@chakra-ui/react";
import { useVideoChatContext } from "../context/VideoChatContext";
import "../styles.css";


function VideoCall() {
  const { currentUser, currentUserToken } = useAuth(); // Assuming currentUsertoken is available in the auth context
  const {
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
  } = useVideoChatContext();


  return (
    <div className="videoCallWrapper">
      <div className="streamsWrapper">
        {stream ? (
          <>
            <p>My Camera:</p>
            <video
              playsInline
              muted
              ref={myVideo}
              autoPlay
              className="myStreamBox"
            />
          </>
        ) : (
          <div className="myStreamBox">
            <p>Missing Camera</p>
          </div>
        )}

        {!callEnded && callAccepted ? (
          <>
            <p>{currentUser.isVet ? "Client Camera:" : "Vet Camera:"}</p>
            <video
              playsInline
              ref={userVideo}
              autoPlay
              className="partnerStreamBox"
            />
            <Button
                leftIcon={<BiCheck />}
                colorScheme="teal"
                variant="solid"
                onClick={leaveCall}
              >
                End Call
              </Button>

            
          </>
        ) : (
          <>
            {currentUser.isVet && <span>Waiting for calls<Spinner /></span>}
            <p>{currentUser.isVet ? "Client Camera:" : "Vet Camera:"}</p>
            <div className="missingParterStreamBox" />
          </>
        )}
      </div>
      {!callAccepted && isReceivingCall && currentUser.isVet && (
        <Button
          leftIcon={<BiPhoneCall />}
          onClick={answerCall}
          mt="20"
          colorScheme="teal"
          variant="solid"
        >
          Answer Call
        </Button>
      )}
      {!currentUser.isVet &&  (
        <Button
          leftIcon={<BiPhoneCall />}
          onClick={callVet}
          mt="20"
          colorScheme="teal"
          variant="solid"
        >
          Call
        </Button>
      )}
      {currentUser.isVet &&
        callAccepted &&
        callerData.mongoDbId && ( //callEnded
          <div className="writePrescription">
            <h1>Write Prescription</h1>
            <span className="inputsWrapper">
              <input
                type="text"
                required
                placeholder="Medicine Name"
                style={{
                  borderColor: "#4f63b2",
                  borderWidth: 5,
                  borderRadius: 10,
                  padding: 5,
                }}
              />
              <input
                type="text"
                required
                placeholder="Amount"
                style={{
                  borderColor: "#4f63b2",
                  borderWidth: 5,
                  borderRadius: 10,
                  padding: 5,
                }}
              />

              <Button
                leftIcon={<BiCheck />}
                colorScheme="teal"
                variant="solid"
              >
                Approve
              </Button>
            </span>
          </div>
        )}
    </div>
  );
}

export default VideoCall;
