/* eslint-disable no-unused-vars */
import { doc, onSnapshot } from 'firebase/firestore';
import React from 'react';
import { database } from '../../firebase';
import { AuthContext } from '../provider/AuthProvider';

export default function FirebaseGetRealtimeUser(idUser) {

  const [dataUser, setDataUser] = React.useState(null);

  React.useEffect(() => {
    const unsubcriber = onSnapshot(doc(database, "Users", idUser), (document) => {
      if(document.exists()) {
        console.log('listened: ', document.data());
        setDataUser(document.data());
      } else {
        console.log('FirebaseGetRealTimeUser can"t find idUser ');
      }
    });
    return unsubcriber;
  },[idUser]);

  return dataUser;
}
