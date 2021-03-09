import { authenticationService } from '../services';
//Функция handleResponse проверяет ответы api, чтобы узнать, был ли запрос несанкционированным, запрещенным или неудачным
export function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if ([401, 403].indexOf(response.status) !== -1) {
                // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
                authenticationService.logout();
                //location.reload(true);
            }
            //const error = (data && data.email) || response.statusText;
            return data;//Promise.reject(error);
        }
        return data;
    });
}

export function handleErrorResponse(response) {
    if ([401, 403].indexOf(response.status) !== -1) {
        if(response.statusText === "Unauthorized"){
            authenticationService.logout();  
            window.location.reload(true); 
        }                 
    }
    //const error = response.statusText;
    //return Promise.reject(error);
}