import React from 'react';
import { TextInput, View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Platform, RefreshControl } from 'react-native';
import { Button, Subheader, Checkbox, Avatar, Icon } from 'react-native-material-ui'
import { createAppContainer, createStackNavigator } from 'react-navigation';
import { connect } from 'react-redux';
import { fetchAllUsers, updateUser, updatePassword } from '../actions/user';
import { authenticationService } from '../services';
import DatePicker from 'react-native-datepicker';
import Moment from 'moment';
import { validationService } from "../validation/service";
import { TextInputMask } from 'react-native-masked-text';
import { Images } from '../images/images';
import { CachedImage } from 'react-native-cached-image';
import { ScrollView } from 'react-native-gesture-handler';
import translate from '../translations/translations';


const styles = StyleSheet.create({
  textBoxBtnHolder:
  {
    position: 'relative',
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  textBox:
  {
    alignSelf: 'stretch',
    height: 40,
    paddingRight: 45,
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
  container: {
    flex: 1,
    padding: 8,
    paddingTop: 50
  },
  contentInput: {
    marginBottom: (Platform.OS) === 'ios' ? 15 : 0,
  },
  input: {
    padding: 10,
    marginBottom: 15,
    alignSelf: "flex-start",
    paddingBottom: (Platform.OS) === 'ios' ? 30 : 0,
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
    marginTop: 20,
    height: 50,
    backgroundColor: '#0099ff',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: 230,
    padding: 15,
    borderRadius: 10,
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
    alignSelf: "stretch"
  },
  fieldName: {
    color: "#a3a8ae",
    marginBottom: 10,
  },
  fieldValue: {
    color: "#000000",
    fontSize: 16,
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomColor: '#ececec',
    borderBottomWidth: 1,
  }
});

class HomeScreen extends React.Component {
  state = {
    phone: '',
    surName: '',
    name: '',
    email: '',
    birtDate: '',
    refreshing: false
  };
  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener("didFocus", () => {
      this.props.screenProps.refreshUsers(authenticationService.currentUserValue.id);
    });
  }

  componentWillUnmount() {
    this.focusListener.remove();
  }
  EditingProfile() {
    this.props.screenProps.refreshUsers(authenticationService.currentUserValue.id);
    this.props.navigation.navigate('EditingProfile');
  }
  onRefresh() {
    this.setState({ refreshing: true });
    this.props.screenProps.refreshUsers(authenticationService.currentUserValue.id);
    this.setState({ refreshing: false });
  }
  render() {
    return (
      <ScrollView
        contentContainerStyle={{ flex: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh.bind(this)}
            tintColor="#0099ff"
            colors={["#0099ff"]}
          />
        }
      >
        <View style={{ flex: 1, paddingTop: 70 }}>
          <View style={{ paddingLeft: 15, paddingRight: 15, marginTop: 15 }}>
            {
              this.props.screenProps.users.map(function (item, index) {
                return (
                  <View key={index}>
                    <Text style={styles.fieldName}>{translate("phone")}:</Text>
                    <Text style={styles.fieldValue}>{item.phone}</Text>
                    <Text style={styles.fieldName}>{translate("surname")}:</Text>
                    <Text style={styles.fieldValue}>{item.surName}</Text>
                    <Text style={styles.fieldName}>{translate("nameUser")}:</Text>
                    <Text style={styles.fieldValue}>{item.name}</Text>
                    <Text style={styles.fieldName}>{translate("email")}:</Text>
                    <Text style={styles.fieldValue}>{item.email}</Text>
                    <Text style={styles.fieldName}>{translate("birthday")}:</Text>
                    <Text style={styles.fieldValue}>
                      {item.birtDate !== null ? (
                        Moment(item.birtDate).format('YYYY-MM-DD')
                      ) : (
                          ''
                        )}
                    </Text>
                  </View>
                );
              })
            }
            <TouchableOpacity onPress={() => this.EditingProfile()}>
              <View style={styles.button}>
                <Text style={{
                  fontSize: 16,
                  color: '#ffffff',
                }}>
                  {translate("changeProfile")}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('EditingPassword')}>
              <View style={styles.button}>
                <Text style={{
                  fontSize: 16,
                  color: '#ffffff',
                }}>
                  {translate("changePassword")}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }
}

class EditingProfileScreen extends React.Component {
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
      },
      loggedIn: false,
      err: '',
      isChecked: true,
      renderErrorPassword: '',
      valid: true,
      phone: '',
      birtDate: ''
    };

    this.onInputChange = validationService.onInputChange.bind(this);
  }
  componentWillMount() {
    var user = [];
    this.props.screenProps.users.forEach(function (item) {
      user.push({
        phone: item.phone,
        surName: item.surName,
        name: item.name,
        email: item.email,
        birtDate: item.birtDate == null ? "" : Moment(item.birtDate).format('YYYY-MM-DD'),
      })
    })
    this.setState({
      inputs: {
        email: {
          type: "email",
          value: user[0].email,
          errorLabel: "",
          required: false
        },
        username: {
          errorLabel: "",
          value: user[0].name,
          required: true
        },
        surName: {
          type: "surName",
          value: user[0].surName,
          errorLabel: "",
          required: true
        },
      },
      phone: user[0].phone,
      email: user[0].email,
      username: user[0].name,
      surName: user[0].surName,
      birtDate: user[0].birtDate,
    })
  }
  onDate(value, cb = () => { }) {
    const { inputs } = this.state;
    this.setState(
      {
        inputs: {
          ...inputs,
          birtDate: {
            value: value
          }
        },
        renderErrorPassword: ''
      },
      cb
    )
    this.onInputChange({ id: "birtDate", value });
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
  editUser() {
    this.props.screenProps.editUser(authenticationService.currentUserValue.id, this.state.inputs.username.value, this.state.inputs.surName.value, this.state.birtDate, this.state.phone, this.state.inputs.email.value);
    this.props.navigation.goBack(null);
  }
  calenderClear = () => {
    this.setState({ birtDate: '' });
    var value = this.state.inputs.surName.value;
    this.onInputChange({ id: "surName", value });
  }

  onChangeBirthDate(birtDate) {
    this.setState({ birtDate: birtDate });
    var value = this.state.inputs.surName.value;
    this.onInputChange({ id: "surName", value });
  }
  render() {
    return (
      <ScrollView>
        <View style={{ flex: 1, padding: 10, marginTop: (Platform.OS) === 'ios' ? 20 : 0, }}>
          <View style={styles.contentInput}>
            <TextInput
              value={this.state.surName}
              style={styles.input}
              placeholder={translate("surname")}
              onChangeText={value => {
                this.onInputChange({ id: "surName", value }, this.setState({ surName: value }));
              }}
            />
            {this.renderError("surName")}
          </View>
          <View style={styles.contentInput}>
            <TextInput
              value={this.state.username}
              style={styles.input}
              placeholder={translate("nameUser")}
              onChangeText={value => {
                this.onInputChange({ id: "username", value }, this.setState({ username: value }));
              }}
            />
            {this.renderError("username")}
          </View>
          <View>
            <TextInput
              value={this.state.email}
              style={styles.input}
              placeholder={translate("email")}
              onChangeText={value => {
                this.onInputChange({ id: "email", value }), this.setState({ email: value });
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
                    color='#333333'
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
                onDateChange={(birtDate) => { this.onChangeBirthDate(birtDate) }}
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
          <View style={styles.contentInput}>
          </View>
          <TouchableOpacity disabled={this.state.valid} onPress={this.editUser.bind(this)}>
            <View style={this.disabledStyle()}>
              <Text style={{
                fontSize: 16,
                color: '#ffffff',
              }}>
                {translate("save")}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}
class EditingPasswordScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputs: {
        oldpassword: {
          type: "oldpassword",
          value: "",
          errorLabel: "",
          required: true
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
      },
      renderErrorPassword: '',
      valid: true,
      confirmPasswordDisabl: false,
      hidePassword: true,
      oldPassworError: '',
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
    this.props.screenProps.editPassword(authenticationService.currentUserValue.id, this.state.inputs.oldpassword.value, this.state.inputs.password.value);
  }
  componentWillReceiveProps(newProps) {
    if (newProps.screenProps.error !== null  && newProps.screenProps.error) {
      if (newProps.screenProps.error.data == 'oldPasswordIsIncorrect') {
        this.setState({ oldPassworError: translate("oldPasswordIncorrect"), valid: true });
      } else {
        this.props.navigation.goBack(null);
      }
    }
  }
  managePasswordVisibility = () => {
    this.setState({ hidePassword: !this.state.hidePassword });
  }
  onChangeOldPassword(value) {
    this.onInputChange({ id: "oldpassword", value });
    if (this.state.renderErrorPassword !== '') {
      this.setState({
        valid: false
      });
    } else {
      this.setState({
        valid: true
      });
    }
    this.setState({ oldPassworError: '' });
  }
  render() {
    return (
      <ScrollView>
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1, padding: 10, marginTop: (Platform.OS) === 'ios' ? 20 : 0, }}>
            <View>
              <TextInput
                style={styles.input}
                placeholder={translate("oldPassword")}
                secureTextEntry={true}
                onChangeText={value => { this.onChangeOldPassword(value) }}
              />
              <Text style={styles.error}>{this.state.oldPassworError}</Text>
              {this.renderError("oldpassword")}
            </View>
            <View style={styles.contentInput}>
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
            <View style={styles.contentInput}>
              <TextInput
                editable={this.state.confirmPasswordDisabl}
                style={styles.input}
                secureTextEntry={true}
                placeholder={translate("confirmPassword")}
                onChangeText={value => {
                  this.onConfirmPassword(value)
                }}
              />
              <Text style={styles.error}>{this.state.renderErrorPassword}</Text>
              {this.renderError("confirmPassword")}
            </View>
            <View style={{ marginTop: 20 }}>
              <TouchableOpacity disabled={this.state.valid} onPress={this.editPassword.bind(this)}>
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
      </ScrollView>
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
    EditingProfile: {
      screen: props => <EditingProfileScreen {...props} />,
      navigationOptions: {
        title: translate("profileEditing"),
        header: props => <Header {...props} title={translate("profileEditing")} />,
        headerBackTitle: null
      },
    },
    EditingPassword: {
      screen: props => < EditingPasswordScreen {...props} />,
      navigationOptions: {
        title: translate("changePassword"),
        header: props => <Header {...props} title={translate("changePassword")} />,
        headerBackTitle: null
      },
    },
  },
  {
    initialRouteName: 'Home',
  }
);

const AppContainer = createAppContainer(RootStack);

function mapStateToProps(state) {
  return {
    users: state.users.data,
    error: state.users.error
  };
}

const mapDispatchToProps = dispatch => {
  return {
    refreshUsers: (idUser) => { dispatch(fetchAllUsers(idUser)); },
    editUser: (idUser, name, surName, birtDate, phone, email) => { dispatch(updateUser({ idUser, name, surName, birtDate, phone, email })); },
    editPassword: (idUser, oldPassword, newPassword) => { dispatch(updatePassword({ idUser, oldPassword, newPassword })); },
  };
};

class App extends React.Component {
  componentWillMount() {
    this.props.refreshUsers(authenticationService.currentUserValue.id);
  }
  render() {
    return <AppContainer screenProps={{
      users: this.props.users,
      error: this.props.error,
      editUser: this.props.editUser,
      editPassword: this.props.editPassword,
      refreshUsers: this.props.refreshUsers
    }} />;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
