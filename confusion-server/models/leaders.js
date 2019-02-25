import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const leaderSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        required: true
    },
    abbr: {
        type: String,
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

const Leaders = mongoose.model('Leader', leaderSchema);

export default Leaders;