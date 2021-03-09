import React from 'react';
import { TextInput, View, Text, StyleSheet, FlatList, TouchableOpacity, SectionList, Platform, RefreshControl, ActivityIndicator,Alert } from 'react-native';
import { Button, Subheader, Icon } from 'react-native-material-ui'
import { createAppContainer, createStackNavigator } from 'react-navigation';
import { connect } from 'react-redux';
import { fetchAllTransactions } from '../actions/transaction';
import { depositAccount, fetchAllUsers } from '../actions/user';
import { authenticationService } from '../services';
import Moment from 'moment';
import * as Progress from 'react-native-progress';
import { ScrollView } from 'react-native-gesture-handler';
import translate from '../translations/translations';
import Header from '../Components/Header'




const styles = StyleSheet.create({
  indicator: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100
  },
  fine: {
    backgroundColor: "red"
  },
  admission: {
    backgroundColor: "#0099ff"
  },
  bonus: {
    backgroundColor: "#29fd08"
  },
  writeOff: {
    backgroundColor: "#ff6600"
  },
  content: {
    backgroundColor: '#f9f9f9',
    flex: 1,
    paddingBottom: 25,
    paddingTop:70
  },
  item: { 
    backgroundColor: '#f9f9f9',
    // marginLeft: 25,
    // marginRight: 25,
    borderRadius: 10,
    padding: 15,
    width: '90%',
    alignItems: 'center',
  },
  itemDate: {
    // borderBottomColor: '#d1d5da',
    // borderBottomWidth: 0.5,
    padding: 10,
    backgroundColor:"#ffffff",
    marginTop:20,
    marginBottom:20
  },
  itemScore: {
    // marginLeft: 25,
    // marginRight: 25,
    //padding: 15,
  },
  itemBalanc: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginTop: 20,
    backgroundColor: '#ff6600',
    padding: 15,
    shadowOpacity: 0.75,
    shadowRadius: 1,
    shadowColor: 'gray',
    shadowOffset: { height: 0, width: 0 }
  },
  containerPanel: {
    top: 25
  },
  margTop: {
    top: 30
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
  buttonControl: {
    backgroundColor: "#ff7c5c"
  },
  tableHead: {
    backgroundColor: "#fff6b2",
  },
  controlPanel: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'center',
    paddingLeft: 10,
  },
  bottonControl: {
    marginRight: 15,
    color: 'red'
  },
  text: {
    textAlign: 'center',
    fontSize: 15
  },
  row: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    marginBottom: 10
  },
  box: {
    flex: 1,
    height: 40,
    alignItems: 'center',
    alignSelf: 'stretch'
  },
  boxleft: {
    alignItems: 'flex-start',
  },
  tableHead: {
    backgroundColor: '#fff6b2',
  },
  tableCell: {
    flex: 1,
    flexDirection: 'row',
    // alignItems: 'stretch',
    justifyContent: 'flex-start',
    padding:15
  },
  button: {
    marginTop: 20,
    height: 50,
    backgroundColor: '#0099ff',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: 300,
    borderRadius: 10,
  },
});




class HomeScreen extends React.Component {
  state = {
    account: '',
    refresh: false,
    refreshing: false
  };
  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener("didFocus", () => {
      this.props.screenProps.refreshTransactions(authenticationService.currentUserValue.id);
      this.props.screenProps.refreshUsers(authenticationService.currentUserValue.id);
    });
  }

  componentWillUnmount() {
    this.focusListener.remove();
  }

  onRefresh() {
    this.setState({ refreshing: true });
    this.props.screenProps.refreshTransactions(authenticationService.currentUserValue.id);
    this.props.screenProps.refreshUsers(authenticationService.currentUserValue.id);
    this.setState({ refreshing: false });
  }
  render() {
    return (
      <View style={styles.content}>
        <ScrollView refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh.bind(this)}
            tintColor="#0099ff"
            colors={["#0099ff"]}
          />
        }>
          {this.props.screenProps.transactions == 'noTransactions' ? (
            <View>
              <View style={styles.itemBalanc}>
                <View style={{ width: '90%' }}>
                  {
                    this.props.screenProps.users.map(function (item) {
                      return (
                        <Text key={item.idUser} style={{ color: '#fff', alignSelf: 'flex-start', fontSize: 20 }}>Р {item.accountBalance}</Text>
                      );
                    })
                  }
                </View>
                <TouchableOpacity style={{ alignSelf: 'flex-end', width: '10%' }} onPress={() => this.props.navigation.navigate('Replenish', { refresh: this.refresh })}>
                  <View style={{
                    backgroundColor:
                      '#ffffff', justifyContent: 'center',
                    alignItems: 'center', borderRadius: 10, padding: 5
                  }}>
                    <Text style={{
                      fontSize: 16,
                      color: '#ff6600',
                    }}>
                      +</Text>
                  </View>
                </TouchableOpacity>

              </View>
                  <Text style={{ marginLeft: 25, marginTop: 30 }}>{translate("noPayments")}</Text>
            </View>
          ) :
            this.props.screenProps.transactions.length == 0 ? (
              <View style={styles.margTop, styles.indicator}>
                <ActivityIndicator size="large" color="#0099ff" />
              </View>
            ) : (
                <View>
                  <View style={styles.itemBalanc}>
                    <View style={{ width: '90%' }}>
                      {
                        this.props.screenProps.users.map(function (item) {
                          return (
                            <Text key={item.idUser} style={{ color: '#ffffff', alignSelf: 'flex-start', fontSize: 20 }}>{translate("balance")}: {item.accountBalance}</Text>
                          );
                        })
                      }
                    </View>
                    <TouchableOpacity style={{ alignSelf: 'flex-end', width: '10%' }} onPress={() => this.props.navigation.navigate('Replenish', { refresh: this.refresh })}>
                      <View style={{
                        backgroundColor:
                          '#ffffff', justifyContent: 'center',
                        alignItems: 'center', borderRadius: 10, padding: 5
                      }}>
                        <Text style={{
                          fontSize: 16,
                          color: '#ff6600',
                        }}>
                          +</Text>
                      </View>
                    </TouchableOpacity>

                  </View>
                  {this.props.screenProps.transactions != null ?
                    <FlatList
                      style={{ width: '100%' }}
                      keyExtractor={item => item.date}
                      data={this.props.screenProps.transactions}
                      renderItem={({ item, index }) => (
                        <View style={styles.itemScore}>
                          {/* {index == 0 || Moment(this.props.screenProps.transactions[index].date).format('DD.MM.YY') !== Moment(this.props.screenProps.transactions[index - 1].date).format('DD.MM.YY') ? (
                            <View style={styles.itemDate}><Text style={{ color:"#0099ff", fontSize: 16, fontWeight: 'bold' }}>{Moment(item.date).format('DD.MM.YY')}</Text></View>
                          ) : (
                              <View />
                            )
                          } */}
                          <View style={[styles.tableCell]}>
                            <View style={[styles.box, styles.boxleft]}>
                              {(() => {
                                switch (item.transactionType) {
                                  case 'Штраф':
                                    return (
                                      <View style={[styles.iconContainer, styles.fine]}><Icon size={24} color='#ffffff' name="close" /></View>
                                    )
                                    break;
                                  case 'Поступление ДС':
                                    return <View style={[styles.iconContainer, styles.admission]}><Icon size={24} color='#ffffff' name="done" /></View>
                                    break;
                                  case 'Бонус':
                                    return <View style={[styles.iconContainer, styles.bonus]}><Icon size={24} color='#ffffff' name="star" /></View>
                                    break;
                                  case 'Списание ДС':
                                    return <View style={[styles.iconContainer, styles.writeOff]}><Icon size={24} color='#ffffff' name="remove" /></View>
                                    break;
                                }
                              })()}

                            </View>
                            <View style={[styles.box, styles.boxleft]}>
                              <Text style={{ fontSize: 15, fontWeight: 'bold' }}>
                              {(() => {
                                switch (item.transactionType) {
                                  case 'Штраф':
                                    return (
                                      translate("fine")
                                    )
                                    break;
                                  case 'Поступление ДС':
                                    return  translate("cashInflow")
                                    break;
                                  case 'Бонус':
                                    return  translate("bonus")
                                    break;
                                  case 'Списание ДС':
                                    return  translate("cashWithdrawal")
                                    break;
                                }
                              })()}
                                </Text>
                              <Text style={{ color: 'grey', fontSize: 13 }}>{Moment(item.date).format('DD.MM.YY HH:mm')}</Text>
                            </View>
                            <View style={[styles.box]}><Text>{item.amount}</Text></View>
                          </View>
                        </View>

                      )}
                      ItemSeparatorComponent={() => <View style={styles.separator} />}
                    />
                    : null}
                </View>
              )}
        </ScrollView>
      </View>
    );
  }
}

class ReplenishScreen extends React.Component {
  state = {
    account: '',
  };
  onChanged(text) {
    let newText = '';
    let numbers = '0123456789';

    for (var i = 0; i < text.length; i++) {
      if (numbers.indexOf(text[i]) > -1) {
        newText = newText + text[i];
      }
      else {
        // your call back function
        Alert.alert(translate("error"),translate("onlyNumbers"));
      }
    }
    this.setState({ account: newText });
  }
  replenish() {
    //const refresh = this.props.navigation.getParam('refresh', () => {});
    this.props.screenProps.refreshAccount(authenticationService.currentUserValue.id, this.state.account);
    this.setState({
      account: ''
    });
    this.props.navigation.goBack(null);
    //refresh();

  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ padding: 10, marginTop: (Platform.OS) === 'ios' ? 20 : 0 }}>
          <TextInput
            style={styles.input}
            placeholder={translate("amount")}
            keyboardType='numeric'
            value={this.state.account}
            onChangeText={(text) => this.onChanged(text)}
          />
          <TouchableOpacity onPress={this.replenish.bind(this)}>
            <View style={styles.button}>
              <Text style={{
                fontSize: 16,
                color: '#ffffff',
              }}>
                {translate("save")}</Text>
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
      screen: props => <HomeScreen {...props} />,
      navigationOptions: {
        header: null,
        headerBackTitle: null
      },
    },
    Replenish: {
      screen: props => <ReplenishScreen {...props} />,
      navigationOptions: {
        title:  translate("replenishAccount"),
        header: props => <Header {...props} title={translate("replenishAccount")} />,
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
    transactions: state.transactions
  };
}

const mapDispatchToProps = dispatch => {
  return {
    refreshTransactions: (idUser) => { dispatch(fetchAllTransactions(idUser)); },
    refreshAccount: (idUser, depositAmount) => { dispatch(depositAccount({ idUser, depositAmount })); },
    refreshUsers: (idUser) => { dispatch(fetchAllUsers(idUser)); },
  };
};

class App extends React.Component {
  componentWillMount() {
    this.props.refreshTransactions(authenticationService.currentUserValue.id);
    this.props.refreshUsers(authenticationService.currentUserValue.id);
  }
  render() {
    return <AppContainer screenProps={{
      transactions: this.props.transactions,
      refreshTransactions: this.props.refreshTransactions,
      refreshAccount: this.props.refreshAccount,
      users: this.props.users,
      refreshUsers: this.props.refreshUsers
    }} />;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);