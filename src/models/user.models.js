class User {

    //Attributes of user
    userId;
    username;
    password;
    role;
    email;
    status;
    registerDate;
    firstName;
    lastName;
    birthday;
    shippingInfo;
    creditInfo;
    googleAuth;

    //Constructors
    constructor(username, password, role, status, email, registerDate, firstName, lastName, birthday, shippingInfo, creditInfo, googleAuth, userId) {

        this.userId = userId;
        this.username = username;
        this.password = password;
        this.role = role;
        this.email = email;
        this.status = status;
        this.registerDate = registerDate;
        this.firstName = firstName;
        this.lastName = lastName;
        this.birthday = birthday;
        this.shippingInfo = shippingInfo;
        this.creditInfo = creditInfo;
        this.googleAuth = googleAuth;

    }

    //Getters

    getUserId() {
        return this.userId;
    }

    getUsername() {
        return this.username;
    }

    getPassword() {
        return this.password;
    }

    getRole() {
        return this.role;
    }

    getEmail() {
        return this.email;
    }

    getStatus() {
        return this.status;
    }

    getRegistrationDate() {
        return this.registerDate;
    }

    getBirthday() {
        return this.birthday;
    }

    getFirstName() {
        return this.firstName;
    }

    getLastName() {
        return this.lastName;
    }

    getShippingInfo() {
        return this.shippingInfo;
    }

    getCreditInfo() {
        return this.creditInfo;
    }

    getGoogleAuth() {
        return this.googleAuth;
    }

    //Setters

    setUsername(username) {
        this.username = username;
    }

    setPassword(password) {
        this.password = password;
    }

    setRole(role) {
        this.role = role;
    }

    setStatus(status) {
        this.status = status;
    }

    setEmail(email) {
        this.email = email;
    }

    setRegistrationDate(registerDate) {
        this.registerDate = registerDate;
    }

    setBirthday(birthday) {
        this.birthday = birthday;
    }

    setFirstName(firstName) {
        this.firstName = firstName;
    }

    setLastName(lastName) {
        this.lastName = lastName;
    }

    setShippingInfo(shippingInfo) {
        this.shippingInfo = shippingInfo;
    }

    setCreditInfo(creditInfo) {
        this.creditInfo = creditInfo;
    }

    setGoogleAuth(googleAuth) {
        this.googleAuth = googleAuth;
    }

    //To JSON
    toJSON() {
        
        return JSON.parse(JSON.stringify({
            userid: this.userId,
            username: this.username,
            password: this.password,
            role: this.role,
            email: this.email,
            status: this.status,
            registerDate: this.registerDate,
            firstname: this.firstName,
            lastname: this.lastName,
            birthday: this.birthday,
            shippingInfo: this.shippingInfo,
            creditInfo: this.creditInfo,
            googleAuth: this.googleAuth
        }))


    }

    toValue() {
        return [`username: ${this.username}`, `password: ${this.password}`, `role: ${this.role}`, `status: ${this.status}`, `email: ${this.email}`, `registerDate: ${this.registerDate}`, `firstname: ${this.firstName}`, `lastname: ${this.lastName}`, `birthday: ${this.birthday}`]
    }

    toList() {
        return [this.username, this.password, this.role, this.email, this.status, this.registerDate, this.firstName, this.lastName, this.birthday, this.shippingInfo, this.creditInfo, this.googleAuth]
    }

}

module.exports = User;