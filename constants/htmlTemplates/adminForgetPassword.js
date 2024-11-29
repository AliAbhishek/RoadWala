export const adminForgetPassword = (user, projectName, token) => {
  console.log(token, "token");
  const name = user?.admin_name || "User";
  const userEmail = encodeURIComponent(user.email);
  const resetPasswordUrl = `https://road-assist-admin.bosselt.com/reset-password/${token}`;
  // const resetPasswordUrl = `https://epic.bosselt.com/forgot-password/${token}`;

  return `
    
    <table
    width="100%"
    height="100%"
    cellpadding="0"
    cellspacing="0"
    bgcolor="#fff"
    >
    <tbody>
    <tr>
    <td align="center">
    <table width="600" cellpadding="50" cellspacing="0">
    <tbody>
    <tr>
    <td bgcolor="#fff" style="border-radius: 15px">
    <table
    class="col-600"
    width="600"
    height="300"
    cellpadding="0"
    cellspacing="0"
    >
    <tbody>
    <tr>
    <td height="20"></td>
    </tr>
    <tr>
    <td
    align="left"
    style="
    font-family: 'Raleway', sans-serif;
    font-size: 37px;
    color: #000000;
    font-weight: bold;
    margin-bottom: 20px;
    "
    >
    <img
    align="left"
    height="120px"
   src="https://i.imghippo.com/files/tDHPf1727442472.png"
    />
    </td>
    </tr>
    
    <tr>
    <td
    align="left"
    style="
    font-family: 'Raleway', sans-serif;
    font-size: 25px;
    color: #000000;
    font-weight: 700;
    "
    >
    <p class=""><span>Dear ${name},</span></p>
    </td>
    </tr>
    <tr>
    <td height="25"></td>
    </tr>
    <tr>
    <td
    align="left"
    style="
    font-family: 'Raleway', sans-serif;
    font-size: 16px;
    color: #000000;
    font-weight: 700;
    line-height: 25px;
    "
    >
    <p>
    We received a request to reset the password for your
    account. To proceed with resetting your password,
    please follow the instructions below.
    </p>
    </td>
    </tr>
    <tr>
    <td height="25"></td>
    </tr>
    <tr>
    <td
    align="left"
    style="
    font-family: 'Raleway', sans-serif;
    font-size: 16px;
    color: #000000;
    font-weight: 700;
    line-height: 25px;
    "
    >
    <p>
    Click the link below to reset your password:
    </p>
    <p>
    <a href="${resetPasswordUrl}" style="text-decoration: none; color: #551A8B">[Reset Password Link]</a>
    </p>
    </td>
    </tr>
    <tr>
    <td height="25"></td>
    </tr>
    
    <tr>
    <td
    align="left"
    style="
    font-family: 'Raleway', sans-serif;
    font-size: 16px;
    color: #000000;
    font-weight: 700;
    line-height: 25px;
    "
    >
    <p>For your security, the password reset link will expire with-in 10 minutes.
    If you did not request
    a password reset, you can safely ignore this email.
    Your current password will remain unchanged.
    </p>
    </td>
    </tr>
    <tr>
    <td height="20"></td>
    </tr>
    
    <tr>
    <td align="left"
    style="font-family: 'Raleway', sans-serif; font-size:16px; color:#000000; font-weight: 700; padding: 0; margin: 0;">
    <p style="margin: 0; padding: 0;">
    Best regards,
    </p>
    </td>
    </tr>
    <tr>
    <td align="left"
    style="font-family: 'Raleway', sans-serif; font-size: 18px; color:#000000; font-weight: 700; padding: 0; margin: 0;">
    <p style="margin: 0;"><span style="font-weight: 700;">Peek Team</span>
    </p>
    </td>
    </tr>
    </tbody>
    </table>
    </td>
    </tr>
    </tbody>
    </table>
    </td>
    </tr>
    </tbody>
    </table>
    `;
};
