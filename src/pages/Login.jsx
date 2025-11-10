import {
    Box,
    Button,
    Card,
    CardContent,
    Divider,
    TextField,
    Typography,
    Snackbar,
    Alert,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getToken, setToken, setRole } from "../services/localStorageService";
import '../assets/styles/login.css';

const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [snackBarOpen, setSnackBarOpen] = useState(false);
    const [snackBarMessage, setSnackBarMessage] = useState("");

    const handleCloseSnackBar = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setSnackBarOpen(false);
    };

    const handleGoogleLogin = () => {
        alert(
            "Please refer to Oauth2 series for this implementation guidelines."
        );
    };

    useEffect(() => {
        const accessToken = getToken();
        if (accessToken) {
            navigate("/");
        }
    }, [navigate]);

    const handleSubmit = (event) => {
        event.preventDefault();

        fetch("http://localhost:8080/safetyconstruction/auth/token", {
            method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({
        name: username,
        password: password,
        }),
    })
        .then((response) => response.json())
        .then((data) => {
        if (data.code !== 1000) {
            throw new Error(data.message);
        }
        setToken(data.result?.token);
        setRole(data.result?.role);
        // Force a page reload to update the authentication state
        window.location.href = '/';
        })
        .catch((error) => {
        setSnackBarMessage(error.message);
        setSnackBarOpen(true);
        });
    };

    return (
        <>
            <Snackbar
                open={snackBarOpen}
                onClose={handleCloseSnackBar}
                autoHideDuration={6000}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert
                    onClose={handleCloseSnackBar}
                    severity="error"
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    {snackBarMessage}
                </Alert>
            </Snackbar>

            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                height="100vh"
                bgcolor={"#f0f2f5"}
            >
                <Card
                    sx={{
                        minWidth: 400,
                        maxWidth: 500,
                        boxShadow: 4,
                        borderRadius: 4,
                        padding: 4,
                    }}
                >
                    <CardContent>
                        <Typography variant="h5" component="h1" gutterBottom>
                            Welcome to Safety Construction
                        </Typography>

                        <Box
                            component="form"
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            justifyContent="center"
                            width="100%"
                            onSubmit={handleSubmit}
                        >
                            <TextField
                                label="Username"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <TextField
                                label="Password"
                                type="password"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                size="large"
                                fullWidth
                                sx={{
                                    mt: "15px",
                                    mb: "25px",
                                }}
                            >
                                Login
                            </Button>
                            <Divider flexItem sx={{ mb: 2 }} />
                        </Box>

                        <Box display="flex" flexDirection="column" width="100%" gap="25px">
                            <Button
                                variant="contained"
                                color="secondary"
                                size="large"
                                onClick={handleGoogleLogin}
                                fullWidth
                                sx={{ gap: "10px" }}
                            >
                                <GoogleIcon />
                                Continue with Google
                            </Button>
                            <Button
                                variant="contained"
                                color="success"
                                size="large"
                                onClick={() => navigate("/register")}
                                fullWidth
                            >
                                Create an account
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </>
    );
};

export default Login;