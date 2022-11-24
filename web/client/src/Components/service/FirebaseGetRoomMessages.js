import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { database } from '../../firebase';

//UseEffect này luôn lắng nge
//UseEffect này chỉ chạy lại khi biến owner lớp cha gọi nó thay đổi giá trị truyền vào
//Nếu thay đổi hàm sẽ đc thực thi => trả về danh sách rooms mới.
const FirebaseGetRoomMessages = (idRoom) => {

    const [roomMessages, setRoomMessages] = useState([]);

    useEffect(() => {
        const unsbubcriber = onSnapshot(doc(database, "RoomMessages", idRoom), (document) => {
            setRoomMessages(document.data().listObjectMessage);
        });
        return unsbubcriber;
    }, [idRoom]);

    
    if(!idRoom || !idRoom.length){
        setRoomMessages([]);
        return;
    }
    
    return roomMessages;
};

export default FirebaseGetRoomMessages;