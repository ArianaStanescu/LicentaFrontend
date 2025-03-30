import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {Typography, CircularProgress, Box, Button} from "@mui/material";
import {getAd} from "../api/ads/getAd";
import {getAdImage} from "../api/ads/getAdImage";
import {ActivityCategory, Gender, Weekday} from "../Enum";
import {CreateEnrollmentRequestPopup} from "../components/parent/CreateEnrollmentRequestPopup";
import {calculateAge} from "../helpers/calculateAge";
import {isTrainer} from "../context/AuthContextProvider";
import {ViewEnrollmentRequestsPopup} from "../components/trainer/ViewEnrollmentRequestsPopup";
import {EditAdPopup} from "../components/trainer/EditAdPopup";
import {createGroup} from "../api/group/createGroup";
import {ConfirmDialog} from "../components/ConfirmDialog";

export const ViewAdPage = () => {
    const {id} = useParams();
    const [ad, setAd] = useState(null);
    const [trainer, setTrainer] = useState(null);
    const [adImage, setAdImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [popupOpen, setPopupOpen] = useState(false);
    const [enrollmentRequestsPopupOpen, setEnrollmentRequestsPopupOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const userIsTrainer = isTrainer();

    useEffect(() => {
        const fetchAd = async () => {
            try {
                const response = await getAd(id);
                setAd(response);
            } catch (error) {
                console.error("Eroare la preluarea anunțului:", error);
            } finally {
                setLoading(false);
            }
        };

        const fetchAdImage = async () => {
            try {
                const response = await getAdImage(id);
                setAdImage(response);
            } catch (error) {
                console.error("Eroare la preluarea anunțului:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAd();
        fetchAdImage();
    }, [id]);

    useEffect(() => {
        if (ad && ad.activity) {
            setTrainer(ad.activity.trainer);
        }
    }, [ad]);

    if (loading) {
        return (<Box sx={{display: "flex", justifyContent: "center", alignItems: "center", height: "100vh"}}>
            <CircularProgress/>
        </Box>);
    }

    if (!ad) {
        return <Typography variant="h6" color="error">Anunțul nu a fost găsit!</Typography>;
    }
    return (<Box
        sx={{
            marginTop: 4,
            display: "flex",
            flexDirection: "row",
            width: "100%",
            maxWidth: "100%",
            maxHeight: "100%",
            alignItems: "center",
            borderRadius: 2,
            overflow: "hidden",
            boxShadow: 1,
            backgroundColor: "white",
            padding: 2,
        }}
    >
        <Box
            sx={{
                width: "20%", display: "flex", alignItems: "center", justifyContent: "center",
            }}
        >
            {adImage ? (<Box
                component="img"
                src={adImage}
                alt={ad.title}
                sx={{
                    width: "100%", height: "auto", objectFit: "contain", borderRadius: 2,
                }}
            />) : (<Box
                sx={{
                    width: "100%",
                    height: "100%",
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
            </Box>)}
        </Box>

        <Box
            sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                paddingLeft: 2,
                height: "100%",
            }}
        >
            <Typography
                variant="h5"
                sx={{
                    fontSize: {xs: "1.5rem", md: "2rem"}, textAlign: "center", fontWeight: "bold",
                }}
            >
                {ad.title}
            </Typography>

            <Box sx={{display: "flex", flexDirection: "column", alignItems: "flex-start", mt: 1}}>
                <Box
                    sx={{
                        display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", mt: 2
                    }}
                >
                    <Typography
                        variant="body1"
                        sx={{
                            fontSize: {xs: "1rem", md: "1.2rem"}, textTransform: "capitalize"
                        }}
                    >
                        Categorie: {ActivityCategory[ad.category]}
                    </Typography>

                    {userIsTrainer && <Button
                        variant="text"
                        onClick={() => setEditDialogOpen(true)}
                    >
                        Editează
                    </Button>
                    }
                </Box>

                <Typography
                    variant="body2"
                    sx={{fontSize: {xs: "1rem", md: "1.2rem"}, color: "gray"}}
                >
                    Interval de vârstă: {ad.minAge} - {ad.maxAge} ani
                </Typography>
                <Typography
                    variant="body2"
                    sx={{fontSize: {xs: "1rem", md: "1.2rem"}, color: "gray"}}
                >
                    Gen: {Gender[ad.gender]}
                </Typography>
                <Typography
                    variant="body2"
                    sx={{fontSize: {xs: "1rem", md: "1.2rem"}, color: "gray"}}
                >
                    Zilele de activitate:{" "}
                    {ad.activityDays.map((day) => Weekday[day]).join(", ")}
                </Typography>
            </Box>

            <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                    fontSize: {xs: "0.9rem", md: "1rem"}, mt: 2, textAlign: "left",
                }}
            >
                {ad.description + '"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?"'}
            </Typography>

            <Box
                sx={{
                    display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 2,
                }}
            >
                <Typography
                    variant="h6"
                    color="primary"
                    sx={{
                        fontSize: {xs: "1rem", md: "1.25rem"}, fontWeight: "bold"
                    }}
                >
                    {ad.price} RON
                </Typography>

                {!userIsTrainer && ad.status === 'ACTIVE' && <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setPopupOpen(true)}
                >
                    Înscriere
                </Button>}
                {!userIsTrainer && ad.status === 'PENDING' && <Typography
                    variant="h6"
                    color="primary"
                    sx={{
                        fontSize: {xs: "1rem"}, fontWeight: "bold"
                    }}
                >
                    Cererile de înscriere sunt în curs de procesare
                </Typography>}
                {!userIsTrainer && ad.status === 'COMPLETED' && <Typography
                    variant="h6"
                    color="primary"
                    sx={{
                        fontSize: {xs: "1rem"}, fontWeight: "bold"
                    }}
                >
                    Anunțul a fost închis
                </Typography>}
                {userIsTrainer && (ad.status === 'ACTIVE' || ad.status === 'PENDING') && <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setEnrollmentRequestsPopupOpen(true)}
                >
                    Vizualizează cereri de înscriere
                </Button>}
                {userIsTrainer && (ad.status === 'ACTIVE' || ad.status === 'PENDING') && (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setConfirmDialogOpen(true)}
                    >
                        Creează grupă
                    </Button>
                )}
                {userIsTrainer && ad.status === 'COMPLETED' && <Box>
                    <Typography
                        variant="h6"
                        color="primary"
                        sx={{
                            fontSize: {xs: "1rem"}, fontWeight: "bold"
                        }}
                    >
                        Anunțul a fost închis
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        // onClick={}
                    >
                        Vizualizare grupă
                    </Button>
                </Box>}
            </Box>

            <Box>
                <Typography
                    variant="body1"
                    sx={{fontSize: {xs: "1rem", md: "1.2rem"}, mt: 6}}
                >
                    Informații de contact:
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        fontSize: {xs: "0.9rem", md: "1rem"}, textAlign: "left",
                    }}
                >
                    Nume trainer: {trainer ? trainer.firstName + ' ' + trainer.lastName : ''}
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        fontSize: {xs: "0.9rem", md: "1rem"}, textAlign: "left",
                    }}
                >
                    Vârstă: {trainer ? calculateAge(trainer.birthDate) + ' ani' : ''}
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        fontSize: {xs: "0.9rem", md: "1rem"}, textAlign: "left",
                    }}
                >
                    Gen: {trainer ? Gender[trainer.gender] : ''}
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        fontSize: {xs: "0.9rem", md: "1rem"}, textAlign: "left",
                    }}
                >
                    Email: {trainer ? trainer.email : ''}
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        fontSize: {xs: "0.9rem", md: "1rem"}, textAlign: "left",
                    }}
                >
                    Telefon: {trainer ? trainer.phoneNumber : ''}
                </Typography>
            </Box>
            <CreateEnrollmentRequestPopup open={popupOpen} onClose={() => setPopupOpen(false)}/>
            <ViewEnrollmentRequestsPopup open={enrollmentRequestsPopupOpen}
                                         onClose={() => setEnrollmentRequestsPopupOpen(false)}/>
            <EditAdPopup
                open={editDialogOpen}
                onClose={() => setEditDialogOpen(false)}
                adToEdit={ad}
                onSave={(updatedAd) => {
                    setAd((prev) => ({...prev, ...updatedAd}));
                    setEditDialogOpen(false);
                }}
            />
            <ConfirmDialog
                open={confirmDialogOpen}
                title="Confirmare creare grupă"
                message="Ești sigur că vrei să creezi această grupă?"
                onCancel={() => setConfirmDialogOpen(false)}
                onConfirm={() => {
                    createGroup(ad.activity.id, ad.id);
                    setConfirmDialogOpen(false);
                }}
            />
        </Box>
    </Box>);
};

