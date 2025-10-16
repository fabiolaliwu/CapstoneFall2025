import Message from '../models/Message.js';

// GET
export const getMessages = async (req, res) => {
    const { chat_type, ref_id } = req.query;
    if(!chat_type){
        return res.status(400).json({ error: "chat_type query parameter is required" });
    }
    if (chat_type !== 'global' && !ref_id) {
        return res.status(400).json({ error: "ref_id query parameter is required for non-global chats" });
    }
    let filter = { chat_type };
    if (chat_type !== 'global') {
        filter.ref_id = ref_id;
    }

    try{
        const messages = await Message.find(filter)
            .populate("sender", "username")
            .sort({ createdAt: 1 }); // sort by oldest first
        res.status(200).json(messages);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
  

// CREATE
export const createMessage = async (req, res) => {
    console.log("POST /messages body:", req.body);
    const { text, sender, chat_type='global', ref_id=null } = req.body;
    if (!text || !sender) {
        return res.status(400).json({ error: "Text and sender are required" });
    }
    if (chat_type !== 'global' && !ref_id) {
        return res.status(400).json({ error: "ref_id is required for non-global chats" });
    }

    try {
        const newMessage = await Message.create({
            text,
            sender,
            chat_type,
            ref_id
        });
        const populatedMessage = await newMessage.populate("sender", "username");

        //EMIT
        const io = req.app.get('io');
        const room = chat_type === 'global' ? 'global' : `${chat_type}-${ref_id}`;
        io.to(room).emit('newMessage', populatedMessage);
        
        res.status(200).json(populatedMessage);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// AI modified statement - to generate controllers for messages