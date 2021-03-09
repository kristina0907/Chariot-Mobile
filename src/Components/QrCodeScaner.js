import React, { PureComponent, Component } from 'react';
import { Platform, TextInput, View, Text, StyleSheet, TouchableOpacity, Image, Linking, PermissionsAndroid, TouchableHighlight, Picker, Button, ScrollView } from 'react-native';
import { createAppContainer, createStackNavigator, StackActions, NavigationActions } from 'react-navigation';
import { CameraKitCameraScreen, } from 'react-native-camera-kit';
import { connect } from 'react-redux';
import { fetchAllChariotRentInfo } from '../actions/chariot';
import NumericInput from 'react-native-numeric-input';
import { createTrip, extendTrip, completeTrip } from '../actions/trip';
import { fetchAllTransactions } from '../actions/transaction';
import { authenticationService } from '../services';
import Modal from "react-native-modal";
import { Images } from '../images/images';
import { CachedImage } from 'react-native-cached-image';
import { Icon } from 'react-native-material-ui';
import translate from '../translations/translations';


function charging(level) {
  if (level <= 100 && level >= 50) {
    return (
      <View>
        <CachedImage style={{ width: 67, height: 37 }} source={Images['charge100']} fallbackSource={Images['charge100']} />
        <Text style={{ color: '#ffffff', position: "absolute", left: 10, top: 10 }}>{level} %</Text>
      </View>
    )
  } else if (level <= 49 && level >= 30) {
    return (
      <View>
        <CachedImage style={{ width: 67, height: 37 }} source={Images['charge50']} fallbackSource={Images['charge50']} />
        <Text style={{ color: '#ffffff', position: "absolute", left: 10, top: 10 }}>{level} %</Text>
      </View>
    )
  } else if (level <= 29) {
    return (
      <View>
        <CachedImage style={{ width: 67, height: 37 }} source={Images['charge20']} fallbackSource={Images['charge20']} />
        <Text style={{ color: '#ffffff', position: "absolute", left: 10, top: 10 }} >{level} %</Text>
      </View>
    )

  }
}

class HomeScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      QR_Code_Value: '',
      regNumber: '',
      modalVisible: false,
      Start_Scanner: false,
      param: {
        number: '',
        idUser: 1,
      }
    }
  }
  onQR_Code_Scan_Done = (QR_Code) => {
    this.props.screenProps.error = null;
    var p = { idUser: authenticationService.currentUserValue.id, number: QR_Code }
    this.props.screenProps.onGetChariotRentInfo(p);
    this.setState({ Start_Scanner: false });
    this.setModalVisible(false);
  }

  open_QR_Code_Scanner = () => {
    var that = this;
    if (Platform.OS === 'android') {
      async function requestCameraPermission() {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA, {
            'title': 'Camera App Permission',
            'message': 'Camera App needs access to your camera '
          }
          )
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            that.setState({ param: { number: '', idUser: authenticationService.currentUserValue.id } });
            that.setState({ Start_Scanner: true });
          } else {
            alert("CAMERA permission denied");
          }
        } catch (err) {
          alert("Camera permission err", err);
          console.warn(err);
        }
      }
      requestCameraPermission();
    } else {
      that.setState({ param: { number: '', idUser: authenticationService.currentUserValue.id } });
      that.setState({ Start_Scanner: true });
    }
  }
  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener("didFocus", () => {
      this.props.screenProps.refreshTransactions(authenticationService.currentUserValue.id);
    });
  }

  componentWillUnmount() {
    this.focusListener.remove();
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.screenProps.chariotRentInfo !== this.props.screenProps.chariotRentInfo)
      this.setState({ QR_Code_Value: nextProps.screenProps.chariotRentInfo });
  }
  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }
  render() {
    if (!this.state.Start_Scanner) {
      return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.MainContainer}>
            {this.state.QR_Code_Value.rentStatus ? <React.Fragment /> : (
              <React.Fragment>
                <Text style={{ fontSize: 15, textAlign: 'center', color: '#0099ff', width: "50%" }}> {translate("scanQRCode")}</Text>
                <CachedImage style={{ width: 136, height: 141 }} source={Images['qrcode']} fallbackSource={Images['qrcode']} />
              </React.Fragment>
            )}
            {(() => {
              switch (this.state.QR_Code_Value.rentStatus) {
                case 'readyToRent':
                  return <RentScreen screenProps={this.props.screenProps} navigation={this.props.navigation} isRent={true} />
                  break;
                case 'readyToExtend':
                  return <ExtendScreen screenProps={this.props.screenProps} navigation={this.props.navigation} />
                  break;
                case 'excess':
                  return <Excess screenProps={this.props.screenProps} navigation={this.props.navigation} />
                  break;
                case 'lowCharge':
                  return <LowCharge screenProps={this.props.screenProps} navigation={this.props.navigation} />
                  break;
                case 'notExist':
                  return <NotExist screenProps={this.props.screenProps} navigation={this.props.navigation} />
                  break;
                case 'rentedFromAnotherUser':
                  return <RentedFromAnotherUser screenProps={this.props.screenProps} navigation={this.props.navigation} />
                  break;
                case 'readyToRentAndHandOver':
                  return <RentAndHandOverScreen screenProps={this.props.screenProps} navigation={this.props.navigation} />
                  break;
                case 'readyToHandOver':
                  return <СompleteScreen screenProps={this.props.screenProps} navigation={this.props.navigation} />
                  break;
                case 'noTariff':
                case 'noTariffOnCurrentDate':
                  return <View style={styles.ResultContainer}>
                    <Text style={styles.titleHead}>{translate("error")}}</Text><Text style={{ fontSize: 18 }}>{translate("matNotReady")}}</Text></View>
                  break;
              }
            })()}
            <TouchableOpacity
              onPress={this.open_QR_Code_Scanner}
              style={styles.button}>
              <Text style={styles.buttonText}>
                {translate("scan")}
              </Text>
            </TouchableOpacity>
            {/* <View style={{ marginTop: 25 }}>
              <TouchableHighlight onPress={() => this.props.navigation.navigate('MyModal', { codeScan: this.onQR_Code_Scan_Done })}>
                <Text style={{ color:'#0099ff' }}>{translate("enterNumber")}</Text>
              </TouchableHighlight>
            </View> */}
          </View>
        </ScrollView>
      );
    }
    return (
      <View style={{ position: "absolute", top: 0, left: 0, bottom: 0, right: 0 }}>
        <CameraKitCameraScreen
          style={{
            zIndex: 1
          }}
          actions={{ leftButtonText: translate("сancel") }}
          onBottomButtonPressed={(event) => {
            if (event.type == "left") {
              this.setState({ Start_Scanner: false });
            }
          }}
          hideControls={false}           //(default false) optional, hide buttons and additional controls on top and bottom of screen
          showFrame={false}   //(default false) optional, show frame with transparent layer (qr code or barcode will be read on this area ONLY), start animation for scanner,that stoped when find any code. Frame always at center of the screen
          // offsetForScannerFrame={30}   //(default 30) optional, offset from left and right side of the screen
          // heightForScannerFrame={200}  //(default 200) optional, change height of the scanner frame
          scanBarcode={true}
          laserColor={'#2979FF'}
          frameColor={'#2979FF'}
          colorForScannerFrame={'#2979FF'}
          onReadCode={event =>
            this.onQR_Code_Scan_Done(event.nativeEvent.codeStringValue)
          }
        />
      </View>
    );
  }
}


class RentScreen extends Component {
  state = {
    amountPay: 0,
    durationPay: this.props.screenProps.chariotRentInfo.intervalMinute,
    idChariot: '',
    idUser: '',
    idTarif: '',
    isModalVisible: false,
    errorTrip: '',
  };
  handleInputChange = e => {
    this.setState({
      amountPay: (e * this.props.screenProps.chariotRentInfo.tarifPrice) / this.props.screenProps.chariotRentInfo.intervalMinute,
      durationPay: e
    });
  };

  componentWillMount() {
    this.setState({
      amountPay: (this.props.screenProps.chariotRentInfo.intervalMinute * this.props.screenProps.chariotRentInfo.tarifPrice) / this.props.screenProps.chariotRentInfo.intervalMinute,
      idChariot: this.props.screenProps.chariotRentInfo.idChariot,
      idTarif: this.props.screenProps.chariotRentInfo.idTarif,
      idUser: this.props.screenProps.idUser
    });
  }

  errorTrips(newProps) {
  }
  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener("didFocus", () => {
      this.props.screenProps.refreshTransactions(authenticationService.currentUserValue.id);
    });
  }

  componentWillUnmount() {
    this.focusListener.remove();
  }
  componentWillReceiveProps(newProps) {
    this.setState({
      idChariot: newProps.screenProps.chariotRentInfo.idChariot,
      idUser: newProps.screenProps.idUser,
      idTarif: newProps.screenProps.chariotRentInfo.idTarif
    })
    if (newProps.screenProps.error !== null && this.props.screenProps.error !== newProps.screenProps.error) {
      if (newProps.screenProps.error.data == 'notEnoughCash') {
        this.setState({ visibleModal: null, errorTrip: translate("balanceNotEnough") });
      } else if (newProps.screenProps.error.data == 'transactionError') {
        this.setState({ visibleModal: null, errorTrip: translate("transactionError") });
      } else if (newProps.screenProps.error.data == 'userError') {
        this.setState({ visibleModal: null, errorTrip: translate("userError") });
      } else if (newProps.screenProps.error.data == 'commandIsNotRecorded') {
        this.setState({ visibleModal: null, errorTrip: translate("commandNotRecorded") });
      } else if (newProps.screenProps.error.data == 'alreadyRent') {
        this.setState({ visibleModal: null, errorTrip: translate("METLeasedAnotherUser") });
      } else if (newProps.screenProps.error.data == 'notEnoughToExtend') {
        this.setState({ visibleModal: null, errorTrip: translate("minimumRentalTime") });
      } else if (newProps.screenProps.error.data == 'noCoordinates') {
        this.setState({ visibleModal: null, errorTrip: translate("couldNotFindStationNearby") });
      } else if (newProps.screenProps.error.data == 'connectToTheStation') {
        this.setState({ visibleModal: null, errorTrip: translate("connectStation") });
      } else if (newProps.screenProps.error.data == 'outsideTheZone') {
        this.setState({ visibleModal: null, errorTrip: translate("OutZone") });
      } else if (newProps.screenProps.error.data == 'extendIsNotAvailable') {
        this.setState({ visibleModal: null, errorTrip: translate("extensionTripNotAvailable") });
      } else if (newProps.screenProps.error.data == 'rentError') {
        this.setState({ visibleModal: null, errorTrip: translate("rentalError") });
      } else if (newProps.screenProps.error.data == 'extendError') {
        this.setState({ visibleModal: null, errorTrip: translate("renewalError") });
      } else if (newProps.screenProps.error.data == 'lowCharge') {
        this.setState({ visibleModal: null, errorTrip: translate("lowCharge") });
      } else if (newProps.screenProps.error.data == 'completeError') {
        this.setState({ visibleModal: null, errorTrip: translate("decontaminationError") });
      } else if (newProps.screenProps.error.data == 'skanChariot') {
        this.setState({ isModalVisible: false });
      }
      else if (newProps.screenProps.error.data === null) {
        this.props.screenProps.refreshTransactions(authenticationService.currentUserValue.id);
        newProps.navigation.dispatch(
          StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'Main' })],
          })
        );
        setTimeout(() => { this.props.screenProps.mapNavigation() }, 3000)
      }
    }
  }

  rentChariot(data) {
    this.props.screenProps.onAddTrip(data);
  }

  extendChariot(data) {
    this.props.screenProps.onExtendTrip(data);
  }
  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  }
  swipUp() {
    this.setState({ isModalVisible: false });
    this.props.navigation.dispatch(
      StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Main' })],
      })
    );
  }
  onCloseModal() {
    if (this.props.screenProps.error !== null && this.props.screenProps.error.data !== 'skanChariot') {
      this.setState({ isModalVisible: true })
    } else {
      this.setState({ isModalVisible: false })
    }
  }
  render() {
    const isRent = this.props.navigation.getParam('isRent', 'NO-ID')
    return (
      <View>
        <View style={styles.ResultContainer}>
          <Modal
            isVisible={this.state.isModalVisible}
            onSwipeComplete={() => this.swipUp()}
            swipeDirection={['up']}
          >
            <View style={styles.content}>
              <Text style={styles.contentTitle}>{this.state.errorTrip}</Text>
              <TouchableOpacity
                onPress={() => this.swipUp()}
                style={styles.button1}>
                <Text style={styles.buttonText}>
                  Ок
                  </Text>
              </TouchableOpacity>
            </View>
          </Modal>
          <View>
            {(() => {
              switch (this.props.screenProps.chariotRentInfo.metType) {
                case 'Велосипед':
                  return <CachedImage style={{ width: 94, height: 69 }} source={Images['bike']} fallbackSource={Images['bike']} />
                  break;
                case 'Самокат':
                  return <CachedImage style={{ width: 94, height: 65 }} source={Images['scooter']} fallbackSource={Images['scooter']} />
                  break;
                case 'Мотороллер':
                  return <CachedImage style={{ width: 92, height: 54 }} source={Images['motoroler']} fallbackSource={Images['motoroler']} />
                  break;
              }
            })()}
          </View>
          <View style={[styles.tableCell]}>
            <View style={[styles.box, styles.boxleft]}>
              <Text style={{ marginBottom: 5 }}>{translate("typeTransport")}:</Text>
              <Text style={{ marginBottom: 15, fontWeight: 'bold' }}>
                {(() => {
                  switch (this.props.screenProps.chariotRentInfo.metType) {
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
              <Text style={{ marginBottom: 5 }}>{translate("METNumber")}:</Text>
              <Text style={{ marginBottom: 15, fontWeight: 'bold' }}>{this.props.screenProps.chariotRentInfo.number}</Text>
            </View>
            <View style={[styles.box, styles.boxright]}>
              <Text style={{ marginBottom: 5 }}>{translate("charge")}:</Text>
              {charging(this.props.screenProps.chariotRentInfo.chargeLevel)}
            </View>
          </View>
          {/* <Button style={styles.bottonControl} onPress={() => this.props.isRent === true
          ? this.rentChariot(this.state)
          : this.extendChariot(this.state)} raised primary title="аренда" /> */}
        </View>
        <TouchableOpacity
          onPress={() => this.setState({ visibleModal: 'rent' })}
          style={styles.button}>
          <Text style={styles.buttonText}>
            {translate("rent")}
          </Text>
        </TouchableOpacity>
        <Modal
          isVisible={this.state.visibleModal === 'rent'}
          onSwipeComplete={() => this.setState({ visibleModal: null })}
          onModalHide={() => this.onCloseModal()}
          swipeDirection={['up']}
        >
          <View style={styles.content}>
            <View style={{ alignItems: 'flex-end', alignContent: 'flex-end', width: '100%', marginBottom: 15 }}>
              <TouchableOpacity
                onPress={() => this.setState({ visibleModal: null })}
                style={{ alignItems: 'flex-end', alignContent: 'flex-end', width: 50, }}>
                <CachedImage style={{ width: 36, height: 36 }} source={Images['close']} fallbackSource={Images['close']} />
              </TouchableOpacity>
            </View>
            <Text style={{ fontSize: 15, marginBottom: 25, color: '#0099ff', fontWeight: 'bold' }}> {translate("enterTime")}</Text>
            <NumericInput
              value={this.state.durationPay}
              onChange={this.handleInputChange}
              onLimitReached={(isMax, msg) => console.log(isMax, msg)}
              totalWidth={180}
              totalHeight={40}
              iconSize={25}
              step={this.props.screenProps.chariotRentInfo.intervalMinute}
              minValue={this.props.screenProps.chariotRentInfo.intervalMinute}
              maxValue={9999}
              editable={false}
              valueType='real'
              rounded
              textColor='#a6a19e'
              borderColor="#ffffff"
              iconStyle={{ color: 'white' }}
              rightButtonBackgroundColor='#0099ff'
              leftButtonBackgroundColor='#0099ff' />
            <Text style={{ fontSize: 15, marginTop: 25, color: '#a6a19e' }}>{translate("cost")} {this.state.amountPay}</Text>
            <TouchableOpacity
              onPress={() => (this.props.isRent === true || isRent === true)
                ? this.rentChariot(this.state)
                : this.extendChariot(this.state)}
              style={styles.button}>
              <Text style={styles.buttonText}>
                {translate("rent")}
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    );
  }
}


class ExtendScreen extends Component {
  state = {
    amountPay: 0,
    durationPay: this.props.screenProps.chariotRentInfo.intervalMinute,
    idChariot: this.props.screenProps.chariotRentInfo.idChariot,
    idUser: this.props.screenProps.idUser,
    idTarif: this.props.screenProps.chariotRentInfo.idTarif
  };
  handleInputChange = e => {
    this.setState({
      amountPay: (e * this.props.screenProps.chariotRentInfo.tarifPrice) / this.props.screenProps.chariotRentInfo.intervalMinute,
      durationPay: e
    });
  };

  componentWillMount() {
    this.setState({
      amountPay: (this.props.screenProps.chariotRentInfo.intervalMinute * this.props.screenProps.chariotRentInfo.tarifPrice) / this.props.screenProps.chariotRentInfo.intervalMinute,
      idChariot: this.props.screenProps.chariotRentInfo.idChariot,
      idTarif: this.props.screenProps.chariotRentInfo.idTarif,
      idUser: this.props.screenProps.idUser
    });
  }
  deliverChariot(data) {
    this.props.screenProps.onCompleteTrip(data);
  }
  swipUp() {
    this.setState({ isModalVisible: false });
    this.props.navigation.dispatch(
      StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Main' })],
      })
    );

  }
  onCloseModal() {
    if (this.props.screenProps.error !== null && this.props.screenProps.error.data !== 'skanChariot') {
      this.setState({ isModalVisible: true })
    } else {
      this.setState({ isModalVisible: false })
    }
  }
  extendChariot(data) {
    this.props.screenProps.onExtendTrip(data);
  }
  componentWillReceiveProps(newProps) {
    this.setState({
      idChariot: newProps.screenProps.chariotRentInfo.idChariot,
      idUser: newProps.screenProps.idUser,
      idTarif: newProps.screenProps.chariotRentInfo.idTarif
    })
    if (newProps.screenProps.error !== null && this.props.screenProps.error !== newProps.screenProps.error) {
      if (newProps.screenProps.error.data == 'notEnoughCash') {
        this.setState({ visibleModal: null, errorTrip: translate("balanceNotEnough") });
      } else if (newProps.screenProps.error.data == 'transactionError') {
        this.setState({ visibleModal: null, errorTrip: translate("transactionError") });
      } else if (newProps.screenProps.error.data == 'userError') {
        this.setState({ visibleModal: null, errorTrip: translate("userError") });
      } else if (newProps.screenProps.error.data == 'commandIsNotRecorded') {
        this.setState({ visibleModal: null, errorTrip: translate("commandNotRecorded") });
      } else if (newProps.screenProps.error.data == 'alreadyRent') {
        this.setState({ visibleModal: null, errorTrip: translate("METLeasedAnotherUser") });
      } else if (newProps.screenProps.error.data == 'notEnoughToExtend') {
        this.setState({ visibleModal: null, errorTrip: translate("minimumRentalTime") });
      } else if (newProps.screenProps.error.data == 'noCoordinates') {
        this.setState({ visibleModal: null, errorTrip: translate("couldNotFindStationNearby") });
      } else if (newProps.screenProps.error.data == 'connectToTheStation') {
        this.setState({ visibleModal: null, errorTrip: translate("connectStation") });
      } else if (newProps.screenProps.error.data == 'outsideTheZone') {
        this.setState({ visibleModal: null, errorTrip: translate("OutZone") });
      } else if (newProps.screenProps.error.data == 'extendIsNotAvailable') {
        this.setState({ visibleModal: null, errorTrip: translate("extensionTripNotAvailable") });
      } else if (newProps.screenProps.error.data == 'rentError') {
        this.setState({ visibleModal: null, errorTrip: translate("rentalError") });
      } else if (newProps.screenProps.error.data == 'extendError') {
        this.setState({ visibleModal: null, errorTrip: translate("renewalError") });
      } else if (newProps.screenProps.error.data == 'lowCharge') {
        this.setState({ visibleModal: null, errorTrip: translate("lowCharge") });
      } else if (newProps.screenProps.error.data == 'completeError') {
        this.setState({ visibleModal: null, errorTrip: translate("decontaminationError") });
      } else if (newProps.screenProps.error.data == 'completeIsNotAvailable') {
        this.setState({ visibleModal: null, errorTrip: translate("tripCompletedScanAgain") });
      } else if (newProps.screenProps.error.data == 'skanChariot') {
        this.setState({ isModalVisible: false });
      }
      else if (newProps.screenProps.error.data === null) {
        this.props.screenProps.refreshTransactions(authenticationService.currentUserValue.id);
        newProps.navigation.dispatch(
          StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'Main' })],
          })
        );
        setTimeout(() => { this.props.screenProps.mapNavigation() }, 3000)
      }
    }
  }
  render() {
    return (
      <View>
        <View style={styles.ResultContainer}>
          <Modal
            isVisible={this.state.isModalVisible}
            onSwipeComplete={() => this.swipUp()}
            swipeDirection={['up']}
          >
            <View style={styles.content}>
              <Text style={styles.contentTitle}>{this.state.errorTrip}</Text>
              <TouchableOpacity
                onPress={() => this.swipUp()}
                style={styles.button1}>
                <Text style={styles.buttonText}>
                  Ок
                  </Text>
              </TouchableOpacity>
            </View>
          </Modal>
          {this.props.screenProps.chariotRentInfo.chargeLevel < 49 ? (
            <Text style={{ backgroundColor: '#fb4c4c', padding: 5, alignSelf: 'flex-start', color: '#ffffff', borderRadius: 4, fontSize: 20, alignSelf: 'center' }} >Низкий уровень заряда!</Text>
          ) : (
              <React.Fragment />
            )}
          <View>
            {(() => {
              switch (this.props.screenProps.chariotRentInfo.metType) {
                case 'Велосипед':
                  return <CachedImage style={{ width: 94, height: 69 }} source={Images['bike']} fallbackSource={Images['bike']} />
                  break;
                case 'Самокат':
                  return <CachedImage style={{ width: 94, height: 65 }} source={Images['scooter']} fallbackSource={Images['scooter']} />
                  break;
                case 'Мотороллер':
                  return <CachedImage style={{ width: 92, height: 54 }} source={Images['motoroler']} fallbackSource={Images['motoroler']} />
                  break;
              }
            })()}
          </View>
          <View style={[styles.tableCell]}>
            <View style={[styles.box, styles.boxleft]}>
              <Text style={{ marginBottom: 5 }}>{translate("typeTransport")}:</Text>
              <Text style={{ marginBottom: 15, fontWeight: 'bold' }}>
                {(() => {
                  switch (this.props.screenProps.chariotRentInfo.metType) {
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
              <Text style={{ marginBottom: 5 }}>{translate("METNumber")}:</Text>
              <Text style={{ marginBottom: 15, fontWeight: 'bold' }}>{this.props.screenProps.chariotRentInfo.number}</Text>
            </View>
            <View style={[styles.box, styles.boxright]}>
              <Text style={{ marginBottom: 5 }}>{translate("charge")}:</Text>
              {charging(this.props.screenProps.chariotRentInfo.chargeLevel)}
            </View>
          </View>
        </View>
        <View style={{ width: '75%', alignSelf: 'center', flexDirection: 'row', alignItems: 'stretch', justifyContent: "center" }}>
          <TouchableOpacity
            onPress={() => this.deliverChariot(this.state)}
            style={[styles.button, { width: 130, marginRight: 25 }]}>
            <Text style={styles.buttonText}>
              {translate("complete")}
            </Text>
          </TouchableOpacity>
          <Modal
            isVisible={this.state.visibleModal === 'rent'}
            onSwipeComplete={() => this.setState({ visibleModal: null })}
            onModalHide={() => this.onCloseModal()}
            swipeDirection={['up']}
          >
            <View style={styles.content}>
              <View style={{ alignItems: 'flex-end', alignContent: 'flex-end', width: '100%', marginBottom: 15 }}>
                <TouchableOpacity
                  onPress={() => this.setState({ visibleModal: null })}
                  style={{ alignItems: 'flex-end', alignContent: 'flex-end', width: 50, }}>
                  <CachedImage style={{ width: 36, height: 36 }} source={Images['close']} fallbackSource={Images['close']} />
                </TouchableOpacity>
              </View>
              <Text style={{ fontSize: 15, marginBottom: 25, color: '#0099ff', fontWeight: 'bold' }}> {translate("enterTime")}</Text>
              <NumericInput
                value={this.state.durationPay}
                onChange={this.handleInputChange}
                onLimitReached={(isMax, msg) => console.log(isMax, msg)}
                totalWidth={180}
                totalHeight={40}
                iconSize={25}
                step={this.props.screenProps.chariotRentInfo.intervalMinute}
                minValue={this.props.screenProps.chariotRentInfo.intervalMinute}
                maxValue={9999}
                editable={false}
                valueType='real'
                rounded
                textColor='#a6a19e'
                borderColor="#ffffff"
                iconStyle={{ color: 'white' }}
                rightButtonBackgroundColor='#0099ff'
                leftButtonBackgroundColor='#0099ff' />
              <Text style={{ fontSize: 15, marginTop: 25, color: '#a6a19e' }}>{translate("cost")} {this.state.amountPay}</Text>
              <TouchableOpacity
                onPress={() => this.extendChariot(this.state)}
                style={styles.button}>
                <Text style={styles.buttonText}>
                  {translate("rent")}
                </Text>
              </TouchableOpacity>
            </View>
          </Modal>
          <TouchableOpacity
            onPress={() => this.setState({ visibleModal: 'rent' })}
            style={[styles.button, { width: 130 }]}>
            <Text style={styles.buttonText}>
              {translate("extend")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

class RentAndHandOverScreen extends Component {
  render() {
    return (
      <View style={styles.ResultContainer}>
        <View style={[styles.tableCell]}>
          <View style={[styles.box, styles.boxleft]}>
            {(() => {
              switch (this.props.screenProps.chariotRentInfo.metType) {
                case 'Велосипед':
                  return <CachedImage style={{ width: 94, height: 69 }} source={Images['bike']} fallbackSource={Images['bike']} />
                  break;
                case 'Самокат':
                  return <CachedImage style={{ width: 94, height: 65 }} source={Images['scooter']} fallbackSource={Images['scooter']} />
                  break;
                case 'Мотороллер':
                  return <CachedImage style={{ width: 92, height: 54 }} source={Images['motoroler']} fallbackSource={Images['motoroler']} />
                  break;
              }
            })()}
          </View>
          <View style={[styles.box, styles.boxright]}>
            <Text style={{ fontSize: 14, marginBottom: 5 }}>{translate("typeTransport")}:</Text>
            <Text style={{ fontSize: 16, marginBottom: 15, fontWeight: 'bold' }}>
              {(() => {
                switch (this.props.screenProps.chariotRentInfo.metType) {
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
            <Text style={{ fontSize: 14, marginBottom: 5 }}>{translate("METNumber")}:</Text>
            <Text style={{ fontSize: 16, marginBottom: 15, fontWeight: 'bold' }}>{this.props.screenProps.chariotRentInfo.number}</Text>
            <Text style={{ fontSize: 14, marginBottom: 5 }}>{translate("charge")}:</Text>
            {charging(this.props.screenProps.chariotRentInfo.chargeLevel)}
          </View>
        </View>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('Сomplete')}
          style={styles.button}>
          <Text style={{ color: '#FFF', fontSize: 14 }}>
            {translate("complete")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('Rent', { isRent: true })}
          style={styles.button}>
          <Text style={styles.buttonText}>
            {translate("rent")}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}


class Excess extends Component {
  state = {
    modalVisible: false,
  };

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }
  render() {
    return (
      <View style={styles.ResultContainer}>
        <Text style={styles.titleHead}>{translate("unfinishedTripsExceeded")}</Text>
        <Text style={{ backgroundColor: "#f5c95b", fontSize: 18, alignSelf: 'center' }}>{translate("completeCurrentTrips")}</Text>
      </View>
    );
  }
}


class LowCharge extends Component {
  render() {
    return (
      <View style={styles.ResultContainer}>
        <Text style={styles.titleHead}>{translate("rentalError")}</Text>
        <Text style={{ fontSize: 18, alignSelf: 'center' }}>{translate("lowCharge")}</Text>
        <View style={{ alignItems: 'center', marginTop: 20 }}>
          {charging(this.props.screenProps.chariotRentInfo.chargeLevel)}
        </View>
      </View>
    );
  }
}


class NotExist extends Component {
  render() {
    return (
      <View style={styles.ResultContainer}>
        <Text style={styles.titleHead}>{translate("error")}</Text>
        <Text style={{ fontSize: 18, alignSelf: 'center' }}>{translate("METNumberNotExist")}</Text>
      </View>
    );
  }
}

class RentedFromAnotherUser extends Component {
  render() {
    return (
      <View style={[styles.ResultContainer, { textAlign: 'center' }]}>
        <Text style={styles.titleHead}>{translate("error")}</Text>
        <Text style={{ fontSize: 18, textAlign: 'center' }}>{translate("METLeasedAnotherUser")}</Text>
      </View>
    );
  }
}



class СompleteScreen extends React.Component {
  state = {
    amountPay: 0,
    durationPay: 0,
    idChariot: '',
    idUser: '',
    idTarif: ''
  };
  componentWillMount() {
    this.setState({
      idChariot: this.props.screenProps.chariotRentInfo.idChariot,
      idTarif: this.props.screenProps.chariotRentInfo.idTarif,
      amountPay: this.props.screenProps.chariotRentInfo.tarifPrice,
      idUser: this.props.screenProps.idUser
    });
  }

  deliverChariot(data) {
    this.props.screenProps.onCompleteTrip(data);
    setTimeout(() => { this.props.screenProps.mapNavigation() }, 3000)
  }
  swipUp() {
    this.setState({ isModalVisible: false });
    this.props.navigation.dispatch(
      StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Main' })],
      })
    );
  }
  onCloseModal() {
    if (this.props.screenProps.error !== null && this.props.screenProps.error.data !== 'skanChariot') {
      this.setState({ isModalVisible: true })
    } else {
      this.setState({ isModalVisible: false })
    }
  }
  componentWillReceiveProps(newProps) {
    this.setState({
      idChariot: newProps.screenProps.chariotRentInfo.idChariot,
      idUser: newProps.screenProps.idUser,
      idTarif: newProps.screenProps.chariotRentInfo.idTarif
    })
    if (newProps.screenProps.error !== null && this.props.screenProps.error !== newProps.screenProps.error) {
      if (newProps.screenProps.error.data == 'notEnoughCash') {
        this.setState({ visibleModal: null, errorTrip: translate("balanceNotEnough") });
      } else if (newProps.screenProps.error.data == 'transactionError') {
        this.setState({ visibleModal: null, errorTrip: translate("transactionError") });
      } else if (newProps.screenProps.error.data == 'userError') {
        this.setState({ visibleModal: null, errorTrip: translate("userError") });
      } else if (newProps.screenProps.error.data == 'commandIsNotRecorded') {
        this.setState({ visibleModal: null, errorTrip: translate("commandNotRecorded") });
      } else if (newProps.screenProps.error.data == 'alreadyRent') {
        this.setState({ visibleModal: null, errorTrip: translate("METLeasedAnotherUser") });
      } else if (newProps.screenProps.error.data == 'notEnoughToExtend') {
        this.setState({ visibleModal: null, errorTrip: translate("minimumRentalTime") });
      } else if (newProps.screenProps.error.data == 'noCoordinates') {
        this.setState({ visibleModal: null, errorTrip: translate("couldNotFindStationNearby") });
      } else if (newProps.screenProps.error.data == 'connectToTheStation') {
        this.setState({ visibleModal: null, errorTrip: translate("connectStation") });
      } else if (newProps.screenProps.error.data == 'outsideTheZone') {
        this.setState({ visibleModal: null, errorTrip: translate("OutZone") });
      } else if (newProps.screenProps.error.data == 'extendIsNotAvailable') {
        this.setState({ visibleModal: null, errorTrip: translate("extensionTripNotAvailable") });
      } else if (newProps.screenProps.error.data == 'rentError') {
        this.setState({ visibleModal: null, errorTrip: translate("rentalError") });
      } else if (newProps.screenProps.error.data == 'extendError') {
        this.setState({ visibleModal: null, errorTrip: translate("renewalError") });
      } else if (newProps.screenProps.error.data == 'lowCharge') {
        this.setState({ visibleModal: null, errorTrip: translate("lowCharge") });
      } else if (newProps.screenProps.error.data == 'completeError') {
        this.setState({ visibleModal: null, errorTrip: translate("decontaminationError") });
      } else if (newProps.screenProps.error.data == 'completeIsNotAvailable') {
        this.setState({ visibleModal: null, errorTrip: translate("tripCompletedScanAgain") });
      } else if (newProps.screenProps.error.data == 'skanChariot') {
        this.setState({ isModalVisible: false });
      } else if (newProps.screenProps.error.data === null) {
        this.props.screenProps.refreshTransactions(authenticationService.currentUserValue.id);
        newProps.navigation.dispatch(
          StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'Main' })],
          })
        );
        setTimeout(() => { this.props.screenProps.mapNavigation() }, 3000)
      }
    }
  }
  render() {
    return (
      <View>
        <View style={styles.ResultContainer}>
          <Modal
            isVisible={this.state.isModalVisible}
            onSwipeComplete={() => this.swipUp()}
            swipeDirection={['up']}
          >
            <View style={styles.content}>
              <Text style={styles.contentTitle}>{this.state.errorTrip}</Text>
              <TouchableOpacity
                onPress={() => this.swipUp()}
                style={styles.button1}>
                <Text style={styles.buttonText}>
                  Ок
                  </Text>
              </TouchableOpacity>
            </View>
          </Modal>
          <View>
            {(() => {
              switch (this.props.screenProps.chariotRentInfo.metType) {
                case 'Велосипед':
                  return <CachedImage style={{ width: 94, height: 69 }} source={Images['bike']} fallbackSource={Images['bike']} />
                  break;
                case 'Самокат':
                  return <CachedImage style={{ width: 94, height: 65 }} source={Images['scooter']} fallbackSource={Images['scooter']} />
                  break;
                case 'Мотороллер':
                  return <CachedImage style={{ width: 92, height: 54 }} source={Images['motoroler']} fallbackSource={Images['motoroler']} />
                  break;
              }
            })()}
          </View>
          <View style={[styles.tableCell]}>
            <View style={[styles.box, styles.boxleft]}>
              <Text style={{ marginBottom: 5 }}>{translate("typeTransport")}:</Text>
              <Text style={{ marginBottom: 15, fontWeight: 'bold' }}>
                {(() => {
                  switch (this.props.screenProps.chariotRentInfo.metType) {
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
              <Text style={{ marginBottom: 5 }}>{translate("METNumber")}:</Text>
              <Text style={{ marginBottom: 15, fontWeight: 'bold' }}>{this.props.screenProps.chariotRentInfo.number}</Text>
            </View>
            <View style={[styles.box, styles.boxright]}>
              <Text style={{ marginBottom: 5 }}>{translate("charge")}:</Text>
              {charging(this.props.screenProps.chariotRentInfo.chargeLevel)}
            </View>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => this.deliverChariot(this.state)}
          style={styles.button}>
          <Text style={styles.buttonText}>
            {translate("handOver")}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

class FinishScreen extends React.Component {
  render() {
    return (
      < View style={{ flex: 1 }}>
        <Text style={styles.title} >{translate("complete")}</Text>
        <View style={{ padding: 10 }}>
          <Text style={{ padding: 5 }}>{translate("typeTransport")}</Text>
          <Text style={{ padding: 5 }}>{translate("RegnumberHumanReadable")}</Text>
          <Text style={{ padding: 5 }}>{translate("NeedDriveStation")}</Text>
        </View>
      </View >
    );
  }
}

class ModalScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      regNumber: '',
    }
  }

  codeScan() {
    this.props.navigation.state.params.codeScan(this.state.regNumber);
    this.props.navigation.goBack(null);
  }
  render() {
    return (
      <View style={{ marginTop: 22 }}>
        <View style={{ alignItems: 'center', justifyContent: 'center', padding: 25 }}>
          <TextInput
            placeholder={translate("METNumber")}
            onChangeText={TextInputValue =>
              this.setState({ regNumber: TextInputValue })}
            style={styles.input}
            underlineColorAndroid='transparent'
          />
          <TouchableOpacity
            onPress={() => this.codeScan()}
            style={styles.button}>
            <Text style={styles.buttonText}>
              {translate("save")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}


const MainStack = createStackNavigator(
  {
    Home: {
      screen: HomeScreen,
      navigationOptions: {
        header: null,
      },
    },
    Сomplete: {
      screen: СompleteScreen,
      navigationOptions: {
        header: null,
      },
    },
    Extend: {
      screen: ExtendScreen,
      navigationOptions: {
        header: null,
      },
    },
    Rent: {
      screen: RentScreen,
      navigationOptions: {
        header: null,
      },
    },
    Finish: {
      screen: FinishScreen,
      navigationOptions: {
        header: null,
      },
    }
  },
  {
    initialRouteName: 'Home',
  }
);

const RootStack = createStackNavigator(
  {
    Main: {
      screen: MainStack,
      navigationOptions: {
        header: null,
        headerBackTitle: null
      },
    },
    MyModal: {
      screen: ModalScreen,
      navigationOptions: {
        headerBackTitle: null
      },
    },
  },
  {
    mode: 'modal',
    //headerMode: 'none',
  }
);

const AppContainer = createAppContainer(RootStack);

const mapStateToProps = (state) => {
  return {
    chariotRentInfo: state.chariotRentInfo.data,
    trips: state.trips.data,
    error: state.trips.error
  };
}

const mapDispatchToProps = dispatch => {
  return {
    onGetChariotRentInfo: (params) => { dispatch(fetchAllChariotRentInfo(params)); },
    onAddTrip: trip => { dispatch(createTrip(trip)); },
    onExtendTrip: trip => { dispatch(extendTrip(trip)); },
    onCompleteTrip: trip => { dispatch(completeTrip(trip)); },
    refreshTransactions: (idUser) => { dispatch(fetchAllTransactions(idUser)); },
  }
};

class App extends React.Component {
  state = {
    idUser: 11
  };

  render() {
    return <AppContainer screenProps={
      {
        chariotRentInfo: this.props.chariotRentInfo,
        onGetChariotRentInfo: this.props.onGetChariotRentInfo,
        onAddTrip: this.props.onAddTrip,
        onExtendTrip: this.props.onExtendTrip,
        onCompleteTrip: this.props.onCompleteTrip,
        idUser: authenticationService.currentUserValue.id,
        error: this.props.error,
        refreshTransactions: this.props.refreshTransactions,
        mapNavigation: this.props.mapNavigation
      }
    } />;
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(App);

const styles = StyleSheet.create({
  box: {
    flex: 1,
    // height: 40,
    // alignItems: 'center',
    // alignSelf: 'stretch'
  },
  boxleft: {
    // alignContent: 'center',
    // alignItems: 'center',
    // justifyContent: "center",
  },
  boxright: {
    alignItems: 'flex-start',
    paddingLeft: 35,
  },
  tableCell: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: "space-between",
    marginTop: 35,
  },
  Image: {
    width: 80,
    height: 80,
  },
  contentTitle: {
    fontSize: 14,
    marginBottom: 12,
    alignSelf: 'center',
    textAlign: 'center'
  },
  buttonResult: {
    marginTop: 15,
    padding: 12,
    width: 150,
    backgroundColor: '#2979FF',
    alignItems: 'center',
    color: '#ffffff'
  },
  buttonText: {
    color: '#FFF',
    fontSize: 14
  },
  content: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    width: '90%',
    alignSelf: 'center'
  },
  ResultContainer: {
    elevation: 7,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    paddingLeft: 30,
    paddingRight: 30,
    width: "80%",
    shadowOpacity: 0.75,
    shadowRadius: 5,
    shadowColor: 'gray',
    shadowOffset: { height: 3, width: 0 }
    // borderWidth: 1,
    // borderRadius: 2,
    // borderColor: '#ddd',
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.8,
    // shadowRadius: 2,
    // elevation: 1,
    // padding: 30,
    // margin: 30,
  },
  titleHead: {
    fontSize: 24,
    marginBottom: 15
  },
  MainContainer: {
    flex: 1,
    paddingTop: (Platform.OS) === 'ios' ? 40 : 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
    // borderWidth: 1,
    // borderRadius: 2,
    // borderColor: '#ddd',
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.8,
    // shadowRadius: 2,
    // elevation: 1,
  },
  QR_text: {
    color: '#000',
    fontSize: 19,
    padding: 8,
    marginTop: 12
  },
  button: {
    // backgroundColor: '#2979FF',
    // alignItems: 'center',
    // padding: 12,
    width: 200,
    marginTop: 20,
    height: 50,
    backgroundColor: '#0099ff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 10,
    alignSelf: 'center'
  },
  button1: {
    // backgroundColor: '#2979FF',
    // alignItems: 'center',
    // padding: 12,
    // width: 300,
    marginTop: 15,
    height: 40,
    backgroundColor: '#0099ff',
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    borderRadius: 10,
  },
  input: {
    borderBottomColor: '#ececec',
    borderBottomWidth: 1,
    marginBottom: 15,
    color: "#000000",
    width: '100%'
  },
});