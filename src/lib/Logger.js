let MapRLoggerLevel = {
    none: 0,
    basic: 1,
    debug: 2
}
let MapRLogger = {
    loggingLevel: MapRLoggerLevel.debug,

    debug: function(...args) {
        if(MapRLoggerLevel.debug <= this.loggingLevel) {
            console.debug("MapR: ", ...args);
        }
    },
    log: function(...args) {
        if(MapRLoggerLevel.basic <= this.loggingLevel) {
            console.log("MapR: ", ...args);
        }
    }
}

export { MapRLogger }