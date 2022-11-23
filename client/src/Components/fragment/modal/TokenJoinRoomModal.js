/* eslint-disable array-callback-return */
/* eslint-disable no-unused-vars */
import React, { useCallback } from 'react';
import { IoCopy } from 'react-icons/io5';
import { AuthContext } from '../../provider/AuthProvider';
import $ from 'jquery';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { arrayUnion, doc, setDoc, updateDoc } from 'firebase/firestore';
import { database } from '../../../firebase';
import { AppContext } from '../../provider/AppProvider';
import moment from 'moment';

export default function TokenJoinRoomModal({ room, setMathRoomToken }) {

  const { currentUser } = React.useContext(AuthContext);

  React.useEffect(() => {
    console.log('run useEffect');
    if(room) {
      $("#openTokenJoinRoomModal").click();
    } else {
      $(".btn-close").click();
    }
  },[room]);

  const handleJoinRoom = async () => {
    try {
      await updateDoc(doc(database, "Rooms", room.id), {
        listMember: arrayUnion(currentUser.id)
      });
      setMathRoomToken(null);
      await updateDoc(doc(database, "RoomMessages", room.id), {
        listObjectMessage: arrayUnion({
            idSender: currentUser.id,
            nameSender: "Thông báo",
            msg: currentUser.fullName + " đã tham gia nhóm",
            time: moment().format('MMMM Do YYYY, h:mm:ss a'),
            photoURL: currentUser.photoURL,
            idMessage: (Math.random() + 1).toString(36).substring(2)
        })
      });
      toast.success("Tham gia nhóm thành công");
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
    
  }

  return (
    <>
    <ToastContainer theme='colored' />
    <button className='d-none' data-bs-toggle="modal" data-bs-target="#TokenJoinRoomModal" id="openTokenJoinRoomModal"></button>
    <div className="modal" id="TokenJoinRoomModal" tabIndex="-1" role="dialog" aria-hidden="true" data-bs-keyboard="false" data-bs-backdrop="static">
        <div className="modal-dialog modal-dialog-centered modal-xl">
            <div className="modal-content">
                <div className="modal-header">
                    <h4 className="modal-title fw-bold">Tham gia nhóm chat</h4>
                    <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div className="modal-body d-flex text-dark">

                    <div className='d-flex justify-content-center align-items-center w-100 text-center'>
                        <div style={{ backgroundImage: `url("https://media1.giphy.com/media/cZ7rmKfFYOvYI/giphy-downsized.gif")` }} className="p-5 text-white">
                          <img src="https://res.cloudinary.com/dopzctbyo/image/upload/v1649587869/cld-sample.jpg" alt="urlImage" className='rounded-circle' width="100" height="100" />
                          <br />
                          <span className='lead fw-bolder'>{room && room.name}</span>
                          <br />
                          <span>{room && room.description}</span>
                          <br />
                          <span>{room && room.listMember.length} Thành viên</span>
                        </div>
                    </div>
                    <div className='w-100 p-2'>
                        <p className='fw-bold lead text-decoration-underline'>Thông tin chi  tiết nhóm</p>
                        <span className='text-success'><IoCopy />Token: {room && room.id}</span><br />
                        <span>Nhóm trưởng: </span><br />
                        <span>&emsp;- {room && room.owner}</span><br />
                        <span>Danh sách thành viên:</span><br />
                        {
                            room &&
                            room.listMember.map(element => {
                              return <span className='d-block' key={Math.random()}>- {element}</span>;
                            })
                        }
                        <span>Ngày thành lập nhóm</span><br />
                        <span>&emsp;- {room && room.createAt}</span><br />
                        <span>Cách đây:</span><br />
                        <span>&emsp;- 3 month ago</span>
                    </div>


                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-outline-secondary btn-lg" data-bs-dismiss="modal">Huỷ</button>
                    {
                      room && room.listMember.includes(currentUser.id) ?
                      <button className='btn btn-primary btn-lg text-white disabled'>Đã tham gia</button> :
                      <button className='btn btn-primary btn-lg text-white' onClick={() => handleJoinRoom()}>Tham gia nhóm</button>
                    }
                </div>
            </div>
        </div>
    </div>
    </>
  );
}
