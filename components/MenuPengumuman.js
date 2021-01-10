import React, {useState, useEffect} from 'react';
import {API_URL} from '@env';
import {
  ScrollView,
  RefreshControl,
  SectionList,
  SafeAreaView,
  Alert,
} from 'react-native';
import {Text, View, Spinner} from 'native-base';
import {createStackNavigator} from '@react-navigation/stack';
import {center as centerScreen, styles} from './custom/Styles';

const PengumumanStack = createStackNavigator();

const HomeScreen = ({navigation}) => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api_pelanggaran_siswa/informasi`)
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, [isLoading]);

  const FlatListItemSeparator = () => {
    return (
      //Item Separator
      <View style={styles.listItemSeparatorStyle} />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => {
              setLoading(true);
            }}
          />
        }>
        {isLoading ? (
          <Spinner color="blue" />
        ) : (
          <>
            <SectionList
              ItemSeparatorComponent={FlatListItemSeparator}
              sections={data
                .reduce((r, v) => {
                  let idx = r.findIndex((val) => val.title === v.tanggal);
                  // Alert.alert('asdad', JSON.stringify(idx));
                  if (idx < 0) {
                    let data_reduce = data
                      ? data
                          .filter((val) => val.tanggal === v.tanggal)
                          .map((pengumuman) => pengumuman)
                      : [];
                    r.push({title: v.tanggal, data: data_reduce});
                  }
                  return r;
                }, [])
                .filter((v) => v.data && v.data.length)}
              renderSectionHeader={({section}) => (
                <Text style={styles.sectionHeaderStyle}> {section.title} </Text>
              )}
              renderItem={({item}) => (
                // Single Comes here which will be repeatative for the FlatListItems
                <Text
                  style={styles.sectionListItemStyle}
                  //Item Separator View
                  onPress={() => navigation.navigate('Report', item)}>
                  {item.informasi}
                </Text>
              )}
              keyExtractor={(item, index) => index}
              refreshing={isLoading}
              onRefresh={() => {
                setLoading(true);
              }}
            />
            {/* <View style={fabStyle}>
            <Fab
              containerStyle={{}}
              style={fabColor}
              position="bottomRight"
              onPress={() => navigation.navigate('Report')}>
              <AddFabIcon style={fabIconColor} />
            </Fab>
          </View> */}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default () => {
  return (
    <PengumumanStack.Navigator>
      <PengumumanStack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Menu Pengumuman',
        }}
      />
    </PengumumanStack.Navigator>
  );
};
