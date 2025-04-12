import React from "react";
import { Box, Button, Card, CardContent, IconButton, Tooltip, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { dayIndexToEnum } from "../Enum";
import EmailIcon from '@mui/icons-material/Email';
export const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    const dayName = dayIndexToEnum[date.getDay()];
    const dateFormatted = date.toLocaleDateString('ro-RO');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return { dateFormatted, dayName, hours, minutes };
};

export const SessionCard = ({ session, isNextSession, groupId }) => {
    const navigate = useNavigate();
    const start = formatDateTime(session.startDateTime);
    const end = formatDateTime(session.endDateTime);

    return (
        <Card sx={{
            height: 300,
            width: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: isNextSession ? "2px solid #33cc33" : "none",
        }}>
            <CardContent style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-start", paddingTop: "50px" }}>
                <Typography variant="h6" align="center">
                    {start.dateFormatted}
                </Typography>
                <Typography variant="body1" align="center">
                    Ziua: {start.dayName}
                </Typography>
                <Typography variant="body1" align="center">
                    Ora: {`${start.hours} - ${end.hours}`}
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", mt: 2 }}>
                    <Button variant="text" onClick={() => navigate(`/view-session/${session?.id}/${groupId}`)}>
                        Vizualizare
                    </Button>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                    {session?.newComments &&
                        <Tooltip title="Ai comment-uri necitite!" sx={{fontSize: "1rem"}}>
                            <Box sx={{ color: "red", alignSelf: "center" }}>
                                <EmailIcon fontSize="small" sx={{ m: 0, p: 0, verticalAlign: "middle" }} />
                            </Box>
                        </Tooltip>}
                </Box>
            </CardContent>
        </Card>
    );
};
