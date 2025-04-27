import {useEffect, useState} from "react";
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button, Alert
} from "@mui/material";
import {ArrowBack, ArrowForward} from "@mui/icons-material";
import {getParentId} from "../../helpers/localStorageHelper";
import Grid2 from "@mui/material/Grid2";
import {useNavigate} from "react-router-dom";
import {getEnrollmentRequestsByParent} from "../../api/enrollment-requests/getEnrollmentRequestsByParent";
import {EnrollmentRequestStatus} from "../../Enum";
import {cancelEnrollmentRequest} from "../../api/enrollment-requests/cancelEnrollmentRequest";

const PAGE_SIZE = 10;

export const MyEnrollmentRequestsPage = () => {
    const [enrolmmentRequests, setEnrolmmentRequests] = useState([]);
    const [pageNumber, setPageNumber] = useState(0);
    const [hasNextPage, setHasNextPage] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const parentId = getParentId();
    const navigate = useNavigate();

    const fetchEnrollmentRequests = async () => {
        try {
            setIsLoading(true);
            const response = await getEnrollmentRequestsByParent(parentId, pageNumber, PAGE_SIZE);
            setEnrolmmentRequests(response);
            setHasNextPage(response.length === PAGE_SIZE);
        } catch (error) {
            console.error("Eroare la încărcarea cererilor de înscriere:", error);
        }
        finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEnrollmentRequests();
    }, [pageNumber]);

    const handleCancel = async (requestId) => {
        try {
            await cancelEnrollmentRequest(requestId);
            setEnrolmmentRequests(prev =>
                prev.map(req =>
                    req.id === requestId ? {...req, status: 'CANCELED'} : req
                )
            );
        } catch (err) {
            console.error("Eroare la anularea cererii de înscriere:", err);
        }
    };

    const handleNextPage = () => {
        if (hasNextPage) setPageNumber((prev) => prev + 1);
    };

    const handlePreviousPage = () => {
        if (pageNumber > 0) setPageNumber((prev) => prev - 1);
    };


    return (
        <Box sx={{padding: 3}}>
            <Typography variant="h4" gutterBottom>
                Cererile mele de înscriere la anunțurile active
            </Typography>

            {!isLoading && enrolmmentRequests.length === 0 ? (
                <Alert severity="info">Niciun trainer găsit!</Alert>
            ) : (
                <>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Nume copil</TableCell>
                                    <TableCell>Anunț</TableCell>
                                    <TableCell>Status cerere</TableCell>
                                    <TableCell>Acțiuni</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {enrolmmentRequests.map((er) => (
                                    <TableRow key={er.id}>
                                        <TableCell>{er?.child?.firstName} {er?.child?.lastName}</TableCell>
                                        <TableCell>{er.ad?.title}</TableCell>
                                        <TableCell>{EnrollmentRequestStatus[er?.status]}</TableCell>
                                        {er?.status === 'PENDING' ?
                                            <TableCell><Button
                                                variant="contained"
                                                color="secondary"
                                                sx={{mr: 1}}
                                                onClick={() => handleCancel(er.id, er?.child?.id)}
                                            >
                                                Anulează
                                            </Button></TableCell>
                                            :
                                            <TableCell>-</TableCell>}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Grid2 xs={12}
                           sx={{
                               display: "flex",
                               justifyContent: "center",
                               mt: 3,
                               gap: {xs: "auto", sm: 2},
                           }}>
                        <Button
                            variant="text"
                            onClick={handlePreviousPage}
                            disabled={pageNumber === 0}
                            startIcon={<ArrowBack/>}
                        >
                            Înapoi
                        </Button>
                        <Box sx={{
                            fontSize: "1.2rem",
                            fontWeight: "bold",
                            textAlign: "center",
                            display: "flex",
                            alignItems: "center"
                        }}>
                            Pagina {pageNumber + 1}
                        </Box>
                        <Button
                            variant="text"
                            onClick={handleNextPage}
                            disabled={!hasNextPage}
                            endIcon={<ArrowForward/>}
                        >
                            Înainte
                        </Button>
                    </Grid2>
                </>
            )}


        </Box>
    );
};

