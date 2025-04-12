import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
} from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { setHours, setMinutes } from "date-fns";
import { ro } from 'date-fns/locale';

export const EditSessionDatesDialog = ({ open, onClose, onSave, session }) => {
    const [selectedDate, setSelectedDate] = useState(new Date(session?.startDateTime));
    const [startTime, setStartTime] = useState(new Date(session?.startDateTime));
    const [endTime, setEndTime] = useState(new Date(session?.endDateTime));
    const currentDate = new Date();

    const handleDateChange = (date) => {
        setSelectedDate(date);
        setStartTime(setMinutes(setHours(date, startTime.getHours()), startTime.getMinutes()));
        setEndTime(setMinutes(setHours(date, endTime.getHours()), endTime.getMinutes()));
    };

    const updateStartTime = (time) => {
        setStartTime(setMinutes(setHours(selectedDate, time.getHours()), time.getMinutes()));
    };

    const updateEndTime = (time) => {
        setEndTime(setMinutes(setHours(selectedDate, time.getHours()), time.getMinutes()));
    };

    const handleSave = () => {
        onSave({
            startDateTime: new Date(startTime.getTime() - startTime.getTimezoneOffset() * 60000).toISOString(),
            endDateTime: new Date(endTime.getTime() - endTime.getTimezoneOffset() * 60000).toISOString(),
        });
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Editează perioada sesiunii</DialogTitle>
            <DialogContent>
                <Box mt={2} display="flex" flexDirection="column" alignItems={"center"} gap={5}>
                    <DatePicker
                        selected={selectedDate}
                        onChange={handleDateChange}
                        dateFormat="yyyy/MM/dd"
                        inline
                        minDate={currentDate}
                        locale={ro}
                    />
                    <Box display={"flex"} gap={5} justifyContent="center">
                    <DatePicker
                        selected={startTime}
                        onChange={updateStartTime}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={30}
                        timeFormat="HH:mm"
                        dateFormat="HH:mm"
                        inline
                        timeCaption="Start"
                    />
                    <DatePicker
                        selected={endTime}
                        onChange={updateEndTime}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={30}
                        timeFormat="HH:mm"
                        dateFormat="HH:mm"
                        inline
                        timeCaption="Final"
                    />
                    </Box>
                    {startTime >= endTime && (
                        <Typography color="error" variant="body2">
                            Data de final trebuie să fie după data de început!
                        </Typography>
                    )}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Anulează</Button>
                <Button onClick={handleSave} variant="contained" disabled={startTime >= endTime}>
                    Salvează
                </Button>
            </DialogActions>
        </Dialog>
    );
};
