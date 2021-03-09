import { apiUrl, hubUrl, hubMessageUrl } from './url';
import { authenticationService } from '../services';
const signalR = require("@aspnet/signalr");


export const messageRecipient = () => {
    let connection = new signalR.HubConnectionBuilder()
        .withUrl(hubUrl)
        .build();
   
    connect(connection);
    connection.onclose(function (e) {
        connect(connection);
    });
};

async function connect(connection) {
    connection.start().catch(err => {
        sleep(5000).then(() => {
            console.log("Reconnecting Socket");
            connect(connection)
            //console.log(err)
        })       
        }
    );
    connection.on("messageReceived", (message, idUsers) => {
        if (authenticationService != null) {
            if (idUsers != "" && idUsers != null) {
                var usersArray = idUsers.split(",");
                var a = authenticationService.currentUserValue.id.toString();
                if (usersArray.indexOf(a) != -1)
                    alert(message);
            }
        }
    });
}

async function sleep(msec) {
    return new Promise(resolve => setTimeout(resolve, msec));
}