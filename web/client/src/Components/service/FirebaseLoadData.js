/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import { collection, doc, getDoc, onSnapshot, query, where } from 'firebase/firestore';
import React from 'react';
import { AppContext } from '../provider/AppProvider';

export default function FirebaseLoadData() {

    const { progress } = React.useContext(AppContext);
    const [progressPercent, setProgressPercent] = React.useState("0%");

    React.useEffect(() => {
        if(progress <= 100) {
            setProgressPercent(progress + "%");
            console.log('progress now: ', progress);
        }
    },[progress]);

    return (
        <div className="progress">
            <div className="progress-bar progress-bar-striped progress-bar-animated active" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style={{ width: progressPercent }}>{progressPercent} Complete</div>
        </div>
    );
}
