/* eslint-disable no-unused-vars */
import React, { memo, useEffect, useState } from 'react';
import { BiLinkAlt } from 'react-icons/bi';
import { MdOutlineExitToApp } from 'react-icons/md';
import { toast } from 'react-toastify';
import { arrayRemove, doc, setDoc, updateDoc } from 'firebase/firestore';
import { database, storage } from '../../../firebase';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import $ from 'jquery';

export default memo(function Update({ objectGroupModal, users, currentUser, setCurrentRowShow, setShowGroupModalComponent }) {

    const awaitHandleUploadPhotoURL = async (editRoomUrlImage, oldPath, currentPath) => {
        let link;
        if(editRoomUrlImage == null){
            return link = objectGroupModal.urlImage;
        }
        if(oldPath){
            console.log(' oldpath lúc này = ', oldPath);
            const oldImageRef = ref(storage, oldPath);
            deleteObject(oldImageRef)
                .then(() => {
                    console.log('Found room have oldPath, delete successfully!');
                })
                .catch((err) => {
                    console.log(err);
                    toast.error(err.message);
                });
        }
        const imagesRef = ref(storage, currentPath);
        await uploadBytes(imagesRef, editRoomUrlImage)
          .then(async () => {
              await getDownloadURL(imagesRef)
                .then((url) => {
                    link = url;
                });
          })
          .catch(err => {
              console.log(err);
              toast.error(err.message);
          });
        return link;
    }

    const handleUpdateRoom = async (e) => {
        e.preventDefault();
        const editRoomName = e.target["editRoomName"].value;
        const editRoomDescription = e.target["editRoomDescription"].value;
        const editRoomUrlImage = e.target["editRoomUrlImage"].files[0];

        if(editRoomName === "" || editRoomName === undefined){
            toast.error("Tên phòng không được rỗng");
            return;
        }
        if(editRoomDescription === "" || editRoomDescription === undefined){
            toast.error("Vui lòng nhập mô tả nhóm");
            return;
        }
        var currentPath = 0;
        if(editRoomUrlImage)
            currentPath = 'urlImages/' + objectGroupModal.id + "__" + editRoomUrlImage.name;
        const newUrlImage = await awaitHandleUploadPhotoURL(editRoomUrlImage, objectGroupModal.oldPath, currentPath);
        const room = {...objectGroupModal, description: editRoomDescription, name: editRoomName, urlImage: newUrlImage, oldPath: currentPath};
        await setDoc(doc(database, "Rooms", objectGroupModal.id), room);
        toast.success("Cập nhật thành công");
        setShowGroupModalComponent("info");
    }

    const onSelectedNewUrlImage = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('#newRoomUrlImage').attr('src', e.target.result);
            }
            reader.readAsDataURL(e.target.files[0]);
        }
    }

  return (
    <div className="modal-content">
        <div className="modal-header">
            <p className="modal-title">Quản lý nhóm chat</p>
            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <form onSubmit={handleUpdateRoom}>
        <div className="modal-body">
            {/* 0div */}
            <div>
                <ul className="nav nav-tabs">
                    <li className="nav-item">
                        <span className='nav-link needCursor' onClick={() => setShowGroupModalComponent("info")}>Thông tin</span>
                    </li>
                    <li className="nav-item">
                        <span className='nav-link active'>Cập nhật</span>
                    </li>
                    <li className="nav-item">
                        <span className='nav-link needCursor' onClick={() => setShowGroupModalComponent("authorization")}>Phân quyền</span>
                    </li>
                </ul>
            </div>
            {/* 1div */}
            <div className='border p-3 text-center'>
                <img src={objectGroupModal.urlImage} alt="urlImage" width='80' height='80' className='rounded-circle needCursor border' />
                <br />
                <span className='fw-bold'>{objectGroupModal.name}</span>
                <br />
                <span className='small'>{objectGroupModal.description}</span>
            </div>
            {/* 2div */}
            <div className='border p-3 my-2'>
                <div className="input-group">
                    <span className="input-group-text">Tên nhóm</span>
                    <input type="text" className="form-control" placeholder="Nhập tên nhóm" defaultValue={objectGroupModal.name} name="editRoomName" />
                </div>
                <div className="input-group">
                    <span className="input-group-text">Mô tả</span>
                    <textarea type="text" className="form-control" placeholder="Nhập mô tả nhóm" defaultValue={objectGroupModal.description} name="editRoomDescription"></textarea>
                </div>
                <div className="input-group">
                    <span className="input-group-text">Ảnh đại diện</span>
                    <input type="file" className="form-control" name="editRoomUrlImage" onChange={onSelectedNewUrlImage} accept="image/png, image/jpeg" />
                </div>
            </div>
            {/* 3div */}
            <div className="border p-3 my-2 text-center">
                <span>Ảnh đại diện mới</span>
                <br />
                <img src={objectGroupModal.urlImage} alt="urlImage" width='80' height='80' className='rounded-circle needCursor border' name="newRoomUrlImage" id='newRoomUrlImage' />
            </div>
        </div>
        <div className="modal-footer">
            <button type="submit" className="btn btn-success w-100" data-bs-dismiss="modal">Cập nhật thông tin</button>
        </div>
        </form>
    </div>
  );
});
