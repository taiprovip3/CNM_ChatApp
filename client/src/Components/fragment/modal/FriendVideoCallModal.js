/* eslint-disable no-unused-vars */
import React, { useCallback, useState } from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import { HiMicrophone } from 'react-icons/hi';
import { ImVideoCamera } from 'react-icons/im';
import { AuthContext } from '../../provider/AuthProvider';
import $ from 'jquery';
import Peer from 'simple-peer';

export default function FriendVideoCallModal() {

  const { socket, currentUser, selectedFriend, setSelectedFriend, caller, setCaller, receiver, setReceiver, callerStatus, setCallerStatus, receiverStatus, setReceiverStatus } = React.useContext(AuthContext);
  const { socket_id, fullName } = currentUser;

  //Biến chung:
  const [myCameraStream, setMyCameraStream] = useState();
  const [actor, setActor] = useState("receiver");
  const [callerPeerData, setCallerPeerData] = useState();
  const [receiverPeerData, setReceiverPeerData] = useState();


  const myVideo = React.useRef();
  const userVideo = React.useRef();
  const connectionRef = React.useRef();

  React.useEffect(() => {
    if(selectedFriend) {
        $("#openFriendVideoCallModal").click()
    } else {
        $(".btn-close").click();
    }
  },[selectedFriend]);

  React.useEffect(() => {
    if(currentUser) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
        myVideo.current.srcObject = stream;
        setMyCameraStream(stream);
      });

      socket.on("robot_receiver", (data) => {
        if(data) { //TH: caller muốn gọi tối
          setActor("receiver"); //Nhận view receiver
          setCaller(data.caller); //Nhận caller
          setCallerPeerData(data.callerPeerData); //Nhận camera caller
          setReceiver(currentUser); //Set global mình nhận
          setReceiverStatus("RECEIVING"); //Cho view biết là đang receiving
        } else {//TH: caller muốn huỷ cuộc gọi do mình ko nge máy quá lâu
            setReceiverStatus("NO_RECEIVE");
            //Lưu vết lại là đã huỷ cuộc gọi
        }
      });
    }
  },[currentUser, setCaller, setReceiver, setReceiverStatus, socket]);

  const handleCallerConfirmCallVideo = useCallback(() => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: myCameraStream,
    })
    peer.on("signal", (data) => { //Join & truyền vào kênh signal, (data) peer chính mình
      setActor("caller");
      setCallerStatus("CALLING");
      socket.emit("i_want_call_video", {
        caller: currentUser,
        receiver: receiver,
        callerPeerData: data
      });
    });
    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });
    socket.on("caller_await_server_response", (data) => {
      if(data) {
        console.log('ir: ', data);
        peer.signal(data);//-> gắn signal của receiver đồng ý call cho peer stream caller
        setCallerStatus("ACCEPTED");
      } else {
        setCallerStatus("DENIED");  //Nhận view denied
      }
    });
    connectionRef.current = peer;
  },[currentUser, myCameraStream, receiver, setCallerStatus, socket]);
  const handleCallerCancelCallVideo = useCallback(() => {
    setCallerStatus("NO_CALL");
    socket.emit("i_cancel_to_call", receiver.socket_id);
    //Lưu vết cuộc gọi nhỡ
  },[receiver, setCallerStatus, socket]);


  const handleReceiverAnswerCallVideo = useCallback(() => {
    setReceiverStatus("ACCEPTED");  //nhận view mới
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: myCameraStream,
    });
    peer.on("signal", (data) => {
      socket.emit("i_accept_to_call", {
        caller: caller,
        receiverPeerData: data, 
      });
    });
    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });
    peer.signal(callerPeerData);
    connectionRef.current = peer;
  },[caller, callerPeerData, myCameraStream, setReceiverStatus, socket]);
  const handleReceiverDenyCallVideo = useCallback(() => {
    setReceiverStatus("NO_RECEIVE");
    connectionRef.current.destroy();
    socket.emit("i_deny_to_call", caller.socket_id);
  },[caller, setReceiverStatus, socket]);

  return (
    <>
    <button className='d-none' data-bs-toggle="modal" data-bs-target="#FriendVideoCallModal" id="openFriendVideoCallModal"></button>
    <div className="modal" id="FriendVideoCallModal" tabIndex="-1" role="dialog" aria-hidden="true" data-bs-keyboard="false" data-bs-backdrop="static">
        <div className="modal-dialog modal-dialog-centered modal-xl">
            <div className="modal-content">
                <div className="modal-header">
                    <h4 className="modal-title fw-bold">Gọi video đến bạn bè</h4>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={() => setSelectedFriend(null)}></button>
                </div>
                <div className="modal-body d-flex">
                    <div className='w-100 d-flex jutify-content-center align-items-center rounded'>
                        <video playsInline ref={myVideo} autoPlay style={{ width: "100%", height:'100%' }} />
                    </div>




                    {
                      (actor === "receiver") ?
                          (receiverStatus === "NO_RECEIVE") ?
                              <div className='w-100 p-5 d-flex justify-content-center align-items-center'>
                                  <div className='text-center p-5' style={{ boxShadow: 'rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px' }}>
                                      <div className='text-primary lead'><FaInfoCircle /> Hãy đảm bảo thiết bị của bạn có kết nối <ImVideoCamera /> và <HiMicrophone />!</div>
                                      <div className='p-2 text-center'>
                                          <img src={!selectedFriend ? "https://res.cloudinary.com/dopzctbyo/image/upload/v1649587847/sample.jpg" : selectedFriend.photoURL} alt="photoURL" width='100' height='100' className='rounded-circle' />
                                          <br />
                                          <span className='fw-bold lead'>{!selectedFriend ? "ORA ORA ORA" : selectedFriend.fullName}</span>
                                          <br />
                                          <span className='text-muted'>{!selectedFriend ? "MUDA MUDA MUDA" : selectedFriend.slogan}</span>
                                      </div>
                                      <div className="d-flex">
                                          <div className='w-100'>
                                              <button className='w-100 btn btn-success' onClick={handleCallerConfirmCallVideo}>Xác nhận</button>
                                          </div>
                                          <div className='w-100'></div>
                                          <div className='w-100'><button className='w-100 btn btn-secondary' data-bs-dismiss="modal" onClick={() => setSelectedFriend(null)}>Huỷ bỏ</button></div>
                                      </div>
                                  </div>
                              </div>
                          : (receiverStatus === "RECEIVING") ?
                                <div>
                                    <div>{caller.fullName}</div>
                                    <div>Đang gọi đến bạn</div>
                                    <div><button onClick={handleReceiverAnswerCallVideo}>Đồng ý</button></div>
                                    <div><button onClick={handleReceiverDenyCallVideo}>Từ chối</button></div>
                                </div>
                            :
                                <div>
                                    <div><video playsInline ref={userVideo} autoPlay style={{ width: "100%", height:'100%' }} /></div>
                                    <div>Đã kết nối với</div>
                                    <div>{caller.fullName}</div>
                                    <div><button onClick={handleReceiverDenyCallVideo}>Ngắt kết nối</button></div>
                                </div>
                      :
                          (callerStatus === "NO_CALL") ?
                              <div className='w-100 p-5 d-flex justify-content-center align-items-center'>
                                  <div className='text-center p-5' style={{ boxShadow: 'rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px' }}>
                                      <div className='text-primary lead'><FaInfoCircle /> Bạn đang là Receiver <ImVideoCamera /> và <HiMicrophone />!</div>
                                      <div className='p-2 text-center'>
                                          <img src={!selectedFriend ? "https://res.cloudinary.com/dopzctbyo/image/upload/v1649587847/sample.jpg" : selectedFriend.photoURL} alt="photoURL" width='100' height='100' className='rounded-circle' />
                                          <br />
                                          <span className='fw-bold lead'>{!selectedFriend ? "ORA ORA ORA" : selectedFriend.fullName}</span>
                                          <br />
                                          <span className='text-muted'>{!selectedFriend ? "MUDA MUDA MUDA" : selectedFriend.slogan}</span>
                                      </div>
                                      <div className="d-flex">
                                          <div className='w-100'>
                                              <button className='w-100 btn btn-success' onClick={handleCallerConfirmCallVideo}>Xác nhận</button>
                                          </div>
                                          <div className='w-100'></div>
                                          <div className='w-100'><button className='w-100 btn btn-secondary' data-bs-dismiss="modal" onClick={() => setSelectedFriend(null)}>Huỷ bỏ</button></div>
                                      </div>
                                  </div>
                              </div>
                          : (callerStatus === "CALLING") ?
                              <div>
                                  <div>Vui lòng chờ đợi</div>
                                  <div>{receiver && receiver.fullName} phản hồi</div>
                                  <div><button onClick={handleCallerCancelCallVideo}>Huỷ gọi</button></div>
                              </div>
                            : (caller === "ACCEPTED") ?
                                <div>
                                    <div><video playsInline ref={userVideo} autoPlay style={{ width: "100%", height:'100%' }} /></div>
                                    <div>{receiver && receiver.fullName} đã đồng ý kết nối</div>
                                    <div><button onClick={handleCallerCancelCallVideo}>Ngắt kết nối</button></div>
                                </div>
                            : 
                                null
                    }
















                    



                </div>
            </div>
        </div>
    </div>
    </>
  );
}
