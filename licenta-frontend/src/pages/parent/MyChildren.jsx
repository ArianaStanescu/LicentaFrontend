import React, {useEffect, useState} from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid2,
    CircularProgress,
    Alert,
    Button,
    DialogActions,
    DialogTitle, Dialog, DialogContent, TextField, MenuItem
} from "@mui/material";
import {getParentId} from "../../helpers/localStorageHelper";
import {getChildren} from "../../api/children/getChildren";
import {Gender} from "../../Enum";
import {createChild} from "../../api/children/createChild";



export const MyChildren = () => {
    const [children, setChildren] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [newChild, setNewChild] = useState({ firstName: "", lastName: "", age: "", birthDate: "", gender: "" });
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleChange = (e) => setNewChild({ ...newChild, [e.target.name]: e.target.value });

    useEffect(() => {
        fetchChildren();
    }, []);

    const fetchChildren = async () => {
        setLoading(true);
        setError(null);
        try {
            const children = await getChildren(getParentId());
            setChildren(children || []);
        } catch (err) {
            setError("Failed to load children. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        try {
            const response = await createChild(getParentId(), newChild);

            if (response === null) {
                setError("A apărut o eroare la comunicarea cu serverul.");
                return;
            }

            if (!response.success) {
                setError(response.error || "Copilul nu a fost adăugat. Încearcă din nou.");
                return;
            }

            fetchChildren();
            handleClose();
        } catch (err) {
            setError("A apărut o eroare neașteptată. Te rugăm să încerci din nou.");
            console.error("Eroare la adăugare:", err);
        }
    };

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
                Copiii mei
            </Typography>
            <Grid2 container spacing={3} sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                {loading ? (
                    <CircularProgress />
                ) : error ? (
                    <Alert severity="error">{error}</Alert>
                ) : children.length > 0 ? (
                    children.map((child) => (
                        <Grid2 item xs={12} sm={6} md={4} key={child.id} sx={{width: '100%'}}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">{child.firstName + ' ' + child.lastName}</Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Vârstă: {child.age} ani
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Data nașterii: {child.birthDate}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Gen: {Gender[child.gender]}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid2>
                    ))
                ) : (
                    <Alert severity="info">Niciun copil găsit!</Alert>
                )}
            </Grid2>
            <Box sx={{ marginTop: 3, textAlign: "center" }}>
                <Button variant="contained" color="primary" onClick={handleOpen}>
                    Adaugă copil
                </Button>
            </Box>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Adaugă un copil</DialogTitle>
                <DialogContent>
                    <TextField fullWidth margin="dense" label="Prenume" name="firstName" onChange={handleChange} />
                    <TextField fullWidth margin="dense" label="Nume" name="lastName" onChange={handleChange} />
                    <TextField fullWidth margin="dense" label="Data nașterii" name="birthDate" type="date" InputLabelProps={{ shrink: true }} onChange={handleChange} />
                    <TextField
                        select
                        fullWidth
                        margin="dense"
                        label="Gen"
                        name="gender"
                        value={newChild.gender}
                        onChange={handleChange}
                    >
                        <MenuItem value="MALE">{Gender.MALE}</MenuItem>
                        <MenuItem value="FEMALE">{Gender.FEMALE}</MenuItem>>
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Anulează</Button>
                    <Button variant="contained" color="primary" onClick={handleSubmit}>Adaugă</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
