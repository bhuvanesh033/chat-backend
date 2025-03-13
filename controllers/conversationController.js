const Conversation = require('../models/conversation');
const Participant = require('../models/participant');
const Message = require('../models/message');
const User = require('../models/user');
const { Op } = require('sequelize');

// Create individual chat
exports.createIndividualChat = async (req, res) => {
    const { phone_number } = req.body; // phone_number of the other participant
    const loggedInUser = req.user.phone_number; // Extracted from JWT

    try {
        if (!phone_number) {
            return res.status(400).json({ error: 'Phone number is required' });
        }

        // Create a new conversation
        const conversation = await Conversation.create({
            is_group: false,
            image: null,
            timestamp: new Date()
        });

        // Add participants
        await Participant.bulkCreate([
            { convo_id: conversation.id, phone_number: loggedInUser },
            { convo_id: conversation.id, phone_number }
        ]);

        res.status(201).json({
            message: 'Individual chat created successfully',
            conversation
        });
    } catch (error) {
        console.error("Error creating individual chat:", error);
        res.status(500).json({ error: error.message });
    }
};

// Create group chat
exports.createGroupChat = async (req, res) => {
    const { participants, image, group_name } = req.body; // Added group_name
    const loggedInUser = req.user.phone_number; // Extracted from JWT

    try {
        if (!participants || !Array.isArray(participants) || participants.length < 2) {
            return res.status(400).json({ error: 'At least two participants are required for a group chat' });
        }

        // Ensure the logged-in user is included in the participants list
        if (!participants.includes(loggedInUser)) {
            participants.push(loggedInUser);
        }

        // Create a new group conversation with group name
        const conversation = await Conversation.create({
            is_group: true,
            group_name: group_name || "New Group", // Default if no name is provided
            image: image || null,
            timestamp: new Date()
        });

        // Add participants to the group
        const participantEntries = participants.map(phone_number => ({
            convo_id: conversation.id,
            phone_number
        }));
        await Participant.bulkCreate(participantEntries);

        res.status(201).json({
            message: 'Group chat created successfully',
            conversation
        });
    } catch (error) {
        console.error("Error creating group chat:", error);
        res.status(500).json({ error: error.message });
    }
};


// Get all user conversations
// Get all user conversations
// exports.getUserConversations = async (req, res) => {
//     const loggedInUser = req.user ? req.user.phone_number : null;
//     if (!loggedInUser) {
//         return res.status(400).json({ error: 'User not authenticated' });
//     }

//     try {
//         const userConversations = await Participant.findAll({
//             where: { phone_number: loggedInUser },
//             include: [
//                 {
//                     model: Conversation,
//                     include: [
//                         {
//                             model: Participant,
//                             include: [
//                                 {
//                                     model: User,
//                                     attributes: ['phone_number', 'name'],
//                                 },
//                             ],
//                         },
//                         {
//                             model: Message,
//                             attributes: ['text', 'timestamp'],
//                             order: [['timestamp', 'DESC']],
//                             limit: 1,
//                         },
//                     ],
//                 },
//             ],
//         });

//         console.log("User conversations fetched:", userConversations);

//         const conversationDetails = await Promise.all(
//             userConversations.map(async (participant) => {
//                 const conversation = participant.Conversation;
//                 const isGroup = conversation.is_group;

//                 // Get the last message (if exists)
//                 const lastMessage = conversation.Messages[0] ? conversation.Messages[0].text : null;

//                 // Get the other participant's name for individual chat
//                 let otherParticipantName = null;
//                 if (!isGroup) {
//                     const otherParticipant = conversation.Participants.find(
//                         (p) => p.phone_number !== loggedInUser
//                     );
//                     if (otherParticipant) {
//                         otherParticipantName = otherParticipant.User.name;
//                     }
//                 }

//                 return {
//                     conversationId: conversation.id,
//                     isGroup,
//                     groupName: isGroup ? conversation.group_name : null, // ✅ Include group name
//                     otherParticipantName: isGroup ? null : otherParticipantName, // ✅ Only for individual chats
//                     lastMessage,
//                     timestamp: conversation.timestamp,
//                 };
//             })
//         );

//         res.status(200).json(conversationDetails);
//     } catch (error) {
//         console.error("Error fetching user conversations:", error);
//         res.status(500).json({ error: 'Something went wrong', details: error.message });
//     }
// };

// exports.getIndividualChats = async (req, res) => {
//     try {
//       const phoneNumber = req.user.phone_number;
  
//       const individualChats = await Conversation.findAll({
//         where: {
//           is_group: false,
//         },
//         include: [
//           {
//             model: Participant,
//             where: { phone_number: phoneNumber },
//             attributes: [],
//           },
//           {
//             model: Participant,
//             where: {
//               phone_number: { [Op.ne]: phoneNumber },
//             },
//             include: {
//               model: User,
//               attributes: ['name', 'phone_number'],
//             },
//           },
//           {
//             model: Message,
//             limit: 1,
//             order: [['timestamp', 'DESC']],
//           },
//         ],
//       });
  
//       res.json(individualChats);
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: 'Error fetching individual chats' });
//     }
//   };
  
exports.getIndividualChats = async (req, res) => {
    try {
      const phoneNumber = req.user.phone_number;
  
      const individualChats = await Conversation.findAll({
        where: {
          is_group: false,
        },
        include: [
          {
            model: Participant,
            as: 'MyParticipant',
            where: { phone_number: phoneNumber },
            attributes: [], // We don't need self data
          },
          {
            model: Participant,
            as: 'OtherParticipant',
            where: {
              phone_number: { [Op.ne]: phoneNumber },
            },
            include: {
              model: User,
              attributes: ['name', 'phone_number'],
            },
          },
          {
            model: Message,
            limit: 1,
            order: [['timestamp', 'DESC']],
          },
        ],
      });
  
      res.json(individualChats);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error fetching individual chats' });
    }
  };

  exports.getGroupChats = async (req, res) => {
    try {
      const phoneNumber = req.user.phone_number;
  
      const groupChats = await Conversation.findAll({
        where: {
          is_group: true,
        },
        include: [
          {
            model: Participant,
            where: { phone_number: phoneNumber },
            include: {
              model: User,
              attributes: ['name', 'phone_number'],
            },
          },
          {
            model: Message,
            limit: 1,
            order: [['timestamp', 'DESC']],
          },
        ],
      });
  
      res.json(groupChats);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error fetching group chats' });
    }
  };
  
// Get a specific conversation by ID
exports.  getMessagesByConversation= async (req, res) => {
    const { conversationId } = req.params;
    const loggedInUser = req.user ? req.user.phone_number : null;

    if (!loggedInUser) {
        return res.status(400).json({ error: 'User not authenticated' });
    }

    try {
        const conversation = await Conversation.findOne({
            where: { id: conversationId },
            include: [
                {
                    model: Participant,
                    include: [
                        {
                            model: User,
                            attributes: ['phone_number', 'name'],
                        },
                    ],
                },
                {
                    model: Message,
                    attributes: ['content', 'timestamp'],
                    order: [['timestamp', 'ASC']], // Order messages by timestamp
                },
            ],
        });

        if (!conversation) {
            return res.status(404).json({ error: 'Conversation not found' });
        }

        res.status(200).json(conversation);
    } catch (error) {
        console.error("Error fetching conversation:", error);
        res.status(500).json({ error: 'Something went wrong', details: error.message });
    }
};
