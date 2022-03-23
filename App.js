/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useCallback, useEffect} from 'react';

import {
  SafeAreaView,
  StyleSheet,
  View,
  Platform,
  StatusBar,
  TextInput,
  Text,
  FlatList,
} from 'react-native';

const fetchDogs = async (query, next) => {
  try {
    const response = await fetch(
      `https://api.thedogapi.com/v1/breeds/search?q=${
        query.length > 0 ? query : 'a'
      }`,
    );

    const data = await response.json();
    next(data);
  } catch {
    console.log('Something went wrong!');
  }
};

const Item = ({title}) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
  </View>
);

const App = () => {
  const [animals, setAnimals] = useState([]);

  const debounce = useCallback(func => {
    let timer;
    return function (...args) {
      // eslint-disable-next-line consistent-this
      const context = this;
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        timer = null;
        func.apply(context, args);
      }, 200);
    };
  }, []);

  const handleSearch = e => {
    fetchDogs(e, setAnimals);
  };

  const optimisedSearch = debounce(handleSearch);

  const renderItem = ({item}) => <Item title={item.name} />;

  useEffect(() => {
    fetchDogs('a', setAnimals);
  }, [setAnimals]);

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.search}
        placeholder="Search"
        onChangeText={optimisedSearch}
      />
      <View style={styles.list}>
        <FlatList
          data={animals}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: Platform.OS ? StatusBar.currentHeight : 0,
    backgroundColor: '#fff',
  },
  search: {
    padding: 10,
    borderColor: 'dodgerblue',
    borderWidth: 3,
    margin: 10,
    fontSize: 22,
    borderRadius: 10,
    color: 'dodgerblue',
  },
  list: {
    padding: 10,
    paddingTop: 0,
  },
  item: {
    borderColor: '#FF5733',
    borderWidth: 2,
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#FFC300',
  },
  title: {
    fontSize: 22,
    color: '#FF5733',
  },
});

export default App;
