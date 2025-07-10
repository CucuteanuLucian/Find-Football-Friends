import React from "react";
import Form from '../../Components/Form/Form';

function LoginApp() {
    return <Form route='/api/token/' method='login' />

}

export default LoginApp;