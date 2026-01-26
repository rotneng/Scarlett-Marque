import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  IconButton,
  CircularProgress,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import { getProducts, updateProduct } from "../../../Actions/product.actions";
import Header from "../../header";

const API_BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://scarlett-marque.onrender.com";

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const productState = useSelector((state) => state.product);

  // 👇 FIXED: Wrapped in useMemo to prevent dependency cycle errors
  const products = useMemo(() => productState?.products || [], [productState]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [sizes, setSizes] = useState("");
  const [colors, setColors] = useState("");

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const formatImageForDisplay = (imgData) => {
    if (!imgData) return null;

    let path = imgData;
    if (typeof imgData === "object") {
      path = imgData.img || imgData.url || imgData.filename;
    }

    if (!path) return null;

    if (path.startsWith("http") || path.startsWith("data:")) {
      return path;
    }

    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${API_BASE_URL}${cleanPath}`;
  };

  useEffect(() => {
    if (products.length === 0) {
      dispatch(getProducts());
    } else {
      const productToEdit = products.find((p) => p._id === id);
      if (productToEdit) {
        setTitle(productToEdit.title || "");
        setDescription(productToEdit.description || "");
        setPrice(productToEdit.price || "");
        setCategory(productToEdit.category || "");
        setStock(productToEdit.stock || "");

        setSizes(
          Array.isArray(productToEdit.sizes)
            ? productToEdit.sizes.join(",")
            : productToEdit.sizes || "",
        );
        setColors(
          Array.isArray(productToEdit.colors)
            ? productToEdit.colors.join(",")
            : productToEdit.colors || "",
        );

        let rawImages = [];
        if (productToEdit.images && productToEdit.images.length > 0) {
          rawImages = productToEdit.images;
        } else if (
          productToEdit.productPictures &&
          productToEdit.productPictures.length > 0
        ) {
          rawImages = productToEdit.productPictures;
        }

        const formatted = rawImages
          .map((img) => formatImageForDisplay(img))
          .filter((url) => url !== null);

        setExistingImages(formatted);
      }
    }
  }, [id, products, dispatch]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const validFiles = files.filter((file) => file.type.startsWith("image/"));
      setNewImages((prev) => [...prev, ...validFiles]);
    }
  };

  const removeNewImage = (index) => {
    setNewImages(newImages.filter((_, i) => i !== index));
  };

  const removeExistingImage = (indexToRemove) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("stock", stock);
      formData.append("sizes", sizes);
      formData.append("colors", colors);

      existingImages.forEach((url) => {
        let cleanPath = url;
        if (url.startsWith(API_BASE_URL)) {
          cleanPath = url.replace(API_BASE_URL, "");
        }

        formData.append("existingImages", cleanPath);
      });

      if (newImages.length > 0) {
        newImages.forEach((file) => {
          formData.append("images", file);
        });
      }

      await dispatch(updateProduct(id, formData, navigate));
    } catch (error) {
      console.log("Update failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <Box
        sx={{
          p: { xs: 2, md: 4 },
          width: { xs: "95%", sm: "80%", md: "600px" },
          maxWidth: "600px",
          margin: "0 auto",
          bgcolor: "#f4f4f4",
          minHeight: "100vh",
        }}
      >
        <Paper elevation={3} sx={{ p: { xs: 3, md: 4 }, borderRadius: 2 }}>
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{
              mb: 3,
              textAlign: "center",
              fontSize: { xs: "1.5rem", md: "2.125rem" },
              color: "#0f2a1d",
            }}
          >
            Update Product
          </Typography>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="Product Title"
                  fullWidth
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Price"
                  type="number"
                  fullWidth
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Stock"
                  type="number"
                  fullWidth
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Category"
                  fullWidth
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Sizes"
                  fullWidth
                  value={sizes}
                  onChange={(e) => setSizes(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  helperText="Comma separated (e.g. S,M,L)"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Colors"
                  fullWidth
                  value={colors}
                  onChange={(e) => setColors(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  helperText="Comma separated (e.g. Red,Blue)"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Description"
                  multiline
                  rows={4}
                  fullWidth
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <Box
                  sx={{
                    border: "1px dashed #ccc",
                    p: 2,
                    borderRadius: 2,
                    bgcolor: "#fafafa",
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{ mb: 1, color: "text.secondary" }}
                  >
                    Current Images (Click trash icon to delete)
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 1,
                      mb: 3,
                    }}
                  >
                    {existingImages.length > 0 ? (
                      existingImages.map((imgUrl, index) => (
                        <Box
                          key={index}
                          sx={{
                            width: 80,
                            height: 80,
                            border: "1px solid #eee",
                            borderRadius: 1,
                            position: "relative",
                          }}
                        >
                          <img
                            src={imgUrl}
                            alt="Current"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              borderRadius: "4px",
                            }}
                          />
                          <IconButton
                            size="small"
                            onClick={() => removeExistingImage(index)}
                            sx={{
                              position: "absolute",
                              top: 0,
                              right: 0,
                              bgcolor: "rgba(255,255,255,0.8)",
                              p: "2px",
                              "&:hover": {
                                bgcolor: "white",
                                color: "red",
                              },
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      ))
                    ) : (
                      <Typography
                        variant="caption"
                        sx={{ fontStyle: "italic", color: "orange" }}
                      >
                        All existing images removed.
                      </Typography>
                    )}
                  </Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ mb: 1, color: "text.secondary" }}
                  >
                    Add New Images
                  </Typography>

                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<CloudUploadIcon />}
                    fullWidth
                    sx={{
                      color: "#0f2a1d",
                      borderColor: "#0f2a1d",
                      mb: 2,
                      "&:hover": {
                        borderColor: "#144430",
                        bgcolor: "rgba(15, 42, 29, 0.04)",
                      },
                    }}
                  >
                    Select New Files
                    <input
                      type="file"
                      hidden
                      multiple
                      onChange={handleImageChange}
                      accept="image/*"
                    />
                  </Button>

                  {newImages.length > 0 && (
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 1,
                      }}
                    >
                      {newImages.map((file, index) => (
                        <Box
                          key={index}
                          sx={{
                            position: "relative",
                            width: 80,
                            height: 80,
                            border: "1px solid #ddd",
                            borderRadius: 1,
                          }}
                        >
                          <img
                            src={URL.createObjectURL(file)}
                            alt="New Preview"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              borderRadius: "4px",
                            }}
                          />
                          <IconButton
                            size="small"
                            onClick={() => removeNewImage(index)}
                            sx={{
                              position: "absolute",
                              top: 0,
                              right: 0,
                              bgcolor: "rgba(255,255,255,0.8)",
                              p: "2px",
                              "&:hover": {
                                bgcolor: "white",
                                color: "red",
                              },
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  size="large"
                  sx={{
                    bgcolor: "#0f2a1d",
                    mt: 2,
                    py: 1.5,
                    "&:hover": { bgcolor: "#144430" },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Update Product"
                  )}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    </>
  );
};

export default UpdateProduct;
