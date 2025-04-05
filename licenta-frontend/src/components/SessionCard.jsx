import React from "react";
import {Box, Button, Card, CardContent, Typography} from "@mui/material";

const daysOfWeek = ["Duminică", "Luni", "Marți", "Miercuri", "Joi", "Vineri", "Sâmbătă"];

const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    const dayName = daysOfWeek[date.getDay()];
    const dateFormatted = date.toLocaleDateString();
    const hours = date.getHours().toString().padStart(2, '0');
    return {dateFormatted, dayName, hours};
};

export const SessionCard = ({session, onView, isNextSession}) => {
    const start = formatDateTime(session.startDateTime);
    const end = formatDateTime(session.endDateTime);

    return (
        <Card sx={{
            height: 300,
            maxWidth: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: isNextSession ? "2px solid #33cc33" : "none",
        }}>
            <CardContent>
                <Typography variant="h6" align="center">
                    {start.dateFormatted}
                </Typography>
                <Typography variant="body1" align="center">
                    Ziua: {start.dayName}
                </Typography>
                <Typography variant="body1" align="center">
                    Ora: {`${start.hours} - ${end.hours}`}
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center" sx={{mt: 1, wordBreak: "break-word"}}>
                    {`Notă: ${session.note || "- "} Lorem Ipsum is simply dummy text of the printing and typesetting industry.`}
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                    <Button variant="text" onClick={() => onView(session.id)}>
                        Vizualizare
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};
