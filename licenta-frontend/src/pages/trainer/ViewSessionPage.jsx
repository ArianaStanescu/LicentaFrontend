import { useParams } from 'react-router-dom';
import { useEffect, useState } from "react";
import { getSession } from "../../api/session/getSession";
import { Alert, Box, Button, Container, IconButton, Paper, Typography } from "@mui/material";
import { formatDateTime } from "../../components/SessionCard";
import { getGroup } from "../../api/group/getGroup";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from '@mui/icons-material/Delete';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import { ActivityCategory, GroupStatus } from "../../Enum";
import { updateSessionNote } from "../../api/session/updateSessionNote";
import { AddFileDialog } from "../../components/trainer/AddFileDialog";
import { createSessionDocument } from "../../api/session-document/createSessionDocument";
import { getDocumentTitle } from "../../api/session-document/getDocumentTitle";
import { getDocumentContent } from "../../api/session-document/getDocumentContent";
import { SessionNote } from "../../components/trainer/SessionNote";
import { deleteSessionDocument as deleteSessionDocumentService } from '../../api/session-document/deleteSessionDocument';
import { EditSessionDatesDialog } from '../../components/trainer/EditSessionDatesDialog';
import { updateSessionDate } from '../../api/session/updateSessionDate';
import { isTrainer } from '../../context/AuthContextProvider';

export const ViewSessionPage = () => {
    const { sessionId, groupId } = useParams();
    const [fileOpen, setFileOpen] = useState(false);
    const [editSessionPageModalOpen, setEditSessionPageModalOpen] = useState(false);
    const [note, setNote] = useState('');
    const [session, setSession] = useState(null);
    const [group, setGroup] = useState(null);
    const [documentTitle, setDocumentTitle] = useState();
    const [error, setError] = useState(null);
    const start = formatDateTime(session?.startDateTime);
    const end = formatDateTime(session?.endDateTime);
    const userIsTrainer = isTrainer();
 
    const fetchSession = async () => {
        try {
            const data = await getSession(sessionId);
            setSession(data || {});
            setNote(data.note || '');

            const docTitle = await getDocumentTitle(sessionId);
            setDocumentTitle(docTitle?.title);

        } catch (err) {
            setError('Eroare la încărcarea sesiunii');
        }
    };
    useEffect(() => {
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

    const handleSaveNote = async () => {
        try {
            const updatedSession = {
                ...session, note: note
            };
            await updateSessionNote(sessionId, updatedSession);
            await fetchSession()
        } catch (err) {
            setError('Nu s-a putut salva nota');
        }
    };


    const handleAddFile = () => {
        setFileOpen(true);
    }

    const handleUploadFile = async (formData) => {
        const result = await createSessionDocument(session.id, formData);

        if (result.success) {
            await fetchSession();
            console.log("Document încărcat cu succes");
        } else {
            console.error("Eroare la încărcare:", result.error);
        }
    };

    const deleteSessionDocument = async (sessionId) => {
        try {
            await deleteSessionDocumentService(sessionId);
            setDocumentTitle(null);
        } catch (error) {
            console.error("Eroare la ștergere:", error);
        }
    };

    const editSessionPeriod = async (period) => {
        const result = await updateSessionDate(session.id, period);

        if (result.success) {
            await fetchSession();
        } else {
            console.error("Eroare la editare perioada sesiune:", result.error);
        }
    };


    return (<Container maxWidth="lg" sx={{ mt: 4 }}>
        {session && (<Typography variant="h4" gutterBottom>
            Vizualizare sesiune - {start.dayName}, {start.dateFormatted}: {`${start.hours}:${start.minutes} - ${end.hours}:${end.minutes}`}
        </Typography>)}

        {error ? (<Alert severity="error">{error}</Alert>) : (<Paper elevation={3} sx={{ p: 3 }}>
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
                        Document:
                        {!documentTitle && userIsTrainer &&
                            <IconButton
                                onClick={() => handleAddFile()}
                                size="small"
                            >
                                <DriveFolderUploadIcon />
                            </IconButton>
                        }
                        {documentTitle && <span style={{marginLeft: 5}}>{documentTitle}</span>}
                        {documentTitle &&
                            <IconButton
                                onClick={() => getDocumentContent(sessionId, documentTitle)}
                                size="small"
                            >
                                <DownloadIcon />
                            </IconButton>
                        }
                        {documentTitle && userIsTrainer &&
                            <IconButton
                                onClick={() => deleteSessionDocument(sessionId)}
                                size="small"
                                sx={{ color: "red" }}
                            >
                                <DeleteIcon />
                            </IconButton>
                        }
                    </Typography>
                </Box>
                {userIsTrainer && <Box display="flex" flexDirection="column" gap={1}>
                    <Button variant="text" color="primary" onClick={() => setEditSessionPageModalOpen(true)}>
                        Editează perioada de desfășurare
                    </Button>
                </Box>}
            </Box>
        </Paper>)}
        <SessionNote note={note} setNote={setNote} updateNote={handleSaveNote} />
        <AddFileDialog
            open={fileOpen}
            onClose={() => setFileOpen(false)}
            onUpload={handleUploadFile}
        />
        {session && <EditSessionDatesDialog
            open={editSessionPageModalOpen}
            onClose={() => setEditSessionPageModalOpen(false)}
            session={session} 
            onSave={editSessionPeriod}
            />}
    </Container>);
}