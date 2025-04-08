import { useEffect, useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    CircularProgress,
    Typography,
    Box, List, ListItem, Avatar, ListItemAvatar, ListItemText, FormControlLabel, Radio, Alert, Snackbar
} from "@mui/material";
import { getChildren } from "../../api/children/getChildren";
import {getParentId} from "../../helpers/localStorageHelper";
import {calculateAge} from "../../helpers/calculateAge";
import {useParams} from "react-router-dom";
import {createEnrollmentRequest} from "../../api/enrollment-requests/createEnrollmentRequest";

export const CreateEnrollmentRequestPopup = ({ open, onClose, refreshAd }) => {
    const { id: adId } = useParams();
    const [children, setChildren] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedChild, setSelectedChild] = useState(null);
    const [successMessage, setSuccessMessage] = useState(false);

    useEffect(() => {
        if (open) {
            fetchChildren();
        }
    }, [open]);

    const fetchChildren = async () => {
        setLoading(true);
        setError(null);
        try {
            const childrenData = await getChildren(getParentId());
            setChildren(childrenData || []);
        } catch (err) {
            setError("Failed to load children. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSelectChild = (child) => {
        setSelectedChild(child);
    };

    const handleEnroll = async () => {
        if (selectedChild) {
            try {
                const response = await createEnrollmentRequest(adId, selectedChild.id);

                if (response === null) {
                    setError("A apărut o eroare la comunicarea cu serverul.");
                    return;
                }

                if (!response.success) {
                    setError(response.error || "Copilul nu a fost adăugat. Încearcă din nou.");
                    return;
                }

                setSuccessMessage(true);
                await refreshAd();
                onCloseButton();
            } catch (err) {
                console.log(err);
                setError("A apărut o eroare neașteptată. Te rugăm să încerci din nou.");
            }
        } else {
            setError("Te rog selectează un copil înainte de a înscrie.");
        }
    };

    const onCloseButton = () => {
        setSelectedChild(null);
        onClose();
    }

    const handleCloseSnackbar = () => {
        setSuccessMessage(false);
    };

    return (
        <>
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ textAlign: "center", fontWeight: "bold", pb: 1 }}>Listă copii</DialogTitle>
            <DialogContent>
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100px">
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Typography color="error" sx={{ textAlign: "center" }}>{error}</Typography>
                ) : children.length > 0 ? (
                    <List sx={{ width: "100%", bgcolor: "background.paper", borderRadius: 2, boxShadow: 1, p: 0 }}>
                        {children.map((child, index) => (
                            <ListItem
                                key={index}
                                sx={{
                                    borderBottom: index !== children.length - 1 ? "1px solid #e0e0e0" : "none",
                                    backgroundColor: selectedChild === child ? "#e0f7fa" : "transparent",
                                    cursor: "pointer",
                                }}
                                onClick={() => handleSelectChild(child)}
                            >
                                <ListItemAvatar>
                                    <Avatar sx={{ bgcolor: "#5cd65c", color: "white" }}>
                                        {child.firstName.charAt(0)}{child.lastName.charAt(0)}
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={`${child.firstName} ${child.lastName}`}
                                    secondary={`Vârsta: ${calculateAge(child.birthDate)} ani`}
                                />
                                <FormControlLabel
                                    control={<Radio checked={selectedChild === child} />}
                                    label=""
                                />
                            </ListItem>
                        ))}
                    </List>
                ) : (
                    <Typography sx={{ textAlign: "center", fontSize: "1rem", mt: 2 }}>
                        Nu există copii înregistrați.
                    </Typography>
                )}
            </DialogContent>
            <DialogActions sx={{ justifyContent: "space-between", p: 2 }}>
                <Button onClick={onCloseButton} variant="contained" color="secondary">
                    Închide
                </Button>
                {!error || error !== "Te rog selectează un copil înainte de a înscrie." ? (
                    <Button onClick={handleEnroll} variant="contained" color="primary">
                        Înscrie
                    </Button>
                ) : null}
            </DialogActions>
        </Dialog>
            <Snackbar open={successMessage} autoHideDuration={5000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                    Copil adăugat cu succes!
                </Alert>
            </Snackbar>
        </>
    );
};