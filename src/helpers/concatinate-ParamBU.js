export function concatinateParam(data){
    var param;
    switch (data.selectedComand) {
        case 3:  
            switch (data.selectedParam) {
                case 1:   
                    param = data.selectedParam + "|" + data.metType                    
                    break;
                case 2: 
                    param = data.selectedParam + "|" + data.BUID                        
                    break;
                case 5:   
                    param = data.selectedParam + "|" + data.adressCOD + "|" + data.portCOD                     
                    break;                
                default:
                    break;
            }              
            break;
        case 7:  
            param = data.deviceMode              
            break;        
        default:
            break;
    }
    return param;
}