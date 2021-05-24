class Orders {

    orderId;
    userId;
    status;
    shippingId;
    dateCreated;
    dateShipped;
    payType;
    subtotal;
    total;


    constructor(orderId, userId, status, shippingId, dateCreated, dateShipped, payType, subtotal, total) {

        this.orderId = orderId;
        this.userId = userId;
        this.status = status;
        this.shippingId = shippingId;
        this.dateCreated = dateCreated;
        this.dateShipped = dateShipped;
        this.payType = payType;
        this.subtotal = subtotal;
        this.total = total;

    }

    //Getters
    getOrderId() {
        return this.orderId;
    }

    getUserId() {
        return this.userId;
    }

    getStatus() {
        return this.status;
    }

    getShippingId() {
        return this.shippingId;
    }

    getDateCreated() {
        return this.dateCreated;
    }

    getDateShipped() {
        return this.dateShipped;
    }

    getPayType() {
        return this.payType;
    }

    getSubtotal() {
        return this.subtotal;
    }

    getTotal() {
        return this.total;
    }

    //Setters
    setStatus() {
        this.status = status;
    }

    setDateShipped() {
        this.dateShipped = dateShipped;
    }

    setSubtotal() {
        this.subtotal = subtotal;
    }

    setTotal() {
        this.total = total;
    }

    //JSON
    //To JSON
    toJSON() {

        return JSON.parse(JSON.stringify({
            orderId: this.orderId,
            userId: this.userId,
            status: this.status,
            shippingId: this.shippingId,
            dateCreated: this.dateCreated,
            dateShipped: this.dateShipped,
            payType: this.payType,
            subtotal: this.subtotal,
            total: this.total
        }))
    }

    toList() {
        return [this.userId, this.status, this.shippingId, this.dateCreated, this.dateShipped, this.payType, this.subtotal, this.total];
    }

    toValue() {
        return [`orderId: ${this.orderId}`, `userId: ${this.userId}`, `status: ${this.status}`, `shippingId: ${this.shippingId}`, `dateCreated: ${this.dateCreated}`, `dateShipped: ${this.dateShipped}`, `payType: ${this.payType}`, `subtotal: ${this.subtotal}`, `total: ${this.total}`]
    }


}

module.exports = Orders;