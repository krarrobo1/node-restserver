const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

let categoriaSchema = new Schema({
    nombre: {
        type: String,
        unique: true,
        required: [true, 'El nombre es necesario']
    },
    estado: {
        type: Boolean,
        default: true
    },
    idCreator: {
        type: ObjectId,
        required: [true, 'El id del creador es necesario']
    }
});
categoriaSchema.plugin(uniqueValidator, { message: '{PATH} debe ser unico' });

module.exports = mongoose.model('Categoria', categoriaSchema);