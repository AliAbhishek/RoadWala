import sgMail from "@sendgrid/mail";
const sendGrid = (msg) => {
    console.log(process.env.SEND_GRID_API_KEY)
  sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
  sgMail
    .send(msg)
    .then((returnRes) => {
      console.log(returnRes);
      console.log(`Success: Email sent successfully to ${msg.to}`);
      return true;
    })
    .catch((error) => {
      if (error) {
        console.log("error", error);
        console.error(
          `Error: While sending email to ${msg.to} Error encountered is: ${error}`
        );
      } 
    });
};
export default sendGrid;