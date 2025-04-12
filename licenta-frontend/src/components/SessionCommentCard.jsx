import React from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";
import { getParentId, getTrainerId } from "../helpers/localStorageHelper";

export const SessionCommentCard = ({ comment }) => {

    const isAuthor = () => {
        return comment?.authorParent?.id == getParentId() || comment?.authorTrainer?.id == getTrainerId();
    }

    return (
        <Card sx={{ width: "100%", mb: 2 }}>
            <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Box mr={2} minWidth={150} flexDirection={"column"} display={"flex"} gap={0.5}>
                        <Box display="flex" alignItems="center" gap={0.5}>
                            <Typography variant="subtitle1" fontWeight="bold">
                                {comment?.authorTrainer ? `${comment?.authorTrainer?.firstName} ${comment?.authorTrainer?.lastName}` : `${comment?.authorParent?.firstName} ${comment?.authorParent?.lastName}`}
                            </Typography>
                            {isAuthor() &&
                                <Typography variant="subtitle1" fontWeight="bold" sx={{ fontStyle: 'italic' }}>
                                    (Tu)
                                </Typography>
                            }
                        </Box>
                        <Typography variant="subtitle2" fontWeight="bold">
                            {comment?.authorParent ? "Parinte" : "Trainer"}
                        </Typography>
                        <Typography variant="subtitle2" color="text.primary">
                            {new Date(comment?.createdAt).toLocaleString("ro-RO")}
                        </Typography>
                        <Typography variant="subtitle2" color="red" sx={{ fontStyle: 'italic' }}>
                            (Nou)
                        </Typography>
                    </Box>

                    <Box flexGrow={1}>
                        <Typography>
                            {comment?.content}
                        </Typography>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};
