import Notification from '../models/Notification.js';

/**
 * Create a notification for a user
 */
export const createNotification = async (userId, type, title, message, relatedId = null, relatedType = null) => {
  try {
    const notification = await Notification.create({
      userId,
      type,
      title,
      message,
      relatedId,
      relatedType,
      read: false
    });
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    // Don't throw - notifications are not critical
    return null;
  }
};

/**
 * Create booking-related notifications
 */
export const notifyBookingCreated = async (booking, ownerId, renterName, vehicleName) => {
  await createNotification(
    ownerId,
    'booking_request',
    'New Booking Request',
    `${renterName} has requested to book your vehicle "${vehicleName}"`,
    booking._id,
    'booking'
  );
};

export const notifyBookingConfirmed = async (booking, renterId, ownerName, vehicleName) => {
  await createNotification(
    renterId,
    'booking_confirmed',
    'Booking Confirmed',
    `Your booking for "${vehicleName}" has been confirmed by ${ownerName}`,
    booking._id,
    'booking'
  );
};

export const notifyBookingCancelled = async (booking, userId, isOwner, otherUserName, vehicleName) => {
  const message = isOwner 
    ? `${otherUserName} has cancelled their booking for "${vehicleName}"`
    : `Your booking for "${vehicleName}" has been cancelled`;
  
  await createNotification(
    userId,
    'booking_cancelled',
    'Booking Cancelled',
    message,
    booking._id,
    'booking'
  );
};

export const notifyBookingCompleted = async (booking, ownerId, renterId, vehicleName) => {
  // Notify owner
  await createNotification(
    ownerId,
    'booking_completed',
    'Booking Completed',
    `Booking for "${vehicleName}" has been completed`,
    booking._id,
    'booking'
  );
  
  // Notify renter
  await createNotification(
    renterId,
    'booking_completed',
    'Booking Completed',
    `Your booking for "${vehicleName}" has been completed. Please rate your experience!`,
    booking._id,
    'booking'
  );
};

/**
 * Create message notification
 */
export const notifyMessageReceived = async (userId, senderName, chatId) => {
  await createNotification(
    userId,
    'message',
    'New Message',
    `You have a new message from ${senderName}`,
    chatId,
    'message'
  );
};

export default {
  createNotification,
  notifyBookingCreated,
  notifyBookingConfirmed,
  notifyBookingCancelled,
  notifyBookingCompleted,
  notifyMessageReceived
};

