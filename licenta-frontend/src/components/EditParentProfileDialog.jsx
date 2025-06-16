import React, { use, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Typography,
} from "@mui/material";
import { editParent } from "../api/parent/editParent";

export const EditParentProfileDialog = ({
  open,
  onClose,
  parentToEdit,
  onSave,
}) => {
  const [formData, setFormData] = React.useState(parentToEdit);
  const [errors, setErrors] = React.useState({});

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        await editParent(parentToEdit?.id, formData);

        onClose();
        onSave();
      } catch (err) {
        alert("A apărut o eroare la actualizarea părintelui. Încearcă din nou.");
      }
    }
  };

  console.log("Form data:", formData);

  const validateForm = () => {
    let newErrors = {};
    if (!formData?.firstName?.trim())
      newErrors.firstName = "Prenumele este obligatoriu.";
    if (!formData?.lastName?.trim())
      newErrors.lastName = "Numele este obligatoriu.";
    if (!formData?.phoneNumber?.trim())
      newErrors.phoneNumber = "Numărul de telefon este obligatoriu.";
    if (!formData?.gender) newErrors.gender = "Vă rugăm să selectați genul.";
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
          
          {errors.description && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {errors.description}
            </Typography>
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
