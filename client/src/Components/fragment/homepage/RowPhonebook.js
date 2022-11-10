import React, { memo, useState } from 'react';
import '../../css/RowPhonebook.css';
import { AuthContext } from '../../provider/AuthProvider';
import { BsFillChatTextFill } from 'react-icons/bs'
import { RiSettings5Line, RiFolderUserFill } from 'react-icons/ri';
import { BiSearchAlt } from 'react-icons/bi';
import { HiUserAdd, HiOutlineUserGroup } from 'react-icons/hi';
import { TbUsers } from 'react-icons/tb';
import { AiFillQuestionCircle } from 'react-icons/ai';
import ListFriend from '../row-chat/ListFriend';
import ListRoom from '../row-chat/ListRoom';
import { AppContext } from '../../provider/AppProvider';

export default memo(function RowPhonebook() {

    //Biến
    const { currentUser: { photoURL }, setCurrentRowShow } = React.useContext(AuthContext);
    const { friends } = React.useContext(AppContext);
    const [selectedObject, setSelectedObject] = useState('DanhSachKetBan');

    //Hàm

    //FontEnd
    return (
        <div className="row">
            <div className='col-lg-1 bg-primary border' id='divA'>
                <div data-bs-toggle="modal" data-bs-target="#SignoutModal">
                    <img src={photoURL} alt="photoURL" className='rounded-circle mx-auto d-block my-3 needCursor' width="45" height="45" />
                </div>
                <div className='py-3 rounded needCursor' onClick={() => setCurrentRowShow("row-chat")}>
                    <BsFillChatTextFill className='fs-3 text-white mx-auto d-block' />
                </div>
                <div className='py-3 rounded my-3' style={{ backgroundColor: '#0e58ad' }} >
                    <RiFolderUserFill className='fs-3 text-white mx-auto d-block' />
                </div>
                <div id='settingIconCss' className='p-1'>
                    <RiSettings5Line id='iconSetting' className='h1 text-white' data-bs-toggle="modal" data-bs-target="#UserInfoModal" />
                </div>
            </div>
            <div className="col-lg-3 border" id='divB'>
                <div className='d-flex align-items-center'>
                    <div className="input-group">
                    <span className="input-group-text"><BiSearchAlt /></span>
                    <input type="text" className="form-control" placeholder="Tìm kiếm" />
                    </div>
                    <HiUserAdd className='h3 m-2 needCursor' data-bs-toggle="modal" data-bs-target="#AddFriendModal" />
                    <HiOutlineUserGroup className='h3 m-1 needCursor' data-bs-toggle="modal" data-bs-target="#CreateRoomModal" />
                </div>
                <div>
                    <div className='d-flex align-items-center p-1 needCursor' onClick={() => setSelectedObject('DanhSachKetBan')} style={selectedObject === 'DanhSachKetBan' ? {backgroundColor: '#69d0ff'} : {backgroundColor: 'white'}}>
                        <img src="https://chat.zalo.me/assets/NewFr@2x.820483766abed8ab03205b8e4a8b105b.png" alt="DanhSachKetBan" width='45' height='45' />
                        <span className='px-1'>Danh sách kết bạn</span>
                    </div>
                    <div className='d-flex align-items-center p-1 needCursor' onClick={() => setSelectedObject('DanhSachNhom')} style={selectedObject === 'DanhSachNhom' ? {backgroundColor: '#69d0ff'} : {backgroundColor: 'white'}}>
                        <img src="https://chat.zalo.me/assets/group@2x.2d184edd797db8782baa0d5c7a786ba0.png" alt="DanhSachNhom" width='45' height='45' />
                        <span className='px-1'>Danh sách nhóm</span>
                    </div>
                    <hr />
                    <div className="d-flex align-items-center">
                        <span className='text-primary flex-fill'><TbUsers /> Bạn bè ({friends.length})</span>
                        <AiFillQuestionCircle className='text-primary lead' data-bs-toggle="tooltip" title="Nhấp giải thích" />
                    </div>
                    {
                        friends.map(obj => {
                            return <div className={selectedObject === obj ? 'd-flex border border-primary border-3 align-items-center p-1 needCursor' : 'd-flex align-items-center p-1 needCursor'} key={Math.random()}>
                                        <img src={obj.photoURL} alt="photoURL" width='45' height='45' className='rounded-circle' />
                                        <span className='px-1'>{obj.fullName}</span>
                                    </div>;
                        })
                    }
                </div>
            </div>
            <div className="col-lg-8" id='divC'>
                {
                    selectedObject === 'DanhSachKetBan' ?
                    <ListFriend />
                    :
                    <ListRoom />
                }
            </div>
        </div>
    );
});
