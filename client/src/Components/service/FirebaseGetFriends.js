import { useEffect, useState } from 'react';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { database } from '../../firebase';

//UseEffect này luôn lắng nge
//UseEffect này chỉ chạy lại khi biến owner lớp cha gọi nó thay đổi giá trị truyền vào
//Nếu thay đổi hàm sẽ đc thực thi => trả về danh sách rooms mới.
const FirebaseGetFriends = (owner) => {
    useEffect(() => {
        const arrTemp = [];
        const unsubcribe = onSnapshot(doc(database, "UserFriends", owner), (document) => {
            if(document.data() !== undefined){
                const dataTemp = document.data().listFriend;
                dataTemp.map(async (obj) => {
                    
                    const docRef = doc(database, "Users", obj.idFriend);
                    const docSnap = await getDoc(docRef);
                    arrTemp.push(docSnap.data());

                });
                setFriends(arrTemp);
            }
        });
        return unsubcribe;
    }, [owner]);

    const [friends, setFriends] = useState([]);
    if(!owner || !owner.length){
        setFriends([]);
        return;
    }
    return friends;
};

export default FirebaseGetFriends;