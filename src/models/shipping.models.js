class Shipping {

    shippingId;
    shippingType;
    shippingCost;

    constructor(shippingId, shippingType, shippingCost){
        this.shippingId = shippingId;
        this.shippingType = shippingType;
        this.shippingCost = shippingCost;
    }

    //Getters
    getShippingId(){
        return this.shippingId;
    }

    getShippingType(){
        return this.shippingType;
    }

    getShippingCost(){
        return this.shippingCost;
    }


    //Setters
    setShippingType(shippingType){
        this.shippingType = shippingType;
    }

    setShippingCost(shippingCost){
        this.shippingCost = shippingCost;
    }

}

module.exports = Shipping;