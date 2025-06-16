import React, { use, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  TextareaAutosize,
  Typography,
  Box,
} from "@mui/material";
import { editTrainer } from "../api/trainer/editTrainer";

export const EditTrainerProfileDialog = ({
  open,
  onClose,
  trainerToEdit,
  onSave,
}) => {
  const [formData, setFormData] = React.useState(trainerToEdit);
  const [errors, setErrors] = React.useState({});

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        const response = await editTrainer(formData);

        if (!response.success) {
          alert(response.error || "Eroare la actualizarea trainer-ului.");
          return;
        }

        onClose();
        onSave();
      } catch (err) {
        alert("A apărut o eroare. Încearcă din nou.");
      }
    }
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData?.firstName?.trim())
      newErrors.firstName = "Prenumele este obligatoriu.";
    if (!formData?.lastName?.trim())
      newErrors.lastName = "Numele este obligatoriu.";
    if (!formData?.phoneNumber?.trim())
      newErrors.phoneNumber = "Numărul de telefon este obligatoriu.";
    if (!formData?.gender) newErrors.gender = "Vă rugăm să selectați genul.";
    if (!formData?.birthDate)
      newErrors.birthDate = "Data nașterii este necesară pentru trainer.";
    if (!formData?.description)
      newErrors.description = "Descrierea trainer-ului este obligatorie.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if(Object.keys(errors).length > 0) {
      validateForm();
    }
  };

  const handleImageUpload = (e) => {
    setFormData((prev) => ({
      ...prev,
      trainerImage: e.target.files[0],
    }));
    if(Object.keys(errors).length > 0) {
        validateForm();
    }
  };
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Modifică datele</DialogTitle>
      {formData && (
        <DialogContent>
          <TextField
            label="Prenume"
            name="firstName"
            type="text"
            value={formData.firstName}
            onChange={handleChange}
            error={!!errors.firstName}
            helperText={errors.firstName}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Nume de familie"
            name="lastName"
            type="text"
            value={formData.lastName}
            onChange={handleChange}
            error={!!errors.lastName}
            helperText={errors.lastName}
            fullWidth
            margin="normal"
          />
          <TextField
            fullWidth
            label="Număr de telefon"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            error={!!errors.phoneNumber}
            helperText={errors.phoneNumber}
            margin="normal"
          />
          <TextField
            fullWidth
            select
            label="Gen"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            error={!!errors.gender}
            helperText={errors.gender}
            margin="normal"
          >
            <MenuItem value="MALE">Masculin</MenuItem>
            <MenuItem value="FEMALE">Feminin</MenuItem>
          </TextField>
          <TextField
            fullWidth
            label="Data nașterii"
            name="birthDate"
            type="date"
            value={formData.birthDate}
            onChange={handleChange}
            error={!!errors.birthDate}
            helperText={errors.birthDate}
            margin="normal"
            InputLabelProps={{ shrink: true }}
            InputProps={{
              inputProps: {
                max: new Date(
                  new Date().setFullYear(new Date().getFullYear() - 18)
                )
                  .toISOString()
                  .split("T")[0],
              },
            }}
          />
          <TextareaAutosize
            placeholder="Descriere trainer"
            multiline
            name="description"
            minRows={3}
            fullWidth
            value={formData.description}
            onChange={handleChange}
            style={{
              resize: "vertical",
              maxHeight: "500px",
              minHeight: "50px",
              width: "100%",
              marginTop: "10px",
            }}
          />
          {errors.description && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {errors.description}
            </Typography>
          )}

          <Button variant="contained" component="label">
            Încarcă o nouă imagine (JPEG)
            <input
              type="file"
              accept="image/jpeg"
              hidden
              onChange={handleImageUpload}
            />
          </Button>

          {errors?.trainerImage && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {errors.trainerImage}
            </Typography>
          )}
          {formData?.trainerImage && (
            <Box sx={{ fontSize: "0.9rem", color: "gray" }}>
              Fișier selectat: {formData.trainerImage?.name}
            </Box>
          )}
        </DialogContent>
      )}
      <DialogActions>
        <Button onClick={() => onClose()}>Închide</Button>
        <Button onClick={() => handleSubmit()} variant="contained">
          Salvează
        </Button>
      </DialogActions>
    </Dialog>
  );
};
