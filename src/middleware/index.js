
const validation = require('../middleware/validation');
const validationJWT = require('../middleware/validation-jwt');
const validationRole = require('../middleware/validation-role');


module.exports = {  
    ...validation,
    ...validationJWT,
    ...validationRole
}