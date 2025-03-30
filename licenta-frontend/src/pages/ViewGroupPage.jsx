import {useParams} from "react-router-dom";
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
    Dialog
} from "@mui/material";
import {getGroup} from "../api/group/getGroup";
import {Gender, GroupStatus, Weekday} from "../Enum";
import Grid2 from "@mui/material/Grid2";
import {calculateAge} from "../helpers/calculateAge";

export const ViewGroupPage = () => {
    const {id: groupId} = useParams();
    const [group, setGroup] = useState(null);
    const [error, setError] = useState(null);
    const [openChildrenDialog, setOpenChildrenDialog] = useState(false);

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
    }, [groupId]);

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
                <Typography><strong>Copii înscriși:</strong> {group.childrenCount}</Typography>
                <Typography><strong>Zile de
                    activitate:</strong> {group.activityDays.map(day => Weekday[day]).join(", ")}</Typography>
                <Button
                    variant="contained"
                    sx={{mt: 2}}
                    onClick={() => setOpenChildrenDialog(true)}
                >
                    Vizualizare copii
                </Button>
            </Paper>
            <Divider sx={{my: 3}}/>
            <Typography variant="h6">Sesiuni:</Typography>
            {/*{group.sessions?.length === 0 ? (*/}
            {/*    <Typography color="text.secondary">Nicio sesiune înregistrată.</Typography>*/}
            {/*) : (*/}
            {/*    <List>*/}
            {/*        {group.sessions.map(session => (*/}
            {/*            <ListItem key={session.id}>*/}
            {/*                <ListItemText*/}
            {/*                    primary={`Sesiune: ${session.title || "Fără titlu"}`}*/}
            {/*                    secondary={`Dată: ${session.date || "Nespecificată"}`}*/}
            {/*                />*/}
            {/*            </ListItem>*/}
            {/*        ))}*/}
            {/*    </List>*/}
            {/*)}*/}
            <Dialog
                open={openChildrenDialog}
                onClose={() => setOpenChildrenDialog(false)}
                fullWidth
            >
                <DialogTitle>Copii înscriși în grup</DialogTitle>
                <DialogContent dividers sx={{py: 0}}>
                    {group.children?.length === 0 ? (
                        <Typography color="text.secondary">Niciun copil înscris.</Typography>) : (<Grid2 container>
                            <List>
                                {group.children.map(child => (<ListItem key={child.id}>
                                        <ListItemText
                                            primary={`${child.firstName} ${child.lastName}`}
                                            secondary={`Vârstă: ${calculateAge(child.birthDate)} ani`}
                                        />
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
