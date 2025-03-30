import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        primary: {
            // main: "#ccff99",
            // main: "#33cc33",
            main: "#5cd65c",
            contrastText: "#fff",
        },
        secondary: {
            main: "#ff0000",

        },
        action: {
            // active: "#33cc33",
            // hover: "#ccff99",
            // selected: "#ccff99",
            // disabled
        },
        background: {
            // default: "#f4f6f8",
            // paper: "#ffffff",
        },
    },
    typography: {
        fontFamily: "Arial, sans-serif",
        h4: {
            fontWeight: 700,
        },
        button: {
            textTransform: "none",
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: "8px",
                    padding: "10px 20px",
                    fontSize: "1rem",
                    transition: "background-color 0.3s ease",
                    "&:hover": {
                        backgroundColor: "#33cc33",
                    },
                },
                text: {
                    backgroundColor: "transparent",
                    color: "#5cd65c",
                    "&:hover": {
                        backgroundColor: "transparent",
                        color: "#33cc33"
                    }
                },
                containedSecondary: {
                    backgroundColor: "#ff0000",
                    color: "#fff",
                    "&:hover": {
                        backgroundColor: "#e60000",
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    borderRadius: "8px",
                    backgroundColor: "#fff",
                },
            },
        },
    },
});

export default theme;
