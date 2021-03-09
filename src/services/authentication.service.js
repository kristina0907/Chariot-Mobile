import { BehaviorSubject } from 'rxjs';
import { handleResponse } from '../helpers';
import { apiUrl } from '../actions/url';
import AsyncStorage from '@react-native-community/async-storage';
import { Alert } from 'react-native';
import translate, { setLocale } from '../translations/translations';


//Служба аутентификации используется для входа и выхода из приложения, для входа в систему она отправляет учетные данные пользователя 
//в /users/authenticate route на api, если аутентификация прошла успешно, сведения о пользователе, 
//включая токен, добавляются в локальное хранилище, а текущий пользователь устанавливается в приложении путем вызова currentUserSubject.следующий пользователь.;)

//RxJS используются для хранения текущего состояния пользователя и связи между различными компонентами приложения.
//const currentUserSubject = new BehaviorSubject(JSON.parse(AsyncStorage.getItem('currentUser')));

// async function getCurrentUserSubject(){
//     try {
//         let userData = null;
//         var currentUser = await AsyncStorage.getItem('currentUser');// разобраться
//         userDate = JSON.parse(currentUser); 
//         return userData;
//     } catch (e) {        
//         userData = null;
//         return userData;
//     }
// }

var currentUserSubject = new BehaviorSubject(null);
var isVerifyCode = true;
var codeUser = "";
var phoneError = "";
var errorPhoneUniq = "";
var language = "ru";


function setCurrentUserSubject(userSubject) {
    currentUserSubject = new BehaviorSubject(userSubject);
}

export const authenticationService = {
    setCurrentUserSubject,
    login,
    logout,
    register,
    generateConfirmationCode,
    getLanguage,
    verifyConfirmCode,
    CheckPhoneUniq,
    generateConfirmationCodeForRestoringAccess,
    currentUser: currentUserSubject.asObservable(),
    get currentUserValue() { return currentUserSubject.value },
    get isVerifyCode() { return isVerifyCode },
    get codeUser() { return codeUser },
    get phoneError() { return phoneError },
    get errorPhoneUniq() { return errorPhoneUniq },
    get language() { return language }
};

async function login(phone, password) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password })
    };

    return fetch(`${apiUrl}/auth/login`, requestOptions)
        .then(handleResponse)
        .then((user) => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes

            if (user.phoneError !== undefined) {
                if (user.phoneError.length === 1)
                    phoneError = user.phoneError[0];
                else
                    phoneError = user.phoneError;
            } else
                if (user.password !== undefined) {
                    phoneError = user.password;
                }
                else {
                    AsyncStorage.setItem('currentUser', JSON.stringify(user));
                    var currentUser = AsyncStorage.getItem('currentUser');
                    phoneError = "";
                    currentUserSubject.next(user);
                    return user;
                }
        });
}

function logout() {
    // remove user from local storage to log user out
    AsyncStorage.removeItem('currentUser');
    currentUserSubject.next(null);
}


async function register(email, password, name, surName, phone, birtDate, CodeConfirm, CodeUser) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, surName, phone, birtDate, CodeConfirm, CodeUser })
    };

    return fetch(`${apiUrl}/auth/register`, requestOptions)
        .then(handleResponse)
        .then(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            AsyncStorage.setItem('currentUser', JSON.stringify(user));
            currentUserSubject.next(user);
            return user;
        });
}

async function generateConfirmationCode(phone) {
    codeUser = uuidv4();
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codeUser, phone })
    };

    return fetch(`${apiUrl}/auth/GenerateConfirmationCode`, requestOptions)
        .then(response => response.json())
        .then(tempUser => {
            alert("Код подтверждения: " + tempUser.codeConfirm);
            //return tempUser;
        })
        .catch(error => alert('Ошибка:' + error));
}

async function generateConfirmationCodeForRestoringAccess(phone) {
    codeUser = uuidv4();
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codeUser, phone })
    };

    return fetch(`${apiUrl}/auth/GenerateConfirmationCodeForRestoringAccess`, requestOptions)
        .then(response => response.json())
        .then(tempUser => {
            if (tempUser.phoneError == "noUserWithThisPhone") {
                phoneError = "noUserWithThisPhone";
                alert("Номера не существует");
            } else {
                phoneError = "";
                alert("Код подтверждения: " + tempUser.codeConfirm);
            }
            //return tempUser;
        })
        .catch(error => alert('Ошибка:' + error));
}

async function verifyConfirmCode(codeConfirm, phone) {
    isVerifyCode = false;
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codeConfirm, codeUser, phone })
    };

    return fetch(`${apiUrl}/auth/VerifyConfirmCode`, requestOptions)
        .then(response => response.json())
        .then(tempUser => {
            if (tempUser.codeUser == "codeIsNotVerify") {
                alert("Код введен неверно");
            }
            else {
                codeUser = tempUser.codeUser;
                isVerifyCode = true;
            }
            //return tempUser;
        })
        .catch(
            error => alert('Ошибка:' + error)
        );
}

async function CheckPhoneUniq(phone) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(phone)
    };
    return fetch(`${apiUrl}/auth/checkPhoneUniq`, requestOptions)
        .then(response => response.json())
        .then(user => {
            if (user.phoneError !== undefined) {
                if (user.phoneError.length === 1)
                    errorPhoneUniq = user.phoneError[0];
                else
                    errorPhoneUniq = user.phoneError;
            }
            else {
                errorPhoneUniq = ""
            }
        });
}

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}


async function getLanguage(lang) {
    language = lang;
    setLocale(lang);
}
