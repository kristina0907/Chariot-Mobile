import React, { Component } from 'react';
import { View, StyleSheet, StatusBar, Image, Dimensions, Text, Button, TouchableHighlight, TouchableOpacity, PermissionsAndroid, RefreshControl } from 'react-native';
import MapView, { MAP_TYPES, PROVIDER_DEFAULT, UrlTile, Marker, ProviderPropType, Polyline, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { connect } from 'react-redux';
import { fetchSelectStationMet } from '../actions/stationMet';
import { createAppContainer, createStackNavigator, StackActions, NavigationActions } from 'react-navigation';
import { authenticationService } from '../services';
import { Images } from '../images/images';
import { CachedImage } from 'react-native-cached-image';
import { thisExpression } from '@babel/types';
import { ScrollView } from 'react-native-gesture-handler';
import { fetchActualTarif } from '../actions/tarif';
import translate from '../translations/translations';


const styles = StyleSheet.create({
  allNonMapThingsnew: {
    height: '100%',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    flex: 1,
  },
  topBottonInfo: {
    elevation: 1,
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 30,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.75,
    shadowRadius: 1,
    shadowColor: 'gray',
    shadowOffset: { height: 0, width: 0 }
  },
  ImageIconStyle: {
    width: 25,
    height: 25
  },
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
    // width:"100%",
    // height:"100%",
    zIndex: 2
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  circleRed: {
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
    backgroundColor: 'red',
  },
  circleGray: {
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
    backgroundColor: '#4682B4',
  },
  circleDarkGray: {
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
    backgroundColor: '#495054',
  },
  circleBlue: {
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
    backgroundColor: '#4169E1',
  },
  circleGreen: {
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
    backgroundColor: '#3CB371',
  },
  circleYellow: {
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
    backgroundColor: '#f0cb26',
  },
  pinText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 20,
    marginBottom: 10,
  },
  button: {
    elevation: 3,
    borderRadius: 10,
    justifyContent: 'center',
    shadowOpacity: 0.75,
    shadowRadius: 1,
    shadowColor: 'gray',
    shadowOffset: { height: 0, width: 0 },
    backgroundColor: '#4396fa',
    alignItems: 'center',
    padding: 10,
    marginTop: 5
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 16
  },
  allNonMapThings: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  routeInfoControl: {
    elevation: 0,
    position: 'absolute',
    top: 80,
    width: '100%',
    flexDirection: "row",
    alignItems: 'center',
    alignContent: 'space-between',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    // elevation: 0,
    // position: 'absolute',
    // top: 70,
    // width: '100%',
    // flexDirection: 'row',
    // alignItems: 'stretch',
    // justifyContent: "center",
    // // alignItems: 'center',
    // // justifyContent: 'center',
    // backgroundColor: '#ffffff',
    // backgroundColor: 'rgba(0,0,0,0.3)',
    // padding:10,
  },
  routeInfoText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    elevation: 5,
    top: 0,
    flex: 0,
    marginRight: 5,
  },
  menuLongPress: {
    elevation: 0,
    position: 'absolute',
    bottom: 80,
    width: '95%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 10,
    padding: 25,
  },
  stationInfoButtons: {
    elevation: 5,
    position: 'absolute',
    bottom: 127,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
  stationInfoData: {
    elevation: 5,
    position: 'absolute',
    bottom: 40,
    width: '100%',
    flexDirection: 'column',
    padding: 5,
  },
  menuStation: {
    elevation: 0,
    position: 'absolute',
    bottom: 80,
    width: '95%',
    height: 180,//'30%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 10,
    padding: 15,
  },
  buttonText: {
    color: '#42464d',
    fontSize: 24,
    fontWeight: 'bold',
  },
  menuButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  buttonUpdateMap: {
    elevation: 5,
    position: 'absolute',
    bottom: 10,
    backgroundColor: 'white',
    borderRadius: 30,
    width: '15%',
    height: 53,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.75,
    shadowRadius: 1,
    shadowColor: 'gray',
    shadowOffset: { height: 0, width: 0 }
  },
  buttonDeleteRoute: {
    elevation: 5,
    top: 0,
    flex: 0,
    marginRight: 5,
    backgroundColor: 'white',
    borderRadius: 50,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.75,
    shadowRadius: 1,
    shadowColor: 'gray',
    shadowOffset: { height: 0, width: 0 }
  },
  buttonRoute: {
    elevation: 0,
    marginRight: 5,
    top: 0,
    flex: 0,
    backgroundColor: 'white',
    borderRadius: 100,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  buttonMenu: {
    elevation: 5,
    marginRight: 5,
    marginLeft: 5,
    top: 0,
    flex: 0,
    backgroundColor: '#0099ff',
    borderRadius: 15,
    width: '33%',
    height: 35,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
});

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 54.626563;
const LONGITUDE = 39.755886;
const LATITUDE_DELTA = 0.02;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const GOOGLE_MAPS_APIKEY = 'AIzaSyAkT4_S6OTbGMer1-VRBbWASaH_bluGfuQ'//'AIzaSyCXGBREhaXpM-B5kcjQVWfVW627KheARmM';
const bykeSpeed = 40;
const chariotSpeed = 30;
const scooterSpeed = 50;
const footSpeed = 5;

class OpenStreetMapScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      statusBarHeight: null,
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      markers: [],
      markersMet: [],
      routeMarkerFrom: null,
      routeMarkerFromStation: null,
      latitudeFrom: null,
      longitudeFrom: null,
      routeMarkerTo: null,
      routeMarkerToStation: null,
      latitudeTo: null,
      longitudeTo: null,
      routeMode: "WALKING",
      metType: "byke",
      userLongitude: null,
      userLatitude: null,
      routeDistance: null,
      routeDuration: null,

      menuVisible: false,
      stationVisible: false,
      longPressCoordinate: null
    };
  }
  deleteRouteInfo() {
    this.setState({ routeDistance: null, routeDuration: null })
  }
  deleteMarkerFrom() {
    this.setState({ routeMarkerFrom: null, routeDuration: null, routeDistance: null })
  }
  deleteMarkerTo() {
    this.setState({ routeMarkerTo: null, routeDuration: null, routeDistance: null })
  }
  deleteMarkerFromStation() {
    this.setState({ routeMarkerFromStation: null })
  }
  deleteMarkerToStation() {
    this.setState({ routeMarkerToStation: null })
  }
  navigateToView(viewName, marker) {
    this.setState({
      region:
      {
        latitude: marker.latlng.latitude,
        longitude: marker.latlng.longitude,
        latitudeDelta: this.state.region.latitudeDelta,
        longitudeDelta: this.state.region.longitudeDelta
      }
    })
    this.props.navigation.navigate(viewName, { marker: marker, setToPositionStation: this.setToPositionStation.bind(this), setFromPositionStation: this.setFromPositionStation.bind(this) })
  }
  setMarkers(props) {
    var markers = [];
    var markersMet = [];
    if (props.metCoordinatesLatLng.length != 0) {
      props.metCoordinatesLatLng.forEach(function (item, i, arr) {
        markersMet.push({
          key: item.idTrack,
          latlng: {
            latitude: item.latitude,
            longitude: item.longitude,
          },
          children: {
            idChariot: item.idChariot,
            chargeLevel: item.chargeLevel,
            metTypeName: item.metTypeName,
            chariotNumber: item.chariotNumber,
            isForsaken: item.isForsaken,
          }
        })
      });
    }
    if (props.stationMetsLatLng.length != 0) {
      props.stationMetsLatLng.forEach(function (item, i, arr) {
        markers.push({
          latlng: {
            latitude: item.latitude,
            longitude: item.longitude,
          },
          title: item.name,
          description: item.name,
          children: {
            idStationMet: item.idStationMet,
            name: item.name,
            adress: item.adress,
            code: item.code,
            countFreeSlots: item.countFreeSlots,
            countCharging: item.countCharging,
            countSlots: item.countSlots,
            countChariot: item.countChariot,
            countByke: item.countByke,
            countMoto: item.countMoto
          }
        })
      })
    }
    this.setState({
      markers: markers,
      markersMet: markersMet
    })
  }
  componentWillReceiveProps(nextProps) {
    this.setMarkers(nextProps.screenProps);
  }
  componentWillMount() {
    this.setMarkers(this.props.screenProps);
  }
  async componentDidMount() {
    this.interval = setInterval(() => {
      this.props.screenProps.refreshMetCoordinates(authenticationService.currentUserValue.id)
    }, 10000);
    // const granted = await PermissionsAndroid.request(
    //   PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    // )
    // if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    //   //var location = await Location.getCurrentPositionAsync({});

    //   const options = {
    //     enableHighAccuracy: false,
    //     timeout: 10000,
    //     maximumAge: 0,
    //     distanceFilter: 0
    //   };
    //   var id;
    //   id = navigator.geolocation.watchPosition((lastPosition) => {
    //     alert("au")
    //     this.setState({ userLongitude: lastPosition.coords.longitude, userLatitude: lastPosition.coords.latitude });        
    //   }, 
    //   (error) => {
    //     //alert(JSON.stringify(error))
    //     alert("Отсутствуют геоданные");    
    //     navigator.geolocation.clearWatch(id);    
    //   }, 
    //   options);

    // }
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  onRegionChangeComplete = (region) => {
    this.setState({ region: { latitude: region.latitude, longitude: region.longitude, latitudeDelta: region.latitudeDelta, longitudeDelta: region.longitudeDelta } })
  };
  onLongPress = (e) => {
    // this.props.navigation.navigate('Menu', {
    //   coordinate: e.nativeEvent.coordinate,
    //   setFromPosition: this.setFromPosition.bind(this),
    //   setToPosition: this.setToPosition.bind(this),
    //   refreshMetCoordinates: this.props.screenProps.refreshMetCoordinates.bind(this)
    // })
    this.setState({ longPressCoordinate: e.nativeEvent.coordinate, menuVisible: true })
  };
  stationClick(marker) {
    this.props.screenProps.refreshStaionMet(marker.children.idStationMet)
    this.setState({ stationVisible: true })
  }
  setFromPosition = async (coordinate) => {
    await this.setState({
      routeMarkerFrom: {
        latlng: {
          latitude: coordinate.latitude,
          longitude: coordinate.longitude
        }
      }
    });
    this.setState({ longPressCoordinate: null, menuVisible: false })
    this.deleteMarkerFromStation();
  }
  setToPosition = async (coordinate) => {
    await this.setState({
      routeMarkerTo: {
        latlng: {
          latitude: coordinate.latitude,
          longitude: coordinate.longitude
        }
      }
    });
    this.setState({ longPressCoordinate: null, menuVisible: false })
    this.deleteMarkerToStation();
  }
  setFromPositionStation = async (coordinate) => {
    await this.setState({
      routeMarkerFromStation: {
        latlng: {
          latitude: coordinate.latitude,
          longitude: coordinate.longitude
        }
      }
    });
    this.setState({ stationVisible: false })
    this.deleteMarkerFrom();
  }
  setToPositionStation = async (coordinate) => {
    await this.setState({
      routeMarkerToStation: {
        latlng: {
          latitude: coordinate.latitude,
          longitude: coordinate.longitude
        }
      }
    });
    this.setState({ stationVisible: false })
    this.deleteMarkerTo();
    if (this.state.routeMarkerFromStation == null && this.state.routeMarkerFrom == null) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        const options = {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 0,
          distanceFilter: 0
        };
        var id;
        id = await navigator.geolocation.watchPosition((lastPosition) => {
          this.setState({ userLongitude: lastPosition.coords.longitude, userLatitude: lastPosition.coords.latitude });
          var coordinate = { latitude: this.state.userLatitude, longitude: this.state.userLongitude };
          this.setFromPositionStation(coordinate);
          navigator.geolocation.clearWatch(id);
        },
          (error) => {
            alert(translate("turnOnGeodata"))
            navigator.geolocation.clearWatch(id);
          },
          options);
      }
      // if (this.state.userLatitude === null || this.state.userLongitude === null) {
      //   alert("Для построения маршрута от текущей геолокации включите геоданные!")
      // }
      // else {
      //   var coordinate = { latitude: this.state.userLatitude, longitude: this.state.userLongitude };
      //   this.setFromPositionStation(coordinate)
      // }
    }
  }
  deleteRoute() {
    this.deleteMarkerFrom();
    this.deleteMarkerTo();
    this.deleteMarkerFromStation();
    this.deleteMarkerToStation();
    this.deleteRouteInfo();
  }
  routeInfoVisible() {
    return (this.state.routeMarkerFrom !== null && this.state.routeMarkerTo !== null) ||
      (this.state.routeMarkerFromStation !== null && this.state.routeMarkerToStation !== null) ||
      (this.state.routeMarkerFrom !== null && this.state.routeMarkerToStation !== null) ||
      (this.state.routeMarkerFromStation !== null && this.state.routeMarkerTo !== null);
  }
  calculateRouteDuration(distance, transportType) {
    switch (transportType) {
      case 'byke':
        var time = (distance / bykeSpeed) * 60;
        this.setState({ routeDuration: time.toFixed(2), metType: "byke", routeMode: "WALKING" });
        this.props.screenProps.getActualTarif(36);
        break;
      case 'chariot':
        var time = (distance / chariotSpeed) * 60;
        this.setState({ routeDuration: time.toFixed(2), metType: "chariot", routeMode: "WALKING" });
        this.props.screenProps.getActualTarif(32);
        break;
      case 'scooter':
        var time = (distance / scooterSpeed) * 60;
        this.setState({ routeDuration: time.toFixed(2), metType: "scooter", routeMode: "DRIVING" });
        this.props.screenProps.getActualTarif(34);
        break;
      case 'foot':
        var time = (distance / footSpeed) * 60;
        this.setState({ routeDuration: time.toFixed(2), metType: "foot", routeMode: "WALKING", });
        break;
    }
  }
  onRefresh() {
    this.setState({ refreshing: true });
    this.props.screenProps.refreshStaionMets();
    this.setState({ refreshing: false });
  }

  render() {
    return (
      <View style={styles.container}>
        {/* <View style={styles.allNonMapThings}>
          <TouchableOpacity style={styles.buttonUpdateMap}
            onPress={() => this.props.screenProps.refreshStaionMets()}
          >
            <Text style={styles.buttonText} >
              ↺
              </Text>
          </TouchableOpacity>
        </View> */}
        <View style={styles.allNonMapThingsnew}>
          <View style={styles.topBottonInfo} >
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
              onPress={() => this.props.screenProps.refreshStaionMets()}
            >
              <CachedImage style={{ width: 20, height: 17 }} source={Images['refresh']} fallbackSource={Images['refresh']} />
            </TouchableOpacity>
          </View>
        </View>
        {/* <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh.bind(this)}
              tintColor="#0099ff"
              colors={["#0099ff"]}
            />
          }
          > */}
        <MapView
          region={this.state.region}
          provider={PROVIDER_GOOGLE}
          mapType={this.mapType}
          rotateEnabled={false}
          showsUserLocation={true}
          showsMyLocationButton={true}
          followsUserLocation={true}
          showsCompass={true}
          toolbarEnabled={true}
          zoomEnabled={true}
          onRegionChangeComplete={this.onRegionChangeComplete}
          onLongPress={this.onLongPress}
          style={styles.map}
          moveOnMarkerPress={false}
        >
          {/* <UrlTile
            urlTemplate="http://a.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png"
            maximumZ={28}
          /> */}
          {
            this.state.markers.length != 0 ?
              this.state.markers.map((marker, index) => {
                return (
                  <MapView.Marker
                    key={index}
                    coordinate={marker.latlng}
                    title={translate('station') + ": №" + marker.children.code}
                    ASPECT_RATIO
                    //onPress={() => this.navigateToView('Station', marker)}
                    onPress={() => this.stationClick(marker)}
                    description={translate('address') + ": " + marker.children.adress}
                  //onCalloutPress={() => this.navigateToView('Chat')}
                  >
                    {/* <Callout> 
                                      <TouchableOpacity //onPress={() => this.navigateToView('Chat')}
                                      
                                                title="aaaaaaaaaa"
                                            underlayColor='#dddddd'>
                                            <Text>aaaaaaaaaaaaaa</Text>
                                      </TouchableOpacity>
                    </Callout> */}
                    {marker.children.countCharging == 0 ?
                      <View style={styles.circleRed}>
                        <Text style={styles.pinText}>{marker.children.countCharging}</Text>
                      </View>
                      :
                      <View style={styles.circleRed}>
                        <Text style={styles.pinText}>{marker.children.countCharging}</Text>
                      </View>
                    }
                  </MapView.Marker>
                )
              })
              : null
          }
          {this.state.markersMet.length != 0 ?
            this.state.markersMet.map((marker, index) => {
              return (
                <MapView.Marker

                  key={index}
                  coordinate={marker.latlng}
                  ASPECT_RATIO
                  title={marker.children.metTypeName + ": " + marker.children.chariotNumber}
                  onPress={() => this.setState({ stationVisible: false })}
                  description={translate('chargeLevel') + ":" + marker.children.chargeLevel.toString()}
                >
                  {marker.children.chargeLevel < 50 ?
                    <View style={styles.circleDarkGray}>
                      <Text style={styles.pinText}>{marker.children.metTypeName[0]}</Text>
                    </View>
                    : ((marker.children.isForsaken) ?
                      <View style={styles.circleYellow}>
                        <Text style={styles.pinText}>{marker.children.metTypeName[0]}</Text>
                      </View>
                      :
                      <View style={styles.circleGreen}>
                        <Text style={styles.pinText}>{marker.children.metTypeName[0]}</Text>
                      </View>)
                  }
                </MapView.Marker>
              )
            })
            : null
          }
          {this.state.routeMarkerFrom != null ?
            <MapView.Marker
              coordinate={this.state.routeMarkerFrom.latlng}
              title={"✖"}
              ASPECT_RATIO
              onCalloutPress={() => this.deleteMarkerFrom()}
            >
              <View style={styles.circleGray}>
                <Text style={styles.pinText}>a</Text>
              </View>
            </MapView.Marker>
            : null}

          {this.state.routeMarkerTo != null ?
            <MapView.Marker
              coordinate={this.state.routeMarkerTo.latlng}
              title={"✖"}
              ASPECT_RATIO
              onCalloutPress={() => this.deleteMarkerTo()}
            >
              <View style={styles.circleGray}>
                <Text style={styles.pinText}>b</Text>
              </View>
            </MapView.Marker>
            : null}

          {(this.state.routeMarkerFrom != null && this.state.routeMarkerTo != null) ?
            <MapViewDirections
              origin={this.state.routeMarkerFrom.latlng}
              destination={this.state.routeMarkerTo.latlng}
              apikey={GOOGLE_MAPS_APIKEY}
              strokeWidth={3}
              mode={this.state.routeMode}
              strokeColor="hotpink"
              onReady={result => {
                this.calculateRouteDuration(result.distance, this.state.metType)
                this.setState({ routeDistance: result.distance.toFixed(2) })
              }}
            />
            : null}
          {(this.state.routeMarkerFromStation != null && this.state.routeMarkerToStation != null) ?
            <MapViewDirections
              origin={this.state.routeMarkerFromStation.latlng}
              destination={this.state.routeMarkerToStation.latlng}
              apikey={GOOGLE_MAPS_APIKEY}
              strokeWidth={3}
              mode={this.state.routeMode}
              strokeColor="hotpink"
              onReady={result => {
                this.calculateRouteDuration(result.distance, this.state.metType)
                this.setState({ routeDistance: result.distance.toFixed(2) })
              }}
            />
            : null}
          {(this.state.routeMarkerFromStation != null && this.state.routeMarkerTo != null) ?
            <MapViewDirections
              origin={this.state.routeMarkerFromStation.latlng}
              destination={this.state.routeMarkerTo.latlng}
              apikey={GOOGLE_MAPS_APIKEY}
              strokeWidth={3}
              mode={this.state.routeMode}
              strokeColor="hotpink"
              onReady={result => {
                this.calculateRouteDuration(result.distance, this.state.metType)
                this.setState({ routeDistance: result.distance.toFixed(2) })
              }}
            />
            : null}
          {(this.state.routeMarkerFrom != null && this.state.routeMarkerToStation != null) ?
            <MapViewDirections
              origin={this.state.routeMarkerFrom.latlng}
              destination={this.state.routeMarkerToStation.latlng}
              apikey={GOOGLE_MAPS_APIKEY}
              strokeWidth={3}
              mode={this.state.routeMode}
              strokeColor="hotpink"
              onReady={result => {
                this.calculateRouteDuration(result.distance, this.state.metType);
                this.setState({ routeDistance: result.distance.toFixed(2) })
              }}
            />
            : null}
        </MapView>


        {this.state.menuVisible ?
          <View style={styles.menuLongPress}>
            {this.state.menuVisible ?
              <TouchableOpacity style={styles.buttonMenu}
                onPress={() => this.setToPosition(this.state.longPressCoordinate)}
              >
                <Text style={styles.menuButtonText} >{translate('here')}</Text>
              </TouchableOpacity>

              : null}
            {this.state.menuVisible ?
              <TouchableOpacity style={styles.buttonMenu}
                onPress={() => this.setFromPosition(this.state.longPressCoordinate)}
              >
                <Text style={styles.menuButtonText} >{translate('fromHere')}</Text>
              </TouchableOpacity>
              : null}
            {this.state.menuVisible ?
              <TouchableOpacity style={styles.buttonMenu}
                onPress={() => this.setState({ longPressCoordinate: null, menuVisible: false })}
              >
                <Text style={styles.menuButtonText} >{translate('hide')}</Text>
              </TouchableOpacity>
              : null}

          </View>
          : null}


        {this.state.stationVisible ?
          <View style={styles.menuStation}>
            <View style={styles.stationInfoButtons}>
              <TouchableOpacity style={styles.buttonMenu}
                onPress={() => this.setFromPositionStation({ latitude: this.props.screenProps.stationMet[0].latitude, longitude: this.props.screenProps.stationMet[0].longitude })}
              >
                <Text style={styles.menuButtonText} >{translate('here')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonMenu}
                onPress={() => this.setToPositionStation({ latitude: this.props.screenProps.stationMet[0].latitude, longitude: this.props.screenProps.stationMet[0].longitude })}
              >
                <Text style={styles.menuButtonText} >{translate('fromHere')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonMenu}
                onPress={() => this.setState({ stationVisible: false })}
              >
                <Text style={styles.menuButtonText} >{translate('hide')}</Text>
              </TouchableOpacity>
            </View>
            {this.props.screenProps.stationMet.length != 0 ?
              <View style={styles.stationInfoData}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#ffffff' }}>{translate('transport')}:</Text>
                <Text style={{ fontSize: 14, color: '#ffffff' }}>{translate('scooter')}({this.props.screenProps.stationMet[0].countChariot}); {translate('bike')}({this.props.screenProps.stationMet[0].countByke});{translate('motoroler')}({this.props.screenProps.stationMet[0].countMoto})</Text>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#ffffff' }}>{translate('slots')}:</Text>
                <Text style={{ fontSize: 14, color: '#ffffff' }}>{translate('free')}({this.props.screenProps.stationMet[0].countFreeSlots}); {translate('isCharging')}({this.props.screenProps.stationMet[0].countCharging})</Text>
              </View>
              : null}
          </View>
          : null}


        {this.routeInfoVisible() ?
          <View style={styles.routeInfoControl}>
            <View style={{ flexDirection: 'row', width: '55%' }}>
              <TouchableOpacity style={this.state.metType === "byke" ? [styles.buttonRoute, { backgroundColor: "#0099ff" }] : styles.buttonRoute}
                // onPress={() => this.setState({ routeMode: "BICYCLING" })}
                onPress={() => this.calculateRouteDuration(this.state.routeDistance, "byke")}
              >
                {this.state.metType === "byke" ?
                  <CachedImage style={{ width: 30, height: 19 }} source={Images['bike2']} fallbackSource={Images['bike2']} />
                  : <CachedImage style={{ width: 30, height: 19 }} source={Images['bike1']} fallbackSource={Images['bike1']} />
                }

                {/* <Text style={this.state.metType === "byke" ? [styles.buttonText, { color: "white" }] : styles.buttonText} >В</Text> */}
              </TouchableOpacity>
              <TouchableOpacity style={this.state.metType === "scooter" ? [styles.buttonRoute, { backgroundColor: "#0099ff" }] : styles.buttonRoute}
                // onPress={() => this.setState({ routeMode: "DRIVING" })}
                onPress={() => this.calculateRouteDuration(this.state.routeDistance, "scooter")}
              >
                {this.state.metType === "scooter" ?
                  <CachedImage style={{ width: 30, height: 21 }} source={Images['motoroler2']} fallbackSource={Images['motoroler2']} />
                  : <CachedImage style={{ width: 30, height: 21 }} source={Images['motoroler1']} fallbackSource={Images['motoroler1']} />
                }
          
                {/* <Text style={this.state.metType === "scooter" ? [styles.buttonText, { color: "white" }] : styles.buttonText} >М</Text> */}
              </TouchableOpacity>
              <TouchableOpacity style={this.state.metType === "chariot" ? [styles.buttonRoute, { backgroundColor: "#0099ff" }] : styles.buttonRoute}
                // onPress={() => this.setState({ routeMode: "WALKING" })}
                onPress={() => this.calculateRouteDuration(this.state.routeDistance, "chariot")}
              >
                {this.state.metType === "chariot" ?
                  <CachedImage style={{ width: 30, height: 21 }} source={Images['scooter2']} fallbackSource={Images['scooter2']} />
                  : <CachedImage style={{ width: 30, height: 21 }} source={Images['scooter1']} fallbackSource={Images['scooter1']} />
                }
        
                {/* <Text style={this.state.metType === "chariot" ? [styles.buttonText, { color: "white" }] : styles.buttonText} >С</Text> */}
              </TouchableOpacity>
              <TouchableOpacity style={this.state.metType === "foot" ? [styles.buttonRoute, { backgroundColor: "#0099ff" }] : styles.buttonRoute}
                // onPress={() => this.setState({ routeMode: "WALKING" })}
                onPress={() => this.calculateRouteDuration(this.state.routeDistance, "foot")}
              >
                 {this.state.metType === "foot" ?
                  <CachedImage style={{ width: 10, height: 20 }} source={Images['people2']} fallbackSource={Images['people2']} />
                  : <CachedImage style={{ width: 10, height: 20 }} source={Images['people']} fallbackSource={Images['people']} />
                }
              
                {/* <Text style={this.state.metType === "foot" ? [styles.buttonText, { color: "white" }] : styles.buttonText} >П</Text> */}
              </TouchableOpacity>
            </View>
            <View style={{ width: '28%' }}>
              <Text style={styles.routeInfoText} >
                {(this.state.routeDuration != null) ?
                  (this.state.routeDuration + " min\n" + ((this.state.routeDistance != null) ? this.state.routeDistance + " km\n" +
                    ((this.state.metType != "foot") ? ((Math.ceil(this.state.routeDuration / this.props.screenProps.actualTarif.intervalMinute) * this.props.screenProps.actualTarif.price) + " rub") : "") : "")) : ""}
              </Text>
            </View>
            <View style={{ width: '15%' }}>
              <TouchableOpacity style={styles.buttonDeleteRoute}
                onPress={() => this.deleteRoute()}
              >
                <Text style={styles.buttonText} >
                  ✕
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          : null}
        {/* </ScrollView> */}
      </View>
    );
  }
}

class StationScreen extends React.Component {
  componentWillMount() {
    var marker = this.props.navigation.getParam('marker', 'NO-ID');
    this.props.screenProps.refreshStaionMet(marker.children.idStationMet)
  }
  hideScreen() {
    this.props.navigation.goBack(null);
  }
  setToPositionStation() {
    this.props.navigation.goBack(null);
    var coordinate = { latitude: this.props.screenProps.stationMet[0].latitude, longitude: this.props.screenProps.stationMet[0].longitude };
    this.props.navigation.state.params.setToPositionStation(coordinate);
  }
  setFromPositionStation() {
    this.props.navigation.goBack(null);
    var coordinate = { latitude: this.props.screenProps.stationMet[0].latitude, longitude: this.props.screenProps.stationMet[0].longitude };
    this.props.navigation.state.params.setFromPositionStation(coordinate);
  }
  render() {
    const marker = this.props.screenProps.stationMet;
    return (

      <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-end' }}>
        {marker.length != 0 ?
          <View style={{ height: "40%", width: '100%', backgroundColor: "#fff", justifyContent: "flex-start" }}>
            <TouchableOpacity
              onPress={() => this.hideScreen()}
              style={styles.button}>
              <Text style={{ color: '#FFF', fontSize: 14 }}>
                {translate('hide')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => this.setToPositionStation()}
              style={styles.button}>
              <Text style={{ color: '#FFF', fontSize: 14 }}>
                {translate('finishHere')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => this.setFromPositionStation()}
              style={styles.button}>
              <Text style={{ color: '#FFF', fontSize: 14 }}>
                {translate('startHere')}
              </Text>
            </TouchableOpacity>

            {/* <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Наименование, номер станции МЭТ</Text> */}
            {/* <Text style={{ fontSize: 14 }}>{marker[0].name + ", " + marker[0].code}</Text> */}
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{translate('transport')}:</Text>
            <Text style={{ fontSize: 14 }}>{translate('scooter')}({marker[0].countChariot}); {translate('bike')}({marker[0].countByke}); {translate('motoroler')}({marker[0].countMoto})</Text>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{translate('slots')}:</Text>
            <Text style={{ fontSize: 14 }}>{translate('free')}({marker[0].countFreeSlots}); {translate('isCharging')}({marker[0].countCharging})</Text>
          </View>
          : null
        }
      </View>
    );
  }
}

class MenuScreen extends React.Component {
  componentWillMount() {
    var coordinate = this.props.navigation.getParam('coordinate', 'NO-ID');
  }
  setFromPosition() {
    this.props.navigation.goBack(null);
    var coordinate = this.props.navigation.getParam('coordinate', 'NO-ID');
    this.props.navigation.state.params.setFromPosition(coordinate);
  }
  setToPosition() {
    this.props.navigation.goBack(null);
    var coordinate = this.props.navigation.getParam('coordinate', 'NO-ID');
    this.props.navigation.state.params.setToPosition(coordinate);
  }
  hideScreen() {
    this.props.navigation.goBack(null);
  }
  render() {
    const marker = this.props.screenProps.stationMet;
    return (
      <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-end' }}>
        <View style={{ height: "40%", width: '100%', backgroundColor: "#fff", justifyContent: "flex-start" }}>
          <TouchableOpacity
            onPress={() => this.hideScreen()}
            style={styles.button}>
            <Text style={{ color: '#FFF', fontSize: 14 }}>
              {translate('hide')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.setFromPosition()}
            style={styles.button}>
            <Text style={{ color: '#FFF', fontSize: 14 }}>
              {translate('finishHere')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.setToPosition()}
            style={styles.button}>
            <Text style={{ color: '#FFF', fontSize: 14 }}>
              {translate('startHere')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
const RootStack = createStackNavigator(
  {
    Home: { screen: OpenStreetMapScreen },
    Station: { screen: props => <StationScreen {...props} navigation={props.navigation} /> },
    Menu: { screen: props => <MenuScreen {...props} navigation={props.navigation} /> },
    // Chat: { screen: props => <ChatScreen {...props} navigation={props.navigation} /> },
  },
  {
    initialRouteName: 'Home',
    mode: 'modal',
    headerMode: 'none',
    transparentCard: true,
    cardStyle: {
      backgroundColor: "transparent",
      opacity: 0.99
    }
  }
);
const AppContainer = createAppContainer(RootStack);

function mapStateToProps(state) {
  return {
    stationMet: state.stationMet,
    actualTarif: state.actualTarif
  };
}
const mapDispatchToProps = dispatch => {
  return {
    refreshStaionMet: (idStationMet) => { dispatch(fetchSelectStationMet(idStationMet)); },
    getActualTarif: (metTypeCode) => { dispatch(fetchActualTarif(metTypeCode)); },
  };
};
class App extends React.Component {

  render() {
    return (
      <AppContainer screenProps={
        {
          stationMetsLatLng: this.props.stationMetsLatLng,
          metCoordinatesLatLng: this.props.metCoordinatesLatLng,
          refreshMetCoordinates: this.props.refreshMetCoordinates,
          refreshStaionMet: this.props.refreshStaionMet,
          stationMet: this.props.stationMet,
          actualTarif: this.props.actualTarif,
          getActualTarif: this.props.getActualTarif,
          refreshStaionMets: this.props.refreshStaionMets
        }
      } />
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(App);
