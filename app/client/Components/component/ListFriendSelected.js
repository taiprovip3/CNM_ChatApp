import React, { memo } from 'react';
import { Image } from 'native-base';

const ListFriendSelected = ({ listOfYourFriend }) => {
    return <>
    {
        listOfYourFriend.map((obj) => {
            if(obj.isSelected)
                return <Image key={obj.id} source={{uri: obj.photoURL}} alt="photoURL" size="xs" borderRadius={100} />;
        })
    }
    </>
};

export default memo(ListFriendSelected);