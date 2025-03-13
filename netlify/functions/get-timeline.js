// Import required modules
const fs = require('fs');
const path = require('path');

exports.handler = async function(event, context) {
  try {
    // Create a simplified version of the timeline data
    const timelineData = [
      {
        weeks: "Weeks 1–4",
        shortTitle: "Discovery Setup",
        progressStatus: "in-progress",
        paymentStatus: "pending",
        blockTitle: "Block 1 (Weeks 1–4)",
        totalBlock: 4500,
        paymentsBreakdown: [
          { role: "UI/UX", amount: 1000, status: "pending" },
          { role: "Mobile", amount: 500, status: "pending" },
          { role: "Backend", amount: 3000, status: "pending" }
        ],
        keyFocus: [
          "Heavy UI/UX design (wireframes, high-level flows)",
          "Flutter project setup & onboarding screens",
          "Backend architecture, authentication & DB schema",
          "Onboarding & Verification: Photo Verification, ID Verification, Verified Profile Indicators, Photo Guidelines"
        ]
      },
      {
        weeks: "Weeks 5–8",
        shortTitle: "Design Refine",
        progressStatus: "not-started",
        paymentStatus: "not-paid",
        blockTitle: "Block 2 (Weeks 5–8)",
        totalBlock: 5000,
        paymentsBreakdown: [
          { role: "UI/UX", amount: 1500, status: "not-paid" },
          { role: "Mobile", amount: 1500, status: "not-paid" },
          { role: "Backend", amount: 2000, status: "not-paid" }
        ],
        keyFocus: [
          "Refine UI/UX based on feedback",
          "Implement core features",
          "Backend API development",
          "Integration testing"
        ]
      }
    ];
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(timelineData)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch timeline data', details: error.message })
    };
  }
}; 