export function getPermissionsFromToken(token) {
    var base64Url = token.split('.')[1];
    var base64 = decodeURIComponent(atob(base64Url).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    var base64JSON = JSON.parse(base64);
    var permissions = base64JSON.unique_name[1].split(',')    
    return permissions;
}