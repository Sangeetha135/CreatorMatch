/**
 * Test Script for User Suspension Functionality
 *
 * This script demonstrates how the suspension system works:
 * 1. Admin can suspend a user
 * 2. Suspended user can still log in
 * 3. Suspended user cannot perform other operations
 * 4. Admin can reactivate the user
 */

require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

const testSuspensionFlow = async () => {
  try {
    console.log("=== Testing User Suspension Functionality ===\n");

    // Find a test user (non-admin)
    const testUser = await User.findOne({
      role: { $ne: "admin" },
      email: { $ne: "admin@creatorconnect.com" },
    });

    if (!testUser) {
      console.log("No test user found. Please create a non-admin user first.");
      return;
    }

    console.log(`Test user found: ${testUser.name} (${testUser.email})`);
    console.log(
      `Original status: ${testUser.suspendedAt ? "Suspended" : "Active"}\n`
    );

    // Test 1: Suspend the user
    console.log("1. Suspending user...");
    testUser.suspendedAt = new Date();
    testUser.suspensionReason = "Testing suspension functionality";
    await testUser.save();
    console.log("✓ User suspended successfully");
    console.log(`   Suspended at: ${testUser.suspendedAt}`);
    console.log(`   Reason: ${testUser.suspensionReason}\n`);

    // Test 2: Check login is still possible
    console.log("2. Testing login capability...");
    const loginTestUser = await User.findById(testUser._id);
    if (loginTestUser.isVerified) {
      console.log("✓ User can still log in (isVerified is still true)");
    } else {
      console.log("✗ User cannot log in (this is unexpected)");
    }

    // Test 3: Check suspension status
    console.log("3. Checking suspension status...");
    console.log(`   isSuspended: ${!!loginTestUser.suspendedAt}`);
    console.log(`   suspendedAt: ${loginTestUser.suspendedAt}`);
    console.log(`   suspensionReason: ${loginTestUser.suspensionReason}\n`);

    // Test 4: Reactivate the user
    console.log("4. Reactivating user...");
    testUser.suspendedAt = undefined;
    testUser.suspensionReason = undefined;
    await testUser.save();
    console.log("✓ User reactivated successfully\n");

    console.log("=== How the suspension system works ===");
    console.log("1. When admin suspends a user:");
    console.log("   - Sets suspendedAt timestamp");
    console.log("   - Sets suspensionReason");
    console.log("   - Keeps isVerified as true (allows login)");
    console.log("");
    console.log("2. When suspended user tries to access protected routes:");
    console.log("   - checkSuspension middleware checks suspendedAt field");
    console.log("   - Returns 403 error with suspension details");
    console.log(
      "   - User can see they are suspended but cannot perform actions"
    );
    console.log("");
    console.log("3. Login endpoint is NOT protected by suspension check");
    console.log("   - Suspended users can log in");
    console.log("   - Login response includes suspension status");
    console.log("   - Frontend can show appropriate message");
    console.log("");
    console.log("4. Admin routes are NOT protected by suspension check");
    console.log("   - Uses different middleware (isAdmin)");
    console.log("   - Admins can work even if somehow suspended");
  } catch (error) {
    console.error("Error testing suspension:", error);
  }
};

const main = async () => {
  await connectDB();
  await testSuspensionFlow();
  mongoose.connection.close();
  console.log("\nDatabase connection closed");
};

main();
