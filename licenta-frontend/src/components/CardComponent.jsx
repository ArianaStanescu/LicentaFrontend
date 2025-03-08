import {Box, Card, CardContent, CardMedia, Typography} from "@mui/material";


export const CardComponent = ({ title, description, category, price, minAge, maxAge, gender ,imageUrl }) => {
    return (
        <Card
            sx={{
                margin: 2,
                display: "flex",
                flexDirection: "row",
                width: {xs: 300, sm: 600, md: 800},
                maxWidth: {xs: "100%", sm: 600, md: 1000},
                height: 170,
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
                        width: 150,
                        objectFit: "cover",
                        backgroundColor: "black"
                    }}
                />
            ) : (
                <Box
                    sx={{
                        height: "100%",
                        width: 150,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#f0f0f0",
                        color: "black",
                        fontSize: "14px",
                        fontWeight: "bold",
                        textAlign: "center",
                        padding: "8px"
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
                }}
            >
                <Box>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{
                            fontSize: { xs: "1rem", md: "1.25rem" },
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis"
                        }}
                    >
                        {title}
                    </Typography>

                    <Typography
                        variant="body2"
                        component="div"
                        sx={{
                            fontSize: { xs: "1rem", md: "1rem" },
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis"
                        }}
                    >
                        {category.toLowerCase()}
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            fontSize: { xs: "0.85rem", md: "1rem" },
                            overflow: "hidden",
                            textOverflow: "ellipsis"
                        }}
                    >
                        {description}
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            fontSize: { xs: "0.85rem", md: "1rem" },
                            overflow: "hidden",
                            textOverflow: "ellipsis"
                        }}
                    >
                        {minAge} - {maxAge} years
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            fontSize: { xs: "0.85rem", md: "1rem" },
                            overflow: "hidden",
                            textOverflow: "ellipsis"
                        }}
                    >
                        {gender.toLowerCase()}
                    </Typography>
                </Box>

                <Box sx={{ alignSelf: "flex-end" }}>
                    <Typography
                        variant="h6"
                        color="primary"
                        sx={{
                            fontSize: { xs: "1rem", md: "1.25rem" },
                            fontWeight: "bold"
                        }}
                    >
                        {price} RON
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
}

