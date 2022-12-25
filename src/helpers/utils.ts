import {randomBytes} from "crypto";
export const paramsToObject = (querystring:any)=>{
    const res =   Object.fromEntries(new URLSearchParams(querystring));
    return res == null ? {} :res;
};

export const genMatricNumber = ()=>{
    const serialNumber = `fpn/s05/${randomBytes(3).toString("hex")}`;
    return serialNumber;
}


// FISHER-YATES ALGORITHM
export const randomizeArray = <T>(arr:Array<T>):Array<T>=>{
    for(let i = arr.length -1;i>0;i--){
        const j = Math.floor(Math.random() * (i + 1));
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    return arr;
}