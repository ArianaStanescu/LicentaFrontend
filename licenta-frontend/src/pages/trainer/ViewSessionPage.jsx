import {useParams} from 'react-router-dom';
import {useEffect, useState} from "react";
import {getSession} from "../../api/session/getSession";
import {Alert, Box, Button, Container, IconButton, Paper, Typography} from "@mui/material";
import {formatDateTime} from "../../components/SessionCard";
import {getGroup} from "../../api/group/getGroup";
import DownloadIcon from "@mui/icons-material/Download";
import {ActivityCategory, GroupStatus} from "../../Enum";
import {AddNoteDialog} from "../../components/trainer/AddNoteDialog";
import {updateSessionNote} from "../../api/session/updateSessionNote";
import {AddFileDialog} from "../../components/trainer/AddFileDialog";
import {createSessionDocument} from "../../api/session-document/createSessionDocument";
import {getDocumentTitle} from "../../api/session-document/getDocumentTitle";
import {getDocumentContent} from "../../api/session-document/getDocumentContent";

export const ViewSessionPage = () => {
    const {sessionId, groupId} = useParams();
    const [noteOpen, setNoteOpen] = useState(false);
    const [fileOpen, setFileOpen] = useState(false);
    const [dateOpen, setDateOpen] = useState(false);
    const [note, setNote] = useState('');
    const [session, setSession] = useState(null);
    const [group, setGroup] = useState(null);
    const [documentTitle, setDocumentTitle] = useState();
    const [error, setError] = useState(null);
    const start = formatDateTime(session?.startDateTime);
    const end = formatDateTime(session?.endDateTime);

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const data = await getSession(sessionId);
                setSession(data || {});

                const docTitle = await getDocumentTitle(sessionId);
                setDocumentTitle(docTitle.title);

            } catch (err) {
                setError('Eroare la încărcarea sesiunii');
            }
        };

        if (sessionId) {
            fetchSession();
        }
    }, [sessionId]);

    useEffect(() => {
        const fetchGroup = async () => {
            try {
                const data = await getGroup(groupId);
                setGroup(data || {});
            } catch (err) {
                setError('Eroare la încărcarea sesiunii');
            }
        };

        if (groupId) {
            fetchGroup();
        }
    }, [groupId]);

    const handleAddNote = () => {
        setNote(session?.note || '');
        setNoteOpen(true);
    };

    const handleSaveNote = async () => {
        try {
            const updatedSession = {
                ...session, note: note
            };
            await updateSessionNote(sessionId, updatedSession);
        } catch (err) {
            setError('Nu s-a putut salva nota');
        } finally {
            setNoteOpen(false);
        }
    };


    const handleAddFile = () => {
        setFileOpen(true);
    }

    const handleUploadFile = async (formData) => {
        const result = await createSessionDocument(session.id, formData);

        if (result.success) {
            console.log("Document încărcat cu succes");
        } else {
            console.error("Eroare la încărcare:", result.error);
        }
    };


    return (<Container maxWidth="lg" sx={{mt: 4}}>
        {session && (<Typography variant="h4" gutterBottom>
            Vizualizare sesiune - {start.dayName}: {`${start.hours} - ${end.hours}`}
        </Typography>)}

        {error ? (<Alert severity="error">{error}</Alert>) : (<Paper elevation={3} sx={{p: 3}}>
            <Box display="flex" justifyContent="space-between" alignItems="start">
                <Box>
                    <Typography variant="h6" gutterBottom>
                        Detalii sesiune
                    </Typography>
                    <Typography variant="body1">
                        Activitate: {group?.activity?.title}
                    </Typography>
                    <Typography variant="body1">
                        Categorie: {ActivityCategory[group?.activity?.category]}
                    </Typography>
                    <Typography variant="body1">
                        Grupă: {GroupStatus[group?.status]}
                    </Typography>
                    <Typography variant="body1">
                        Notă sesiune: {session?.note || "-"}
                    </Typography>
                    <Typography variant="body1">
                        Document: {documentTitle || "-"}
                        {documentTitle && <IconButton
                            onClick={() => getDocumentContent(sessionId)}
                            size="small"
                        >
                            <DownloadIcon/>
                        </IconButton>
                        }
                    </Typography>
                </Box>
                <Box display="flex" flexDirection="column" gap={1}>
                    <Button variant="contained" color="primary" onClick={handleAddNote}>
                        Adaugă notă
                    </Button>
                    {!documentTitle && <Button variant="contained" color="primary" onClick={handleAddFile}>
                        Adaugă document
                    </Button>}
                    <Button variant="outlined" color="primary">
                        Editează data
                    </Button>
                </Box>
            </Box>
        </Paper>)}
        <AddNoteDialog
            open={noteOpen}
            onClose={() => setNoteOpen(false)}
            note={note}
            setNote={setNote}
            onSave={handleSaveNote}
        />
        <AddFileDialog
            open={fileOpen}
            onClose={() => setFileOpen(false)}
            onUpload={handleUploadFile}
        />
    </Container>);
}