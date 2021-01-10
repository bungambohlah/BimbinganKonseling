import React, {useEffect, useState, useCallback} from 'react';
import {API_URL} from '@env';
import {
  Container,
  Content,
  Form,
  Item,
  Input,
  Label,
  Text,
  View,
  Fab,
  Icon,
  Spinner,
  List,
  ListItem,
  Button,
  Picker,
  Toast,
} from 'native-base';
// import {Picker} from '@react-native-picker/picker';
import DatePicker from 'react-native-datepicker';
import {createStackNavigator} from '@react-navigation/stack';
import {
  center as centerScreen,
  fab as fabStyle,
  fabColor,
  fabIconColor,
  styles,
} from './custom/Styles';
import {AddFabIcon} from './IconList';
import {SectionList, SafeAreaView, Alert} from 'react-native';

const PengaduanStack = createStackNavigator();

const HomeScreen = ({navigation}) => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api_pelanggaran_siswa/`)
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
      <View style={centerScreen}>
        {isLoading ? (
          <Spinner color="blue" />
        ) : (
          <>
            <SectionList
              ItemSeparatorComponent={FlatListItemSeparator}
              sections={data.kelas_jurusan
                .map((v) => {
                  const section = {title: v.name_kelas};
                  section.data = data.siswa
                    ? data.siswa
                        .filter(
                          (val) => val.id_kelas_jurusan === v.id_kelas_jurusan,
                        )
                        .map((siswa) => siswa)
                    : [];
                  return section;
                })
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
                  {item.nama_siswa}
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
      </View>
    </SafeAreaView>
  );
};

const ReportScreen = ({route, navigation}) => {
  const {nama_siswa = '', id_siswa = '', id_tahun = ''} = route.params;
  const [categoryLists, setCategoryLists] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryPelanggaran, setCategoryPelanggaran] = useState([]);
  const [selectedPelanggaran, setSelectedPelanggaran] = useState(null);
  const [date, setDate] = useState(new Date());
  const [waktu_melanggar, setWaktuMelanggar] = useState(new Date());
  const [tempat_pelanggaran, setTempatPelanggaran] = useState('');
  const [tindak_lanjut, setTindakLanjut] = useState('');
  const [isLoading, setLoading] = useState(true);
  const [errorTempatPelanggaran, setErrorTempatPelanggaran] = useState(false);
  const [errorTindakLanjut, setErrorTindakLanjut] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const onValueChangeCategory = (value) => {
    setSelectedCategory(value);
  };
  const onValueChangePelanggaran = (itemValue, itemIndex) => {
    setSelectedPelanggaran(itemValue);
  };
  const onValueChangeDate = (newDate) => {
    setDate(newDate);
  };
  const onValueChangeWaktuMelanggar = (newDate) => {
    setWaktuMelanggar(newDate);
  };
  const onChangeTextTempatPelanggaran = (newText) => {
    setTempatPelanggaran(newText);
  };
  const onChangeTextTindakLanjut = (newText) => {
    setTindakLanjut(newText);
  };
  const onSubmitForm = (e) => {
    e.preventDefault();
    let tindak_lanjutForm = tindak_lanjut;
    let tempat_pelanggaranForm = tempat_pelanggaran;

    if (!tindak_lanjut || tindak_lanjut.length <= 0) {
      setErrorTindakLanjut(true);
      tindak_lanjutForm = true;
      Toast.show({
        text: 'Catatan harus diisi',
        buttonText: 'OK',
        duration: 3000,
      });
    }
    if (tindak_lanjut && tindak_lanjut.length >= 0) {
      setErrorTindakLanjut(false);
      tindak_lanjutForm = false;
    }
    if (!tempat_pelanggaran || tempat_pelanggaran.length <= 0) {
      setErrorTempatPelanggaran(true);
      tempat_pelanggaranForm = true;
      Toast.show({
        text: 'Tempat Pelanggaran harus diisi',
        buttonText: 'OK',
        duration: 3000,
      });
    }
    if (tempat_pelanggaran && tempat_pelanggaran.length >= 0) {
      setErrorTempatPelanggaran(false);
      tempat_pelanggaranForm = false;
    }
    if (!tindak_lanjutForm && !tempat_pelanggaranForm) {
      const body = {
        id_siswa,
        id_tahun,
        id_pelanggaran: selectedPelanggaran,
        tindak_lanjut,
        waktu_melanggar: waktu_melanggar.toISOString().split('T')[0],
        tempat_pelanggaran,
      };
      // Alert.alert('asdasdas', JSON.stringify(body));
      setLoading(true);
      let formBody = [];
      for (let property in body) {
        let encodedKey = encodeURIComponent(property);
        let encodedValue = encodeURIComponent(body[property]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');
      fetch(`${API_URL}/api_pelanggaran_siswa/`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        body: formBody,
      })
        .then((res) => res.json())
        .then((json) => {
          Toast.show({
            text: 'Berhasil terkirim!',
            buttonText: 'OK',
            duration: 3000,
          });
          console.log(json);
          navigation.goBack();
        })
        .catch((error) => {
          Toast.show({
            text: 'Gagal terkirim!',
            buttonText: 'OK',
            duration: 5000,
          });
          console.error(error);
        })
        .finally(setLoading(false));
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        // fetch category lists
        if (
          !categoryLists ||
          (Array.isArray(categoryLists) && categoryLists.length <= 0)
        ) {
          let data_category = await fetch(
            `${API_URL}/api_pelanggaran_siswa/kat_pelanggaran`,
          );
          data_category = await data_category.json();
          if (Array.isArray(data_category) && data_category.length) {
            setCategoryLists(data_category);
            if (data_category[0].id_kat_pelanggaran) {
              setSelectedCategory(data_category[0].id_kat_pelanggaran);
            }
          }
        }

        if (selectedCategory) {
          let category = await fetch(
            `${API_URL}/api_pelanggaran_siswa/pelanggaran/${selectedCategory}`,
          );
          category = await category.json();
          if (Array.isArray(category) && category.length) {
            setCategoryPelanggaran(category);
            if (category[0].id_pelanggaran) {
              setSelectedPelanggaran(category[0].id_pelanggaran);
            }
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [categoryLists, selectedCategory]);

  return isLoading ? (
    <Spinner color="blue" />
  ) : (
    <>
      <Container>
        <Content>
          <Form onSubmit={onSubmitForm}>
            <Item floatingLabel style={{marginBottom: 20}}>
              <Label>
                <Text>Nama Siswa</Text>
              </Label>
              <Input value={nama_siswa} disabled />
            </Item>
            <Item style={{marginBottom: 20}}>
              <Label>
                <Text> Tanggal | Waktu </Text>
              </Label>
              <DatePicker
                date={date}
                mode="date"
                placeholder="Tanggal | Waktu"
                format="YYYY-MM-DD"
                confirmBtnText="Simpan"
                cancelBtnText="Batal"
                customStyles={{
                  dateIcon: {
                    position: 'absolute',
                    left: 0,
                    top: 4,
                    marginLeft: 0,
                  },
                  dateInput: {
                    marginLeft: 36,
                    borderColor: 'transparent',
                  },
                }}
                onDateChange={onValueChangeDate}
                disabled
              />
            </Item>
            <Item picker style={{marginBottom: 20}}>
              <Picker
                mode="dialog"
                iosIcon={<Icon name="arrow-down" />}
                style={{
                  marginLeft: '2%',
                }}
                placeholder="Pilih Kategori Pelanggaran"
                placeholderStyle={{
                  color: '#bfc6ea',
                }}
                placeholderIconColor="#007aff"
                selectedValue={selectedCategory}
                onValueChange={onValueChangeCategory}>
                {Array.isArray(categoryLists) && categoryLists.length
                  ? categoryLists.map((v, idx) => (
                      <Picker.Item
                        key={v.id_kat_pelanggaran}
                        label={v.nama_kat_pelanggaran}
                        value={v.id_kat_pelanggaran}
                      />
                    ))
                  : null}
              </Picker>
            </Item>
            <Item picker style={{marginBottom: 20}}>
              <Picker
                mode="dialog"
                iosIcon={<Icon name="arrow-down" />}
                style={{
                  marginLeft: '2%',
                }}
                placeholder="Pilih Pelanggaran"
                placeholderStyle={{
                  color: '#bfc6ea',
                }}
                placeholderIconColor="#007aff"
                selectedValue={selectedPelanggaran}
                onValueChange={onValueChangePelanggaran}>
                {Array.isArray(categoryPelanggaran) &&
                categoryPelanggaran.length
                  ? categoryPelanggaran.map((v, idx) => (
                      <Picker.Item
                        key={v.id_pelanggaran + idx}
                        label={v.nama_pelanggaran}
                        value={v.id_pelanggaran}
                      />
                    ))
                  : null}
              </Picker>
            </Item>
            <Item>
              <Label>
                <Text> Tanggal Pelanggaran </Text>
              </Label>
              <DatePicker
                date={waktu_melanggar}
                mode="date"
                placeholder="Tanggal Pelanggaran"
                format="YYYY-MM-DD"
                confirmBtnText="Simpan"
                cancelBtnText="Batal"
                customStyles={{
                  dateIcon: {
                    position: 'absolute',
                    left: 0,
                    top: 4,
                    marginLeft: 0,
                  },
                  dateInput: {
                    marginLeft: 36,
                    borderColor: 'transparent',
                  },
                }}
                onDateChange={onValueChangeWaktuMelanggar}
              />
            </Item>
            <Item
              floatingLabel
              success={!errorTempatPelanggaran}
              error={errorTempatPelanggaran}
              style={{marginBottom: 20}}>
              <Label>
                <Text> Tempat Pelanggaran </Text>
              </Label>
              <Input
                value={tempat_pelanggaran}
                onChangeText={onChangeTextTempatPelanggaran}
                placeholder="Silakan isi Tempat Pelanggaran"
              />
            </Item>
            <Item
              floatingLabel
              success={!errorTindakLanjut}
              error={errorTindakLanjut}
              style={{marginBottom: 20}}>
              <Label>
                <Text> Keterangan </Text>
              </Label>
              <Input
                value={tindak_lanjut}
                onChangeText={onChangeTextTindakLanjut}
                placeholder="Silakan isi Keterangan"
              />
            </Item>
          </Form>
          <Content padder>
            <Button block onPress={onSubmitForm} style={{marginBottom: 20}}>
              <Text>Submit</Text>
            </Button>
            <Button
              block
              light
              onPress={() => {
                navigation.goBack();
              }}>
              <Text>Cancel</Text>
            </Button>
          </Content>
        </Content>
      </Container>
    </>
  );
};

export default () => {
  return (
    <PengaduanStack.Navigator>
      <PengaduanStack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Menu Pengaduan',
        }}
      />
      <PengaduanStack.Screen
        name="Report"
        component={ReportScreen}
        options={{
          title: 'Form Lapor Pengaduan',
        }}
      />
    </PengaduanStack.Navigator>
  );
};
