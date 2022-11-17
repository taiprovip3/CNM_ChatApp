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

  //Biến chung:
  const [myCameraStream, setMyCameraStream] = useState();
  const [actor, setActor] = useState("receiver");
  const [callerPeerData, setCallerPeerData] = useState();
  const [receiverPeerData, setReceiverPeerData] = useState();

  const isBusyWith = React.useRef("");
  const myVideo = React.useRef();
  const userVideo = React.useRef();
  const connectionRef = React.useRef();

  React.useEffect(() => {
    if(selectedFriend) {
        setReceiver(selectedFriend);
        $("#openFriendVideoCallModal").click()
    } else {
        $(".btn-close").click();
    }
  },[selectedFriend, setReceiver]);

  React.useEffect(() => {
    if(currentUser) {
      const getUserMedia = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          myVideo.current.srcObject = stream;
          setMyCameraStream(stream);
        } catch (error) {
          console.error(error);
        }
      }
      getUserMedia();
      socket.on("receiver_await_server_response", (data) => {
        if(isBusyWith.current === "") {
          isBusyWith.current = data.caller.socket_id; 
          if(data.command === "CALLER_CALLING") { //TH: caller muốn gọi tối
            setActor("receiver"); //Nhận view receiver
            setReceiverStatus("RECEIVING"); //Cho view biết là đang receiving
            setSelectedFriend(data.caller);
            setCaller(data.caller); //Nhận caller
            setCallerPeerData(data.callerPeerData); //Nhận camera caller
            setReceiver(currentUser); //Set data cho chính mình dự phòng khi cần sử dụng
          } else {//TH: caller muốn huỷ cuộc gọi do mình ko nge máy quá lâu
              if(data.command === "CALLER_CANCEL") {
                console.log('Caller canceled call video.');
                isBusyWith.current = "";
                setReceiverStatus("NO_RECEIVE");
              }
              if(data.command === "CALLER_END") {
                console.log('Caller ended call video.');
                isBusyWith.current = "";
                setReceiverStatus("END");
              }
          }
          //Lưu vết lại là đã huỷ cuộc gọi
        } else {
            if(isBusyWith.current !== data.caller.socket_id) {
                socket.emit("caller_await_server_response", {command: "RECEIVER_BUSY", caller: data.caller});
            } else {
                if(data.command === "CALLER_CALLING") { //TH: caller muốn gọi tối
                  setActor("receiver"); //Nhận view receiver
                  setReceiverStatus("RECEIVING"); //Cho view biết là đang receiving
                  setSelectedFriend(data.caller);
                  setCaller(data.caller); //Nhận caller
                  setCallerPeerData(data.callerPeerData); //Nhận camera caller
                  setReceiver(currentUser); //Set data cho chính mình dự phòng khi cần sử dụng
                } else {//TH: caller muốn huỷ cuộc gọi do mình ko nge máy quá lâu
                    if(data.command === "CALLER_CANCEL") {
                      console.log('Caller canceled call video.');
                      isBusyWith.current = "";
                      setReceiverStatus("NO_RECEIVE");
                    }
                    if(data.command === "CALLER_END") {
                      console.log('Caller ended call video.');
                      isBusyWith.current = "";
                      setReceiverStatus("END");
                    }
                }
                //Lưu vết lại là đã huỷ cuộc gọi
            }
        }
      });
    }
  },[]);

  const handleCallerConfirmCallVideo = useCallback(() => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: myCameraStream,
    })
    peer.on("signal", (data) => { //Join & truyền vào kênh signal, (data) peer chính mình
      isBusyWith.current = selectedFriend;
      setActor("caller");
      setCallerStatus("CALLING");
      socket.emit("receiver_await_server_response", {
        command: "CALLER_CALLING",
        caller: currentUser,
        receiver: receiver,
        callerPeerData: data
      });
    });
    socket.on("caller_await_server_response", (data) => {
      if(data.command === "RECEIVER_ACCEPTED") {
        setActor("caller")
        setReceiverPeerData(data);//-> gắn signal của receiver đồng ý call cho peer stream caller
        setCallerStatus("ACCEPTED");
        setCaller(currentUser);
        setReceiver(selectedFriend);
        peer.signal(data.receiverPeerData);
      } else {
        if(data.command === "RECEIVER_DENIED") {
          console.log('Receiver denied call video.');
          isBusyWith.current = "";
          setCallerStatus("DENIED");  //Nhận view denied
        }
        if(data.command === "RECEIVER_END") {
          console.log('Receiver ended call video.');
          isBusyWith.current = "";
          setCallerStatus("END");
        }
        if(data.command === "RECEIVER_BUSY") {
          console.log('Receiver is now busy');
          isBusyWith.current = "";
          setCallerStatus("BUSY");
        }
      }
    });
    //Lưu vết lại là đã huỷ cuộc gọi
    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });
    connectionRef.current = peer;
  },[currentUser, myCameraStream, receiver, selectedFriend, setCaller, setCallerStatus, setReceiver, socket]);
  const handleCallerCancelCallVideo = useCallback(() => {
    socket.emit("receiver_await_server_response", {command: "CALLER_CANCEL", receiver});
    isBusyWith.current = "";
    setCallerStatus("NO_CALL");
    //Lưu vết huỷ cuộc gọi
  },[receiver, setCallerStatus, socket]);
  const handleCallerEndCallVideo = useCallback(() => {
    console.log('handleCallerEndCallVideo chạy');
    socket.emit("receiver_await_server_response", {command: "CALLER_END", receiver});
    isBusyWith.current = "";
    setCallerStatus("NO_CALL")
    //Lưu vết end cuộc gọi
  },[receiver, setCallerStatus, socket]);


  const handleReceiverAnswerCallVideo = useCallback(() => {
    setActor("receiver"); //nhận view mới
    setReceiverStatus("ACCEPTED");
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: myCameraStream,
    });
    peer.on("signal", (data) => {
      socket.emit("caller_await_server_response", {
        command: "RECEIVER_ACCEPTED",
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
    isBusyWith.current = "";
    setReceiverStatus("NO_RECEIVE");
    socket.emit("caller_await_server_response", {command: "RECEIVER_DENIED", caller: caller});
    //Lưu vết huỷ gọi
  },[caller, setReceiverStatus, socket]);
  const handleReceiverEndCallVideo = useCallback(() => {
    console.log('handleReceiverEndCallVideo chạy');
    isBusyWith.current = "";
    setReceiverStatus("NO_RECEIVE");
    socket.emit("caller_await_server_response", {command: "RECEIVER_END", caller: caller});
    //Lưu vết end cuộc gọi
  },[caller, setReceiverStatus, socket]);


  const handleCloseFriendVideoCallModal = useCallback(() => {
    if(selectedFriend) {
      if(actor === "caller") {
        socket.emit("receiver_await_server_response", {command: "CALLER_CANCEL", receiver: selectedFriend, caller: currentUser});
        isBusyWith.current = "";
        setCallerStatus("NO_CALL");
      }
    }
    setSelectedFriend(null);
  },[actor, currentUser, selectedFriend, setCallerStatus, setSelectedFriend, socket]);


  return (
    <>
    <button className='d-none' data-bs-toggle="modal" data-bs-target="#FriendVideoCallModal" id="openFriendVideoCallModal"></button>
    <div className="modal" id="FriendVideoCallModal" tabIndex="-1" role="dialog" aria-hidden="true" data-bs-keyboard="false" data-bs-backdrop="static">
        <div className="modal-dialog modal-dialog-centered modal-xl">
            <div className="modal-content">
                <div className="modal-header">
                    <h4 className="modal-title fw-bold">Gọi video đến bạn bè</h4>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={handleCloseFriendVideoCallModal}></button>
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
                                          <img src={selectedFriend && selectedFriend.photoURL} alt="photoURL" width='100' height='100' className='rounded-circle' />
                                          <br />
                                          <span className='fw-bold lead'>{selectedFriend && selectedFriend.fullName}</span>
                                          <br />
                                          <span className='text-muted'>{selectedFriend && selectedFriend.slogan}</span>
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
                            : (receiverStatus === "ACCEPTED") ?
                                <div>
                                    <div><video playsInline ref={userVideo} autoPlay style={{ width: "100%", height:'100%' }} /></div>
                                    <div>Đã kết nối với</div>
                                    <div>{caller.fullName}</div>
                                    <div><button onClick={handleReceiverEndCallVideo}>Ngắt kết nối</button></div>
                                </div>
                              : (receiverStatus === "END") ?
                                    <div>
                                        <div>{caller.fullName}</div>
                                        <div>Đã rời cuộc trò chuyện</div>
                                        <div><button onClick={() => setReceiverStatus("NO_RECEIVE")}>Xác nhận</button></div>
                                    </div>
                                : null
                      :
                          (callerStatus === "NO_CALL") ?
                              <div className='w-100 p-5 d-flex justify-content-center align-items-center'>
                                  <div className='text-center p-5' style={{ boxShadow: 'rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px' }}>
                                      <div className='text-primary lead'><FaInfoCircle /> Bạn đang là Receiver <ImVideoCamera /> và <HiMicrophone />!</div>
                                      <div className='p-2 text-center'>
                                          <img src={selectedFriend && selectedFriend.photoURL} alt="photoURL" width='100' height='100' className='rounded-circle' />
                                          <br />
                                          <span className='fw-bold lead'>{selectedFriend && selectedFriend.fullName}</span>
                                          <br />
                                          <span className='text-muted'>{selectedFriend && selectedFriend.slogan}</span>
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
                            : (callerStatus === "ACCEPTED") ?
                                <div>
                                    <div><video playsInline ref={userVideo} autoPlay style={{ width: "100%", height:'100%' }} /></div>
                                    <div>{receiver && receiver.fullName} đã đồng ý kết nối</div>
                                    <div><button onClick={handleCallerEndCallVideo}>Ngắt kết nối</button></div>
                                </div>
                            : (callerStatus === "DENIED") ?
                                <div>
                                    <div>{receiver && receiver.fullName}</div>
                                    <div>đã từ chối cuộc gọi</div>
                                    <div><button onClick={() => setCallerStatus("NO_CALL")}>Xác nhận</button></div>
                                </div>
                              : (callerStatus === "END") ?
                                  <div>
                                      <div>{receiver && receiver.fullName}</div>
                                      <div>đã rời cuộc trò truyện</div>
                                      <div><button onClick={() => setCallerStatus("NO_CALL")}>Xác nhận</button></div>
                                  </div>
                                : (callerStatus === "BUSY") ?
                                    <div>
                                        <div>{receiver && receiver.fullName}</div>
                                        <div>máy đang bận. Vui lòng gọi lại sau!</div>
                                        <div><button onClick={() => setCallerStatus("NO_CALL")}>Xác nhận</button></div>
                                    </div>
                                  : null
                    }
















                    



                </div>
            </div>
        </div>
    </div>
    </>
  );
}
