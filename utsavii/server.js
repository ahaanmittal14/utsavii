const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const Review = require("./models/Review");
const Product = require("./models/Product");

const app = express();
const PORT = 5000;
const MONGO_URI = process.env.MONGO_URI;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
  })
  .catch((error) => {
    console.error("❌ MongoDB connection failed:");
    console.error(error.message);
  });

// Server test
app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "Utsavii server is working!",
  });
});

// Create a review
// Create a review
app.post("/api/reviews", async (req, res) => {
  try {
    const { productId, customerName, rating, comment } = req.body;

    if (!productId || !customerName || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "All review fields are required.",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5.",
      });
    }

    const review = await Review.create({
      productId,
      customerName,
      rating,
      comment,
    });

    res.status(201).json({
      success: true,
      message: "Review submitted for approval.",
      review,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Could not create review.",
    });
  }
});

// Get approved reviews for a product
app.get("/api/reviews/product/:productId", async (req, res) => {
  try {
    const reviews = await Review.find({
      productId: req.params.productId,
      approved: true,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      reviews,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Could not load reviews.",
    });
  }
});

// Get approved reviews for a product
app.get("/api/reviews/:productId", async (req, res) => {
  try {
    const reviews = await Review.find({
      productId: req.params.productId,
      approved: true,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      reviews,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Could not load reviews.",
    });
  }
});
// Get all reviews for the admin panel
app.get("/api/admin/reviews", async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      reviews,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Could not load admin reviews.",
    });
  }
});

// Approve a review
app.patch("/api/admin/reviews/:id/approve", async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { approved: true },
      { new: true },
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found.",
      });
    }

    res.json({
      success: true,
      message: "Review approved.",
      review,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Could not approve review.",
    });
  }
});

// Hide a review
app.patch("/api/admin/reviews/:id/hide", async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { approved: false },
      { new: true },
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found.",
      });
    }

    res.json({
      success: true,
      message: "Review hidden.",
      review,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Could not hide review.",
    });
  }
});

// Delete a review
app.delete("/api/admin/reviews/:id", async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found.",
      });
    }

    res.json({
      success: true,
      message: "Review deleted.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Could not delete review.",
    });
  }
});

// Get all products
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find({
      display: true,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      products,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Could not load products.",
    });
  }
});

// Get one product
app.get("/api/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Could not load product.",
    });
  }
});

// Create a product
app.post("/api/products", async (req, res) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      message: "Product created.",
      product,
    });
  } catch (error) {
    console.error(error);

    res.status(400).json({
      success: false,
      message: "Could not create product.",
      error: error.message,
    });
  }
});
// ===============================
// PRODUCT API
// ===============================

// Get all products
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find({
      display: true,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Get products error:", error);

    res.status(500).json({
      success: false,
      message: "Could not load products.",
    });
  }
});

// Get one product
app.get("/api/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Get product error:", error);

    res.status(500).json({
      success: false,
      message: "Could not load product.",
    });
  }
});

// Create a product
app.post("/api/products", async (req, res) => {
  try {
    const product = await Product.create({
      name: req.body.name,
      price: req.body.price,
      description: req.body.description || "",
      category: req.body.category || "Sarees",
      image: req.body.image || "",
      badge: req.body.badge || "",
      featured: req.body.featured || false,
      display: req.body.display !== false,
    });

    res.status(201).json({
      success: true,
      message: "Product created.",
      product,
    });
  } catch (error) {
    console.error("Create product error:", error);

    res.status(400).json({
      success: false,
      message: "Could not create product.",
      error: error.message,
    });
  }
});
app.listen(PORT, () => {
  console.log(`🚀 Utsavii server running at http://localhost:${PORT}`);
});
