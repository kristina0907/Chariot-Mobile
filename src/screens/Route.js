import React from 'react';
import { Text, View, WebView, StyleSheet,TouchableOpacity } from 'react-native';
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import { Icon } from 'react-native-material-ui';
import MapView from '../Components/MapView';
import QrCodeScaner from '../Components/QrCodeScaner';
import { connect } from 'react-redux';
import { fetchAllStationMet } from '../actions/stationMet';
import { fetchAllMetCoordinates } from '../actions/track';
import { messageRecipient } from '../actions/messageRecipient';
import { authenticationService } from '../services';
import translate from '../translations/translations';
import { CachedImage } from 'react-native-cached-image';
import { Images } from '../images/images';
import TabBar from '../Components/TabBar';


class HomeScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoad: false      
    }
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.screenProps.stationMets.length != 0)
        this.setState({isLoad: true});
  }  
  render() {
    //console.disableYellowBox = true;
    //|| this.state.isLoad
    return (
      this.props.screenProps.stationMets.length != 0 && this.props.screenProps.metCoordinates.length != 0 || this.state.isLoad ?      
        <MapView
          stationMetsLatLng={this.props.screenProps.stationMets}
          metCoordinatesLatLng={this.props.screenProps.metCoordinates}
          refreshMetCoordinates={this.props.screenProps.refreshMetCoordinates}
          refreshStaionMets={this.props.screenProps.refreshStaionMets}
        />
        :
        null 
    );
  }
}

class SettingsScreen extends React.Component {
  mapNavigation = () => {
    this.props.navigation.navigate('Home');
  }
  render() {
    return (
      <QrCodeScaner mapNavigation={this.mapNavigation}/>
    );
  }
}

const TabNavigation = createBottomTabNavigator(
  {
    Home: {
      screen: props => <HomeScreen {...props} />,
      navigationOptions: {
        tabBarLabel: translate("map"),

      }
    },
    Settings: {
      screen: SettingsScreen,
      navigationOptions: {
        tabBarLabel: translate("rentTransport"),
      }
    },
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let IconComponent = CachedImage;
        let iconName;
        if (routeName === 'Home') {
          iconName = `map`;
          iconWith=25;
          iconHeight=26;
          IconComponent = CachedImage;
        } else if (routeName === 'Settings') {
          iconName = `qrcodemenu`;
          iconWith=25;
          iconHeight=26;
        }
        return  <CachedImage style={{ width: iconWith, height: iconHeight }} source={Images[iconName]} fallbackSource={Images[iconName]} />;
      },
    }),
    tabBarComponent: TabBar,
    tabBarOptions: {
      activeTintColor: '#ffffff',
      inactiveTintColor: '#ffffff',
    },
  }
);

const AppContainer = createAppContainer(TabNavigation);

function mapStateToProps(state) {
  return {
    stationMets: state.stationMets,
    metCoordinates: state.metCoordinates
  };
}

const mapDispatchToProps = dispatch => {
  return {
    refreshStaionMets: () => { dispatch(fetchAllStationMet()); },
    refreshMetCoordinates: (idUser) => { dispatch(fetchAllMetCoordinates(idUser)); },
  };
};

class App extends React.Component {
  componentWillMount() {
    messageRecipient();
    this.props.refreshStaionMets();
    this.props.refreshMetCoordinates(authenticationService.currentUserValue.id);
  }
  render() {
    return <AppContainer screenProps={{
      stationMets: this.props.stationMets,
      metCoordinates: this.props.metCoordinates,
      refreshMetCoordinates: this.props.refreshMetCoordinates,
      refreshStaionMets: this.props.refreshStaionMets
    }} />;
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(App);
