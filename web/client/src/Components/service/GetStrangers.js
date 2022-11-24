import React from 'react';
import { AppContext } from '../provider/AppProvider';

const GetStrangers = (id) => {

    const { users, docFriendRequests } = React.useContext(AppContext);

    let strangers = [];
    if(docFriendRequests) {
        const listIdRequester = [id];     // => Lấy dc listId cần loại bỏ
        const fromRequests = docFriendRequests.fromRequest;
        if(fromRequests !== undefined){
            for(let i=0; i<fromRequests.length; i++) {
                listIdRequester.push(fromRequests[i].idRequester);
            }
        }
        const toRequests = docFriendRequests.toRequest;
        if(toRequests !== undefined){
            for(let i=0; i<toRequests.length; i++) {
                listIdRequester.push(toRequests[i].idRequester);
            }
        }
        
        let copyArraysUsers = [];
        Object.assign(copyArraysUsers, users);
        for(let i=0; i<listIdRequester.length; i++) {
            for(let j=0; j<copyArraysUsers.length; j++) {
                if(listIdRequester[i] === copyArraysUsers[j].id) {
                    copyArraysUsers.splice(j,1);
                    break;
                }
            }
        }
        strangers = copyArraysUsers;
    } else{
        let copyArraysUsers = [];
        Object.assign(copyArraysUsers, users);
        for(let i=0; i<copyArraysUsers.length; i++) {
            if(copyArraysUsers[i].id === id) {
                copyArraysUsers.splice(i,1);
                break;
            }
        }
        strangers = copyArraysUsers;
    }
    return strangers;
}

export default GetStrangers;