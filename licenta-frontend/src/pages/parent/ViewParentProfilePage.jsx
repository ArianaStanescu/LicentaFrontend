import {
    Alert,
    Box,
    Button,
    Paper,
    Typography
} from "@mui/material";
import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import { Gender } from "../../Enum";
import { isParent } from "../../context/AuthContextProvider";
import { getParentId } from "../../helpers/localStorageHelper";
import { getParent } from "../../api/parent/getParent";
import { EditParentProfileDialog } from "../../components/EditParentProfileDialog";

export const ViewParentProfilePage = () => {
    const {parentId} = useParams();
    const [editProfileDialogOpen, setEditProfileDialogOpen] = useState(false);
    const [parent, setParent] = useState(null);
    const fetchParent = async () => {
        try {
            const data = await getParent(parentId);
            setParent(data);
        } catch (error) {
            console.error("Eroare la încărcarea părintelui", error);
        }
    };

    useEffect(() => {
        fetchParent();
    }, [parentId]);

    return (
        <>
            <Box sx={{padding: 3}}>
                <Typography variant="h4" gutterBottom>
                    Profil părinte
                </Typography>

                <Paper elevation={3} sx={{ padding: 3, mt: 3, display: "flex", flexDirection: "row", flexWrap: "wrap" }}>

                    <Box sx={{ display: "flex", flexDirection: "column", width: { xs: "100%", md: "50%" } }}>
                        <Typography
                            variant="body1"
                            sx={{ fontSize: { xs: "1rem", md: "1.2rem" }, mb: 2, mt: 2 }}
                        >
                            Informații:
                        </Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontSize: { xs: "0.9rem", md: "1rem" }, mb: 1 }}
                        >
                            Nume părinte: {parent ? `${parent.firstName} ${parent.lastName}` : ""}
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontSize: { xs: "0.9rem", md: "1rem" }, mb: 1 }}
                        >
                            Email: {parent ? parent.email : ""}
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontSize: { xs: "0.9rem", md: "1rem" }, mb: 1 }}
                        >
                            Telefon: {parent ? parent.phoneNumber : ""}
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontSize: { xs: "0.9rem", md: "1rem" }, mb: 1 }}
                        >
                            Gen: {parent ? Gender[parent.gender] : ""}
                        </Typography>

                        {isParent() && getParentId() == parent?.id && <Button
                            size="small"
                            variant="text"
                            onClick={() => setEditProfileDialogOpen(true)}
                            sx={{ alignSelf: "flex-start" }}
                        >
                            Editează
                        </Button>}
                    </Box>
                   
                    {editProfileDialogOpen &&
                        <EditParentProfileDialog
                            open={editProfileDialogOpen}
                            onClose={() => setEditProfileDialogOpen(false)}
                            parentToEdit={parent}
                            onSave={fetchParent}
                        />}
                </Paper>

                <Box
                    xs={12}
                    sm={8}
                    md={9}
                    spacing={2}
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        flexDirection: "column",
                        flex: "auto",
                    }}
                >
                </Box>
            </Box>
        </>
    );
};