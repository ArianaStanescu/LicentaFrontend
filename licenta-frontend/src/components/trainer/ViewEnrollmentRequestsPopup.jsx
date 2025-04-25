import {useEffect, useState} from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    CircularProgress,
    Typography,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Snackbar,
    Alert
} from "@mui/material";
import {useParams} from "react-router-dom";
import {getEnrollmentRequests} from "../../api/enrollment-requests/getEnrollmentRequests";
import {calculateAge} from "../../helpers/calculateAge";
import {rejectEnrollmentRequest} from "../../api/enrollment-requests/rejectEnrollmentRequest";
import {acceptEnrollmentRequest} from "../../api/enrollment-requests/acceptEnrollmentRequest";

export const ViewEnrollmentRequestsPopup = ({open, onClose}) => {
    const {id: adId} = useParams();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    useEffect(() => {
        if (open) {
            fetchRequests();
        }
    }, [open]);

    const fetchRequests = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getEnrollmentRequests(adId);
            setRequests(response || []);
        } catch (err) {
            setError("Eroare la încărcarea solicitărilor.");
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async (requestId, childId) => {
        try {
            await acceptEnrollmentRequest(requestId);
            setRequests(prev =>
                prev.map(req =>
                    req.id === requestId ? {...req, status: 'APPROVED'} : req
                )
            );
            setSuccessMessage("Cererea a fost acceptată!");
        } catch (err) {
            setError("Eroare la acceptarea cererii.");
        }
    };

    const handleReject = async (requestId, childId) => {
        try {
            await rejectEnrollmentRequest(requestId);
            setRequests(prev =>
                prev.map(req =>
                    req.id === requestId ? {...req, status: 'REJECTED'} : req
                )
            );
            setSuccessMessage("Cererea a fost respinsă!");
        } catch (err) {
            setError("Eroare la respingerea cererii.");
        }
    };

    const handleCloseSnackbar = () => {
        setSuccessMessage(null);
    };

    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
                <DialogTitle sx={{textAlign: "center", fontWeight: "bold"}}>Cereri de înscriere</DialogTitle>
                <DialogContent>
                    {loading ? (
                        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100px">
                            <CircularProgress/>
                        </Box>
                    ) : error ? (
                        <Typography color="error" sx={{textAlign: "center"}}>{error}</Typography>
                    ) : requests.length > 0 ? (
                        <TableContainer component={Paper} sx={{mt: 2}}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="left"><strong>Nume copil</strong></TableCell>
                                        <TableCell align="left"><strong>Vârstă</strong></TableCell>
                                        <TableCell align="left"><strong>Acțiuni</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {requests.map((request, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{request.child.firstName} {request.child.lastName}</TableCell>
                                            <TableCell>{calculateAge(request.child.birthDate)} ani</TableCell>
                                            <TableCell>
                                                {request.status === 'PENDING' &&
                                                    <Box>
                                                        <Button
                                                            variant="contained"
                                                            color="secondary"
                                                            sx={{mr: 1}}
                                                            onClick={() => handleReject(request.id, request.child.id)}
                                                        >
                                                            Respinge
                                                        </Button>
                                                        <Button
                                                            variant="contained"
                                                            color="primary"

                                                            onClick={() => handleAccept(request.id, request.child.id)}
                                                        >
                                                            Acceptă
                                                        </Button>
                                                    </Box>
                                                }
                                                {request.status === 'CANCELED' && <Typography color="secondary">Anulată</Typography>}
                                                {request.status === 'REJECTED' && <Typography color="error">Respinsă</Typography>}
                                                {request.status === 'APPROVED' && <Typography color="primary">Acceptată</Typography>}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    ) : (
                        <Typography sx={{textAlign: "center", fontSize: "1rem", mt: 2}}>
                            Nu există cereri de înscriere.
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions sx={{justifyContent: "space-between", p: 2}}>
                    <Button onClick={onClose} variant="contained" color="secondary">
                        Închide
                    </Button>
                    <Button onClick={onClose} variant="contained" color="primary">
                        OK
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={Boolean(successMessage)} autoHideDuration={5000} onClose={handleCloseSnackbar}
                      anchorOrigin={{vertical: "top", horizontal: "center"}}>
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{width: '100%'}}>
                    {successMessage}
                </Alert>
            </Snackbar>
        </>
    );
};
