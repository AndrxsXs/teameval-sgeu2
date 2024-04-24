import { CssBaseline } from "@mui/material";
import TopNavbar from "../../components/TopNavbar";
import Form from "../../components/auth/Form";

export default function CreatePassword() {
    return (
        <>
            <TopNavbar />
            <main>
                <CssBaseline />
                <Form route="api/create_password/" method="change_password"/>
            </main >
        </>
    );
}