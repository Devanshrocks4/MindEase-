const mongoose = require('mongoose');
const User = require('./models/User');
const Assessment = require('./models/Assessment');

async function deleteExcessUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mindease');
    console.log('Connected to MongoDB');

    // Count total users
    const totalUsers = await User.countDocuments();
    console.log(`Total users: ${totalUsers}`);

    if (totalUsers <= 15) {
      console.log('Already 15 or fewer users. No deletion needed.');
      return;
    }

    // Get all users sorted by creation date (newest first)
    const allUsers = await User.find().sort({ createdAt: -1 });

    // Keep the first 10-15 users (newest)
    const usersToKeep = allUsers.slice(0, 15);
    const usersToDelete = allUsers.slice(15);

    console.log(`Keeping ${usersToKeep.length} users`);
    console.log(`Deleting ${usersToDelete.length} users`);

    // Delete assessments for users to delete
    for (const user of usersToDelete) {
      await Assessment.deleteMany({ userId: user._id });
      console.log(`Deleted assessments for user: ${user.email}`);
    }

    // Delete the users
    const userIdsToDelete = usersToDelete.map(u => u._id);
    await User.deleteMany({ _id: { $in: userIdsToDelete } });

    console.log(`Deleted ${usersToDelete.length} users`);

    // Final count
    const finalCount = await User.countDocuments();
    console.log(`Final user count: ${finalCount}`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

deleteExcessUsers();
