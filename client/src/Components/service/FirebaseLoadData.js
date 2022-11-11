/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import { collection, doc, getDoc, onSnapshot, query, where } from 'firebase/firestore';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { database } from '../../firebase';
import { AppContext } from '../provider/AppProvider';
import { AuthContext } from '../provider/AuthProvider';

export default function FirebaseLoadData() {

    const { progress, isLoadDocsFriendMessages } = React.useContext(AppContext);
    const [progressPercent, setProgressPercent] = React.useState("0%");
    const history = useNavigate();

    React.useEffect(() => {
        if(progress <= 100) {
            setProgressPercent(progress + "%");
            console.log('progress now: ', progress);
        }
    },[progress]);
    React.useEffect(() => {
        if(isLoadDocsFriendMessages) {
            return history("/home");
        }
    },[history, isLoadDocsFriendMessages]);

    return (
        <div className="progress">
            <div className="progress-bar progress-bar-striped progress-bar-animated active" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style={{ width: progressPercent }}>{progressPercent} Complete</div>
        </div>
    );
}
