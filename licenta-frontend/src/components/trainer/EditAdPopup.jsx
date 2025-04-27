import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Button, Box, Typography,
} from "@mui/material";
import {Weekday} from "../../Enum";
import {useState, useEffect} from "react";
import {updateAd} from "../../api/ads/updateAd";

export const EditAdPopup = ({open, onClose, onSave, adToEdit}) => {
    const [formData, setFormData] = useState({
        price: "",
        minAge: "",
        maxAge: "",
        totalSpots: "",
        location: "",
        startDate: "",
        endDate: "",
        durationRules: [],
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
                location: adToEdit.location || "",
                startDate: adToEdit.startDate || "",
                endDate: adToEdit.endDate || "",
                durationRules: adToEdit.durationRules || [],
                description: adToEdit.description || ""
            });
            setErrors({});
        }
    }, [adToEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const addDurationRule = () => {
        setFormData((prev) => ({
            ...prev,
            durationRules: [...prev.durationRules, { day: "", startHour: 8, numberOfHours: 1 }]
        }));
    };

    const handleDurationRuleChange = (index, field, value) => {
        setFormData((prev) => {
            const updatedRules = [...prev.durationRules];
            updatedRules[index] = { ...updatedRules[index], [field]: value };
            return { ...prev, durationRules: updatedRules };
        });
    };

    const removeDurationRule = (index) => {
        setFormData((prev) => ({
            ...prev,
            durationRules: prev.durationRules.filter((_, i) => i !== index)
        }));
    };

    const validateForm = () => {
        let newErrors = {};
        if (!formData.price) newErrors.price = "Prețul este obligatoriu";
        if (!formData.minAge) newErrors.minAge = "Vârsta minimă este obligatorie";
        if (!formData.maxAge) newErrors.maxAge = "Vârsta maximă este obligatorie";
        if (!formData.totalSpots) newErrors.totalSpots = "Numărul de locuri este obligatoriu";
        if (!formData.location) newErrors.location = "Locația este obligatorie";
        if (!formData.startDate) newErrors.startDate = "Data de început este obligatorie";
        if (!formData.endDate) newErrors.endDate = "Data de sfârșit este obligatorie";
        if (!formData.description) newErrors.description = "Descrierea este obligatorie";
        if (!formData.durationRules || formData.durationRules.length === 0) {
            newErrors.durationRules = "Regulile de durată sunt obligatorii";
        }

        formData.durationRules.forEach((rule, index) => {
            if (!rule.day) newErrors[`durationRules.${index}.day`] = "Ziua este obligatorie";
            if (!rule.startHour) newErrors[`durationRules.${index}.startHour`] = "Ora de început este obligatorie";
            if (!rule.numberOfHours) newErrors[`durationRules.${index}.numberOfHours`] = "Numărul de ore este obligatoriu";
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (validateForm()) {
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
    }

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
                    label="Locație"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    error={!!errors.location}
                    helperText={errors.location}
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
                <Button variant="contained" onClick={addDurationRule} fullWidth>
                    Adaugă Regulă de Durată
                </Button>

                {formData.durationRules?.map((rule, index) => (
                    <Box key={index} sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                        <TextField
                            select
                            label="Zi"
                            name="day"
                            value={rule.day}
                            onChange={(e) => handleDurationRuleChange(index, "day", e.target.value)}
                            error={!!errors[`durationRules.${index}.day`]}
                            helperText={errors[`durationRules.${index}.day`]}
                            fullWidth
                        >
                            {Object.entries(Weekday).map(([key, label]) => (
                                <MenuItem key={key} value={key}>
                                    {label}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            select
                            label="Ora început"
                            name="startHour"
                            value={rule.startHour}
                            onChange={(e) => handleDurationRuleChange(index, "startHour", Number(e.target.value))}
                            error={!!errors[`durationRules.${index}.startHour`]}
                            helperText={errors[`durationRules.${index}.startHour`]}
                            fullWidth
                        >
                            {Array.from({ length: 14 }, (_, i) => i + 8).map((hour) => (
                                <MenuItem key={hour} value={hour}>
                                    {hour.toString().padStart(2, '0')}:00
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            label="Număr de ore"
                            name="numberOfHours"
                            type="number"
                            value={rule.numberOfHours}
                            onChange={(e) => handleDurationRuleChange(index, "numberOfHours", Number(e.target.value))}
                            error={!!errors[`durationRules.${index}.numberOfHours`]}
                            helperText={errors[`durationRules.${index}.numberOfHours`]}
                            fullWidth
                        />
                        <Button variant="containedSecondary" onClick={() => removeDurationRule(index)}>
                            Șterge
                        </Button>
                    </Box>
                ))}

                {errors.durationRules && (
                    <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                        {errors.durationRules}
                    </Typography>
                )}
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