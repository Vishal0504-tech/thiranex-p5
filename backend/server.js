import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup environment and paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 5000;

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Helper to load product data
const getProducts = () => {
  const filePath = path.join(__dirname, 'data', 'products.json');
  try {
    const rawData = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(rawData);
  } catch (error) {
    console.error('Error reading products.json:', error);
    return [];
  }
};

// Endpoints

// 1. GET /api/products - get all products with filtering, searching, and sorting
app.get('/api/products', (req, res) => {
  try {
    let products = getProducts();
    const { search, category, priceMin, priceMax, sort, inStock } = req.query;

    // Filter by text search
    if (search) {
      const searchLower = search.toLowerCase().trim();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower)
      );
    }

    // Filter by category
    if (category && category !== 'All') {
      const catLower = category.toLowerCase().trim();
      products = products.filter((p) => p.category.toLowerCase() === catLower);
    }

    // Filter by min price
    if (priceMin) {
      const min = parseFloat(priceMin);
      if (!isNaN(min)) {
        products = products.filter((p) => p.price >= min);
      }
    }

    // Filter by max price
    if (priceMax) {
      const max = parseFloat(priceMax);
      if (!isNaN(max)) {
        products = products.filter((p) => p.price <= max);
      }
    }

    // Filter by availability (in stock)
    if (inStock === 'true') {
      products = products.filter((p) => p.inStock);
    }

    // Sorting
    if (sort) {
      switch (sort) {
        case 'price_asc':
          products.sort((a, b) => a.price - b.price);
          break;
        case 'price_desc':
          products.sort((a, b) => b.price - a.price);
          break;
        case 'rating_desc':
          products.sort((a, b) => b.rating - a.rating);
          break;
        case 'name_asc':
          products.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'name_desc':
          products.sort((a, b) => b.name.localeCompare(a.name));
          break;
        default:
          // Default: leave original ordering
          break;
      }
    }

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Server error retrieving products.' });
  }
});

// 2. GET /api/categories - get list of all unique categories
app.get('/api/categories', (req, res) => {
  try {
    const products = getProducts();
    const categories = ['All', ...new Set(products.map((p) => p.category))];
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Server error retrieving categories.' });
  }
});

// 3. GET /api/products/:id - get single product detail
app.get('/api/products/:id', (req, res) => {
  try {
    const products = getProducts();
    const product = products.find((p) => p.id === req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Server error retrieving product details.' });
  }
});

// 4. POST /api/checkout - mock checkout order creation
app.post('/api/checkout', (req, res) => {
  try {
    const { items, shippingDetails, paymentDetails } = req.body;

    // Simple validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty or invalid.' });
    }

    if (!shippingDetails || !shippingDetails.fullName || !shippingDetails.address || !shippingDetails.email) {
      return res.status(400).json({ error: 'Missing shipping details.' });
    }

    if (!paymentDetails || !paymentDetails.cardNumber || !paymentDetails.expiryDate) {
      return res.status(400).json({ error: 'Missing payment details.' });
    }

    // Verify stock counts
    const products = getProducts();
    const errors = [];
    let subtotal = 0;

    items.forEach((item) => {
      const match = products.find((p) => p.id === item.id);
      if (!match) {
        errors.push(`Product ${item.id} not found in database.`);
      } else if (!match.inStock) {
        errors.push(`${match.name} is currently out of stock.`);
      } else if (match.stockCount < item.quantity) {
        errors.push(`Insufficient stock for ${match.name}. Only ${match.stockCount} left.`);
      } else {
        subtotal += match.price * item.quantity;
      }
    });

    if (errors.length > 0) {
      return res.status(400).json({ error: 'Checkout failed due to inventory mismatches.', details: errors });
    }

    // Success response
    const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const tax = subtotal * 0.08;
    const shipping = subtotal > 150 ? 0 : 15.00;
    const total = subtotal + tax + shipping;

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      orderId,
      summary: {
        subtotal: parseFloat(subtotal.toFixed(2)),
        tax: parseFloat(tax.toFixed(2)),
        shipping: parseFloat(shipping.toFixed(2)),
        total: parseFloat(total.toFixed(2))
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error processing checkout.' });
  }
});

app.listen(PORT, () => {
  console.log(`E-Commerce API server running on http://localhost:${PORT}`);
});
