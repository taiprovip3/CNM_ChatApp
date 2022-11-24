export const renderYobDays = () => {
    const arr = [];
    for(var i=1;i<32;i++){
        arr.push(i);
    }
    return arr;
};
export const renderYobMonths = () => {
    const arr = [];
    for(var i=1;i<13;i++){
        arr.push(i);
    }
    return arr;
};
export const renderYobYears = () => {
    const currentYear = new Date().getFullYear();
    const arr = [];
    for(var i=currentYear-119;i<=currentYear;i++){
        arr.push(i);
    }
    return arr;
};