import React, {useEffect, useState} from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid2,
    Alert,
    Button,
    DialogActions,
    DialogTitle, Dialog, DialogContent, TextField, MenuItem
} from "@mui/material";
import {getParentId} from "../../helpers/localStorageHelper";
import {getChildren} from "../../api/children/getChildren";
import {Gender} from "../../Enum";
import {createChild} from "../../api/children/createChild";
import {useNavigate} from "react-router-dom";
import {EditChildDialog} from "../../components/parent/EditChildDialog";
import {updateChild} from "../../api/children/updateChild";
import {calculateAge} from "../../helpers/calculateAge";


export const MyChildren = () => {
    const navigate = useNavigate();
    const [children, setChildren] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [newChild, setNewChild] = useState({firstName: "", lastName: "", age: "", birthDate: "", gender: ""});
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [editChild, setEditChild] = useState(null);
    const [editOpen, setEditOpen] = useState(false);

    useEffect(() => {
        fetchChildren();
    }, []);

    const fetchChildren = async () => {
        setError(null);
        try {
            setIsLoading(true)
            const children = await getChildren(getParentId());
            setChildren(children || []);
            console.log(children);
        } catch (err) {
            setError("Failed to load children. Please try again.");
        } finally {
            setIsLoading(false);
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

    const handleEditOpen = (child) => {
        setEditChild(child);
        setEditOpen(true);
    };
    const handleEditClose = () => {
        setEditChild(null);
        setEditOpen(false);
    };

    const handleChange = (e) => setNewChild({ ...newChild, [e.target.name]: e.target.value });

    const handleUpdateChild = async (updatedChild) => {
        try {
            const response = await updateChild(updatedChild.id, updatedChild);
            if (!response?.success) {
                setError("Actualizarea a eșuat.");
                return;
            }
            await fetchChildren();
        } catch (err) {
            console.error("Eroare la actualizare:", err);
            setError("A apărut o eroare la actualizarea copilului.");
        }
    };

    return (
        <Box sx={{padding: 3}}>
            <Typography variant="h4" gutterBottom>
                Copiii mei
            </Typography>
            <Grid2 container spacing={1} sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant="contained" color="primary" onClick={handleOpen}>
                        Adaugă copil
                    </Button>
                </Box>
                {error && (
                    <Box sx={{ minHeight: { xs: "auto", md: "600px" } }}>
                        <Alert severity="error">{error}</Alert>
                    </Box>
                )}
                {!error && !isLoading && children.length === 0 && (
                    <Box sx={{ minHeight: { xs: "auto", md: "600px" } }}>
                        <Alert severity="info">Niciun copil găsit!</Alert>
                    </Box>
                )}
                {!error && !isLoading && children.length > 0 && (
                    children.map((child) => (
                        <Grid2 item xs={12} sm={6} md={4} key={child.id} sx={{width: '100%'}}>
                            <Card>
                                <Box display="flex" justifyContent="space-between" alignItems="start" p={2}>
                                    <CardContent sx={{padding: 0, paddingRight: 2}}>
                                        <Typography variant="h6">{child.firstName + ' ' + child.lastName}</Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Vârstă: {calculateAge(child.birthDate)} ani
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Data nașterii: {child.birthDate}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Gen: {Gender[child.gender]}
                                        </Typography>
                                        <Button variant='text'  onClick={() => handleEditOpen(child)}>Editează</Button>
                                    </CardContent>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        sx={{height: 'fit-content', mt: 6}}
                                        onClick={() => {
                                            navigate(`/child-groups/${child.id}`)
                                        }}
                                    >
                                        Vizualizare grupă
                                    </Button>
                                </Box>
                            </Card>

                        </Grid2>
                    ))
                )}
            </Grid2>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Adaugă un copil</DialogTitle>
                <DialogContent>
                    <TextField fullWidth margin="dense" label="Prenume" name="firstName" onChange={handleChange}/>
                    <TextField fullWidth margin="dense" label="Nume" name="lastName" onChange={handleChange}/>
                    <TextField fullWidth margin="dense" label="Data nașterii" name="birthDate" type="date"
                        InputProps={{
                            inputProps: {
                                max: new Date().toISOString().split("T")[0],
                            },
                        }}
                        InputLabelProps={{ shrink: true }} onChange={handleChange} />
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
                        <MenuItem value="FEMALE">{Gender.FEMALE}</MenuItem>
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Anulează</Button>
                    <Button variant="contained" color="primary" onClick={handleSubmit}>Adaugă</Button>
                </DialogActions>
            </Dialog>

            <EditChildDialog
                open={editOpen}
                onClose={handleEditClose}
                child={editChild}
                setChild={setEditChild}
                onSave={handleUpdateChild}
            />
        </Box>
    );
};
