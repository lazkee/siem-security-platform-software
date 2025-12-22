export function getTimeGroup(timeStamp: Date): string{
    const d = new Date(timeStamp);

    if(isNaN(d.getTime())){
        throw new Error("Invalid timestamp provided: " + timeStamp); //ovo ne znam da li moze ovako k.k
    }
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");

    const quarter = Math.floor(d.getMinutes() / 15) * 15;
    const qStr = String(quarter).padStart(2, "0");

    return `${yyyy}_${mm}_${dd}_${hh}_${qStr}`;
}