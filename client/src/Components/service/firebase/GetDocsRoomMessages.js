import { collection, onSnapshot, query, where } from 'firebase/firestore';
import React from 'react';
import { database } from '../../../firebase';
import { AppContext } from '../../provider/AppProvider';

export default function GetDocsRoomMessages() {
  const { setProgress, setIsLoadDocsRoomMessages, isLoadRoomsUser, roomsUser } = React.useContext(AppContext);
  const [documents, setDocuments] = React.useState([]);
  React.useEffect(() => {
    if(isLoadRoomsUser) {
      if(roomsUser.length > 0) {
        const q = query(collection(database, "RoomMessages"), where("idRoom", "in", roomsUser));
        const unsubcriber = onSnapshot(q, (querySnapShot) => {
          const listDocRoomMessagesUserJoinedHasBeenChanged = [];
          querySnapShot.forEach((document) => {
              listDocRoomMessagesUserJoinedHasBeenChanged.push(document.data());
          });
          setDocuments(listDocRoomMessagesUserJoinedHasBeenChanged);
        });
        return unsubcriber;
      }
      setProgress(prev => prev + 16);
      setIsLoadDocsRoomMessages(true);
    }
  },[isLoadRoomsUser, roomsUser, setIsLoadDocsRoomMessages, setProgress]);
  return documents;
}
