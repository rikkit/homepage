export default class Utils {
    public static delay = async (ms) => {        
        await new Promise(r => setTimeout(r, ms))
    }
}
