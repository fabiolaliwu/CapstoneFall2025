class Logger{
    constructor(){
        this.levels = ['debug', 'info', 'warn', 'error'];
        this.currentLevelIndex = this.levels.indexOf('debug');
    }
    setLevel(level){
        if(this.levels.includes(level)){
            this.currentLevel = level;
        }else{
            console.error(`Invalid log level: ${level}`);
        }
    }
    log(level,message){
        const levelIndex=this.levels.indexOf(level);
        if(levelIndex>=this.currentLevelIndex) {
            console[level](`[${level.toUpperCase()}] ${message}`);
        }
    }
    debug(meesage){
        this.log('debug',meesage);
    }
    info(message){
        this.log('info',message);
    }
    warn(message){
        this.log('warn',message);
    }
    error(message){
        this.log('error',message);
    }
}
const logger=new Logger();
export default logger;

//code reference: https://www.loggly.com/blog/best-practices-for-client-side-logging-and-error-handling-in-react/
