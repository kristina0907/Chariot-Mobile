import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, TextInput, NetInfo, NativeModules, Image, Platform, ActivityIndicator, Picker, Alert } from 'react-native';
import { connect } from 'react-redux';
import { Button, Icon } from 'react-native-material-ui';
import { createStackNavigator, createAppContainer, StackActions, NavigationActions } from 'react-navigation';
import HomeScreen from './src/screens/HomeScreen';
import RegistrationScreen from './src/screens/Registration';
import { authenticationService } from './src/services';
import AsyncStorage from '@react-native-community/async-storage';
import * as Progress from 'react-native-progress';
import { validationService } from "./src/validation/service";
import { TextInputMask } from 'react-native-masked-text';
import { changePassword } from './src/actions/user';
import { Images } from './src/images/images';
import { CachedImage } from 'react-native-cached-image';
import { userLogout } from './src/actions/logout';
import { translateLanguage } from './src/actions/language';
import PhoneInput from 'react-native-phone-input';
import CountryPicker from 'react-native-country-picker-modal';
import Modal from "react-native-modal";
import translate, { setLocale } from './src/translations/translations';
import NavigationBar from 'react-native-navbar-color'
import Header from './src/Components/Header'


class StartPage extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#0099ff', alignItems: "center", justifyContent: "center" }}>
        <View>
          <Text style={{ color: '#ffffff', fontSize: 34, marginBottom: 40, fontWeight: '900', alignSelf: 'center' }}>Chariot</Text>
          <CachedImage style={{ width: 243, height: 243 }} source={Images['logo']} fallbackSource={Images['logo']} />
        </View>
      </View>
    );
  }
}


class LoginScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      phone: '',
      password: '',
      loggedIn: false,
      logIn: false,
      name: '',
      err: '',
      isLoad: false,
      click: false,
      dt: '',
      isModalVisible: false,
      error: '',
      errorMessage: '',
      phoneFlag: '+7',
      language: authenticationService.language,
      startPage: true
    };
  }

  static navigationOptions = {
    header: null,
    headerLeft: null,
    gesturesEnabled: false,
    headerBackTitle: null,
    headerVisible: false,
  };
  setLoggedIn(currentUser, phone) {
    if (currentUser) {
      this.setState({ loggedIn: true, phone: phone, err: '' });
    } else {
      this.setState({ err: 'User not found/ username or password is incorrect' });
    }
  }
  async componentWillMount() {
    let userData = null;
    try {
      this.setState({ isLoad: true });
      var currentUser = await AsyncStorage.getItem('currentUser');
      this.setState({ isLoad: false });
      userDate = JSON.parse(currentUser);
      authenticationService.setCurrentUserSubject(userDate);
      this.setLoggedIn(authenticationService.currentUserValue);
    } catch (e) {
      authenticationService.setCurrentUserSubject(userDate);
      this.setLoggedIn(authenticationService.currentUserValue);
    }
  }
  async login() {
    await authenticationService.login(this.state.phoneFlag, this.state.password);
    if (authenticationService.phoneError !== '') {
      if (authenticationService.phoneError == 'no user with this phone') {
        this.setState({ isModalVisible: !this.state.isModalVisible, error: translate("noUserPhone") });
      } else if (authenticationService.phoneError == 'invalid password') {
        this.setState({ isModalVisible: !this.state.isModalVisible, error: translate("wrongPassword") });
      }
      else if (authenticationService.phoneError == 'The Password field is required.') {
        this.setState({ isModalVisible: !this.state.isModalVisible, error: translate("passwordBlank") });
      }
    } else {
      this.setLoggedIn(authenticationService.currentUserValue, this.state.phone);
      this.setState({ click: true, phoneFlag: '+7' });
    }
  }
  logout() {
    this.props.screenProps.userLogout();
    //authenticationService.logout();
    this.setState({ loggedIn: false, name: '', phone: '', password: '' });
  }
  back = () => {
    this.props.navigation.goBack(null)
  }
  swipUp() {
    this.setState({ isModalVisible: false });
  }
  onPressFlag(value) {
    this.setState({
      phoneFlag: this.phone.getValue(value)
    })
  }
  onPhoneChange(value) {
    if (!this.phone.isValidNumber(value)) {
      this.setState({ errorMessage: translate("invalidPhoneFormat") });
    } else {
      this.setState({ errorMessage: '', phoneFlag: value });
    }
  }
  onchangeLanguage(itemValue) {
    this.setState({ language: itemValue });
    this.props.screenProps.changeLanguage(itemValue);
  }
  startPage() {
    this.setState({
      startPage: false
    });
  }
  render() {
    const { navigate } = this.props.navigation;
    setTimeout(() => { this.startPage() }, 5000);
    if (this.state.startPage) {
      return (
        <StartPage />
      )
    } else {
      //console.disableYellowBox = true;
      return (
        this.state.isLoad ?
          // <Progress.Circle size={30} indeterminate={true} /> 
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {/* <Text style={{ color: '#2196f3', fontSize: 40 }}>Загрузка...</Text> */}
            <ActivityIndicator size="large" color="#0099ff" />
          </View>
          :
          this.state.loggedIn ? <HomeScreen screenProps={{ logout: this.logout.bind(this) }} /> :
            <View style={{ flex: 1, backgroundColor: '#0099ff' }}>
              <Modal
                isVisible={this.state.isModalVisible}
                onSwipeComplete={() => this.swipUp()}
                swipeDirection={['up']}
              >
                <View style={styles.contentModal}>
                  <Text style={styles.contentTitle}>{this.state.error}</Text>
                  <TouchableOpacity
                    onPress={() => this.swipUp()}
                    style={styles.button1}>
                    <Text style={{ color: '#FFF', fontSize: 16 }}>
                      Ок
                  </Text>
                  </TouchableOpacity>
                </View>
              </Modal>
              <View style={{ width: '40%', flexDirection: 'row', justifyContent: 'center', backgroundColor: '#0099ff', paddingVertical: 10 }}>
                <CachedImage style={{ width: 30, height: 30 }} source={Images['select']} fallbackSource={Images['select']} />
                <Picker selectedValue={this.state.language} onValueChange={(itemValue) => this.onchangeLanguage(itemValue)} mode="dropdown"
                  style={{ height: 20, backgroundColor: '#0099ff', width: '60%', color: "#ffffff" }}>
                  <Picker.Item label="RU" value="ru" />
                  <Picker.Item label="EN" value="en" />
                  <Picker.Item label="VI" value="vi" />
                </Picker>
              </View>
              <View style={{
                top: "15%", padding: 40, backgroundColor: "#ffffff", borderRadius: 10, alignSelf: "center", width: "80%",
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 12,
                },
                shadowOpacity: 0.58,
                shadowRadius: 18,

                elevation: 24,
              }} >
                <Text style={{ fontSize: 24, color: '#0099ff', alignSelf: "center", marginBottom: 25 }}>Chariot</Text>
                <View>
                  <PhoneInput
                    ref={(ref) => {
                      this.phone = ref;
                    }}
                    initialCountry='ru'
                    textStyle={{ color: '#0099ff' }}
                    textProps={{ placeholder: translate("phone"), placeholderTextColor: "#0099ff" }}
                    style={[styles.inputLogin, styles.inputphone]}
                    onSelectCountry={(value) => this.onPressFlag(value)}
                    onChangePhoneNumber={(value) => this.onPhoneChange(value)}
                    //onPressConfirm={(value) => this.onPressFlag(value)}
                    value={this.state.phoneFlag}
                    autoFormat={true}
                    cancelText={translate("сancel")}
                    confirmText={translate("select")}
                  />
                  <Text style={styles.errorPhone}>{this.state.errorMessage}</Text>
                </View>
                <TextInput
                  placeholder={translate("password")}
                  onChangeText={TextInputValue =>
                    this.setState({ password: TextInputValue })}
                  underlineColorAndroid='transparent'
                  secureTextEntry={true}
                  style={styles.inputLogin}
                  placeholderTextColor="#0099ff"
                />
                <TouchableOpacity onPress={this.login.bind(this)}>
                  <View style={{
                    height: 50, backgroundColor:
                      '#0099ff', justifyContent: 'center',
                    alignItems: 'center', borderRadius: 10,
                    marginTop: 35
                  }}>
                    <Text style={{
                      fontSize: 20,
                      color: '#ffffff',
                    }}>
                      {translate("login")}</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={{ position: 'absolute', bottom: 40, alignSelf: "center" }}>
                <Text onPress={() => navigate('ChangePassword', { back: this.back })} style={{ textAlign: 'center', marginBottom: 25, color: "#ffffff" }}>{translate("forgotPassword")}?</Text>
                <Text onPress={() => navigate('Registration', { back: this.back })} style={{ textAlign: 'center', color: "#ffffff" }}>{translate("notMember")}</Text>
              </View >
            </View >
      );
    }
  }
}
class ChangePasswordScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      phone: '',
      valid: true,
      phoneFlag: '+7',
      errorMessage: ''
    };
  }
  async componentWillMount() {
    let userData = null;
    try {
      this.setState({ isLoad: true });
      var currentUser = await AsyncStorage.getItem('currentUser');
      this.setState({ isLoad: false });
      userDate = JSON.parse(currentUser);
      authenticationService.setCurrentUserSubject(userDate);
      this.setLoggedIn(authenticationService.currentUserValue);
    } catch (e) {
      authenticationService.setCurrentUserSubject(userDate);
      this.setLoggedIn(authenticationService.currentUserValue);
    }
  }
  disabledStyle = function () {
    if (this.state.valid) {
      return {
        marginTop: 20,
        height: 50,
        backgroundColor: '#e1ecf4',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        width: 300,
        borderRadius: 10,
      }
    } else {
      return {
        marginTop: 20,
        height: 50,
        backgroundColor: '#0099ff',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        width: 300,
        borderRadius: 10,
      }
    }
  }
  async code() {
    await authenticationService.generateConfirmationCodeForRestoringAccess(this.state.phoneFlag);
    if (authenticationService.phoneError == "") {
      this.props.navigation.navigate('ConfirmCode', { phone: this.state.phoneFlag });
    }
  }
  onPressFlag(value) {
    this.setState({
      phoneFlag: this.phone.getValue(value)
    })
  }
  onPhoneChange(value) {
    if (!this.phone.isValidNumber(value)) {
      this.setState({ errorMessage: translate("invalidPhoneFormat"), valid: true });
    } else {
      this.setState({ errorMessage: '', phoneFlag: value, valid: false });
    }
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ padding: 10, marginTop: (Platform.OS) === 'ios' ? 20 : 0, }}>
          <View>
            <PhoneInput
              ref={(ref) => {
                this.phone = ref;
              }}
              initialCountry='ru'
              textStyle={{ color: '#0099ff' }}
              textProps={{ placeholder: translate("phone"), placeholderTextColor: "#0099ff" }}
              style={[styles.inputLogin, styles.inputphone]}
              onSelectCountry={(value) => this.onPressFlag(value)}
              onChangePhoneNumber={(value) => this.onPhoneChange(value)}
              //onPressConfirm={(value) => this.onPressFlag(value)}
              value={this.state.phoneFlag}
              autoFormat={true}
              cancelText={translate("сancel")}
              confirmText={translate("select")}
            />
            <Text style={styles.errorPhone}>{this.state.errorMessage}</Text>
          </View>
          <TouchableOpacity disabled={this.state.valid}
            onPress={() => this.code()}
          >
            <View style={this.disabledStyle()}>
              <Text style={{
                fontSize: 16,
                color: '#ffffff',
              }}>
                {translate("getCode")}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
class ConfirmCodeScreen extends React.Component {
  state = {
    codeConfirm: '',
  };
  async send() {
    var phone = this.props.navigation.getParam('phone', 'NO-ID');
    await authenticationService.verifyConfirmCode(this.state.codeConfirm, phone);
    if (authenticationService.isVerifyCode) {
      await this.props.navigation.navigate('EditingPassword', { user: authenticationService.codeUser });
    }
    this.setState({
      codeConfirm: ''
    })
  }
  onChanged(text) {
    let newText = '';
    let numbers = '0123456789';
    for (var i = 0; i < text.length; i++) {
      if (numbers.indexOf(text[i]) > -1) {
        newText = newText + text[i];
      }
      else {
        Alert.alert(translate("error"), translate("onlyNumbers"));
      }
    }
    this.setState({ codeConfirm: newText });
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ padding: 10, marginTop: (Platform.OS) === 'ios' ? 20 : 0, }}>
          <TextInput
            style={styles.input}
            placeholder={translate("confirmationCode")}
            value={this.state.codeConfirm}
            keyboardType={'phone-pad'}
            onChangeText={TextInputValue => this.onChanged(TextInputValue)}
          />
          <View style={{ alignItems: 'center' }}>
            <TouchableOpacity
              // onPress={this.send.bind(this)}
              onPress={() => this.send()}
            >
              <View style={styles.button}>
                <Text style={{
                  fontSize: 16,
                  color: '#ffffff',
                }}>
                  OK</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}
class EditingPasswordScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputs: {
        password: {
          type: "password",
          value: "",
          errorLabel: "",
          required: true
        },
        confirmPassword: {
          type: "confirmPassword",
          value: "",
          errorLabel: "",
          required: true
        },
      },
      renderErrorPassword: '',
      valid: true,
      confirmPasswordDisabl: false,
      hidePassword: true,
      confirmPassword: ''
    };

    this.onInputChange = validationService.onInputChange.bind(this);
  }
  async onPassword(value) {
    var confirm = this.state.confirmPassword;
    if (value == '') {
      this.setState({
        confirmPasswordDisabl: false,
      });
    } else {
      this.setState({
        confirmPasswordDisabl: true,
      });
    }
    if (this.state.inputs.confirmPassword.value !== '') {
      await this.onInputChange({ id: "password", value });
      if (this.state.inputs.password.errorLabel == '' && value !== confirm) {
        this.setState({
          renderErrorPassword: translate("passwordsNotMatch"),
          valid: true
        });
      }
    } else {
      await this.onInputChange({ id: "password", value });
      this.setState({
        confirmPasswordDisabl: true,
      });
    }
  }
  onConfirmPassword(value) {
    this.setState({ confirmPassword: value });
    this.onInputChange({ id: "confirmPassword", value });
    this.setState({ renderErrorPassword: '' });
  }
  renderError(id) {
    const { inputs } = this.state;
    if (inputs[id].errorLabel) {
      return <Text style={styles.error}>{inputs[id].errorLabel}</Text>;
    }
    return null;
  }
  disabledStyle = function () {
    if (this.state.valid) {
      return {
        marginTop: 20,
        height: 50,
        backgroundColor: '#e1ecf4',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        width: 300,
        borderRadius: 10,
      }
    } else {
      return {
        marginTop: 20,
        height: 50,
        backgroundColor: '#0099ff',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        width: 300,
        borderRadius: 10,
      }
    }
  }
  editPassword() {
    var user = this.props.navigation.getParam('user', 'NO-ID');
    this.props.screenProps.onChangePassword(user, this.state.inputs.password.value);
    this.props.navigation.dispatch(
      StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Login' })],
      })
    );
  }
  managePasswordVisibility = () => {
    this.setState({ hidePassword: !this.state.hidePassword });
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, padding: 10 }}>
          <View>
            <View style={styles.textBoxBtnHolder}>
              <TextInput
                onChangeText={value => { this.onPassword(value) }}
                placeholder={translate("newPassword")} underlineColorAndroid="transparent"
                secureTextEntry={this.state.hidePassword}
                style={styles.textBox} />
              <TouchableOpacity activeOpacity={0.8} style={styles.visibilityBtn} onPress={this.managePasswordVisibility}>
                {this.state.hidePassword ? (
                  <CachedImage style={styles.btnImage} source={Images['hide']} fallbackSource={Images['hide']} />
                ) : (
                    <CachedImage style={styles.btnImage} source={Images['view']} fallbackSource={Images['view']} />
                  )}
              </TouchableOpacity>
            </View>
            {this.renderError("password")}
          </View>
          <View>
            <TextInput
              editable={this.state.confirmPasswordDisabl}
              style={styles.input}
              secureTextEntry={true}
              placeholder={translate("confirmPassword")}
              onChangeText={value => { this.onConfirmPassword(value) }}
            />
            <Text style={styles.error}>{this.state.renderErrorPassword}</Text>
            {this.renderError("confirmPassword")}
          </View>
          <View style={{ marginTop: 20 }}>
            <TouchableOpacity disabled={this.state.valid}
              onPress={this.editPassword.bind(this)}
            >
              <View style={this.disabledStyle()}>
                <Text style={{
                  fontSize: 16,
                  color: '#ffffff',
                }}>
                  {translate("save")}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}


const MainNavigator = createStackNavigator({
  Login: {
    screen: LoginScreen,
    navigationOptions: {
      header: null,
      headerLeft: null,
      gesturesEnabled: false,
      headerVisible: false,
    },
  },
  Home: {
    screen: HomeScreen,
    navigationOptions: {
      header: null,
      headerLeft: null,
      gesturesEnabled: false,
      headerVisible: false,
    },
  },
  Registration: {
    screen: RegistrationScreen,
    // navigationOptions: {
    //   title: 'Регистрация',
    // },
    navigationOptions: {
      header: null,
      headerLeft: null,
      gesturesEnabled: false,
      headerVisible: false,
    },
  },
  ChangePassword: {
    screen: ChangePasswordScreen,
    navigationOptions: {
      title: translate("restoreAccess"),
      header: props => <Header {...props} title={translate("restoreAccess")} parameter={'top'} />
    },
  },
  ConfirmCode: {
    screen: ConfirmCodeScreen,
    navigationOptions: {
      title: translate("enterConfirmationCode"),
      header: props => <Header {...props} title={translate("enterConfirmationCode")} parameter={'top'} />
    },
  },
  EditingPassword: {
    screen: EditingPasswordScreen,
    navigationOptions: {
      title: translate("setPassword"),
      header: props => <Header {...props} title={translate("setPassword")} parameter={'top'} />
    },
  },
});

const AppContainer = createAppContainer(MainNavigator);

const mapDispatchToProps = dispatch => {
  return {
    onChangePassword: (idUser, newPassword) => { dispatch(changePassword({ idUser, newPassword })); },
    userLogout: () => { dispatch(userLogout()) },
    changeLanguage: language => { dispatch(translateLanguage(language)) },
  };
};

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      connection_Status: ""
    }
  }

  componentDidMount() {
    NavigationBar.setColor('#0099ff');
    NavigationBar.setStatusBarColor('#0099ff', false)
    NetInfo.isConnected.addEventListener(
      'connectionChange',
      this._handleConnectivityChange
    );

    NetInfo.isConnected.fetch().done((isConnected) => {
      if (isConnected == true) {
        this.setState({ connection_Status: "Online" })
      }
      else {
        this.setState({ connection_Status: "Offline" })
      }
    });
  }
  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener(
      'connectionChange',
      this._handleConnectivityChange
    );
  }
  _handleConnectivityChange = (isConnected) => {

    if (isConnected == true) {
      this.setState({ connection_Status: "Online" })
    }
    else {
      this.setState({ connection_Status: "Offline" })
    }
  };

  render() {
    console.error = (error) => error.apply;
    console.disableYellowBox = true;
    if (this.state.connection_Status == "Online") {
      return (
        <AppContainer screenProps={{
          onChangePassword: this.props.onChangePassword,
          userLogout: this.props.userLogout,
          changeLanguage: this.props.changeLanguage
        }} />
      );
    } else if (this.state.connection_Status == "Offline") {
      return (
        <View style={styles.MainContainer}>
          <Text style={{ fontSize: 20, textAlign: 'center', marginBottom: 20, color: '#ffffff' }}> {translate("noConnection")} </Text>
        </View>
      );
    } else {
      return (
        <View />
      );
    }
  }
}


export default connect(null, mapDispatchToProps)(App);

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2196f3',
    padding: 20
  },
  headerBack: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    paddingTop: 15,
    // justifyContent: 'center',
    // alignItems:'flex-start',
    width: '100%',
    height: 60,
  },
  contentModal: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  contentTitle: {
    fontSize: 14,
    marginBottom: 12,
  },
  inputphone: {
    paddingBottom: 15,
    marginTop: 15
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
  TextStyle: {
    fontSize: 20,
    textAlign: 'center',
    color: '#ffffff'
  },
  inputLogin: {
    borderBottomColor: '#0099ff',
    borderBottomWidth: 1,
    marginBottom: (Platform.OS) === 'ios' ? 30 : 10,
    color: "#0099ff"
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
    color: "#000000",
  },
  textBoxBtnHolder:
  {
    position: 'relative',
    alignSelf: 'stretch',
    justifyContent: 'center',
    marginBottom: (Platform.OS) === 'ios' ? 15 : 0,
  },
  textBox:
  {
    alignSelf: 'stretch',
    height: 45,
    paddingRight: 45,
    //paddingLeft: 8,
    paddingVertical: 0,
    borderBottomColor: '#ececec',
    borderBottomWidth: 1,
    marginBottom: 15,
  },
  visibilityBtn:
  {
    position: 'absolute',
    right: 3,
    height: 40,
    width: 35,
    padding: 5
  },
  btnImage:
  {
    resizeMode: 'contain',
    height: '100%',
    width: '100%'
  },
  error: {
    position: "absolute",
    bottom: 0,
    color: "red",
    fontSize: 12
  },
  errorPhone: {
    position: "absolute",
    bottom: 0,
    color: "red",
    fontSize: 12
  },
  errorPhoneDost: {
    position: "absolute",
    bottom: 0,
    color: "#000000",
    fontSize: 12
  },
  button: {
    marginTop: 20,
    height: 50,
    backgroundColor: '#0099ff',
    justifyContent: 'center',
    alignItems: 'center',
    width: 300,
    borderRadius: 10,
  },
});