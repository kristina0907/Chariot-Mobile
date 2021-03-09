import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Image, Platform, RefreshControl } from 'react-native';
import { Button, Icon } from 'react-native-material-ui'
import { createAppContainer, createStackNavigator } from 'react-navigation';
import { connect } from 'react-redux';
import { fetchAllTrips } from '../actions/trip';
import TrackTrip from './TrackTrip';
import { authenticationService } from '../services';
import Moment from 'moment';
import { Images } from '../images/images';
import * as Progress from 'react-native-progress';
import { CachedImage } from 'react-native-cached-image';
import { ScrollView } from 'react-native-gesture-handler';
import translate from '../translations/translations';
import Header from '../Components/Header'

function charging(level) {
  if (level <= 100 && level >= 50) {
    return (
      <Text style={{ backgroundColor: '#29fd08', padding: 5, paddingLeft:10,paddingRight:10, alignSelf: 'flex-start', color: '#ffffff', borderRadius: 10, marginTop: 10,fontSize:13 }}>{translate("charge")}: {level} %</Text>
    )
  } else if (level <= 49 && level >= 30) {
    return (
      <Text style={{ backgroundColor: '#fba14c', padding: 5, paddingLeft:10,paddingRight:10, alignSelf: 'flex-start', color: '#ffffff', borderRadius: 10, marginTop: 10,fontSize:13 }}>{translate("charge")}: {level} %</Text>)
  } else if (level <= 29) {
    return (
      <Text style={{ backgroundColor: '#fb4c4c', padding: 5, paddingLeft:10,paddingRight:10, alignSelf: 'flex-start', color: '#ffffff', borderRadius: 10, marginTop: 10,fontSize:13 }}>{translate("charge")}: {level} %</Text>)
  }
}
 
class HomeScreen extends Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      serverData: [],
      fetching_from_server: false,
      refreshing: false
    };
    this.offset = 1;
  }
  back = () => {
    this.props.navigation.goBack(null)
  }
  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener("didFocus", () => {
      this.props.screenProps.refreshTrips(authenticationService.currentUserValue.id)
    });
  }

  componentWillReceiveProps(newProps) {
    var i = 1;
  }
  componentWillUnmount() {
    this.focusListener.remove();
  }

  statysTrip(dateFinish, isRentEnds, isForsaken) {
    if (dateFinish !== null) {
      return (
        <Text style={{ marginBottom:20,fontSize:13}}>{translate("tripCompleted")}</Text>
      )
    } else if (isRentEnds) {
      return (
        <Text style={{ backgroundColor: '#fb4c4c', padding: 5, paddingLeft:10,paddingRight:10, alignSelf: 'flex-start', color: '#ffffff', borderRadius: 10,fontSize:13 }}>{translate("fineRide")}</Text>)
    } else if (isForsaken) {
      return (
        <Text style={{ backgroundColor: '#fba14c', padding: 5, paddingLeft:10,paddingRight:10, alignSelf: 'flex-start', color: '#ffffff', borderRadius: 10,fontSize:13 }} >{translate("rideThrown")}</Text>)
    } else {
      return (
        <Text style={{ backgroundColor: '#0099ff', padding: 5, paddingLeft:10,paddingRight:10, alignSelf: 'flex-start', color: '#ffffff', borderRadius: 10,fontSize:13 }}>{translate("driveActive")}</Text>)
    }
  }

  StyleColor = function (date, rent, isForsaken) {
    if (date !== null) {
      return {
        marginLeft: 10,
        marginRight: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        padding: 15,
      }
    } else if (rent) {
      return {
        marginLeft: 10,
        marginRight: 10,
        backgroundColor: '#fff5da',
        borderRadius: 10,
        padding: 15,
      }
    }
    else if (isForsaken) {
      return {
        marginLeft: 10,
        marginRight: 10,
        backgroundColor: '#ffe2da',
        borderRadius: 10,
        padding: 15,
      }
    }
    else {
      return {
        marginLeft: 10,
        marginRight: 10,
        backgroundColor: '#dafff1',
        borderRadius: 10,
        padding: 15,
      }
    }
  }
  onRefresh() {
    this.setState({ refreshing: true });
    this.props.screenProps.refreshTrips(authenticationService.currentUserValue.id)
    this.setState({ refreshing: false });
  }
  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh.bind(this)}
              tintColor="#0099ff"
              colors={["#0099ff"]}
            />
          }>
          {this.props.screenProps.trips == 'noTrips' ? (
            <View style={styles.margTop}>
              <Text style={{ marginLeft: 15 }}>{translate("noTrips")}</Text>
            </View>
          ) :
            this.props.screenProps.trips.length == 0 ? (
              <View style={styles.margTop, styles.indicator}>
                <ActivityIndicator size="large" color="#3aff" />
              </View>
            ) : (
                <View style={styles.margTop}>
                  {this.props.screenProps.trips != null ?
                    <FlatList
                      style={{ width: '100%' }}
                      keyExtractor={(item, index) => index.toString()}
                      data={this.props.screenProps.trips}
                      renderItem={({ item, index }) => (
                        <TouchableOpacity key={item.idTrip} onPress={() => this.props.navigation.navigate('Track', { back: this.back, idTrip: item.idTrip, durationPay: item.durationPay, metType: item.metTypeName, number: item.chariotNumber, idChariot: item.idChariot, tarifPrice: item.tarifPrice, tarifInterval: item.tarifInterval, dateFinish: item.dateFinish, isforsaken: item.isForsaken, isRentEnds: item.isRentEnds, amountPay: item.amountPay, dateStart: item.dateStart, chargeLevel: item.chargeLevel })}>
                          <View style={{
                            elevation:7,
                            backgroundColor: '#ffffff',
                            marginBottom: 15,
                            marginLeft: 25,
                            marginRight: 25,
                            borderRadius: 10,
                            padding: 15,
                            shadowOpacity: 0.75,
                            shadowRadius: 1,
                            shadowColor: 'gray',
                            shadowOffset: { height: 3, width: 0 }
                          }}>
                             {this.statysTrip(item.dateFinish, item.isRentEnds, item.isForsaken)}
                            <View style={[styles.tableCell]}>
                              <View style={[styles.box, styles.boxleft]}>
                                <View style={styles.callTrip}>
                                  {item.dateFinish == null && !item.isForsaken ? (
                                    <React.Fragment>
                                      {charging(item.chargeLevel)}
                                      <Text>{item.chariotInstruction}</Text>
                                    </React.Fragment>
                                  ) : (
                                      <React.Fragment />
                                    )}
                                  <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#0099ff' }}>{translate("cost")}: {item.amountPay}</Text>
                  
                                 </View>
                                <View style={[styles.tableCell]}>
                                  <View style={[styles.iconBox]}>
                                    <View><Icon name="lens" size={14} color='#0099ff' /></View>
                                    <View style={styles.line}><Text style={{ color: '#0099ff' }}>|</Text><Text style={{ color: '#0099ff' }}>|</Text></View>
                                    <View><Icon name="lens" size={14} color='#0099ff' /></View>
                                  </View>
                                  <View style={[styles.box, styles.leftbox]}>
                                    <View style={styles.itemDate}>
                                      <Text style={{fontSize:12}}>{translate("dateBeginning")}: </Text>
                                      <Text style={{fontSize:12}}>{Moment(item.dateStart).format('DD.MM.YY HH:mm')} </Text>

                                      {item.dateFinish !== null ? (
                                        <View style={{ marginTop: 20 }}>
                                          <Text style={{fontSize:12}}>{translate("expirationDate")}: </Text>
                                          <Text style={{fontSize:12}}>{Moment(item.dateFinish).format('DD.MM.YY HH:mm')}</Text>
                                        </View>

                                      ) : (
                                          <Text />
                                        )}</View>
                                  </View>
                                </View>
                              </View>
                              <View style={[styles.box, styles.boxright]}>
                                {(() => {
                                  switch (item.metTypeName) {
                                    case 'Велосипед':
                                      return <CachedImage style={{ width: 90, height: 65 }} source={Images['bike']} fallbackSource={Images['bike']} />
                                      break;
                                    case 'Самокат':
                                      return <CachedImage style={{ width: 95, height: 65 }} source={Images['scooter']} fallbackSource={Images['scooter']} />
                                      break;
                                    case 'Мотороллер':
                                      return <CachedImage style={{ width: 90, height: 50 }} source={Images['motoroler']} fallbackSource={Images['motoroler']} />
                                      break;
                                  }
                                })()}
                                <Text style={{marginTop:5}}>
                                  {(() => {
                                    switch (item.metTypeName) {
                                      case 'Велосипед':
                                        return translate("bike")
                                        break;
                                      case 'Самокат':
                                        return translate("scooter")
                                        break;
                                      case 'Мотороллер':
                                        return translate("motoroler")
                                        break;
                                    }
                                  })()}
                                </Text>
                                <Text style={{ fontWeight: 'bold', marginTop:5,fontSize: 10 }}>{item.chariotNumber}</Text>
                              </View>
                            </View>
                          </View>
                        </TouchableOpacity>
                      )}
                      ItemSeparatorComponent={() => <View style={styles.separator} />}
                    />
                    : null}
                </View>
              )
          }
        </ScrollView>
      </View>
    );
  }
}
const RootStack = createStackNavigator(
  {
    Home: {
      screen: props => <HomeScreen {...props} />,
      navigationOptions: {
        header: null,
        headerBackTitle: null
      },
    },
    Track: {
      screen: props => <TrackTrip {...props} navigation={props.navigation} />,
      navigationOptions: {
        headerBackTitle: null,
        header: props => <Header {...props} parameter={'right'}/>
      },
    },
  },
  {
    initialRouteName: 'Home',
  }
);
const AppContainer = createAppContainer(RootStack);

const mapStateToProps = (state) => {
  return {
    trips: state.trips.data,
    //trips: state.trips
  };
}

const mapDispatchToProps = dispatch => {
  return {
    refreshTrips: (idUser) => { dispatch(fetchAllTrips(idUser)); }
  }
};

class App extends React.Component {
  state = {
    idTrip: 11,
    trips: []
  };
  componentWillMount() {
    this.props.refreshTrips(authenticationService.currentUserValue.id);
  }
  componentWillReceiveProps(newProps) {
    this.setState({ trips: newProps.trips });
  }
  getCoordinates = (idTrip) => {
    this.setState({ idTrip: idTrip })
  }

  render() {
    return (
      <AppContainer screenProps={
        {
          trips: this.state.trips,
          idTrip: this.state.idTrip,
          refreshTrips: this.props.refreshTrips
        }
      } />
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(App);



const styles = StyleSheet.create({
  line: {
    paddingLeft: 5
  },
  iconBox: {
    width: 30
  },
  callTrip: {
    // borderBottomColor: '#d1d5da',
    // borderBottomWidth: 0.5,
    paddingTop: 5,
    paddingBottom: 10,
    // marginBottom: 10
  },
  btnImage: {
    width: 30,
    height: 30
  },
  itemDate: {
    paddingBottom: 10
  },
  itemScore: {
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: 'red',
    borderRadius: 10,
    padding: 15,
  },
  separator: {
    marginBottom: 20
  },
  container: {
    backgroundColor: '#f4f7ff',
    flex: 1,
    paddingTop: 70,
    // justifyContent: 'center',
    // alignItems: 'center',
    // paddingTop: 30,
  },
  item: {
    padding: 10,
  },
  text: {
    fontSize: 15,
    color: 'black',
  },
  footer: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  loadMoreBtn: {
    padding: 10,
    backgroundColor: '#800000',
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: 'white',
    fontSize: 15,
    textAlign: 'center',
  },
  containerPanel: {
    top: 10,
    paddingLeft: (Platform.OS) === 'ios' ? 50 : 25,
  },
  margTop: {
    marginTop: 10,
  },
  indicator: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    backgroundColor: "#f1f8fe",
    borderBottomColor: '#d1d5da',
    borderBottomWidth: 0.5,
    padding: 8
  },
  input: {
    borderBottomColor: '#ececec',
    borderBottomWidth: 1,
    marginBottom: 15,
    color: "#000000"
  },
  buttonControl: {
    backgroundColor: "#ff7c5c"
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    marginBottom: 10
  },
  box: {
    // flex: 2,
    // alignSelf: 'stretch'
  },
  leftbox: {
    alignItems: 'flex-start',
  },
  rightbox: {
    alignItems: 'center',
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignContent:'center',
    width: 100,
  },
  boxright:{
    alignContent:'center',
    justifyContent: 'center',
    alignItems:'center'
  },
  tableHead: {
    backgroundColor: '#fff6b2',
  },
  tableCell: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    alignContent:"space-between",
  },
  controlPanel: {
    // flex: 1,
    // alignSelf: 'flex-start',
    // alignItems: 'flex-start',
    // justifyContent: 'flex-start',
    marginBottom: 10,
    marginTop: 20,
    alignItems: 'flex-start',
    paddingLeft: 10,
  },
  bottonControl: {
    marginRight: 15,
    color: 'red'
  },
  text: {
    textAlign: 'center',
    fontSize: 15
  }
});
