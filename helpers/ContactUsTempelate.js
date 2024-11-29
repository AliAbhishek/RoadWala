const contactUsTemplate = (name, email, message) => {
    return `
    
    <table width="100%" height="100%" cellpadding="0" cellspacing="0" bgcolor="#fff">

        <tbody>
            <tr>
                <td align="center">
                    <table width="600" cellpadding="50" cellspacing="0">
                        <tbody>
                            <tr>
                                <td bgcolor="#fff" style="border-radius: 15px;">
                                    <table class="col-600" width="600" height="300" cellpadding="0" cellspacing="0">
                                        <tbody>
                                            <tr>
                                                <td height="20"></td>
                                            </tr>
                                            <tr>
                                                <td align="left"
                                                    style="font-family: 'Raleway', sans-serif; font-size:37px; color:#000000; font-weight: bold; margin-bottom: 20px;">
                                                    <!-- <img align="left" height="90"
                                                    src="https://suukha-api.bosselt.com/uploads/1722404129103-suukha.jpg"> -->

                                                </td>
                                            </tr>
                                            <!-- <tr>
                                            <td height="30"></td>
                                        </tr> -->
                                            <tr>
                                                <td align="left"
                                                    style="font-family: 'Raleway', sans-serif; font-size:25px; color:#000000; font-weight: 700;">
                                                    <p class=""><span>Hi,</span></p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td height="20"></td>
                                            </tr>
                                            <tr>
                                                <td align="left"
                                                    style="font-family: 'Raleway', sans-serif; font-size:16px; color:#000000; font-weight: 700; line-height: 25px;">
                                                    <p>Name: ${name}
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td align="left"
                                                    style="font-family: 'Raleway', sans-serif; font-size:16px; color:#000000; font-weight: 700; line-height: 25px;">
                                                    <p>Email: ${email}
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td align="left"
                                                    style="font-family: 'Raleway', sans-serif; font-size:16px; color:#000000; font-weight: 700; line-height: 25px;">
                                                    <p>Message: ${message}
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td height="20"></td>
                                            </tr>

                                            <!-- <tr>
                                            <td align="left"
                                                style="font-family: 'Raleway', sans-serif; font-size:16px; color:#000000; font-weight: 700; line-height: 25px;">
                                                <p>Thank you for choosing RoasdAssistance!
                                                </p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td height="20"></td>
                                        </tr> -->

                                            <tr>
                                                <td align="left"
                                                    style="font-family: 'Raleway', sans-serif; font-size:16px; color:#000000; font-weight: 700;">
                                                    <p class="">
                                                        Best regards,
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td height="10"></td>
                                            </tr>
                                            <tr>
                                                <td align="left"
                                                    style="font-family: 'Raleway', sans-serif; font-size:20px; color:#000000; font-weight: 700;">
                                                    <p class=""><span
                                                            style="font-weight: 800; font-family: poppins;">RoadAssistance
                                                            Contact Us</span>
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
    </table>`;
  };
  
export default contactUsTemplate;