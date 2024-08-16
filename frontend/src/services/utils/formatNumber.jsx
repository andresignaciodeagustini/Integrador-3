export function removeDecimals(value){
    if(isNaN(value)){
        return;
    }
    return Math.round(value*100)

}