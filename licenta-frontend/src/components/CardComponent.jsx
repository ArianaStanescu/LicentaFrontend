import {Box, Button, Card, CardContent, CardMedia, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {ActivityCategory, Gender} from "../Enum";

export const CardComponent = ({id, title, description, category, price, minAge, maxAge, gender, imageUrl}) => {
    const navigate = useNavigate();

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
                        backgroundColor: "#f0f0f0",
                        color: "black",
                        fontSize: "14px",
                        fontWeight: "bold",
                        textAlign: "center",
                        padding: "8px",
                        wordBreak: 'break-word',
                    }}
                >
                    Imagine indisponibilă
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
                        {description} + Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged
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

                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 1 }}>
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
