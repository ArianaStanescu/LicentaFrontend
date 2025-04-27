import {Card, CardContent, Typography, Box, Button, IconButton} from "@mui/material";
import {Gender, GroupStatus, Weekday} from "../Enum";
import {useNavigate} from "react-router-dom";
import {useContext} from "react";
import {AuthContext} from "../context/AuthContextProvider";

export const GroupCard = ({group, onEdit}) => {
    const {isTrainer} = useContext(AuthContext);
    const navigate = useNavigate();

    const userIsTrainer = isTrainer();

    return (
        <Card sx={{width: "100%", minHeight: 180}}>
            <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">{group.title}</Typography>
                </Box>
                <Typography variant="body2" color="textSecondary" sx={{mb: 1}}>
                    {group.description}
                </Typography>
                <Typography variant="body2">
                    Zilele de activitate:{" "}
                    {group.durationRules.map((durationRule) => {
                        const endHour = (durationRule.startHour + durationRule.numberOfHours) % 24;
                        return `${Weekday[durationRule.day]} (${String(durationRule.startHour).padStart(2, '0')}:00 - ${String(endHour).padStart(2, '0')}:00)`;
                    }).join(", ")}
                </Typography>
                <Typography variant="body2" sx={{mb: 1}}>
                    Locație: {group.location ?? "nespecificat"}
                </Typography>
                <Typography variant="body2">Copii înscriși: {group.childrenCount}</Typography>
                <Typography variant="body2">
                    Vârstă: {group.minAge} - {group.maxAge} ani
                </Typography>
                <Typography variant="body2">
                    Gen: {Gender[group.gender]}
                </Typography>
                <Typography variant="body2">
                    Status: <strong>{GroupStatus[group.status]}</strong>
                </Typography>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Box>
                        {userIsTrainer && <Button
                            size="small"
                            variant="text"
                            onClick={() => onEdit?.(group)}
                        >
                            Editează
                        </Button>}
                    </Box>
                    <Button
                        variant="contained"
                        size="small"
                        sx={{height: "fit-content"}}
                        onClick={() => navigate(`/view-group/${group.id}`)}
                    >
                        Vizualizare
                    </Button>
                </Box>

            </CardContent>
        </Card>
    );
};


