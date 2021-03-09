import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput, Platform, TouchableOpacity, Image } from 'react-native';
import { Checkbox, Button, Subheader } from 'react-native-material-ui'
import PDFView from 'react-native-view-pdf';
import { createAppContainer, createStackNavigator } from 'react-navigation';
import { Images } from '../images/images';
import { CachedImage } from 'react-native-cached-image';
import translate from '../translations/translations';


const resources = {
  url: 'https://geekbrains.ru/dogovor.pdf',
};
class HomeScreen extends React.Component {
  render() {
    return (
      <View style={styles.content}>
        <View style={styles.item}>
          <Text style={{ fontSize: 17, marginTop: 20, marginBottom: 20, fontWeight: 'bold' }}>{translate("name")}: Chariot</Text>
          <Text style={{ fontSize: 15, marginBottom: 30 }}>{translate("softwareVersion")}: 1.0</Text>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('Replenish')}>
            <View style={{
              height: 50, backgroundColor:
                '#0099ff', justifyContent: 'center',
              alignItems: 'center', padding: 15, borderRadius: 10, marginBottom: 20
            }}>
              <Text style={{
                fontSize: 15,
                color: '#ffffff',
              }}>
                {translate("termsUse")}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

class ReplenishScreen extends React.Component {
  render() {
    const resourceType = 'url';
    return (
      <View style={{ flex: 1 }}>
        <PDFView
          fadeInDuration={250.0}
          style={{ flex: 1 }}
          resource={resources[resourceType]}
          resourceType={resourceType}
          onLoad={() => console.log(`PDF rendered from ${resourceType}`)}
          onError={() => console.log('Cannot render PDF', error)}
        />
      </View>
    );
  }
}

const RootStack = createStackNavigator(
  {
    Home: {
      screen: HomeScreen,
      navigationOptions: {
        header: null,
        headerBackTitle: null
      },
    },
    Replenish: {
      screen: ReplenishScreen,
      navigationOptions: {
        header: null,
        headerBackTitle: null
      },
    },
  },
  {
    initialRouteName: 'Home',
  }
);

const AppContainer = createAppContainer(RootStack);

class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}

export default App;

const styles = StyleSheet.create({
  content: {
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  item: {
    backgroundColor: '#ffffff',
    marginLeft: 25,
    marginRight: 25,
    borderRadius: 10,
    padding: 15,
    width: '90%',
    alignItems: 'center',
    shadowOpacity: 0.75,
    shadowRadius: 1,
    shadowColor: 'gray',
    shadowOffset: { height: 3, width: 0 },
    elevation:7
  },
  btnImage: {
    width: 80,
    height: 80
  },
});
