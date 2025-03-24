import {
    Box,
    Button,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem
} from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import {useNavigate} from "react-router-dom";
import {ActivityCard} from "../components/ActivityCard";
import AddIcon from "@mui/icons-material/Add";
import {useEffect, useState} from "react";
import {ActivityCategory, Gender} from "../Enum";
import {getActivities} from "../api/activities/getActivities";
import {getTrainerId} from "../helpers/localStorageHelper";
import {createActivity} from "../api/activities/createActivity";

export const MyActivitiesPage = () => {
    const [activities, setActivities] = useState([]);
    const [error, setError] = useState(null);
    const [errors, setErrors] = useState({
        title: "",
        description: "",
        category: "",
        gender: "",
    });
    const [openDialog, setOpenDialog] = useState(false);
    const [newActivity, setNewActivity] = useState({
        title: "",
        description: "",
        category: "",
        gender: "",
    });

    const trainerId = getTrainerId();

    const fetchActivities = async () => {
        setError(null);
        try {
            const data = await getActivities(trainerId);
            const sorted = (data || []).sort((a, b) => b.id - a.id);
            setActivities(sorted);
        } catch (err) {
            setError("Eroare la încărcarea activităților.");
        }
    };

    useEffect(() => {
        fetchActivities();
    }, []);

    const handleOpenDialog = () => {
        setNewActivity({
            title: "",
            description: "",
            category: "",
            gender: "",
        });
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleChange = (e) => {
        const {name, value} = e.target;

        setNewActivity((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const handleSubmit = async () => {
        try {
            const newErrors = {};

            if (!newActivity.title.trim()) {
                newErrors.title = "Titlul este obligatoriu.";
            }

            if (!newActivity.description.trim()) {
                newErrors.description = "Descrierea este obligatorie.";
            } else if (newActivity.description.length > 245) {
                newErrors.description = "Descrierea nu poate avea mai mult de 245 de caractere.";
            }

            if (!newActivity.category) {
                newErrors.category = "Selectează o categorie.";
            }

            if (!newActivity.gender) {
                newErrors.gender = "Selectează un gen.";
            }

            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
                return;
            }
            const response = await createActivity(trainerId, newActivity);

            if (response === null) {
                setError("A apărut o eroare la comunicarea cu serverul.");
                return;
            }

            if (!response.success) {
                setError(response.error || "Activitatea nu a fost creată. Încearcă din nou.");
                return;
            }

            fetchActivities();
            setOpenDialog(false);
        } catch (err) {
            setError("A apărut o eroare neașteptată. Te rugăm să încerci din nou.");
            console.error("Eroare la creare:", err);
        }
    };

    return (
        <Box sx={{padding: 2}}>
            <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2}}>
                <h2>Activitățile Mele</h2>
                <Button
                    variant="contained"
                    startIcon={<AddIcon/>}
                    onClick={handleOpenDialog}
                >
                    Adaugă activitate
                </Button>
            </Box>

            {error ? (
                <Alert severity="error">{error}</Alert>
            ) : activities.length === 0 ? (
                <Alert severity="info">Nu ai încă activități adăugate.</Alert>
            ) : (
                <Grid2 container spacing={2}>
                    {activities.map((activity) => (
                        <Grid2 xs={12} sm={6} md={4} key={activity.id}>
                            <ActivityCard {...activity} />
                        </Grid2>
                    ))}
                </Grid2>
            )}

            <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
                <DialogTitle>Adaugă Activitate</DialogTitle>
                <DialogContent sx={{display: "flex", flexDirection: "column", gap: 2, mt: 1}}>
                    <TextField
                        sx={{mt: 1}}
                        label="Titlu"
                        name="title"
                        value={newActivity.title}
                        onChange={handleChange}
                        fullWidth
                        error={Boolean(errors.title)}
                        helperText={errors.title}
                    />
                    <TextField
                        label="Descriere"
                        name="description"
                        value={newActivity.description}
                        onChange={handleChange}
                        multiline
                        rows={3}
                        fullWidth
                        error={Boolean(errors.description)}
                        helperText={errors.description}
                    />
                    <TextField
                        select
                        label="Categorie"
                        name="category"
                        value={newActivity.category}
                        onChange={handleChange}
                        fullWidth
                        error={Boolean(errors.category)}
                        helperText={errors.category}
                    >
                        {Object.entries(ActivityCategory).map(([key, label]) => (
                            <MenuItem key={key} value={key}>
                                {label}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        select
                        label="Gen"
                        name="gender"
                        value={newActivity.gender}
                        onChange={handleChange}
                        fullWidth
                        error={Boolean(errors.gender)}
                        helperText={errors.gender}
                    >
                        {Object.entries(Gender).map(([key, label]) => (
                            <MenuItem key={key} value={key}>
                                {label}
                            </MenuItem>
                        ))}
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Anulează</Button>
                    <Button onClick={handleSubmit} variant="contained">Salvează</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
