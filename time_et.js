exports.timeETformatted = function() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    const formattedTime = hours + ' tundi ' + minutes + ' minutit ' + seconds + ' sekundit';
    
    return formattedTime;
}