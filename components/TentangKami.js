import React from 'react';
import {Text, View} from 'native-base';
import {createStackNavigator} from '@react-navigation/stack';
import {center as centerScreen} from './custom/Styles';

const AboutStack = createStackNavigator();

const HomeScreen = () => {
  return (
    <View style={centerScreen}>
      <Text> Tentang Kami </Text>
    </View>
  );
};

export default () => {
  return (
    <AboutStack.Navigator>
      <AboutStack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Tentang Kami',
        }}
      />
    </AboutStack.Navigator>
  );
};
