import { collection, onSnapshot, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { database } from '../../firebase';

const FirebaseGetUsers = () => {

    //Khi vào AuthenticationScreen.js -> gọi services FirebaseGetUsers -> return users mảng rỗng -> AuthProvider rerender -> UseEffect chạy -> FirebaseGetUsers rerender -> return users lúc này trả về có data -> AuthProvider rerender 1 lần nữa.
    useEffect(() => {
        const q = query(collection(database, "Users"));
        const unsub = onSnapshot(q, (querySnapShot) => {
            const listUsers = [];
            querySnapShot.forEach((document) => {
                listUsers.push(document.data());
            });
            setUsers(listUsers);
        });
        return unsub;
    },[]);

    const [users, setUsers] = useState([]);
    
    return users;
}
export default FirebaseGetUsers;
