import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { CloudUpload } from "@mui/icons-material";
import { addProduct } from "../../../Actions/product.actions";

const AddProducts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    sizes: "",
    colors: "",
    stock: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (error) setError("");
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file");
        return;
      }
      setImage(file);
      setError("");
    }
  };

  const handleAddProduct = async () => {
    if (!formData.title || !formData.price || !formData.category) {
      setError("Title, Price and Category are required");
      return;
    }

    if (!image) {
      setError("Product image is required");
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();

      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });

      // Append image
      formDataToSend.append("image", image);

      await dispatch(addProduct(formDataToSend, navigate));
    } catch (error) {
      console.log("error in adding products", error);
      setError("Failed to add product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ pb: 5 }}>
      <Box
        sx={{
          bgcolor: "#0f2a1d",
          color: "white",
          p: 3,
          textAlign: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Add Products
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          maxWidth: "600px",
          margin: "0 auto",
          p: 2,
          boxShadow: 3,
          borderRadius: 2,
        }}
      >
        <TextField
          label="Title"
          name="title"
          onChange={handleInputChange}
          value={formData.title}
          fullWidth
          required
        />
        <TextField
          label="Description"
          name="description"
          onChange={handleInputChange}
          value={formData.description}
          multiline
          rows={3}
          fullWidth
        />

        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            label="Price"
            name="price"
            type="number"
            onChange={handleInputChange}
            value={formData.price}
            fullWidth
            required
          />
          <TextField
            label="Stock"
            name="stock"
            type="number"
            onChange={handleInputChange}
            value={formData.stock}
            fullWidth
          />
        </Box>

        <TextField
          label="Category"
          name="category"
          onChange={handleInputChange}
          value={formData.category}
          fullWidth
          required
        />
        <TextField
          label="Sizes (e.g. S, M, L)"
          name="sizes"
          onChange={handleInputChange}
          value={formData.sizes}
          fullWidth
        />
        <TextField
          label="Colors (e.g. Red, Blue)"
          name="colors"
          onChange={handleInputChange}
          value={formData.colors}
          fullWidth
        />

        <Box
          sx={{
            border: "1px dashed grey",
            p: 2,
            borderRadius: 1,
            textAlign: "center",
          }}
        >
          <Button
            variant="outlined"
            component="label"
            startIcon={<CloudUpload />}
            sx={{ mb: 1 }}
          >
            {image ? "Change Image" : "Upload Image"}
            <input type="file" hidden onChange={handleImage} accept="image/*" />
          </Button>

          {image && (
            <Typography variant="body2" color="primary">
              Selected: {image.name}
            </Typography>
          )}
        </Box>

        {error && (
          <Typography color="error" align="center">
            {error}
          </Typography>
        )}

        <Button
          variant="contained"
          onClick={handleAddProduct}
          disabled={loading}
          sx={{
            bgcolor: "#0f2a1d",
            color: "white",
            py: 1.5,
            fontSize: "16px",
          }}
        >
          {loading ? "Adding" : "Submit"}
        </Button>
      </Box>
    </Box>
  );
};

export default AddProducts;
