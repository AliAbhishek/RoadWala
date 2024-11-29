const registerTemplate = (project_name, otp_email, user, type) => {
    const name = user?.name || "User";
    return `<table width="100%" height="100%" border="0"  align="center" cellpadding="0" cellspacing="0">
        <tbody>
            <tr>
                <td align="center">
                    <table width="600" border="0" align="center" cellpadding="50"  cellspacing="0">
                        <tbody>
                            <tr>
                                <td align="center" valign="top"  style="border-radius: 15px; position: relative;">
                                    <table class="col-600" width="600" height="200" border="0" border-radius: "15px";  align="center" cellpadding="0" cellspacing="0">
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
                                                <td height="20"></td>
                                            </tr>                                 
                                            <tr>
                                                <td align="left" style="font-family: 'Raleway', sans-serif; font-size:
                                                25px; color:#000000; font-weight: 700;">
                                                    <p class="" style="margin:10px 0;"> <span> Hi</span> ${
                                                        name
                                                    }!  </p>
                                                </td>
                                            </tr>
      
                                            <tr>
                                                <td height="15"></td>
                                            </tr>
                                            <tr>
                                                <td align="left" style="font-family: 'Raleway', sans-serif; font-size:25px; color:#000000; font-weight: 700;">
                                                <p class="" style="margin:10px 0;"> ${
                                                  type == "resendotp"
                                                    ? "Your Account Verify Resend OTP"
                                                    : "Your Account Verify OTP"
                                                }  </p>
                                                </td>
                                            </tr>
      
                                            <tr>
                                                <td height="15"></td>
                                            </tr>
      
      
      
                                            <tr>
                                                <td align="left" style="font-family: 'Raleway', sans-serif; font-size:16px; color:#000000; font-weight: 700; line-height: 25px;">
                                                    <p class="" > We recieved a request to verify your account. Please use the following one-time password to verify yourself.</span>
                                                            
                                                    </p>
                                                </td>
                                            </tr>
      
                                            <tr>
                                                <td height="15"></td>
                                            </tr>
      
                                         <tr>
                                                <td align="left" style="font-family: 'Raleway', sans-serif; font-size:16px; color:#000000; font-weight: 700; line-height: 25px;">
                                                    <p class=""> 
                                                            Your verification OTP
                                                    </p>
                                                </td>
                                            </tr>
                                             <tr>
                                                <td align="left" style="font-family: 'Raleway', sans-serif; font-size:16px; color:#000000; font-weight: 700; line-height: 25px;">
                                                    <p class="">  <span style="font-weight: 800; font-family: poppins; font-size:50px;">${otp_email}</span>
                                                            
                                                    </p>
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
  
export default registerTemplate;
  