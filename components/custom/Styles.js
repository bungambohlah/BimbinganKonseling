import {StyleSheet} from 'react-native';

export const center = {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
};

export const fab = {
  flex: 0,
};

export const fabColor = {
  backgroundColor: '#5067FF',
};

export const fabIconColor = {
  color: 'white',
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    backgroundColor: 'white',
  },
  sectionHeaderStyle: {
    backgroundColor: '#CDDC89',
    fontSize: 20,
    padding: 5,
    color: '#fff',
  },
  sectionListItemStyle: {
    width: '100%',
    fontSize: 15,
    padding: 15,
    color: '#000',
    backgroundColor: '#F5F5F5',
  },
  listItemSeparatorStyle: {
    height: 0.5,
    width: '100%',
    backgroundColor: '#C8C8C8',
  },
});

export default (props) => {};
