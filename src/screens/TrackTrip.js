import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchAllTrackCoordinates } from '../actions/track';
import { createTrip, extendTrip, completeTrip } from '../actions/trip';
import TrackMap from '../Components/TrackMap';
import { TextInput, View, Text, StyleSheet, TouchableHighlight, TouchableWithoutFeedback, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Button, Subheader, Icon } from 'react-native-material-ui'
import { createAppContainer, createStackNavigator, StackActions, NavigationActions } from 'react-navigation';
import NumericInput from 'react-native-numeric-input';
import { authenticationService } from '../services';
import Moment from 'moment';
import Modal from "react-native-modal";
import { Images } from '../images/images';
import { CachedImage } from 'react-native-cached-image';
import Dimensions from 'Dimensions';
import translate from '../translations/translations';



function charging(level) {
    if (level <= 100 && level >= 50) {
        return (
            <Text style={{ backgroundColor: '#29fd08', padding: 5, paddingLeft: 10, paddingRight: 10, alignSelf: 'flex-start', color: '#ffffff', borderRadius: 10, marginTop: 10, fontSize: 13, marginBottom: 10 }}>{translate("charge")}: {level} %</Text>
        )
    } else if (level <= 49 && level >= 30) {
        return (
            <Text style={{ backgroundColor: '#fba14c', padding: 5, paddingLeft: 10, paddingRight: 10, alignSelf: 'flex-start', color: '#ffffff', borderRadius: 10, marginTop: 10, fontSize: 13, marginBottom: 10 }}>{translate("charge")}: {level} %</Text>)
    } else if (level <= 29) {
        return (
            <Text style={{ backgroundColor: '#fb4c4c', padding: 5, paddingLeft: 10, paddingRight: 10, alignSelf: 'flex-start', color: '#ffffff', borderRadius: 10, marginTop: 10, fontSize: 13, marginBottom: 10 }}>{translate("charge")}: {level} %</Text>)
    }
}
function chargingTrip(level) {
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

class HomeScreen extends Component {
    state = {
        isModalVisible: false,
    };
    statysTrip(dateFinish, isRentEnds, isForsaken) {
        if (dateFinish !== null) {
            return (
                <Text style={{ marginBottom: 10, fontSize: 13 }}>{translate("tripCompleted")}</Text>
            )
        } else if (isRentEnds) {
            return (
                <Text style={{ backgroundColor: '#fb4c4c', padding: 5, paddingLeft: 10, paddingRight: 10, alignSelf: 'flex-start', color: '#ffffff', borderRadius: 10, fontSize: 13 }}>{translate("fineRide")}</Text>)
        } else if (isForsaken) {
            return (
                <Text style={{ backgroundColor: '#fba14c', padding: 5, paddingLeft: 10, paddingRight: 10, alignSelf: 'flex-start', color: '#ffffff', borderRadius: 10, fontSize: 13 }} >{translate("rideThrown")}</Text>)
        } else {
            return (
                <Text style={{ backgroundColor: '#0099ff', padding: 5, paddingLeft: 10, paddingRight: 10, alignSelf: 'flex-start', color: '#ffffff', borderRadius: 10, fontSize: 13 }}>{translate("driveActive")}</Text>)
        }
    }
    toggleModal = () => {
        this.setState({ isModalVisible: !this.state.isModalVisible });
    }
    render() {
        return (
            <View style={styles.container}>
                <TrackMap tracks={this.props.screenProps.tracks} />
                <View>
                    <Modal
                        isVisible={this.state.isModalVisible}
                        onSwipeComplete={() => this.setState({ isModalVisible: false })}
                        swipeDirection={['up']}
                    >
                        <View style={styles.content}>
                            {this.statysTrip(this.props.screenProps.dateFinish, this.props.screenProps.isRentEnds, this.props.screenProps.isforsaken)}
                            <View style={[styles.tableCell]}>
                                <View style={[styles.box, styles.boxleft]}>
                                    <View style={styles.callTrip}>
                                        {this.props.screenProps.dateFinish == null && !this.props.screenProps.isforsaken ? (

                                            <React.Fragment>
                                                {charging(this.props.screenProps.chargeLevel)}
                                            </React.Fragment>
                                        ) : (
                                                <React.Fragment />
                                            )}
                                        <Text style={{ fontSize: 13 }}>{translate("duration")}:</Text>
                                        <Text style={{ fontSize: 13, marginBottom: 10 }}>{this.props.screenProps.durationPay} {translate("minutes")}</Text>
                                        <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#0099ff' }}>{translate("cost")}: {this.props.screenProps.amountPay}</Text>

                                    </View>
                                    <View style={[styles.tableCell]}>
                                        <View style={[styles.iconBox]}>
                                            <View><Icon name="lens" size={14} color='#0099ff' /></View>
                                            <View style={styles.line}><Text style={{ color: '#0099ff' }}>|</Text><Text style={{ color: '#0099ff' }}>|</Text></View>
                                            <View><Icon name="lens" size={14} color='#0099ff' /></View>
                                        </View>
                                        <View style={[styles.box, styles.leftbox]}>
                                            <View style={styles.itemDate}>
                                                <Text style={{ fontSize: 12 }}>{translate("dateBeginning")}: </Text>
                                                <Text style={{ fontSize: 12 }}>{Moment(this.props.screenProps.dateStart).format('DD.MM.YY HH:mm')} </Text>

                                                {this.props.screenProps.dateFinish !== null ? (
                                                    <View style={{ marginTop: 20 }}>
                                                        <Text style={{ fontSize: 12 }}>{translate("expirationDate")}: </Text>
                                                        <Text style={{ fontSize: 12 }}>{Moment(this.props.screenProps.dateFinish).format('DD.MM.YY HH:mm')}</Text>
                                                    </View>

                                                ) : (
                                                        <Text />
                                                    )}</View>
                                        </View>
                                    </View>
                                </View>
                                <View style={[styles.box, styles.boxright]}>
                                    {(() => {
                                        switch (this.props.screenProps.metType) {
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
                                    <Text style={{ marginTop: 5 }}>
                                        {(() => {
                                            switch (this.props.screenProps.metType) {
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
                                    <Text style={{ fontWeight: 'bold', marginTop: 5, fontSize: 10 }}>{this.props.screenProps.number}</Text>
                                </View>
                            </View>
                        </View>
                    </Modal>
                    <View style={styles.allNonMapThings}>
                        <View style={styles.topBottonInfo} >
                            <TouchableOpacity
                                style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center' }}
                                onPress={this.toggleModal}
                            >
                                <Icon name='info' />
                                <Text style={styles.infoText} >
                                    {translate("travelInformation")}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {
                        this.props.screenProps.dateFinish == null ? (
                            <View style={styles.allNonMapThings}>
                                <View style={styles.buttonUpdateMap} >
                                    <TouchableOpacity
                                        onPress={() => this.props.navigation.navigate('Сomplete')}
                                    >
                                        <View style={styles.buttonContent}>
                                            <Text style={styles.buttonText}>
                                                {translate("complete")}</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                {!this.props.screenProps.isforsaken ? (
                                    <View style={[styles.buttonUpdateMap, styles.buttonUpdateMap1]} >
                                        <TouchableOpacity
                                            onPress={() => this.props.navigation.navigate('Rent')}
                                        ><View style={styles.buttonContent}>
                                                <Text style={styles.buttonText}>
                                                    {translate("extend")}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                        <View />
                                    )}
                            </View>
                        ) : (
                                <View />
                            )
                    }
                </View >
            </View>
        );
    }
}

class СompleteScreen extends React.Component {
    state = {
        idChariot: '',
        idUser: '',
    };
    swipUp() {
        this.setState({ isModalVisible: false });
        this.props.navigation.dispatch(
            StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'Home' })],
            })
        );
    }
    componentWillMount() {
        this.setState({
            idChariot: this.props.screenProps.idChariot,
            idUser: authenticationService.currentUserValue.id
        });
    }
    componentWillReceiveProps(newProps) {
        if (newProps.screenProps.error !== null && this.props.screenProps.error !== newProps.screenProps.error) {
            if (newProps.screenProps.error.data == 'notEnoughCash') {
                this.setState({ isModalVisible: !this.state.isModalVisible, errorTrip: "Суммы вашего баланса недостаточно" });
            } else if (newProps.screenProps.error.data == 'transactionError') {
                this.setState({ isModalVisible: !this.state.isModalVisible, errorTrip: "Ошибка транзакции" });
            } else if (newProps.screenProps.error.data == 'userError') {
                this.setState({ isModalVisible: !this.state.isModalVisible, errorTrip: "Ошибка пользователя" });
            } else if (newProps.screenProps.error.data == 'commandIsNotRecorded') {
                this.setState({ isModalVisible: !this.state.isModalVisible, errorTrip: "Команда не записывается" });
            } else if (newProps.screenProps.error.data == 'alreadyRent') {
                this.setState({ isModalVisible: !this.state.isModalVisible, errorTrip: "МЭТ в аренде у другого пользователя " });
            } else if (newProps.screenProps.error.data == 'notEnoughToExtend') {
                this.setState({ isModalVisible: !this.state.isModalVisible, errorTrip: "Минимальное время аренды не соответствует интервалу " });
            } else if (newProps.screenProps.error.data == 'noCoordinates') {
                this.setState({ isModalVisible: !this.state.isModalVisible, errorTrip: "Не удается найти станцию поблизости! Если вы находитесь на станции, сдайте МЭТ в слот или обратитесь в техподдержку" });
            } else if (newProps.screenProps.error.data == 'commandIsNotRecorded') {
                this.setState({ isModalVisible: !this.state.isModalVisible, errorTrip: "Команда не записывается" });
            } else if (newProps.screenProps.error.data == 'connectToTheStation') {
                this.setState({ isModalVisible: !this.state.isModalVisible, errorTrip: "Подключитесь к станции" });
            } else if (newProps.screenProps.error.data == 'outsideTheZone') {
                this.setState({ isModalVisible: !this.state.isModalVisible, errorTrip: "Вне зоны" });
            } else if (newProps.screenProps.error.data == 'completeIsNotAvailable') {
                this.setState({ isModalVisible: !this.state.isModalVisible, errorTrip: "Поездка завершена, для аренды МЭТ отсканируйте код повторно" });
            } else if (newProps.screenProps.error.data == 'rentError') {
                this.setState({ visibleModal: null, errorTrip: "Ошибка аренды!" });
            } else if (newProps.screenProps.error.data == 'extendError') {
                this.setState({ visibleModal: null, errorTrip: "Ошибка продления!" });
            } else if (newProps.screenProps.error.data == 'completeError') {
                this.setState({ visibleModal: null, errorTrip: "Ошибка дезактивации" });
            } else if (newProps.screenProps.error.data == 'skanChariot') {
                this.setState({ isModalVisible: false });
            } else if (newProps.screenProps.error.data === null) {
                //this.props.screenProps.refreshTransactions(authenticationService.currentUserValue.id);
                newProps.navigation.dispatch(
                    StackActions.reset({
                        index: 0,
                        actions: [NavigationActions.navigate({ routeName: 'Home' })],
                    })
                );
                setTimeout(() => { this.props.screenProps.back() }, 3000)
            }
        }
    }
    deliverChariot(data) {
        this.props.screenProps.onCompleteTrip(data);
        //this.props.screenProps.back();
    }
    render() {
        return (
            <View style={styles.contentRent}>
                <Modal
                    isVisible={this.state.isModalVisible}
                    onSwipeComplete={() => this.swipUp()}
                    swipeDirection={['up']}
                >
                    <View style={styles.contentModal}>
                        <Text style={styles.contentTitle}>{this.state.errorTrip}</Text>
                        <TouchableOpacity
                            onPress={() => this.swipUp()}
                            style={styles.button1}>
                            <Text style={{ color: '#FFF', fontSize: 16 }}>
                                Ок
                  </Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
                <View style={styles.itemRent}>
                    <View>
                        {(() => {
                            switch (this.props.screenProps.metType) {
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
                    <View style={[styles.newtableCell]}>
                        <View style={[styles.newbox, styles.newboxleft]}>
                            <Text style={{ marginBottom: 5 }}>{translate("typeTransport")}:</Text>
                            <Text style={{ marginBottom: 15, fontWeight: 'bold' }}>
                                {(() => {
                                    switch (this.props.screenProps.metType) {
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
                            <Text style={{ marginBottom: 15, fontWeight: 'bold' }}>{this.props.screenProps.number}</Text>
                        </View>
                        <View style={[styles.newbox, styles.newboxright]}>
                            <Text style={{ marginBottom: 5 }}>{translate("charge")}:</Text>
                            {chargingTrip(this.props.screenProps.chargeLevel)}
                        </View>
                    </View>
                </View>
                <TouchableOpacity onPress={() => this.deliverChariot(this.state)}>
                    <View style={styles.button}>
                        <Text style={{
                            fontSize: 16,
                            color: '#ffffff',
                        }}>
                            {translate("handOver")}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                    <View style={styles.button}>
                        <Text style={{
                            fontSize: 16,
                            color: '#ffffff',
                        }}>
                            {translate("back")} </Text>
                    </View>
                </TouchableOpacity>

            </View>
        );
    }
}


class RentScreen extends React.Component {
    state = {
        amountPay: 0,
        durationPay: this.props.screenProps.tarifInterval,
        idChariot: '',
        idUser: '',
        isModalVisible: false,
        errorTrip: '',
    };
    handleInputChange = e => {
        this.setState({
            amountPay: (e * this.props.screenProps.tarifPrice) / this.props.screenProps.tarifInterval,
            durationPay: e
        });
    };

    componentWillMount() {
        this.setState({
            amountPay: (this.props.screenProps.tarifInterval * this.props.screenProps.tarifPrice) / this.props.screenProps.tarifInterval,
            idChariot: this.props.screenProps.idChariot,
            idUser: authenticationService.currentUserValue.id,
        });
    }
    componentWillReceiveProps(newProps) {
        if (newProps.screenProps.error !== null && this.props.screenProps.error !== newProps.screenProps.error) {
            if (newProps.screenProps.error.data == 'notEnoughCash') {
                this.setState({ visibleModal: null, errorTrip: "Суммы вашего баланса недостаточно" });
            } else if (newProps.screenProps.error.data == 'transactionError') {
                this.setState({ visibleModal: null, errorTrip: "Ошибка транзакции" });
            } else if (newProps.screenProps.error.data == 'userError') {
                this.setState({ visibleModal: null, errorTrip: "Ошибка пользователя" });
            } else if (newProps.screenProps.error.data == 'commandIsNotRecorded') {
                this.setState({ visibleModal: null, errorTrip: "Команда не записывается" });
            } else if (newProps.screenProps.error.data == 'alreadyRent') {
                this.setState({ visibleModal: null, errorTrip: "МЭТ в аренде у другого пользователя " });
            } else if (newProps.screenProps.error.data == 'notEnoughToExtend') {
                this.setState({ visibleModal: null, errorTrip: "Минимальное время аренды не соответствует интервалу " });
            } else if (newProps.screenProps.error.data == 'noCoordinates') {
                this.setState({ visibleModal: null, errorTrip: "Не удается найти станцию поблизости! Если вы находитесь на станции, сдайте МЭТ в слот или обратитесь в техподдержку" });
            } else if (newProps.screenProps.error.data == 'commandIsNotRecorded') {
                this.setState({ visibleModal: null, errorTrip: "Команда не записывается" });
            } else if (newProps.screenProps.error.data == 'connectToTheStation') {
                this.setState({ visibleModal: null, errorTrip: "Подключитесь к станции" });
            } else if (newProps.screenProps.error.data == 'outsideTheZone') {
                this.setState({ visibleModal: null, errorTrip: "Вне зоны" });
            } else if (newProps.screenProps.error.data == 'rentError') {
                this.setState({ visibleModal: null, errorTrip: "Ошибка аренды!" });
            } else if (newProps.screenProps.error.data == 'extendError') {
                this.setState({ visibleModal: null, errorTrip: "Ошибка продления!" });
            } else if (newProps.screenProps.error.data == 'completeError') {
                this.setState({ visibleModal: null, errorTrip: "Ошибка дезактивации" });
            } else if (newProps.screenProps.error.data == 'skanChariot') {
                this.setState({ isModalVisible: false });
            } else if (newProps.screenProps.error.data === null) {
                //this.props.screenProps.refreshTransactions(authenticationService.currentUserValue.id);
                newProps.navigation.dispatch(
                    StackActions.reset({
                        index: 0,
                        actions: [NavigationActions.navigate({ routeName: 'Home' })],
                    })
                );
                setTimeout(() => { this.props.screenProps.back() }, 3000)
            }
        }
    }
    extendChariot(data) {
        this.props.screenProps.onExtendTrip(data);
        //this.props.screenProps.back();
    }
    swipUp() {
        this.setState({ isModalVisible: false });
        this.props.navigation.dispatch(
            StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'Home' })],
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
        return (
            <View style={styles.contentRent}>
                <Modal
                    isVisible={this.state.isModalVisible}
                    onSwipeComplete={() => this.swipUp()}
                    swipeDirection={['up']}
                >
                    <View style={styles.contentModal}>
                        <Text style={styles.contentTitle}>{this.state.errorTrip}</Text>
                        <TouchableOpacity
                            onPress={() => this.swipUp()}
                            style={styles.button1}>
                            <Text style={{ color: '#FFF', fontSize: 16 }}>
                                Ок
                  </Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
                <View style={styles.itemRent}>
                    <View>
                        {(() => {
                            switch (this.props.screenProps.metType) {
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
                    <View style={[styles.newtableCell]}>
                        <View style={[styles.newbox, styles.newboxleft]}>
                            <Text style={{ marginBottom: 5 }}>{translate("typeTransport")}:</Text>
                            <Text style={{ marginBottom: 15, fontWeight: 'bold' }}>
                                {(() => {
                                    switch (this.props.screenProps.metType) {
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
                            <Text style={{ marginBottom: 15, fontWeight: 'bold' }}>{this.props.screenProps.number}</Text>
                        </View>
                        <View style={[styles.newbox, styles.newboxright]}>
                            <Text style={{ marginBottom: 5 }}>{translate("charge")}:</Text>
                            {chargingTrip(this.props.screenProps.chargeLevel)}
                        </View>
                    </View>
                </View>
                <TouchableOpacity
                    onPress={() => this.setState({ visibleModal: 'rent' })}
                    style={styles.button}>
                    <Text style={{ color: '#FFF', fontSize: 16 }}>
                        {translate("rent")}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                    <View style={styles.button}>
                        <Text style={{
                            fontSize: 16,
                            color: '#ffffff',
                        }}>
                            {translate("back")}</Text>
                    </View>
                </TouchableOpacity>
                <Modal
                    isVisible={this.state.visibleModal === 'rent'}
                    onSwipeComplete={() => this.setState({ visibleModal: null })}
                    onModalHide={() => this.onCloseModal()}
                    swipeDirection={['up']}
                >
                    <View style={styles.contentModal}>
                        <View style={{ alignItems: 'flex-end', alignContent: 'flex-end', width: '100%', marginBottom: 15 }}>
                            <TouchableOpacity
                                onPress={() => this.setState({ visibleModal: null })}
                                style={{ alignItems: 'flex-end', alignContent: 'flex-end', width: 50, }}>
                                <CachedImage style={{ width: 36, height: 36 }} source={Images['close']} fallbackSource={Images['close']} />
                            </TouchableOpacity>
                        </View>
                        <Text style={{ fontSize: 15, marginBottom: 25, color: '#0099ff', fontWeight: 'bold' }}>{translate("enterTime")}</Text>
                        <NumericInput
                            value={this.state.durationPay}
                            onChange={this.handleInputChange}
                            onLimitReached={(isMax, msg) => console.log(isMax, msg)}
                            totalWidth={180}
                            totalHeight={40}
                            iconSize={25}
                            step={this.props.screenProps.tarifInterval}
                            minValue={this.props.screenProps.tarifInterval}
                            maxValue={9999}
                            editable={false}
                            valueType='real'
                            rounded
                            textColor='#a6a19e'
                            borderColor="#ffffff"
                            iconStyle={{ color: 'white' }}
                            rightButtonBackgroundColor='#0099ff'
                            leftButtonBackgroundColor='#0099ff' />
                        <Text style={{ fontSize: 15, marginTop: 25, color: '#a6a19e' }}>{translate("cost")}: {this.state.amountPay}</Text>
                        <TouchableOpacity onPress={() =>
                            this.extendChariot(this.state)}>
                            <View style={styles.button}>
                                <Text style={{
                                    fontSize: 16,
                                    color: '#ffffff',
                                }}>
                                    {translate("rent")}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </Modal>


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
                headerLeft: null,
                gesturesEnabled: false,
                headerVisible: false,
                headerBackTitle: null
            },
        },
        Сomplete: {
            screen: props => <СompleteScreen {...props} />,
            navigationOptions: {
                header: null,
                headerLeft: null,
                gesturesEnabled: false,
                headerVisible: false,
                headerBackTitle: null
            },
        },
        Rent: {
            screen: props => <RentScreen {...props} />,
            navigationOptions: {
                header: null,
                headerLeft: null,
                gesturesEnabled: false,
                headerVisible: false,
                headerBackTitle: null
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
        tracks: state.tracks,
        error: state.trips.error
    };
}

const mapDispatchToProps = dispatch => {
    return {
        getTrackCoordinates: (idTrip) => { dispatch(fetchAllTrackCoordinates(idTrip)); },
        onAddTrip: trip => { dispatch(createTrip(trip)); },
        onExtendTrip: trip => { dispatch(extendTrip(trip)); },
        onCompleteTrip: trip => { dispatch(completeTrip(trip)); }
    }
};



class App extends React.Component {
    componentWillMount() {
        this.props.getTrackCoordinates(this.props.navigation.getParam('idTrip', 'NO-ID'));
    }
    render() {
        return (
            <AppContainer screenProps={{
                tracks: this.props.tracks,
                durationPay: this.props.navigation.getParam('durationPay'),
                metType: this.props.navigation.getParam('metType'),
                number: this.props.navigation.getParam('number'),
                idChariot: this.props.navigation.getParam('idChariot'),
                tarifPrice: this.props.navigation.getParam('tarifPrice'),
                tarifInterval: this.props.navigation.getParam('tarifInterval'),
                dateFinish: this.props.navigation.getParam('dateFinish'),
                dateStart: this.props.navigation.getParam('dateStart'),
                amountPay: this.props.navigation.getParam('amountPay'),
                isforsaken: this.props.navigation.getParam('isforsaken'),
                isRentEnds: this.props.navigation.getParam('isRentEnds'),
                onAddTrip: this.props.onAddTrip,
                onExtendTrip: this.props.onExtendTrip,
                onCompleteTrip: this.props.onCompleteTrip,
                back: this.props.navigation.getParam('back'),
                error: this.props.error,
                chargeLevel: this.props.navigation.getParam('chargeLevel'),
            }}></AppContainer>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(App);
// export default (App);


const styles = StyleSheet.create({
    line: {
        paddingLeft: 5
    },
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    button: {
        // backgroundColor: '#2979FF',
        // alignItems: 'center',
        // padding: 12,
        // width: 300,
        marginTop: 20,
        height: 50,
        backgroundColor: '#0099ff',
        justifyContent: 'center',
        alignItems: 'center',
        width: 200,
        borderRadius: 10,
    },
    buttonContent: {
        backgroundColor: '#0099ff',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        height: 40,
        width: 200,
    },
    newbox: {
        flex: 1,
        // height: 40,
        alignItems: 'center',
        alignSelf: 'stretch'
    },
    newboxleft: {
        // borderRightColor: '#56b0f7',
        // borderRightWidth: 1,
        alignContent: 'flex-start',
        alignItems: 'flex-start',
        // justifyContent: "center",
    },
    newboxright: {
        alignItems: 'flex-start',
        paddingLeft: 35,
    },
    newtableCell: {
        marginTop: 30,
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'stretch',
        justifyContent: "space-between",
    },
    newImage: {
        width: 80,
        height: 80,
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
    contentRent: {
        backgroundColor: '#f9f9f9',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
    itemRent: {
        backgroundColor: '#ffffff',
        marginLeft: 25,
        marginRight: 25,
        borderRadius: 10,
        padding: 15,
        width: '90%',
        alignItems: 'center',
        shadowOpacity: 0.75,
        shadowRadius: 1,
        shadowColor: 'gray',
        shadowOffset: { height: 3, width: 0 },
        elevation: 7
    },
    content: {
        height: 280,
        backgroundColor: 'white',
        padding: 20,
        // justifyContent: 'center',
        // alignItems: 'center',
        borderRadius: 10,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    Image: {
        width: 30,
        height: 30
    },
    btnImage: {
        width: 80,
        height: 80
    },
    metType: {
        alignItems: 'center',
    },
    headInfo: {
        borderBottomColor: '#d1d5da',
        borderBottomWidth: 0.5,
        paddingTop: 5,
        paddingBottom: 10,
        flexDirection: 'row',
    },
    bottomInfo: {
        elevation: 1,
        position: 'absolute',
        bottom: 15,
        backgroundColor: '#ffffff',
        width: '90%',
        borderRadius: 10,
        padding: 15,
        alignSelf: "center",
    },
    topBottonInfo: {
        elevation: 1,
        position: 'absolute',
        top: 100,
        right: 0,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        width: 200,
        padding: 10,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    allNonMapThings: {
        height: '100%',
        width: '100%',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'center',
        flex: 1,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        alignSelf: 'center'
    },
    infoText: {
        color: '#000000',
        marginTop: 3,
        marginLeft: 5,
    },
    buttonUpdateMap: {
        //elevation: 1,
        position: 'absolute',
        top: Dimensions.get('window').height - 100,
        borderRadius: 10,
        width: '60%',
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonUpdateMap1: {
        top: Dimensions.get('window').height - 155,
    },
    durationPay: {
        backgroundColor: "#f1f8fe",
        padding: 8,
        marginBottom: 10
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
        padding: 8,
        width: '100%'
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
    row: {
        flexDirection: 'column',
        alignItems: 'stretch',
        height: 40,
        marginBottom: 10
    },
    tableHead: {
        backgroundColor: "#fff6b2"
    },
    controlPanel: {
        flex: 1,
        flexDirection: 'row',
        // alignItems: 'stretch',
        // justifyContent: 'flex-start',
        marginBottom: 25
    },
    bottonControl: {
        marginRight: 15,
        color: 'red'
    },
    text: {
        textAlign: 'center',
        fontSize: 15
    },
    callTrip: {
        // borderBottomColor: '#d1d5da',
        // borderBottomWidth: 0.5,
        paddingTop: 5,
        paddingBottom: 10,
        // marginBottom: 10
    },
    leftbox: {
        alignItems: 'flex-start',
    },
    rightbox: {
        alignItems: 'center',
        alignSelf: 'flex-end',
        width: 100,
    },
    boxright: {
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center'
    },
    tableHead: {
        backgroundColor: '#fff6b2',
    },
    tableCell: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'stretch',
        justifyContent: 'space-between',
        alignContent: "space-between",
    },
    iconBox: {
        width: 30
    },
    box: {
        flex: 2,
    },
    itemDate: {
        paddingBottom: 10
    },
});
