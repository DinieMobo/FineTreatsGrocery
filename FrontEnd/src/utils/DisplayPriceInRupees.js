export const DisplayPriceInRupees = (price)=>{
    if (price === null || price === undefined || isNaN(price)) {
        price = 0;
    }
    return new Intl.NumberFormat('en-LK',{
        style : 'currency',
        currency : 'LKR'
    }).format(price)
}