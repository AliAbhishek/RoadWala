

import { adminForgetPassword } from "../constants/htmlTemplates/adminForgetPassword.js";
import sendGrid from "./sendGrid.js";

export const sendadminForgetPasswordEmail = ({
  email,
  subject,
  project_name,
  type,
  user,
  token,
}) => {
  let html;
  switch (type) {
    case "adminforgetpassword":
      subject = `Reset Your ${project_name} Account`;
      html = adminForgetPassword(user, project_name, token);
      break;
    default:
      break;
  }

  const msg = {
    to: `${email}`,
    from: process.env.SEND_GRID_SENDER,
    subject: subject ? subject : `Verify Your ${project_name} Account`,
    text: "Dont share this Link",
    html,
  };

  sendGrid(msg);
};
