export const pricewithDiscount = (price, dis = 0) => {
    const priceNum = Number(price) || 0;
    const discountNum = Number(dis) || 0;
    
    if (discountNum <= 0) {
        return priceNum;
    }
    
    const discountAmount = Math.ceil((priceNum * discountNum) / 100);
    const actualPrice = priceNum - discountAmount;
    return actualPrice;
}