import React from "react";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";

export const SessionCommentCard = ({ comment, sessionId }) => {


    return (
        <Card sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        }}>
            <CardContent>
                <Typography>
                    {comment?.content}
                </Typography>
            </CardContent>
        </Card>
    );
};
