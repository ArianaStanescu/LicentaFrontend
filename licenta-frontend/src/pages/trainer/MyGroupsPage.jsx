import {
    Box,
    Button,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Checkbox,
    FormControlLabel,
    FormGroup
} from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import {useEffect, useState} from "react";
import {getTrainerId} from "../../helpers/localStorageHelper";
import {getGroups} from "../../api/group/getGroups";
import {GroupCard} from "../../components/GroupCard";
import {Gender, GroupStatus, Weekday} from "../../Enum";
import {getGroupsByActivity} from "../../api/group/getGroupsByActivity";
import {useParams} from "react-router-dom";
import {editGroup} from "../../api/group/editGroup";

export const MyGroupsPage = () => {
    const { activityId } = useParams();
    const [groups, setGroups] = useState([]);
    const [error, setError] = useState(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(null);

    const [newGroup, setNewGroup] = useState({
        title: "",
        description: "",
        gender: "",
        minAge: "",
        maxAge: "",
        status: "",
        location: "",
        durationRules: []
    });

    const [errors, setErrors] = useState({});

    const trainerId = getTrainerId();

    const fetchGroups = async () => {
        setError(null);
        try {
            if (activityId) {
                const data = await getGroupsByActivity(activityId);
                const sorted = (data || []).sort((a, b) => b.id - a.id);
                setGroups(sorted);
            } else {
                const data = await getGroups(trainerId);
                const sorted = (data || []).sort((a, b) => b.id - a.id);
                setGroups(sorted);
            }
        } catch (err) {
            setError("Eroare la încărcarea grupurilor.");
        }
    };

    useEffect(() => {
        fetchGroups();
    }, [activityId]);

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
        setSelectedGroup(null);
    };

    const handleChange = (e, isEdit = false) => {
        const {name, value} = e.target;
        if (isEdit) {
            setSelectedGroup(prev => ({...prev, [name]: value}));
        } else {
            setNewGroup(prev => ({...prev, [name]: value}));
        }
        if (errors[name]) {
            setErrors(prev => ({...prev, [name]: ""}));
        }
    };

    const handleDayToggle = (day, isEdit = false) => {
        const updateDays = (days, day) =>
            days.includes(day) ? days.filter(d => d !== day) : [...days, day];

        if (isEdit) {
            setSelectedGroup(prev => ({
                ...prev,
                activityDays: updateDays(prev.activityDays, day)
            }));
        } else {
            setNewGroup(prev => ({
                ...prev,
                activityDays: updateDays(prev.activityDays, day)
            }));
        }
    };

    const validateGroup = (group) => {
        const newErrors = {};
        if (!group.title.trim()) newErrors.title = "Titlul este obligatoriu.";
        if (!group.description.trim())
            newErrors.description = "Descrierea este obligatorie.";
        if (!group.gender) newErrors.gender = "Genul este obligatoriu.";
        if (!group.minAge || isNaN(group.minAge))
            newErrors.minAge = "Vârsta minimă este obligatorie.";
        if (!group.maxAge || isNaN(group.maxAge))
            newErrors.maxAge = "Vârsta maximă este obligatorie.";
        if (!group.status) newErrors.status = "Selectează un status.";
        if (!group.location) newErrors.location = "Locația este obligatorie.";
        return newErrors;
    };

    const handleEditSubmit = async () => {
        const validation = validateGroup(selectedGroup);
        if (Object.keys(validation).length > 0) {
            setErrors(validation);
            return;
        }

        try {
            const response = await editGroup(selectedGroup.id, selectedGroup);
            if (!response?.success) {
                setError("Eroare la actualizarea grupei.");
                return;
            }
            fetchGroups();
            handleCloseEditDialog();
        } catch {
            setError("Eroare la actualizare.");
        }
    };

    const handleEditGroup = (group) => {
        setSelectedGroup(group);
        setErrors({});
        setOpenEditDialog(true);
    };

    return (
        <Box sx={{ padding: 2 }}>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                }}
            >
                {activityId ? (
                    <h2>Grupele mele pentru activitatea selectată</h2>
                ) : (
                    <h2>Toate grupele mele</h2>
                )}
            </Box>

            {error && <Alert severity="error">{error}</Alert>}
            {groups.length === 0 ? (
                <Alert severity="info">Nu ai încă grupuri create.</Alert>
            ) : (
                <Grid2 container spacing={2}>
                    {groups?.map((group) => (
                        <Grid2 sx={{ width: "100%" }} xs={12} key={group.id}>
                            <GroupCard group={group} onEdit={() => handleEditGroup(group)} />
                        </Grid2>
                    ))}
                </Grid2>
            )}

            {/*editare */}
            <Dialog
                open={openEditDialog}
                onClose={handleCloseEditDialog}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>Editează grupă</DialogTitle>
                <DialogContent
                    sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
                >
                    <TextField
                        label="Titlu"
                        name="title"
                        value={selectedGroup?.title || ""}
                        onChange={(e) => handleChange(e, true)}
                        error={!!errors.title}
                        helperText={errors.title}
                        fullWidth
                        sx={{ mt: 1}}
                    />
                    <TextField
                        label="Descriere"
                        name="description"
                        value={selectedGroup?.description || ""}
                        onChange={(e) => handleChange(e, true)}
                        multiline
                        rows={3}
                        fullWidth
                        error={!!errors.description}
                        helperText={errors.description}
                    />
                    <TextField
                        label="Vârstă minimă"
                        name="minAge"
                        type="number"
                        value={selectedGroup?.minAge || ""}
                        onChange={(e) => handleChange(e, true)}
                        error={!!errors.minAge}
                        helperText={errors.minAge}
                        fullWidth
                    />
                    <TextField
                        label="Vârstă maximă"
                        name="maxAge"
                        type="number"
                        value={selectedGroup?.maxAge || ""}
                        onChange={(e) => handleChange(e, true)}
                        error={!!errors.maxAge}
                        helperText={errors.maxAge}
                        fullWidth
                    />
                    <TextField
                        select
                        label="Gen"
                        name="gender"
                        value={selectedGroup?.gender || ""}
                        onChange={(e) => handleChange(e, true)}
                        error={!!errors.gender}
                        helperText={errors.gender}
                        fullWidth
                    >
                        {Object.entries(Gender)?.map(([key, label]) => (
                            <MenuItem key={key} value={key}>
                                {label}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        select
                        label="Status"
                        name="status"
                        value={selectedGroup?.status || ""}
                        onChange={(e) => handleChange(e, true)}
                        error={!!errors.status}
                        helperText={errors.status}
                        fullWidth
                    >
                        {Object.entries(GroupStatus)?.map(([key, label]) => (
                            <MenuItem key={key} value={key}>
                                {label}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        label="Locație"
                        name="location"
                        value={selectedGroup?.location || ""}
                        onChange={(e) => handleChange(e, true)}
                        fullWidth
                        error={!!errors.location}
                        helperText={errors.location}
                    />
                    {selectedGroup?.durationRules?.map((rule, index) => (
                        <Box
                            key={index}
                            sx={{ display: "flex", gap: 1, alignItems: "center" }}
                        >
                            <TextField
                                select
                                label="Zi"
                                name="day"
                                value={rule.day}
                                disabled="true"
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
                                disabled="true"
                                fullWidth
                            >
                                {Array.from({ length: 14 }, (_, i) => i + 8).map((hour) => (
                                    <MenuItem key={hour} value={hour}>
                                        {hour.toString().padStart(2, "0")}:00
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                label="Număr de ore"
                                name="numberOfHours"
                                type="number"
                                disabled="true"
                                value={rule.numberOfHours}
                                fullWidth
                            />
                        </Box>
                    ))}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEditDialog}>Anulează</Button>
                    <Button onClick={handleEditSubmit} variant="contained">
                        Salvează
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
