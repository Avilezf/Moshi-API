
const validation = require('../middleware/validation');
const validationJWT = require('../middleware/validation-jwt');
const validationRole = require('../middleware/validation-role');
const validationOrder = require('../middleware/validation-order');


module.exports = {  
    ...validation,
    ...validationJWT,
    ...validationRole,
    ...validationOrder
}