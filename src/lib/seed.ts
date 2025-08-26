// Load environment variables explicitly
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env.local file
const envPath = path.resolve(process.cwd(), '.env.local');
dotenv.config({ path: envPath });

// Also load .env file if it exists
const envPath2 = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath2 });

import { projects } from './data';

// Initialize Firebase client SDK with error handling
let db: any, auth: any;

try {
  console.log("Initializing Firebase client SDK...");
  
  // Import Firebase modules
  const { initializeApp, getApps, getApp } = require("firebase/app");
  const { getFirestore } = require("firebase/firestore");
  const { getAuth } = require("firebase/auth");
  
  // Check environment variables
  console.log("Checking environment variables...");
  console.log("API Key:", process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? "Set" : "Not set");
  console.log("Project ID:", process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? "Set" : "Not set");
  
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };
  
  // Validate config
  if (!firebaseConfig.apiKey) {
    throw new Error("Firebase API key is missing. Please check your .env.local file.");
  }
  
  // Initialize Firebase
  console.log("Initializing Firebase app...");
 const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  db = getFirestore(app);
  auth = getAuth(app);
  
  console.log("Firebase client SDK initialized successfully.");
} catch (error) {
  console.error("Failed to initialize Firebase client SDK:", error);
  process.exit(1);
}

// Import Firebase client SDK functions
import { collection, setDoc, doc, writeBatch, getDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';

async function seedDatabase() {
  console.log("=== Firebase Client SDK Seeding ===");
  console.log("This script uses Firebase Client SDK to seed data to Firestore.");
  console.log("==================================\n");
  
  try {
    // --- Create and Authenticate as Admin User ---
    console.log("Creating and authenticating as admin user...");
    const adminEmail = "admin@aether.com";
    const adminPassword = "password";
    
    let userCredential;
    let userId;
    try {
      // Try to create a new admin user
      userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
      console.log("New admin user created:", userCredential.user.uid);
      userId = userCredential.user.uid;
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        console.log("Admin user already exists. Signing in...");
        // Sign in with existing admin user
        userCredential = await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
        console.log("Signed in as existing admin user:", userCredential.user.uid);
        userId = userCredential.user.uid;
      } else {
        console.error("Authentication error:", error.code, error.message);
        throw error;
      }
    }
    
    // Ensure the admin user document exists in Firestore with admin: true
    if (userId) {
      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        // Create the user document if it doesn't exist
        await setDoc(userDocRef, {
          admin: true,
          email: adminEmail,
          createdAt: new Date()
        });
        console.log("Created admin user document in Firestore for user:", userId);
      } else {
        // Check if the user document has admin: true
        const userData = userDoc.data();
        if (!userData?.admin) {
          // Update the user document to set admin: true
          await setDoc(userDocRef, {
            admin: true,
            email: adminEmail,
            updatedAt: new Date()
          }, { merge: true });
          console.log("Updated admin user document in Firestore for user:", userId);
        } else {
          console.log("Admin user document already exists with admin: true for user:", userId);
        }
      }
      
      // Set custom claims on the user's auth token using Firebase Admin SDK
      try {
        // Import Firebase Admin SDK
        const { adminAuth } = await import('./firebase-admin');
        await adminAuth.setCustomUserClaims(userId, { admin: true });
        console.log("Set custom claims for admin user:", userId);
      } catch (error) {
        console.warn("Could not set custom claims (this is expected in development):", error);
        // Don't throw error as custom claims are optional for basic functionality
      }
    }
    
    const user = userCredential.user;
    console.log("Authenticated as:", user.email);
    
    // --- Seed Projects ---
    console.log("\nSeeding projects to Firestore...");
    
    if (!projects || projects.length === 0) {
      console.log("No projects found in data file. Seeding aborted.");
      await signOut(auth);
      return;
    }
    
    // Use batched writes for better performance
    const batch = writeBatch(db);
    
    for (const project of projects) {
      const { id, ...projectData } = project;
      const projectRef = doc(collection(db, 'projects'), id);
      batch.set(projectRef, projectData);
    }
    
    try {
      await batch.commit();
      console.log(`Successfully seeded ${projects.length} projects to Firestore.`);
    } catch (error) {
      console.error("Error committing batch:", error);
      throw error;
    }
    
    // Sign out after seeding
    await signOut(auth);
    console.log("Signed out admin user.");
    
    console.log("\n--- Admin Credentials ---");
    console.log("Email: admin@aether.com");
    console.log("Password: password");
    console.log("-------------------------\n");
    
    console.log("Database seeding completed successfully.");
  } catch (error) {
    console.error("Seeding failed:", error);
    // Try to sign out if there's an error
    try {
      await signOut(auth);
    } catch (signOutError) {
      console.error("Error signing out:", signOutError);
    }
    process.exit(1);
  }
}

seedDatabase()
  .then(() => {
    console.log("Script finished successfully.");
    console.log("\nNext steps:");
    console.log("1. Your data has been seeded to Firestore");
    console.log("2. You can now run your application");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Seeding failed:", error.message);
    console.log("\nTroubleshooting tips:");
    console.log("1. Make sure your Firebase project is set up correctly");
    console.log("2. Check that your Firestore rules allow authenticated users to write data");
    console.log("3. Follow the instructions above to either reset the admin password or manually seed the data");
    process.exit(1);
  });
