import React from 'react';
import { AuthContext } from '../../provider/AuthProvider';
import $ from 'jquery';
import { BsDot } from 'react-icons/bs';
import moment from 'moment';

export default function DetailMessageModal() {

  const { bundleDetailMessageModal, setBundleDetailMessageModal } = React.useContext(AuthContext);

  React.useEffect(() => {
    if(bundleDetailMessageModal){
        $("#openDetailModal").click();
        console.log('ac: ', bundleDetailMessageModal);
    }
    else
        $(".btn-close").click();
  },[bundleDetailMessageModal]);

  if(!bundleDetailMessageModal) {
    return;
  }

  return (
    <div>
        <button data-bs-toggle="modal" data-bs-target="#DetailMessageModal" id='openDetailModal' className='d-none'></button>
        <div className="modal fade" id="DetailMessageModal" tabIndex="-1" role="dialog" aria-hidden="true" data-bs-keyboard="false" data-bs-backdrop="static">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <p className="modal-title fw-bold">Thông tin chi tiết</p>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={() => setBundleDetailMessageModal(null)}></button>
                    </div>
                    <div className="modal-body bg-light p-3">
                        <div className="p-2 d-flex">
                            <div><img src="https://s120-ava-talk.zadn.vn/5/3/6/5/3/120/2d5ad12faad2450f03cdb4b7b1719508.jpg" alt="photoURL" className='rounded-circle' width="45" height="45" /></div>
                            <div className='bg-white border px-3 rounded'>
                                <span className='font-weight-light d-block'>{bundleDetailMessageModal.nameSender}</span>
                                {
                                    bundleDetailMessageModal.msg.includes("https://firebasestorage.googleapis.com/") ?
                                    <img src={bundleDetailMessageModal.msg} alt="messageIsImage" className='img-thumbnail d-block needCursor' height='100' width='100' onClick={() => window.open(bundleDetailMessageModal.msg)} />
                                    : <span className="fw-bold lead d-block">{bundleDetailMessageModal.msg}</span>
                                }
                                <span className='text-end'>{bundleDetailMessageModal.time} <BsDot/></span>
                            </div>
                        </div>
                        <div>Cách đây: {moment(bundleDetailMessageModal.time, "MMMM Do YYYY, h:mm:ss a").fromNow()}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
