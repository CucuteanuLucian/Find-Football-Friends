import React from "react";
import Form from "../../Components/Form/Form";

function SignupApp() {
  return <Form route="/api/user/register/" method="register" />;
}

export default SignupApp;
