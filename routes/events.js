/* 
    Event routes
    /api/events
*/

const { Router } = require('express');
const { check } = require('express-validator');

const router = Router();

const { getEvents, createEvents, updateEvents, deleteEvents } = require('../controllers/events');
const { isDate } = require('../helpers/isDate');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');

// TODAS LAS RUTAS QUE ESTEN DEBAJO DEL VALIDATEJTW ESTAN VALIDADAS POR EL JWT
router.use(validateJWT);

router.get(
    '/', 

    getEvents
);
router.post(
    '/', 
    [
        check('title', "El título es obligatorio").not().isEmpty(),
        check('start', "Fecha de inicio es obligatoria").custom( isDate ),
        check('end', "Fecha de finalizacion es obligatoria").custom( isDate ),
        validateFields
    ],
    createEvents
);
router.put(
    '/:id',
    [
        check('title', "El título es obligatorio").not().isEmpty(),
        check('start', "Fecha de inicio es obligatoria").custom( isDate ),
        check('end', "Fecha de finalizacion es obligatoria").custom( isDate ),
        validateFields
    ],
    updateEvents
);
router.delete('/:id', deleteEvents);

module.exports = router;