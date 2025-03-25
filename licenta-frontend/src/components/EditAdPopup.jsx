import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Button,
} from "@mui/material";
import {Weekday} from "../Enum";
import {useState, useEffect} from "react";
import {updateAd} from "../api/ads/updateAd";

export const EditAdPopup = ({open, onClose, onSave, adToEdit}) => {
    const [formData, setFormData] = useState({
        price: "",
        minAge: "",
        maxAge: "",
        totalSpots: "",
        startDate: "",
        endDate: "",
        activityDays: [],
        description: ""
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (adToEdit) {
            setFormData({
                price: adToEdit.price || "",
                minAge: adToEdit.minAge || "",
                maxAge: adToEdit.maxAge || "",
                totalSpots: adToEdit.totalSpots || "",
                startDate: adToEdit.startDate || "",
                endDate: adToEdit.endDate || "",
                activityDays: adToEdit.activityDays || [],
                description: adToEdit.description || ""
            });
            setErrors({});
        }
    }, [adToEdit]);

    const handleChange = (e) => {
        const {name, value, type} = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "number" ? Number(value) : value
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: ""
        }));
    };

    const handleDaysChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            activityDays: e.target.value
        }));
    };

    const validate = () => {
        const newErrors = {};
        const requiredFields = ["price", "minAge", "maxAge", "totalSpots", "startDate", "endDate", "activityDays"];

        requiredFields.forEach((field) => {
            if (!formData[field] || (Array.isArray(formData[field]) && formData[field].length === 0)) {
                newErrors[field] = "Acest câmp este obligatoriu.";
            }
        });

        if (formData.description && formData.description.length > 255) {
            newErrors.description = "Descrierea nu poate depăși 255 de caractere.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (validate()) {
            try {
                const payload = {
                    ...adToEdit,
                    ...formData
                };
                const response = await updateAd(adToEdit.id, payload);

                if (!response.success) {
                    alert(response.error || "Eroare la actualizarea anunțului.");
                    return;
                }

                onSave(payload);
            } catch (err) {
                alert("A apărut o eroare. Încearcă din nou.");
            }
        }

    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Editează anunțul</DialogTitle>
            <DialogContent sx={{display: "flex", flexDirection: "column", gap: 2, mt: 1}}>
                <TextField
                    sx={{mt: 1}}
                    label="Preț (RON)"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    error={!!errors.price}
                    helperText={errors.price}
                    fullWidth
                />
                <TextField
                    label="Vârstă minimă"
                    name="minAge"
                    type="number"
                    value={formData.minAge}
                    onChange={handleChange}
                    error={!!errors.minAge}
                    helperText={errors.minAge}
                    fullWidth
                />
                <TextField
                    label="Vârstă maximă"
                    name="maxAge"
                    type="number"
                    value={formData.maxAge}
                    onChange={handleChange}
                    error={!!errors.maxAge}
                    helperText={errors.maxAge}
                    fullWidth
                />
                <TextField
                    label="Locuri disponibile"
                    name="totalSpots"
                    type="number"
                    value={formData.totalSpots}
                    onChange={handleChange}
                    error={!!errors.totalSpots}
                    helperText={errors.totalSpots}
                    fullWidth
                />
                <TextField
                    label="Descriere"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    multiline
                    rows={3}
                    fullWidth
                    error={!!errors.description}
                    helperText={errors.description}
                />
                <TextField
                    label="Dată început"
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleChange}
                    InputLabelProps={{shrink: true}}
                    error={!!errors.startDate}
                    helperText={errors.startDate}
                    fullWidth
                />
                <TextField
                    label="Dată sfârșit"
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleChange}
                    InputLabelProps={{shrink: true}}
                    error={!!errors.endDate}
                    helperText={errors.endDate}
                    fullWidth
                />
                <TextField
                    select
                    label="Zile activitate"
                    name="activityDays"
                    value={formData.activityDays}
                    onChange={handleDaysChange}
                    SelectProps={{multiple: true}}
                    error={!!errors.activityDays}
                    helperText={errors.activityDays}
                    fullWidth
                >
                    {Object.entries(Weekday).map(([key, label]) => (
                        <MenuItem key={key} value={key}>
                            {label}
                        </MenuItem>
                    ))}
                </TextField>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Anulează</Button>
                <Button onClick={handleSubmit} variant="contained">
                    Salvează
                </Button>
            </DialogActions>
        </Dialog>
    );
};