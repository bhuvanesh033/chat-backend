const Message = require('../models/message');
const User = require('../models/user');

// Send Message
exports.sendMessage = async (req, res) => {
    const { convo_id, text } = req.body; // Extract convo_id and text from the request body
    const sender_number = req.user.phone_number; // Extract sender's phone number from the JWT token

    try {
        // Ensure convo_id and text are provided
        if (!convo_id || !text) {
            return res.status(400).json({ error: 'convo_id and text are required' });
        }

        // Create the message
        const message = await Message.create({
            convo_id,
            sender_number,
            media_type: 'text', // Assuming this is a text message
            text, // The message text from the request
            timestamp: new Date() // Optional, can be omitted since it defaults to NOW
        });

        // Return the newly created message
        res.status(201).json({
            message: 'Message sent successfully',
            data: message
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Messages by Conversation
// In the 'getMessagesByConversation' method
exports.getMessagesByConversation = async (req, res) => {
    const { convo_id } = req.params;

    try {
        if (!convo_id) {
            return res.status(400).json({ error: 'convo_id is required' });
        }

        const messages = await Message.findAll({
            where: { convo_id },
            include: [
                {
                    model: User,
                    as: 'sender', // Alias 'sender' for the User
                    attributes: ['name', 'phone_number'] // Fetch name and phone_number
                }
            ],
            attributes: ['message_id', 'text', 'timestamp']
        });

        if (messages.length === 0) {
            return res.status(404).json({ error: 'No messages found for this conversation' });
        }

        res.status(200).json({
            messages: messages.map(message => ({
                message_id: message.message_id,
                sender_name: message.sender.name,
                sender_phone_number: message.sender.phone_number, // Correctly reference phone_number
                text: message.text,
                timestamp: message.timestamp
            }))
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};





