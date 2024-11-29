const resendOtpTemplate = (user, otp, projectName) => {
    
    const name = user?.name || "User";
    return `
    <table width="100%" height="100%" cellpadding="0" cellspacing="0">
    
        <!-- START HEADER/BANNER -->
        <tbody>
            <tr>
                <td align="center">
                    <table width="600" cellpadding="50" cellspacing="0">
                        <tbody>
                            <tr>
                                <td  style="border-radius: 10px;">
                                    <table class="col-600" width="600" height="300" cellpadding="0" cellspacing="0">
                                        <tbody>
                                            <tr>
                                                <td height="20"></td>
                                            </tr>
                                            <tr>
                                            <td align="left" style="font-family: 'Raleway', sans-serif; font-size:37px; color:#000000; font-weight: bold; margin-bottom: 20px;  position: relative; left: -15px;">
                                            <img align="left"  src="https://i.imghippo.com/files/tDHPf1727442472.png" style="height:120px;">
                                        </td>
                                            </tr>
                                            <tr>
                                                <td height="30"></td>
                                            </tr>
                                            <tr>
                                                <td align="left"
                                                    style="font-family: 'Raleway', sans-serif; font-size:25px; color:#000000; font-weight: 700;">
                                                    <p><span> Hi </span>${name}</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td height="25"></td>
                                            </tr>
                                            <tr>
                                                <td align="left"
                                                    style="font-family: 'Raleway', sans-serif; font-size:20px; color:#000000; font-weight: 800;">
                                                    <p>Your Account Reset Resend Code</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td height="25"></td>
                                            </tr>
                                            <tr>
                                                <td align="left"
                                                    style="font-family: 'Raleway', sans-serif; font-size:16px; color:#000000; font-weight: 700; line-height: 25px;">
                                                    <p>We received a request to Resend Code to verify your account. Please use the following one-time password to verify yourself.</span>
    
                                                    </p>
                                                </td>
                                            </tr>
    
                                            <tr>
                                                <td height="50"></td>
                                            </tr>
    
                                            <tr>
                                                <td align="left"
                                                    style="font-family: 'Raleway', sans-serif; font-size:18px; color:#000000; font-weight: 700;">
                                                    <p>
                                                        Your Verification Resend Code
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td height="10"></td>
                                            </tr>
                                            <tr>
                                                <td align="left"
                                                    style="font-family: 'Raleway', sans-serif; font-size:30px; color:#000000; font-weight: 700;">
                                                    <p><span style="font-weight: 800;">${otp}</span></p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td height="30"></td>
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
    </table>`;
  };
  
  export default resendOtpTemplate;
  