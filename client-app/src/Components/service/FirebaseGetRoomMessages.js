import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { database } from '../../firebase';

//UseEffect này luôn lắng nge
//UseEffect này chỉ chạy lại khi biến owner lớp cha gọi nó thay đổi giá trị truyền vào
//Nếu thay đổi hàm sẽ đc thực thi => trả về danh sách rooms mới.
const FirebaseGetRoomMessages = (idRoom) => {
    useEffect(() => {
        const getData = async() => {
            const RoomMessagesDocRef = doc(database, "RoomMessages", idRoom);
            const RoomMessagesSnap = await getDoc(RoomMessagesDocRef);
            const DATA = RoomMessagesSnap.data().listObjectMessage;
            setRoomMessages(DATA);
        }
        getData();
    }, [idRoom]);

    const [roomMessages, setRoomMessages] = useState([]);
    if(!idRoom || !idRoom.length){
        setRoomMessages([]);
        return;
    }
    
    return roomMessages;
};

export default FirebaseGetRoomMessages;