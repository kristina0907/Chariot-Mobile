import React, { Component } from 'react';
import { View, StyleSheet, StatusBar, Image, Dimensions, Text } from 'react-native';
import MapView, { MAP_TYPES, PROVIDER_DEFAULT, UrlTile, Marker, ProviderPropType, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';

// import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';
// import { fetchAllTrackCoordinates } from '../actions/track';


const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
});

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 54.62627;
const LONGITUDE = 39.756092;
const LATITUDE_DELTA = 0.001;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;


class OpenStreetMapScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            region: {
                latitude: LATITUDE,
                longitude: LONGITUDE,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            }
        };
    }

    componentWillMount() {
        //this.props.getTrackCoordinates(this.props.idTrip)        
    }

    render() {

        return (
            <React.Fragment>
                <MapView
                    //region={this.props.tracks[0]}
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
                    style={styles.map}
                    showsUserLocation>
                    <UrlTile
                        urlTemplate="http://a.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png"
                        maximumZ={1}
                    />
                    <Polyline
                        coordinates={this.props.tracks}
                        strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
                        strokeColors={[
                            '#7F0000',
                            '#00000000', // no color, creates a "long" gradient between the previous and next coordinate
                            '#B24112',
                            '#E5845C',
                            '#238C23',
                            '#7F0000'
                        ]}
                        strokeWidth={6}
                    />
                </MapView>
            </React.Fragment>
        );
    }
}

// function mapStateToProps(state) {
//     return {
//         tracks: state.tracks
//     };
// }

// const mapDispatchToProps = dispatch => {
//     return {
//         getTrackCoordinates: (idTrip) => { dispatch(fetchAllTrackCoordinates(idTrip)); }
//     };
// };

//export default connect(mapStateToProps, mapDispatchToProps)(OpenStreetMapScreen);
export default OpenStreetMapScreen;

