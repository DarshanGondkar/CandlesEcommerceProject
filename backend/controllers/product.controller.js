import Product from "../models/product.model.js";
import Subscriber from "../models/Subscriber.js";                  

// GET ALL PRODUCTS (with filters)
export const getProducts = async (req, res) => {
  try {
    const {
      minPrice,
      maxPrice,
      size,
      scent,
      sort,
    } = req.query;

    let query = { isActive: true };

    if (minPrice && maxPrice) {
      query.price = { $gte: minPrice, $lte: maxPrice };
    }

    if (size) query.size = size;
    if (scent) query.scentProfile = scent;

    let productsQuery = Product.find(query);

    // Sorting
    if (sort === "low-high") productsQuery.sort({ price: 1 });
    if (sort === "high-low") productsQuery.sort({ price: -1 });
    if (sort === "newest") productsQuery.sort({ createdAt: -1 });

    const products = await productsQuery;
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

// GET SINGLE PRODUCT
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch {
    res.status(500).json({ message: "Error fetching product" });
  }
};



