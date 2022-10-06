import { View, Text, Button } from 'react-native';
import React from 'react';

export default function HomepageScreen({ navigation }) {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>

      <View>
        <Text>Blue Text</Text>
        <Button
        title='Go to AuthScreen'
          onPress={() => navigation.navigate('AuthScreen')}
        />
      </View>

    </View>
  )
};