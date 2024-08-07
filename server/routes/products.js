const express = require('express');
const router = express.Router();
const multer = require('multer');
const Product = require('../models/Product');
const authMiddleware = require('../middlewares/authMiddleware.js');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

router.post('/', authMiddleware, upload.array('pictures', 6), async (req, res) => {
  try {
    const { name, price, quantity } = req.body;
    const userId = req.user._id;

    const pictures = req.files.map(file => file.path);

    const product = new Product({
      name,
      price,
      quantity,
      pictures,
      userId
    });

    await product.save();
    res.status(200).send("Product uploaded successfully'");
  }
  catch (err) {
    res.status(500).send("Failed to upload product");
  }
}
);

// route to read images from a user 
// router.post('/images',authMiddleware, async (req, res) => {
//   try {
//     const products = await Product.find().populate('userId').exec();
//     res.status(200).json(products); // Send the populated products as a JSON response
//   } catch (err) {
//     res.status(500).send("Failed to fetch products");
//     console.log(err);
//   }
// }
// );

module.exports = router;
