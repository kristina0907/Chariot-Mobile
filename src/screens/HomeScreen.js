import React, { Component } from 'react';
import { View, Image, TouchableOpacity, SafeAreaView, Button, Text, StyleSheet, I18nManager, Picker } from 'react-native';
import { authenticationService } from '../services';
import {
  createDrawerNavigator,
  createStackNavigator,
  createAppContainer,
  DrawerItems,
  NavigationEvents
} from 'react-navigation';
import { Icon, Avatar } from 'react-native-material-ui'
import Score from './Score';
import Trips from './Trips';
import Profile from './Profile';
import Route from './Route';
import About from './About';
import { connect } from 'react-redux';
import { fetchAllUsers } from '../actions/user';
import translate, { setLocale } from '../translations/translations';
import { CachedImage } from 'react-native-cached-image';
import { Images } from '../images/images';
import NavigationBar from 'react-native-navbar-color';
import { translateLanguage } from '../actions/language';


const styles = StyleSheet.create({
  contentAvatar: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0099ff',
    paddingBottom: 20,
    paddingTop: 20,
  },
  row: {
    flexDirection: 'column',
    height: 60,
    marginBottom: 10,
    marginTop: 10,
    paddingLeft: 15

  },
  tableCell: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  box: {
    flex: 1,
    height: 60,
    borderBottomColor: '#ececec',
    borderBottomWidth: 1,
    alignSelf: 'stretch',
  },
  box1: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  sidebarItem: {
    padding: 15
  },
  sidebarText: {
    color: '#0099ff',
    fontWeight: 'bold'
  },
  language: {
    position: "absolute",
    left: 15,
    bottom: 15
  }
});


class NavigationDrawerStructure extends Component {
  toggleDrawer = () => {
    this.props.navigationProps.toggleDrawer();
  };
  render() {
    return (
      <View style={{ position: "absolute", top: 10, left: 10, backgroundColor: '#0099ff', borderRadius: 10, padding: 15, zIndex: 0 }}>
        <TouchableOpacity onPress={this.toggleDrawer.bind(this)}>
          <View style={{ flexDirection: 'row' }}>
            <CachedImage style={{ width: 19, height: 9, marginRight: 15, marginTop: 2 }} source={Images['menu']} fallbackSource={Images['menu']} />
            <Text style={{ color: "#ffffff" }}>{this.props.title}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

class Language extends Component {
  constructor(props) {
    super(props);
    this.state = {
      language: authenticationService.language,
    };
  }
   onchangeLanguage(itemValue) {
    this.setState({ language: itemValue });
    this.props.propsMunu.screenProps.changeLanguage(itemValue);
  }
  render() {
    return (
      // <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'center', backgroundColor: '#ffffff', paddingVertical: 10 }}>
      //   <CachedImage style={{ width: 30, height: 30 }} source={Images['select']} fallbackSource={Images['select']} />
      //   <Picker selectedValue={this.state.language} onValueChange={(itemValue) => this.onchangeLanguage(itemValue)} mode="dropdown"
      //     style={{ height: 20, backgroundColor: '#ffffff', width: '60%', color: "#ff6600" }}>
      //     <Picker.Item label="RU" value="ru" />
      //     <Picker.Item label="EN" value="en" />
      //     <Picker.Item label="VI" value="vi" />
      //   </Picker>
      // </View>
      <Picker
        selectedValue={this.state.language}
        style={{ height: 50, width: 100, color: "#ff6600" }}
        onValueChange={(itemValue) => this.onchangeLanguage(itemValue)}>
        <Picker.Item label="RU" value="ru" />
        <Picker.Item label="EN" value="en" />
        <Picker.Item label="VI" value="vi" />
      </Picker>
    );
  }
}

const FirstActivity_StackNavigator = createStackNavigator({
  First: {
    screen: Route,
    headerMode: 'float',
    navigationOptions: ({ navigation }) => ({
      title: translate("rent"),
      header: props => <NavigationDrawerStructure {...props} navigationProps={props.navigation} title={translate("rent")} />,
    }),
  },
});


const Screen2_StackNavigator = createStackNavigator({
  Second: {
    screen: Trips,
    navigationOptions: ({ navigation, drawerLabel, date }) => ({
      title: translate("trips"),
      header: props => <NavigationDrawerStructure {...props} navigationProps={props.navigation} title={translate("trips")} />,
    }),
  },
});


const Screen3_StackNavigator = createStackNavigator({
  Third: {
    screen: Profile,
    navigationOptions: ({ navigation }) => ({
      title: translate("profile"),
      header: props => <NavigationDrawerStructure {...props} navigationProps={props.navigation} title={translate("profile")} />,
    }),
  },
});


const Screen4_StackNavigator = createStackNavigator({
  Fourth: {
    screen: Score,
    navigationOptions: ({ navigation }) => ({
      title: translate("score"),
      header: props => <NavigationDrawerStructure {...props} navigationProps={props.navigation} title={translate("score")} />,
    }),
  },
});


const Screen5_StackNavigator = createStackNavigator({
  Fifth: {
    screen: About,
    navigationOptions: ({ navigation }) => ({
      title: translate("aboutProgram"),
      header: props => <NavigationDrawerStructure {...props} navigationProps={props.navigation} title={translate("aboutProgram")} />,
    }),
  },
});



const DrawerNavigatorExample = createDrawerNavigator({
  Screen1: {
    screen: FirstActivity_StackNavigator,
    navigationOptions: {
      drawerLabel: () => (
        <View style={styles.sidebarItem}>
          <Text style={styles.sidebarText}>{translate("rent")}</Text>
        </View>
      ),
    },
  },
  Screen2: {
    screen: Screen2_StackNavigator,
    navigationOptions: {
      drawerLabel: () => (
        <View style={styles.sidebarItem}>
          <Text style={styles.sidebarText}>{translate("trips")}</Text>
        </View>
      ),
      date: Date.now()
    },
  },
  Screen3: {
    screen: Screen3_StackNavigator,
    navigationOptions: {
      drawerLabel: () => (
        <View style={styles.sidebarItem}>
          <Text style={styles.sidebarText}>{translate("profile")}</Text>
        </View>
      ),
    },
  },
  Screen4: {
    screen: Screen4_StackNavigator,
    navigationOptions: {
      drawerLabel: () => (
        <View style={styles.sidebarItem}>
          <Text style={styles.sidebarText}>{translate("score")}</Text>
        </View>
      ),
    },
  },
  Screen5: {
    screen: Screen5_StackNavigator,
    navigationOptions: {
      drawerLabel: () => (
        <View style={styles.sidebarItem}>
          <Text style={styles.sidebarText}>{translate("aboutProgram")}</Text>
        </View>
      ),
    },
  },
},
  {
    contentComponent: (props) => (
      // <NavigationEvents
      //     onWillFocus={() => { props.screenProps.refreshUsers(authenticationService.currentUserValue.id) }}
      //   />
      <View style={{ flex: 1 }}>
        <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
          <View style={styles.contentAvatar}>
            {/* <TouchableOpacity onPress={() => { props.screenProps.refreshUsers(authenticationService.currentUserValue.id) }}>
              <Text style={{ alignSelf: 'flex-end', color: '#ffffff', marginRight: 15, fontWeight: 'bold' }}><Icon name="cached" /></Text>
            </TouchableOpacity> */}
            <Avatar icon="person" size={50} iconColor="#0099ff" style={{ container: { backgroundColor: '#ffffff' } }} />
          </View>
          {
            props.screenProps.users.map(function (item, index) {

              return (
                <React.Fragment>
                  <View style={{ paddingBottom: 15, backgroundColor: '#0099ff', alignItems: 'center' }} >
                    <Text style={{ color: '#ffffff', fontWeight: 'bold' }}>{item.surName} {item.name}</Text>
                  </View>
                  <View style={{ paddingLeft: 15, paddingTop: 15, paddingBottom: 15, marginTop: 10, marginBottom: 10, backgroundColor: '#ff6600' }} >
                    <Text key={item.idUser} style={{ color: '#ffffff', fontSize: 16, }}>{translate("balance")}: {item.accountBalance}</Text>
                  </View>
                </React.Fragment>
              );
            })
          }
          {/* <View style={{ flex: 1, flexDirection: 'row', marginBottom: 70, borderBottomColor: '#ececec', borderBottomWidth: 1 }}>
            <View style={{ width: 70, height: 70, paddingLeft: 15, paddingTop: 10 }}>
              <Avatar icon="person" size={50} style={{ container: { backgroundColor: '#2196f3' } }} />
            </View>
            <View style={{ width: 200, height: 70, justifyContent: 'flex-start', paddingTop: 15 }} >
              <Text style={{ color: '#000000', marginLeft: 15, fontWeight: 'bold', alignSelf: 'flex-start' }}>{authenticationService.currentUserValue.login}</Text>
              {
                props.screenProps.users.map(function (item) {
                  return (
                    <Text key={item.idUser} style={{ color: '#000000', marginLeft: 15, alignSelf: 'flex-start' }}>Баланс: {item.accountBalance}</Text>
                  );
                })
              }
            </View>
          </View> */}
          <DrawerItems {...props} />
          <TouchableOpacity onPress={() => { props.screenProps.logout() }}>
            <Text style={{ color: '#0099ff', marginLeft: 15, marginTop: 15, fontWeight: 'bold' }}>{translate("exit")}</Text>
          </TouchableOpacity>
        </SafeAreaView>
        <View style={styles.language}>
          <Language propsMunu={props}/>
        </View>
      </View>
    ),
  }
);

const AppContainer = createAppContainer(DrawerNavigatorExample);

function mapStateToProps(state) {
  return {
    users: state.users.data
  };
}

const mapDispatchToProps = dispatch => {
  return {
    refreshUsers: (idUser) => { dispatch(fetchAllUsers(idUser)); },
    changeLanguage: language =>{ dispatch(translateLanguage(language)) },
  };
};

class App extends React.Component {
  componentWillMount() {
    this.props.refreshUsers(authenticationService.currentUserValue.id);
    NavigationBar.setColor('#0099ff');
    NavigationBar.setStatusBarColor('#0099ff', false)
  }
  // componentDidMount() {
  //   this.focusListener = this.props.navigation.addListener("didFocus", () => {
  //     this.props.refreshTrips(authenticationService.currentUserValue.id)
  //   });
  // }

  // componentWillUnmount() {
  //   this.focusListener.remove();
  // }
  //   shouldComponentUpdate(){
  //     this.props.refreshUsers(authenticationService.currentUserValue.id);
  //     return true;
  // }
  render() {
    return <AppContainer screenProps={{
      users: this.props.users,
      logout: this.props.screenProps.logout,
      refreshUsers: this.props.refreshUsers,
      changeLanguage: this.props.changeLanguage
    }} />;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
