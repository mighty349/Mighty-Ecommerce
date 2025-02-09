import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import cookieParser from "cookie-parser";
import cors from "cors";
import pg from "pg";
import bcrypt from "bcrypt";
import env from "dotenv";

env.config({ path: "./src/.env" });

const app = express();
const port = 3000;
const saltRounds=10;


const db = new pg.Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
  });
  db.connect();

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


// Session setup
app.use(session({
    secret: process.env.SESSION_SECRET, // Replace with a strong secret
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true, // Make sure the cookie is not accessible via JavaScript
        secure: false,  // Set to true if using HTTPS
        sameSite:"lax",
        maxAge: 1000 * 60 * 60 * 24 // Important for cross-origin cookies
    },
}));
app.use(cors({
    origin: "http://localhost:5173", // Replace with your frontend URL
    credentials: true
}));

app.use(passport.initialize());
app.use(passport.session());

// Dummy user data


// Passport Local Strategy


passport.use('local', new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (email, password, done) => {
      try {
        const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        if (result.rows.length === 0) {
          return done(null, false, { message: "User does not exist" });
        }
        const user = result.rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return done(null, false, { message: "Invalid credentials" });
        }
        console.log("Valid user:", user);
        // Tag the user type so we can differentiate later
        user.userType = "user";
        return done(null, user);
      } catch (error) {
        console.error("Error during authentication:", error);
        return done(error);
      }
    }
  ));

passport.use('admin-local', new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (email, password, done) => {
      try {
        // Query the admins table
        const hashedpassword = await bcrypt.hash(password, saltRounds);
        console.log(hashedpassword);
        const result = await db.query("SELECT * FROM admins WHERE email = $1", [email]);
        if (result.rows.length === 0) {
          return done(null, false, { message: "Admin does not exist" });
        }
        const admin = result.rows[0];
        
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
          return done(null, false, { message: "Invalid credentials" });
        }
        console.log("Valid admin:", admin);
        // Tag the user type as admin
        admin.userType = "admin";
        return done(null, admin);
      } catch (error) {
        console.error("Error during admin authentication:", error);
        return done(error);
      }
    }
  ));



// Serialize user into the session


// Login route
app.post("/login", (req, res, next) => {
    console.log("Login attempt:", req.body);
    passport.authenticate("local", (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({ message: info.message });
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            console.log('User logged in:', req.user);
            console.log('Session after login:', req.session);
            return res.status(200).json({ message: "Login Successful" });
        });
    })(req, res, next);
});

app.post("/admin-login", (req, res, next) => {
    console.log("Admin login attempt:", req.body);
    passport.authenticate('admin-local', (err, admin, info) => {
      if (err) return next(err);
      if (!admin) return res.status(401).json({ message: info.message });
      req.logIn(admin, (err) => {
        if (err) return next(err);
        console.log('Admin logged in:', admin);
        return res.status(200).json({ message: "Admin Login Successful" });
      });
    })(req, res, next);
  });

  // Admin edit product endpoint
app.put("/admin/product/:id", isAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, brand, current_price, original_price, discount, image_url } = req.body;
  try {
    const result = await db.query(
      `UPDATE products 
       SET name = $1, brand = $2, current_price = $3, original_price = $4, discount = $5, image_url = $6 
       WHERE id = $7 RETURNING *`,
      [name, brand, current_price, original_price, discount, image_url, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product updated successfully", product: result.rows[0] });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Error updating product" });
  }
});

// Admin delete product endpoint
app.delete("/admin/product/:id", isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query("DELETE FROM products WHERE id = $1 RETURNING *", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Error deleting product" });
  }
});

// Admin add product endpoint
// Admin add product endpoint
app.post("/admin/add-product", isAdmin, async (req, res) => {
  const { name, brand, current_price, original_price, discount, stock_quantity, image_url } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO products (name, brand, current_price, original_price, discount, stock_quantity, image_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [name, brand, current_price, original_price, discount, stock_quantity, image_url]
    );
    res.status(201).json({ message: "Product added successfully", product: result.rows[0] });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Error adding product" });
  }
});



// New route to fetch products
app.get("/products", async (req, res) => {
    try {
      const page = Number.parseInt(req.query.page) || 1
      const limit = 8
      const offset = (page - 1) * limit
  
      const result = await db.query("SELECT * FROM products ORDER BY id LIMIT $1 OFFSET $2", [limit, offset])
  
      const totalCount = await db.query("SELECT COUNT(*) FROM products")
      const totalProducts = Number.parseInt(totalCount.rows[0].count)
  
      res.json({
        products: result.rows,
        totalProducts: totalProducts,
        hasMore: offset + limit < totalProducts,
      })
    } catch (error) {
      console.error("Error fetching products:", error)
      res.status(500).json({ message: "Error fetching products" })
    }
  })


  // New route to fetch a specific product by ID
app.get("/product/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const result = await db.query("SELECT * FROM products WHERE id = $1", [id]);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Product not found" });
      }
      console.log(result.rows[0]);
      res.json(result.rows[0]); // Send the product details as the response
    } catch (error) {
      console.error("Error fetching product details:", error);
      res.status(500).json({ message: "Error fetching product details" });
    }
  });
  


// Middleware to protect routes
function isAuthenticated(req, res, next) {
    console.log('Session cookie:', req.session);
    console.log('Is authenticated:', req.isAuthenticated());
    if (req.isAuthenticated()) {
        return next();
    } else {
        console.log('User is not authenticated');
        res.status(401).json({ message: "Unauthorized" });
    }
}


// Protected route
app.get("/check", isAuthenticated, (req, res) => {
    console.log(req.user); // Check the user stored in the session
    res.status(200).json({ message: "Welcome to the Home Page!" });
});

// Middleware to check if the user is an admin
function isAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.userType === "admin") {
    return next();
  }
  res.status(401).json({ message: "Unauthorized - Admins only" });
}

// Admin check endpoint to verify admin authentication
app.get("/admin-check", isAdmin, (req, res) => {
  res.status(200).json({ message: "Welcome Admin" });
});


// Add to cart route (protected)
app.post("/api/cart/add", isAuthenticated, async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user.id;

        // Get product price
        const productResult = await db.query("SELECT * FROM products WHERE id = $1", [productId]);
        if (productResult.rows.length === 0) {
            return res.status(404).json({ error: "Product not found" });
        }
        const product = productResult.rows[0];

        // Upsert cart item using PostgreSQL ON CONFLICT
        const result = await db.query(`
            INSERT INTO cart (user_id, product_id, quantity, price_at_adding)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (user_id, product_id) 
            DO UPDATE SET quantity = cart.quantity + EXCLUDED.quantity
            RETURNING *
        `, [userId, productId, quantity, product.current_price]);

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Error adding to cart:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Get cart items (protected)
app.get("/api/cart", isAuthenticated, async (req, res) => {
    try {
        const result = await db.query(`
            SELECT cart.*, products.name, products.image_url 
            FROM cart
            JOIN products ON cart.product_id = products.id
            WHERE user_id = $1
        `, [req.user.id]);
        
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching cart:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


// Update Quantity Endpoint
app.put("/api/cart/:itemId", isAuthenticated, async (req, res) => {
    try {
      const { itemId } = req.params;
      const { quantity } = req.body;
  
      const result = await db.query(
        "UPDATE cart SET quantity = $1 WHERE id = $2 RETURNING *",
        [quantity, itemId]
      );
  
      res.json(result.rows[0]);
    } catch (error) {
      console.error("Error updating quantity:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
  // Remove Item Endpoint
  app.delete("/api/cart/:itemId", isAuthenticated, async (req, res) => {
    try {
      const { itemId } = req.params;
      await db.query("DELETE FROM cart WHERE id = $1", [itemId]);
      res.status(204).end();
    } catch (error) {
      console.error("Error removing item:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });


// Logout route
app.post("/logout", (req, res) => {
    req.logout(() => {
        res.status(200).json({ message: "Logged out successfully" });
    });
});

app.post("/register", async (req, res) => {
    try {
        console.log(req.body);
        const email = req.body.email;
        const password = req.body.password;

        // Validate that the email is a proper Gmail address
        const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
        if (!gmailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format. Only Gmail addresses are allowed." });
        }

        const check = await db.query("select * from users where email=$1", [email]);
        if (check.rows.length > 0) {
            return res.status(409).json({ message: "User already exists" });
        }
        const hashedpassword = await bcrypt.hash(password, saltRounds);

        await db.query("insert into users (email, password) values ($1, $2)", [email, hashedpassword]);
        res.status(200).json({ message: "Registered Successfully" });
    } catch (error) {
        console.log("Error during Registration:", error);
        res.status(500).json({ message: "An error occurred during registration" });
    }
});



// Serialize user into the session
passport.serializeUser((user, done) => {
    // We store the email and the userType so we know which table to query later
    done(null, { email: user.email, userType: user.userType });
  });
  
  passport.deserializeUser(async (obj, done) => {
    try {
      if (obj.userType === "admin") {
        const result = await db.query("SELECT * FROM admins WHERE email = $1", [obj.email]);
        if (result.rows.length === 0) return done(null, false);
        // Attach the userType again before returning
        const admin = result.rows[0];
        admin.userType = "admin";
        return done(null, admin);
      } else {
        const result = await db.query("SELECT * FROM users WHERE email = $1", [obj.email]);
        if (result.rows.length === 0) return done(null, false);
        return done(null, result.rows[0]);
      }
    } catch (error) {
      console.error("Error during deserialization:", error);
      return done(error);
    }
  });
  



// Start the server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

process.on("SIGINT", () => {
    console.log("Closing server");
    process.exit();
});
