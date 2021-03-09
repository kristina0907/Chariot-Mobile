import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView, TouchableOpacity, Button, Image, Platform, Alert } from 'react-native';
import CheckBox from 'react-native-check-box'
import { authenticationService } from '../services';
import AsyncStorage from '@react-native-community/async-storage';
import HomeScreen from './HomeScreen';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import DatePicker from 'react-native-datepicker';
import Moment from 'moment';
import { validationService } from "../validation/service";
import PDFView from 'react-native-view-pdf';
import { Images } from '../images/images';
import { CachedImage } from 'react-native-cached-image';
import { Icon } from 'react-native-material-ui';
import PhoneInput from 'react-native-phone-input';
import translate from '../translations/translations';
import Header from '../Components/Header'


const resources = {
  url: 'https://geekbrains.ru/dogovor.pdf',
};
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
};

class LogoTitle extends React.Component {
  render() {
    return (
      <View style={styles.headerBack}>
        <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => this.props.back()}>
          <CachedImage style={{ marginLeft: 5, width: 10, height: 20 }} source={Images['back']} fallbackSource={Images['back']} />
          <Text style={{ marginLeft: 50, fontSize: 15, fontWeight: 'bold', color: '#0099ff' }}>{translate("registration")}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

class Registration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputs: {
        email: {
          type: "email",
          value: "",
          errorLabel: "",
          required: false
        },
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
        username: {
          type: "username",
          value: "",
          errorLabel: "",
          required: true
        },
        surName: {
          type: "surName",
          value: "",
          errorLabel: "",
          required: true
        },
        phone: {
          type: "phone",
          value: "",
          errorLabel: "",
          required: true
        },
        // agreement: {
        //   type: "agreement",
        //   value: true,
        //   required: true,
        //   errorLabel: ""
        // }
      },
      loggedIn: false,
      err: '',
      isChecked: true,
      renderErrorPassword: '',
      confirmPasswordDisabl: false,
      valid: true,
      hidePassword: true,
      phone: '',
      birtDate: '',
      confirmPassword: '',
      uniquePhone: '',
      errorMessage: '',
      phoneFlag: '+7'
    };

    this.onInputChange = validationService.onInputChange.bind(this);
  }

  agreement() {
    var value = !this.state.inputs.agreement.value;
    this.onInputChange({ id: "agreement", value })
    //this.onАgreement(this.state);
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

  setLoggedIn(currentUser, name) {
    if (currentUser) {
      this.setState({ loggedIn: true, name: name, err: '' });
    } else {
      this.setState({ err: 'User not found/ username or password is incorrect' });
    }
  }
  async componentWillMount() {
    let userData = null;
    try {
      // this.setState({ isLoad: true});
      var currentUser = await AsyncStorage.getItem('currentUser');
      // this.setState({ isLoad: false});
      userDate = JSON.parse(currentUser);
      authenticationService.setCurrentUserSubject(userDate);
      this.setLoggedIn(authenticationService.currentUserValue);
    } catch (e) {
      authenticationService.setCurrentUserSubject(userDate);
      this.setLoggedIn(authenticationService.currentUserValue);
    }
  }
  async register() {
    await authenticationService.CheckPhoneUniq(this.state.inputs.phone.value);
    if (authenticationService.errorPhoneUniq == "") {
      this.setState({ uniquePhone: '' });
      await this.props.navigation.navigate('ConfirmCode', { registrationData: this.state, setLoggedIn: this.setLoggedIn.bind(this) });
      await authenticationService.generateConfirmationCode(this.state.onPressFlag);
    } else {
      this.setState({ uniquePhone: translate("numberRegistered") });
    }
  }
  logout() {
    authenticationService.logout();
    this.setState({ loggedIn: false, name: '' });
    this.props.screenProps.back();
  }
  handleCheck(e) {
    this.setState({ checked: e });
  }
  disabledStyle = function () {
    if (this.state.valid) {
      return {
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
  onPhone(value) {
    this.setState({
      phone: value,
      uniquePhone: ''
    });
    this.onInputChange({ id: "phone", value });
  }
  managePasswordVisibility = () => {
    this.setState({ hidePassword: !this.state.hidePassword });
  }
  calenderClear = () => {
    this.setState({ birtDate: '' });
  }
  // static navigationOptions = {
  //   // headerTitle instead of title
  //   headerTitle: () => <LogoTitle />,
  //   //headerBackImage: MyCustomHeaderBackImage,
  // };
  onPressFlag(value) {
    this.setState({
      phoneFlag: this.phone.getValue(value)
    })
  }
  onPhoneChange(value) {
    this.setState({
      uniquePhone: ''
    });
    if (!this.phone.isValidNumber(value)) {
      this.setState({ errorMessage: translate("invalidPhoneFormat") });
      var znac = '';
      this.onInputChange({ id: "phone", znac });
    } else {
      this.setState({ errorMessage: '', phoneFlag: value });
      this.onInputChange({ id: "phone", value });
    }
  }
  async onChangeName(value) {
    await this.onInputChange({ id: "username", value });
    if (this.state.renderErrorPassword !== '' || this.state.inputs.password.errorLabel !== '' || this.state.errorMessage !== '') {
      this.setState({
        valid: true
      });
    }
  }
  render() {
    return (

      this.state.loggedIn ? <HomeScreen screenProps={{ logout: this.logout.bind(this) }} /> :
        <React.Fragment>
          <LogoTitle back={() => this.props.screenProps.back()} />
          <ScrollView>
            <View>
              <View style={{ flex: 1, padding: 10, marginTop: (Platform.OS) === 'ios' ? 20 : 0, }}>
                <View style={styles.contentInput}>
                  <PhoneInput
                    ref={(ref) => {
                      this.phone = ref;
                    }}
                    initialCountry='ru'
                    textStyle={{ color: '#000000' }}
                    textProps={{ placeholder: translate("phone"), placeholderTextColor: "#000000" }}
                    style={[styles.input, styles.inputphone]}
                    onSelectCountry={(value) => this.onPressFlag(value)}
                    onChangePhoneNumber={(value) => this.onPhoneChange(value)}
                    value={this.state.phoneFlag}
                    autoFormat={true}
                    cancelText={translate("сancel")}
                    confirmText={translate("select")}
                  />
                  <Text style={styles.error}>{this.state.uniquePhone}</Text>
                  <Text style={styles.error}>{this.state.errorMessage}</Text>
                </View>
                <View style={styles.contentInput}>
                  <View style={styles.textBoxBtnHolder}>
                    <TextInput onChangeText={value => { this.onPassword(value) }} placeholder={translate("password")} underlineColorAndroid="transparent" secureTextEntry={this.state.hidePassword} style={styles.textBox} />
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
                <View style={styles.contentInput}>
                  <TextInput
                    editable={this.state.confirmPasswordDisabl}
                    secureTextEntry={true}
                    style={styles.input}
                    placeholder={translate("confirmPassword")}
                    onChangeText={value => { this.onConfirmPassword(value) }}
                  />
                  <Text style={styles.error}>{this.state.renderErrorPassword}</Text>
                  {this.renderError("confirmPassword")}
                </View>
                <View style={styles.contentInput}>
                  <TextInput
                    style={styles.input}
                    placeholder={translate("nameUser")}
                    onChangeText={value => {
                      this.onChangeName(value);
                    }}
                  />
                  {this.renderError("username")}
                </View>
                <View style={styles.contentInput}>
                  <TextInput
                    style={styles.input}
                    placeholder={translate("surname")}
                    onChangeText={value => {
                      this.onInputChange({ id: "surName", value });
                    }}
                  />
                  {this.renderError("surName")}
                </View>
                <View>
                  <TextInput
                    style={styles.input}
                    placeholder="E-mail"
                    onChangeText={value => {
                      this.onInputChange({ id: "email", value });
                    }}
                  />
                  {this.renderError("email")}
                </View>
                <View style={styles.contentInput}>
                  <View style={styles.textBoxBtnHolder}>
                    <DatePicker
                      iconComponent={
                        <Icon
                          size={30}
                          color='#0099ff'
                          name='access-time'
                        />}
                      style={{ width: '100%', marginBottom: 15 }}
                      date={this.state.birtDate}
                      mode="date"
                      placeholder={translate("birthday")}
                      format="YYYY-MM-DD"
                      minDate="1921-01-01"
                      maxDate={Moment().format('YYYY-MM-DD')}
                      showIcon={this.state.birtDate != '' ? false : true}
                      confirmBtnText="Confirm"
                      cancelBtnText="Cancel"
                      customStyles={{
                        dateIcon: {
                          position: 'absolute',
                          right: 0,
                          top: 4,
                        },
                        dateInput: {
                          marginRight: 20,
                          borderWidth: 0,
                          borderBottomWidth: 1,
                          borderBottomColor: '#ececec',
                          alignItems: 'flex-start',
                        }
                      }}
                      onDateChange={(birtDate) => { this.setState({ birtDate: birtDate }) }}
                    />
                    {this.state.birtDate != '' ? (
                      <TouchableOpacity activeOpacity={0.8} style={styles.visibilityBtn} onPress={this.calenderClear}>
                        <Icon
                          size={28}
                          color='#333333'
                          name='clear'
                        />
                      </TouchableOpacity>
                    ) : (
                        <React.Fragment />
                      )}

                  </View>
                </View>
                <View >
                  <TouchableOpacity onPress={() => this.props.navigation.navigate('Replenish')}>
                    <Text style={{
                      fontWeight: 'bold',
                      marginBottom: 10,
                      marginTop: 10,
                      alignSelf: "center",
                      textDecorationLine: 'underline',
                      color: '#0099ff'
                    }}>
                      {translate("userAgreement")}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={{ marginTop: 20 }}>
                  <TouchableOpacity disabled={this.state.valid} onPress={this.register.bind(this)}>
                    <View style={this.disabledStyle()}>
                      <Text style={{
                        fontSize: 20,
                        color: '#ffffff',
                      }}>
                        {translate("registration")}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </React.Fragment>
    );
  }
}

class ConfirmCodeScreen extends React.Component {
  state = {
    codeConfirm: '',
  };
  async send() {
    var registrationData = this.props.navigation.getParam('registrationData', 'NO-ID');
    await authenticationService.verifyConfirmCode(this.state.codeConfirm);
    if (authenticationService.isVerifyCode) {
      await authenticationService.register(registrationData.inputs.email.value, registrationData.inputs.password.value, registrationData.inputs.username.value, registrationData.inputs.surName.value, registrationData.inputs.phone.value, registrationData.birtDate, this.state.codeConfirm, authenticationService.codeUser);
      this.props.navigation.state.params.setLoggedIn(authenticationService.currentUserValue, registrationData.name);
      this.props.navigation.goBack(null);
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
        <View style={{ padding: 10 }}>
          <TextInput
            style={styles.input}
            placeholder={translate("confirmationCode")}
            keyboardType={'phone-pad'}
            value={this.state.codeConfirm}
            onChangeText={TextInputValue => this.onChanged(TextInputValue)}
          />
          <TouchableOpacity onPress={this.send.bind(this)}>
            <View style={{
              height: 50,
              backgroundColor: '#0099ff',
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
              width: 200,
              borderRadius: 10,
            }}>
              <Text style={{
                fontSize: 16,
                color: '#ffffff',
              }}>
                OK</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}


const RootStack = createStackNavigator(
  {
    Home: {
      screen: props => <Registration {...props} navigation={props.navigation} />,
      navigationOptions: {
        header: null,
        headerBackTitle: null
      },
    },
    ConfirmCode: {
      screen: props => <ConfirmCodeScreen {...props} navigation={props.navigation} />,
      navigationOptions: {
        title: translate("enterConfirmationCode"),
        headerBackTitle: null,
        header: props => <Header {...props} title={translate("enterConfirmationCode")} parameter={'top'} />
      },
    },
    Replenish: {
      screen: ReplenishScreen,
    },
  },
  {
    initialRouteName: 'Home',
  }
);

const AppContainer = createAppContainer(RootStack);


class App extends React.Component {
  componentWillMount() {
  }
  render() {
    console.disableYellowBox = true;
    return <AppContainer screenProps={{ back: this.props.navigation.getParam('back'), }} />;
  }
}
export default App;

const styles = StyleSheet.create({
  inputphone: {
    paddingBottom: 15,
    marginTop: 15
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
  textBoxBtnHolder:
  {
    position: 'relative',
    alignSelf: 'stretch',
    justifyContent: 'center'
  },

  textBox:
  {
    alignSelf: 'stretch',
    height: 45,
    paddingRight: 45,
    // paddingLeft: 8,
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
  top: {
    marginTop: 20
  },
  container: {
    flex: 1,
    padding: 8,
    paddingTop: 50
  },
  input: {
    borderWidth: 1,
    borderColor: "black",
    padding: 10,
    marginBottom: 15,
    alignSelf: "stretch"
  },
  split: {
    flexDirection: "row"
  },
  error: {
    position: "absolute",
    bottom: 0,
    color: "red",
    fontSize: 12
  },
  button: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 20
  },
  containerPanel: {
    top: 25
  },
  margTop: {
    top: 50
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
  contentInput: {
    marginBottom: (Platform.OS) === 'ios' ? 15 : 0,
  },
  buttonControl: {
    backgroundColor: "#ff7c5c"
  },
  tableCell: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  row: {
    flexDirection: 'column',
    alignItems: 'stretch',
    height: 30,
    marginBottom: 10
  },
  box: {
    flex: 1,
    height: 30,
    borderBottomColor: '#ececec',
    borderBottomWidth: 1,
    alignItems: 'center'
  },
  tableHead: {
    backgroundColor: "#fff6b2"
  },
  controlPanel: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    marginBottom: 25
  },
  bottonControl: {
    marginRight: 15,
    color: 'red'
  },
});



