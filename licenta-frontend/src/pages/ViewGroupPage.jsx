import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {
    Box,
    Typography,
    Divider,
    Paper,
    List,
    ListItem,
    ListItemText,
    Button,
    DialogContent,
    DialogTitle,
    DialogActions,
    Dialog,
    IconButton
} from "@mui/material";
import {getGroup} from "../api/group/getGroup";
import {createSessions as createSessionsApi} from "../api/session/createSessions";

import {Gender, GroupStatus, Weekday} from "../Enum";
import Grid2 from "@mui/material/Grid2";
import DeleteIcon from '@mui/icons-material/Delete';
import {calculateAge} from "../helpers/calculateAge";
import {getSessionsByGroup} from "../api/session/getSessionsByGroup";
import {SessionCard} from "../components/SessionCard";
import {ArrowBack, ArrowForward} from "@mui/icons-material";
import { isTrainer } from "../context/AuthContextProvider";
import { isParent } from "../context/AuthContextProvider";
import { getParentId, getTrainerId } from "../helpers/localStorageHelper";
import { removeChildFromGroup } from "../api/group/removeChildFromGroup";

export const ViewGroupPage = () => {
    const {groupId} = useParams();
    const navigate = useNavigate();
    const [group, setGroup] = useState(null);
    const [error, setError] = useState(null);
    const [openChildrenDialog, setOpenChildrenDialog] = useState(false);
    const [sessions, setSessions] = useState(null);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [nextSession, setNextSession] = useState(null);
    const [filters, setFilters] = useState({
        pageNumber: 0,
        pageSize: 10,
        sortBy: "startDateTime",
        sortDirection: "asc"
    });
    const userIsTrainer = isTrainer();

    const fetchGroup = async () => {
        try {
            const data = await getGroup(groupId);
            setGroup(data || {});
        } catch (err) {
            setError("Eroare la încărcarea grupului.");
        }
    };

    useEffect(() => {
        fetchGroup();
        fetchSessions();
    }, [groupId, filters]);

    const fetchSessions = async () => {
        try {
            const data = await getSessionsByGroup(groupId, isTrainer(), isTrainer() ? getTrainerId() : getParentId(), filters);
            if (!nextSession) {
                const now = new Date();
                //setam ora la 00:00 pentru a compara doar in functie de data
                const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

                const upcoming = data.reduce((closest, session) => {
                    const sessionDateRaw = new Date(session.startDateTime);
                    const sessionDate = new Date(sessionDateRaw.getFullYear(), sessionDateRaw.getMonth(), sessionDateRaw.getDate());

                    if (sessionDate >= today && (!closest || sessionDate < new Date(closest.startDateTime))) {
                        return session;
                    }
                    return closest;
                }, null);

                setNextSession(upcoming);
            }
            setSessions(data);
            setHasNextPage(data.length === filters.pageSize);
        } catch (err) {
            setError("Eroare la încărcarea sesiunilor.");
        }
    }

    const handleNextPage = () => {
        if (hasNextPage) {
            setFilters({
                ...filters,
                pageNumber: filters.pageNumber + 1
            });
        }
    };

    const handlePreviousPage = () => {
        setFilters({
            ...filters,
            pageNumber: Math.max(filters.pageNumber - 1, 0)
        });
    };

    const createSessions = async () => {
        try {
            const data = await createSessionsApi(groupId);
            await fetchSessions();

        } catch (err) {
            setError("Eroare la crearea sesiunilor.");
        }
    }

    const removeChild = async(childId) => {
        try {
            await removeChildFromGroup(childId, groupId);
            await fetchGroup();
        } catch (err) {
            setError("Eroare la eliminarea copilului de la o grupa.");
        }
    }

    if (!group) {
        return;
    }

    return (<Box sx={{padding: 3}}>
        <Typography variant="h4" gutterBottom>
            {group.title}
        </Typography>

        <Typography variant="subtitle1" gutterBottom>
            {group.description}
        </Typography>

        <Paper sx={{padding: 2, mt: 2, mb: 3}}>
            <Typography><strong>Activitate:</strong> {group.activity?.title}</Typography>
            <Typography><strong>Gen:</strong> {Gender[group.gender]}</Typography>
            <Typography><strong>Stare:</strong> {GroupStatus[group.status]}</Typography>
            <Typography><strong>Vârste acceptate:</strong> {group.minAge} - {group.maxAge} ani</Typography>
            <Typography><strong>Copii înscriși:</strong> {group?.children?.length ?? 0}</Typography>
            <Typography><strong>Zile de
                activitate:</strong> {group?.durationRules?.map((durationRule) => {
                const endHour = (durationRule.startHour + durationRule.numberOfHours) % 24;
                return `${Weekday[durationRule.day]} (${String(durationRule.startHour).padStart(2, '0')}:00 - ${String(endHour).padStart(2, '0')}:00)`;
                }).join(", ")}
            </Typography>
            <Typography><strong>Locație:</strong> {group.location}</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                {!userIsTrainer &&
                    <Button
                        variant="contained"
                        sx={{ mt: 2 }}
                        onClick={() => navigate('/view-trainer-profile/' + group?.activity?.trainer.id)}
                    >
                        Vizualizare profil trainer
                    </Button>
                }
                <Button
                    variant="contained"
                    sx={{mt: 2}}
                    onClick={() => setOpenChildrenDialog(true)}
                >
                    Vizualizare copii
                </Button>
            </Box>
            {sessions?.length === 0 &&
                <Button
                    variant="contained"
                    sx={{mt: 2}}
                    onClick={() => createSessions()}
                >
                    Creare sesiuni
                </Button>
            }

        </Paper>
        <Divider sx={{my: 3}}/>
        <Typography variant="h6">Sesiuni:</Typography>
        {sessions?.length === 0 ? (
            <Typography color="text.secondary">Nicio sesiune înregistrată.</Typography>
        ) : (
            <>
                <Grid2 container spacing={2} sx={{padding: 2}}>
                    {sessions?.map((session) => (
                        <Grid2 item xs={12} sm={6} md={4} key={session.id}>
                            <SessionCard
                                session={session}
                                isNextSession={nextSession && session.id === nextSession.id}
                                groupId={group?.id}
                            />
                        </Grid2>
                    ))}

                </Grid2>
                <Grid2 xs={12}
                       sx={{
                           display: "flex",
                           justifyContent: "center",
                           mt: 3,
                           gap: {xs: "auto", sm: 6},
                       }}>
                    <Button
                        variant="text"
                        onClick={handlePreviousPage}
                        disabled={filters.pageNumber === 0}
                        startIcon={<ArrowBack/>}
                    >
                        Înapoi
                    </Button>
                    <Box sx={{
                        fontSize: "1.2rem", fontWeight: "bold",
                        textAlign: "center", display: "flex", alignItems: "center"
                    }}>
                        Pagina {filters.pageNumber + 1}
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
        <Dialog
            open={openChildrenDialog}
            onClose={() => setOpenChildrenDialog(false)}
            fullWidth
        >
            <DialogTitle>Copii înscriși în grup</DialogTitle>
            <DialogContent dividers sx={{py: 0}}>
                {group?.children?.length === 0 ? (
                    <Typography color="text.secondary">Niciun copil înscris.</Typography>) : (<Grid2 container>
                    <List sx={{width: "100%"}}>
                            {group?.children?.map(child => (<ListItem key={child.id} sx={{display: "flex", justifyContent: "space-between", width: "100%"}}>
                                <ListItemText
                                    primary={`${child.firstName} ${child.lastName}`}
                                    secondary={`Vârstă: ${calculateAge(child.birthDate)} ani`}
                                    sx={{flexGrow: 1}}
                                />
                                {(isTrainer() || (isParent() && getParentId() == child?.parent?.id)) && (<IconButton
                                    color="error"
                                    onClick={() => {
                                        removeChild(child.id)
                                    }}
                                >
                                    <DeleteIcon />
                                </IconButton>)}
                            </ListItem>))}
                        </List>
                </Grid2>)}
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpenChildrenDialog(false)}>Închide</Button>
            </DialogActions>
        </Dialog>
    </Box>);
};
