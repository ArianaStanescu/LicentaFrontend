import {Card, CardContent, Typography, Box, Button, IconButton} from "@mui/material";
import {Gender, GroupStatus, Weekday} from "../Enum";

export const GroupCard = ({ group, onEdit }) => {
    return (
        <Card sx={{ width: "100%", minHeight: 180 }}>
            <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">{group.title}</Typography>
                </Box>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                    {group.description}
                </Typography>
                <Typography variant="body2">
                    Zilele de activitate: {group.activityDays.map(day => Weekday[day]).join(", ")}
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
                        <Button
                            size="small"
                            variant="text"
                        >
                            Editează
                        </Button>
                    </Box>
                    <Button
                        variant="contained"
                        size="small"
                        onClick={() => onEdit?.(group)}
                        sx={{ height: "fit-content" }}
                    >
                        Vizualizare
                    </Button>
                </Box>

            </CardContent>
        </Card>
    );
};


