// Budget API

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = 4000;

// MongoDB connection URL
const url = 'mongodb://localhost:27017/budgetDB';
// const dbName = 'budgetDB'; // Replace with your database name

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(url)
  .then(() => {
    console.log('Connected successfully to MongoDB');
    // db = client.db(dbName);
  })
  .catch(error => console.error('MongoDB connection error:', error));

  const budgetSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true
    },
    value: {
      type: Number,
      required: true
    },
    color: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          return /^#[0-9A-Fa-f]{6}$/.test(v);
        },
        message: props => `${props.value} is not a valid hexadecimal color!`
      }
    }
  });

const BudgetModel = mongoose.model('Budget', budgetSchema);

app.get('/budget', async (req, res) => {
  try {
    const budgetData = await BudgetModel.find({}) //.toArray();
    res.json(budgetData);
  } catch (error) {
    console.error('Error fetching budget data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/budget', async (req, res) => {
    const budgetItem = new BudgetModel({
      title: req.body.title,
      value: req.body.value,
      color: req.body.color
    });
  
    try {
      const newItem = await budgetItem.save();
      res.status(201).json(newItem);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  const barChartSchema = new mongoose.Schema({
    label: {
        type: String,
        required: true
      },
      value: {
        type: Number,
        required: true
      }
  });
  
  const BarChartModel = mongoose.model('BarChart', barChartSchema, 'barChartData');

app.get('/bar-chart-data', async (req, res) => {
  try {
    const barChartData = await BarChartModel.find({})//.toArray();
    res.json(barChartData);
  } catch (error) {
    console.error('Error fetching bar chart data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
mongoose.connection.once('open', () => {
    app.listen(port, () => {
        console.log(`Server listening at http://localhost:${port}`);
      });

});

mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
  });
