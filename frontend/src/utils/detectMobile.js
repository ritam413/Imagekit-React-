export const  detectDevice = ()=>{
    const userAgent = navigator.userAgent || window.opera
    const isMobileUA = /android|iphone|ipad|iPod|windows phone/i.test(userAgent);

    return isMobileUA ? true : false 
}   