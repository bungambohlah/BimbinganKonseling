/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

// import 'react-native-gesture-handler';
import React, {useState} from 'react';
import {View, TouchableOpacity} from 'react-native';
import {
  Container,
  Header,
  Content,
  Footer,
  FooterTab,
  Button,
  Text,
  Root,
} from 'native-base';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
const BottomTab = createBottomTabNavigator();
import MenuPengaduan from './components/MenuPengaduan';
import MenuPengumuman from './components/MenuPengumuman';
import TentangKami from './components/TentangKami';
import {
  MenuPengumumanIcon,
  MenuPengaduanIcon,
  TentangKamiIcon,
} from './components/IconList';

const NativeTabBar = ({state, descriptors, navigation}) => {
  return (
    <Footer>
      <FooterTab>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <Button
              key={route.key}
              vertical
              active={isFocused}
              onPress={onPress}
              onLongPress={onLongPress}>
              {route.name === 'Pengumuman' ? <MenuPengumumanIcon /> : undefined}
              {route.name === 'Pengaduan' ? <MenuPengaduanIcon /> : undefined}
              {route.name === 'Tentang Kami' ? <TentangKamiIcon /> : undefined}
              <Text>{route.name}</Text>
            </Button>
          );
        })}
      </FooterTab>
    </Footer>
  );
};

const App = () => {
  return (
    <Root>
      <NavigationContainer>
        <BottomTab.Navigator tabBar={(props) => <NativeTabBar {...props} />}>
          <BottomTab.Screen name="Pengumuman" component={MenuPengumuman} />
          <BottomTab.Screen name="Pengaduan" component={MenuPengaduan} />
          <BottomTab.Screen name="Tentang Kami" component={TentangKami} />
        </BottomTab.Navigator>
      </NavigationContainer>
    </Root>
  );
};

export default App;
