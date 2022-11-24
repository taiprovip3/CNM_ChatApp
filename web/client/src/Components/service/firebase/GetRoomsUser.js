import { collection, onSnapshot, query, where } from 'firebase/firestore';
import React from 'react';
import { database } from '../../../firebase';
import { AppContext } from '../../provider/AppProvider';
import { AuthContext } from '../../provider/AuthProvider';

export default function GetRoomsUser() {
  
  const { setProgress, setIsLoadRoomsUser, isLoadDocsFriendMessages } = React.useContext(AppContext);
  const { currentUser: { id } } = React.useContext(AuthContext);
  const [ids, setIds] = React.useState([]);

  React.useEffect(() => {
    if(isLoadDocsFriendMessages) {
      const q = query(collection(database, "Rooms"), where("listMember", "array-contains", id));
      const unsubcriber = onSnapshot(q, (querySnapShot) => {
        const listRoomIdUserJoined = [];
        querySnapShot.forEach((document) => {
          listRoomIdUserJoined.push(document.data().id);
        });
        setIds(listRoomIdUserJoined);
        setProgress(prev => prev + 14);
        setIsLoadRoomsUser(true);
      });
      return unsubcriber;
    }
  },[id, isLoadDocsFriendMessages, setIsLoadRoomsUser, setProgress]);
  return ids;
}
