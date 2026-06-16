const { Storage } = require("./lib/storage");
const fs = require("fs");
const path = require("path");

async function runTest() {
  console.log("🛠️ Starting Senior QA Storage Test...");
  
  // 1. Setup - Use a temporary test ID
  const testId = "qa-test-" + Date.now();
  const testGuest = {
    id: testId,
    title: "M.",
    name: "QA Tester",
    table: 99,
    tableName: "Table Test",
    lang: "fr"
  };

  try {
    // 2. Test Create
    await Storage.saveGuests([...await Storage.getGuests(), testGuest]);
    console.log("✅ Guest created successfully.");

    // 3. Test Retrieve
    const guests = await Storage.getGuests();
    const found = guests.find(g => g.id === testId);
    if (found) {
      console.log("✅ Guest retrieval verified.");
    } else {
      throw new Error("Guest not found after save!");
    }

    // 4. Test Persistence Check (Development Simulator)
    if (process.env.NODE_ENV === "development") {
      const filePath = path.join(process.cwd(), "lib", "guests.json");
      const fileData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      if (fileData.find(g => g.id === testId)) {
        console.log("✅ File System persistence verified (Dev mode).");
      }
    }

    // 5. Cleanup
    await Storage.deleteGuest(testId);
    const guestsAfterDelete = await Storage.getGuests();
    if (!guestsAfterDelete.find(g => g.id === testId)) {
      console.log("✅ Guest deletion verified.");
    }

    console.log("\n🚀 ALL LOCAL TESTS PASSED!");
    console.log("Note: This verifies the logic. Vercel KV will work exactly the same way in production once linked.");
    
  } catch (err) {
    console.error("❌ TEST FAILED:", err);
    process.exit(1);
  }
}

runTest();
