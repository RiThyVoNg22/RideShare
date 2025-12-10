import express from 'express';
import Chat from '../models/Chat.js';
import Booking from '../models/Booking.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Get or create chat for a booking
router.get('/booking/:bookingId', protect, async (req, res) => {
  try {
    const { bookingId } = req.params;

    // Verify user is part of the booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    const userId = req.user._id.toString();
    const bookingUserId = booking.userId?.toString ? booking.userId.toString() : booking.userId.toString();
    const bookingOwnerId = booking.ownerId?.toString ? booking.ownerId.toString() : booking.ownerId.toString();

    if (bookingUserId !== userId && bookingOwnerId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this chat'
      });
    }

    let chat = await Chat.findOne({ bookingId })
      .populate('participants', 'firstName lastName email');

    if (!chat) {
      // Create new chat
      chat = await Chat.create({
        bookingId,
        participants: [booking.userId, booking.ownerId],
        vehicleName: booking.vehicleName,
        messages: [],
        lastMessageTime: new Date()
      });
      
      // Populate after creation
      await chat.populate('participants', 'firstName lastName email');
    }

    res.json({
      success: true,
      chat
    });
  } catch (error) {
    console.error('Error getting/creating chat:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get user's chats
router.get('/my-chats', protect, async (req, res) => {
  try {
    // Find chats where user is a participant
    const chats = await Chat.find({
      participants: { $in: [req.user._id] }
    })
    .populate('participants', 'firstName lastName email')
    .populate('bookingId', 'vehicleName status')
    .sort({ lastMessageTime: -1, updatedAt: -1 });

    // Calculate unread count for each chat
    const chatsWithUnread = chats.map(chat => {
      const unreadCount = chat.messages.filter(msg => {
        const senderId = msg.senderId?.toString ? msg.senderId.toString() : msg.senderId;
        const userId = req.user._id.toString();
        return senderId !== userId && !msg.read;
      }).length;
      
      return {
        ...chat.toObject(),
        unreadCount
      };
    });

    res.json({
      success: true,
      count: chats.length,
      chats: chatsWithUnread
    });
  } catch (error) {
    console.error('Error fetching chats:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Send message (MUST come before /:chatId route)
router.post('/:chatId/messages', protect, async (req, res) => {
  try {
    const { chatId } = req.params;
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Verify user is participant (handle ObjectId comparison)
    const isParticipant = chat.participants.some(
      p => p.toString() === req.user._id.toString() || p._id?.toString() === req.user._id.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to send messages in this chat'
      });
    }

    // Determine receiver (handle both ObjectId and populated objects)
    const userId = req.user._id.toString();
    const receiverId = chat.participants.find(p => {
      const participantId = p._id?.toString ? p._id.toString() : p.toString();
      return participantId !== userId;
    });

    // Add message
    const newMessage = {
      senderId: req.user._id,
      senderName: `${req.user.firstName} ${req.user.lastName}`,
      receiverId,
      message,
      read: false,
      timestamp: new Date()
    };

    chat.messages.push(newMessage);
    chat.lastMessage = message;
    chat.lastMessageTime = new Date();
    await chat.save();

    res.status(201).json({
      success: true,
      message: newMessage
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Mark messages as read (MUST come before /:chatId route)
router.put('/:chatId/read', protect, async (req, res) => {
  try {
    const { chatId } = req.params;
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Mark all messages from other participants as read
    chat.messages.forEach(msg => {
      if (msg.senderId.toString() !== req.user._id.toString()) {
        msg.read = true;
      }
    });

    await chat.save();

    res.json({
      success: true,
      message: 'Messages marked as read'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get single chat by ID (MUST be last, after all specific routes)
router.get('/:chatId', protect, async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId)
      .populate('participants', 'firstName lastName email')
      .populate('bookingId', 'vehicleName status');

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Verify user is participant (handle both ObjectId and populated objects)
    const userId = req.user._id.toString();
    const isParticipant = chat.participants.some(p => {
      const participantId = p._id?.toString ? p._id.toString() : p.toString();
      return participantId === userId;
    });

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this chat'
      });
    }

    res.json({
      success: true,
      chat
    });
  } catch (error) {
    console.error('Error fetching chat:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
