/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useCallback, useState } from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import { HiMicrophone } from 'react-icons/hi';
import { ImVideoCamera } from 'react-icons/im';
import { AuthContext } from '../../provider/AuthProvider';
import $ from 'jquery';
import Peer from 'simple-peer';
import { limitToLast } from 'firebase/firestore';

export default function FriendVideoCallModal() {

  const { socket, currentUser, currentUser: {socket_id,fullName}, selectedFriend, setSelectedFriend } = React.useContext(AuthContext);
  const defaultSelectedFriend = {bod:1,bom:1,boy:1903,age:21,email:'tly63779@cdfaq.com ',fullName:'Phan Tấn Tài',id:'BN12jZMETsVpzjq1w2QpUBXdeA33',joinDate:'November 5th 2022, 1:51:39 pm',keywords:["P", "PH"],lastOnline:"November 15th 2022, 10:34:50 am", phoneNumber:"+84",photoURL:"https://res.cloudinary.com/dopzctbyo/image/upload/v1649587847/sample.jpg",role:["MEMBER"],sex:false,slogan:'Xin chào bạn, mình là người tham gia mới. Nếu là bạn bè thì hãy cùng nhau giúp đỡ nhé!',socket_id:"MNApR2q-X4_XEAu-AAAJ",status:false,theme:"light",address: "Không"};

  const [stream, setStream] = useState();
  const [wasInviting, setWasInviting] = useState(false);
  const [wasReceiving, setWasReceiving] = useState(false);
  const [wasHearing, setWasHearing] = useState(false);
  const [isReceiverAcceptedCall, setIsReceiverAcceptedCall] = useState(false);
  const [socketIdReveiver, setSocketIdReceiver] = useState("");
  const [socketIdCaller, setSocketIdCaller] = useState("");
  const [nameCaller, setNameCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();

  const myVideo = React.useRef();
  const userVideo = React.useRef();
  const connectionRef = React.useRef();

  React.useEffect(() => {
    if(selectedFriend !== null && selectedFriend !== defaultSelectedFriend) {
        console.log('==1', selectedFriend);
        $("#openFriendVideoCallModal").click()
    } else {
        $(".btn-close").click();
    }
  },[selectedFriend]);
  React.useEffect(() => {
    if(currentUser) {
      console.log('Chạy useEffect viddeoCaller');
      const getUserMedia = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          myVideo.current.srcObject = stream;
          setStream(stream);
        } catch (error) {
          console.log(error);
        }
      }
      getUserMedia();

      socket.on("join_call_video", (data) => {/* socket luôn lắng nge ai ở server emit lên kênh join_call_video (luôn nge ai gọi tới mình) */
        setWasReceiving(true);
        setSocketIdCaller(data.socketIdCaller);
        setNameCaller(data.nameCaller);
        setCallerSignal(data.signal);//-> khi có ai đó gọi đến qua kênh signal nhả ra "data". Mình lưu trữ lại "data" của người gọi đó. Nếu đống nhấc máy, > sẽ dùng callerSignal này để thiết lập connectionRef.
      });
    }
  },[]);

  const handleConfirmCallVideo = useCallback(() => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    })
    peer.on("signal", (data) => { /* tạo ra 1 peer (mình là người khởi xướng) -> tiến hành pending... và luôn lắng nge ai emit trên kênh "signal" mình đang pending */
      //Nhả ra 1 signal "data". Bất cứ ai peer emit lên kênh tên signal và truyền vào data trùng vs data này thì connection sẽ được thiết lập giữa 2-peer.
      console.log('test data: ', data);
      setWasInviting(true); //state dùng cho caller
      socket.emit("join_call_video", {  //có 1 kênh join_call_video lắng nge ở server. Socket này gọi vào kênh đó -> kênh đó emit lại cho kênh join_call_video ở useEffect phía client có socket_id là receiver data mình truyển ở đây vào. Ở ChatFriend.js có 1 kênh có mã socketid luôn lắng nge socket emit.
        socketIdReceiver: selectedFriend.socket_id,
        signalData: data,
        socketIdCaller: socket_id,
        nameCaller: fullName,
      });
    });
    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });
    socket.on("is_receiver_accepted_call", (signal) => {//Sau khi emit data của mình vào kênh join_call_video. Thì tạo ra 1 socket lắng nge emit kênh "is_receiver_accepted_call" để chờ.
      setIsReceiverAcceptedCall(true);
      setWasHearing(true);
      peer.signal(signal);//-> gắn signal của receiver đồng ý call cho peer caller
    });
    connectionRef.current = peer;
  },[nameCaller, socket, socketIdCaller, stream]);
  const handleAnswerCallVideo = useCallback(() => {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      socket.emit("is_receiver_accepted_call", {signal: data, socketIdCaller: socketIdCaller});
    });
    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });
    peer.signal(callerSignal);
    connectionRef.current = peer;
    setWasHearing(true);
  },[callerSignal, socket, socketIdCaller, stream]);

  return (
    <>
    <button className='d-none' data-bs-toggle="modal" data-bs-target="#FriendVideoCallModal" id="openFriendVideoCallModal"></button>
    <div className="modal" id="FriendVideoCallModal" tabIndex="-1" role="dialog" aria-hidden="true" data-bs-keyboard="false" data-bs-backdrop="static">
        <div className="modal-dialog modal-dialog-centered modal-xl">
            <div className="modal-content">
                <div className="modal-header">
                    <h4 className="modal-title fw-bold">Gọi video đến bạn bè</h4>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={() => setSelectedFriend(defaultSelectedFriend)}></button>
                </div>
                <div className="modal-body d-flex">
                    <div className='w-100 d-flex jutify-content-center align-items-center rounded'>
                        <video playsInline ref={myVideo} autoPlay style={{ width: "100%", height:'100%' }} />
                    </div>


                    {
                      (wasReceiving) ?
                          (<div>
                              <div>Ai đó đang gọi cho bạn</div>
                              <div><button onClick={handleAnswerCallVideo}>Nge máy</button></div>
                              <div><button onClick={() => setWasReceiving(true)}>Từ chối</button></div>
                          </div>)
                          (wasHearing) ?
                              (
                                  <div>
                                      <video playsInline ref={userVideo} autoPlay style={{ width: "100%", height:'100%' }} />
                                      <div>Đã kết nối</div>
                                      <div><button onClick={() => {setWasHearing(false); setWasReceiving(false); }}>Tắt máy</button></div>
                                  </div>
                              )
                          : null
                      :
                          (wasInviting) ?
                              (
                                <div>
                                    <div>Bạn đang gọi cho ai đó</div>
                                    <div><button onClick={() => setWasInviting(false)}>Huỷ</button></div>
                                </div>
                              )
                          :
                          <div className='w-100 p-5 d-flex justify-content-center align-items-center'>
                            <div className='text-center p-5' style={{ boxShadow: 'rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px' }}>
                                <div className='text-primary lead'><FaInfoCircle /> Hãy đảm bảo thiết bị của bạn có kết nối <ImVideoCamera /> và <HiMicrophone />!</div>
                                <div className='p-2 text-center'>
                                    <img src={selectedFriend.photoURL} alt="photoURL" width='100' height='100' className='rounded-circle' />
                                    <br />
                                    <span className='fw-bold lead'>{selectedFriend.fullName}</span>
                                    <br />
                                    <span className='text-muted'>{selectedFriend.slogan}</span>
                                </div>
                                <div className="d-flex">
                                    <div className='w-100'>
                                        <button className='w-100 btn btn-success' onClick={handleConfirmCallVideo}>Xác nhận</button>
                                    </div>
                                    <div className='w-100'></div>
                                    <div className='w-100'><button className='w-100 btn btn-secondary' data-bs-dismiss="modal" onClick={() => setSelectedFriend(defaultSelectedFriend)}>Huỷ bỏ</button></div>
                                </div>
                            </div>
                      </div>
                    }


                </div>
            </div>
        </div>
    </div>
    </>
  );
}
