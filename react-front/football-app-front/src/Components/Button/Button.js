import React    from "react";
import template from "./Button.jsx";

class Button extends React.Component {
  render() {
    return template.call(this);
  }
}

export default Button;
