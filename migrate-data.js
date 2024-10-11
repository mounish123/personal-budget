const { MongoClient } = require('mongodb');
const fs = require('fs');

const url = 'mongodb://localhost:27017';
const dbName = 'budgetDB';

async function migrateData() {
  const client = new MongoClient(url);

  try {
    await client.connect();
    console.log('Connected successfully to MongoDB');

    const db = client.db(dbName);

    // Read data from JSON file
    const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));

    // Insert budget data
    if (data.myBudget) {
      await db.collection('budgets').insertMany(data.myBudget);
      console.log('Budget data inserted');
    }

    // Insert bar chart data
    if (data.barChartData) {
      await db.collection('barChartData').insertMany(data.barChartData);
      console.log('Bar chart data inserted');
    }

    console.log('Data migration completed');
  } catch (error) {
    console.error('Error during data migration:', error);
  } finally {
    await client.close();
  }
}

migrateData();