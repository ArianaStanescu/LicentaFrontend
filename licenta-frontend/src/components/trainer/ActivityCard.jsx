import {Card, CardContent, Typography, Box, Button} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {ActivityCategory, Gender} from "../../Enum";

export const ActivityCard = ({id, title, description, category, gender, onEdit}) => {
    const navigate = useNavigate();

    return (
        <Card sx={{display: "flex", flexDirection: "column", height: "100%"}}>
            <CardContent sx={{flexGrow: 1}}>
                <Typography variant="h6" gutterBottom>
                    {title}
                </Typography>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                    {description}
                </Typography>

                <Typography variant="body2" sx={{mt: 1}}>
                    Categorie: {ActivityCategory[category] || category}
                </Typography>

                <Typography variant="body2">
                    Gen: {Gender[gender]}
                </Typography>
            </CardContent>

            <Box sx={{display: "flex", justifyContent: "space-between", p: 2, pt: 0}}>
                <Button
                    size="small"
                    variant="text"
                    onClick={() => onEdit({
                        id,
                        title,
                        description,
                        category,
                        gender,
                    })}
                >
                    Editează
                </Button>
                <Box>
                    <Button
                        sx={{ mr: 1, mb: {xs: 1, sm: 0} }}
                        size="small"
                        variant="contained"
                        onClick={() => navigate(`/activities/${id}`)}
                    >
                        Vizualizare grupe
                    </Button>
                    <Button
                        size="small"
                        variant="contained"
                        onClick={() => navigate(`/activities/${id}`)}
                    >
                        Vizualizare anunțuri
                    </Button>
                </Box>
            </Box>
        </Card>
    );
};
