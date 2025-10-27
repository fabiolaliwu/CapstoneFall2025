import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    text:{
        type: String,
        required: true,
    },
    sender:{
        type: String, // user id
        required: true,
        ref: 'User'
    },
    chat_type:{
        type: String,
        enum: ['global', 'event', 'incident'],
        default: 'global'
    },
    ref_id:{
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'chat_type',
        required: function() { 
            return this.chat_type !== 'global'; // ref_id is not required for global chat
        }
    }
}, {
  timestamps: true
});

export default mongoose.model("Message", MessageSchema);
