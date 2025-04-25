import {Box, Button, Card, CardContent, CardMedia, Tooltip, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {ActivityCategory, Gender} from "../Enum";
import {isTrainer} from "../context/AuthContextProvider";
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import React from "react";

export const AdCard = ({
                           id,
                           title,
                           description,
                           category,
                           price,
                           minAge,
                           maxAge,
                           gender,
                           pendingEnrollmentRequestsCount,
                           imageUrl
                       }) => {
    const navigate = useNavigate();

    const userIsTrainer = isTrainer();

    return (
        <Card
            sx={{
                margin: 2,
                display: "flex",
                flexDirection: "row",
                width: {xs: 300, sm: 600, md: 800},
                maxWidth: {xs: "100%", sm: 600, md: 1000},
                height: 200,
                alignItems: "center",
            }}
        >
            {imageUrl ? (
                <CardMedia
                    component="img"
                    image={imageUrl}
                    alt={title}
                    sx={{
                        height: "100%",
                        width: "25%",
                        objectFit: "contain",
                    }}
                />
            ) : (
                <Box
                    sx={{
                        height: "100%",
                        width: "25%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "white",
                    }}
                >

                </Box>
            )}

            <CardContent
                sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: 2,
                    height: "100%",
                    maxWidth: '75%',
                }}
            >
                <Box>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{
                            fontSize: {xs: "1rem", md: "1.25rem"},
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis"
                        }}
                        title='Titlu'
                    >
                        {title}
                    </Typography>

                    <Typography
                        variant="body2"
                        component="div"
                        sx={{
                            fontSize: {xs: "1rem", md: "1rem"},
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis"
                        }}
                    >
                        Categorie: {ActivityCategory[category]}
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            fontSize: {xs: "0.85rem", md: "1rem"},
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis"
                        }}
                        title='Descriere'
                    >
                        {description}
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            fontSize: {xs: "0.85rem", md: "1rem"},
                            overflow: "hidden",
                            textOverflow: "ellipsis"
                        }}
                    >
                        Interval de vârstă: {minAge} - {maxAge} ani
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            fontSize: {xs: "0.85rem", md: "1rem"},
                            overflow: "hidden",
                            textOverflow: "ellipsis"
                        }}
                    >
                        Gen: {Gender[gender]}
                    </Typography>
                </Box>

                <Box sx={{display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 1}}>
                        <Typography
                            variant="h6"
                            color="primary"
                            sx={{
                                fontSize: {xs: "1rem", md: "1.25rem"},
                                fontWeight: "bold"
                            }}
                        >
                            {price} RON
                        </Typography>
                        {userIsTrainer && pendingEnrollmentRequestsCount > 0 &&
                            <Tooltip title="Ai cereri în așteptare!">
                                <Box sx={{ color: "red", alignSelf: "center", display: "flex", alignItems: "center", marginRight: 1 }}>
                                    <PendingActionsIcon fontSize="small" sx={{ m: 0, p: 0, verticalAlign: "middle" }} />
                                     <Typography
                                        sx={{
                                            fontSize: {
                                                xs: "0.75rem",
                                                md: "1rem"
                                            },
                                            fontStyle: "italic"
                                        }}>
                                        ({pendingEnrollmentRequestsCount})
                                    </Typography>
                                </Box>
                            </Tooltip>
                        }
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate(`/view-ad/${id}`)}
                    >
                        Vizualizează
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
}
