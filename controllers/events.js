const { response } = require("express");
const Event = require('../models/Event');

const getEvents = async (req, resp = response) => {

    const events = await Event.find().
                                populate('user', 'name');

    resp.status(200).json({
        ok: true,
        message: 'Events obtains successfully',
        events
    });

}
const createEvents = async (req, resp = response) => {

    const { body, uid } = req;
    const event = new Event(body);

    try {
        event.user = uid;
        const eventSave = await event.save();

        resp.status(200).json({
            ok: true,
            message: 'Event created',
            event: eventSave
        });
        
    } catch (error) {
        console.error(error);
        resp.status(500).json({
            ok: false,
            message: 'Ocurrió un problema, intente más tarde'
        });
    }

}

const updateEvents = async (req, resp = response) => {
    
    const { id } = req.params;
    const uid = req.uid;

    try {
        const event = await Event.findById(id);

        if( !event ){
            return resp.status(404).json({
                ok: false,
                message: 'El evento no existe'
            });
        }

        if(event.user.toString() !== uid){
            return resp.status(401).json({
                ok: false,
                message: 'No tiene permisos para editar este evento '
            });
        }

        const newEvent = {
            ...req.body,
            user: uid,
        }

        const updEvent = await Event.findByIdAndUpdate(id, newEvent, { new: true });

        return resp.status(200).json({
            ok: true,
            message: `Update events with id ${ id }`,
            event: updEvent
        }); 


    } catch (error) {
        console.error(error);
        resp.status(500).json({
            ok: false,
            message: 'Ocurrió un problema con el actualizar el usuario'
        });
    }

   

}

const deleteEvents = async (req, resp = response) => {
    
    const { id } = req.params;
    const uid = req.uid;

    try {
        const event = await Event.findById(id);
        
        if( !event ){
            return resp.status(404).json({
                ok: false,
                message: 'El evento no existe'
            });
        }

        if(event.user.toString() !== uid){
            return resp.status(401).json({
                ok: false,
                message: 'No tiene permisos para eliminar este evento '
            });
        }

        await Event.findOneAndDelete(id);

        return resp.status(200).json({
            ok: true,
            message: `Delete events with id ${ id }`
        });

    } catch (error) {
        console.error(error);
        resp.status(500).json({
            ok: false,
            message: 'Ocurrió un problema con el actualizar el usuario'
        });
    }


}

module.exports = {
    createEvents,
    deleteEvents,
    getEvents,
    updateEvents,
}