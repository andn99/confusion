import mongoose from 'mongoose';
import mongooseCurrency from 'mongoose-currency';

const Schema = mongoose.Schema;
const Currency = mongooseCurrency.loadType(mongoose);

const promoSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    label: {
        type: String,
        required: true
    },
    price: {
        type: Currency,
        min: 0,
        required: true
    },
    featured: {
        type: Boolean,
        required: true,
        default: false
    }, 
    description: {
        type: String,
        required: true
    }
},{
    timestamps: true
})

const Promotions = mongoose.model('Promotion', promoSchema);

export default Promotions;