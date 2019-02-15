let nodemailer = require("nodemailer");
let aws = require("aws-sdk");
aws.config.update({ region: "us-east-1" });

let transporter =
  // process.env.NODE_ENV === "production"
  //   ?
  nodemailer.createTransport({
    SES: new aws.SES({ apiVersion: "2010-12-01" })
  });
// : nodemailer.createTransport({
//     jsonTransport: true
//   });

transporter.verify(error => {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to send email messages");
  }
});

module.exports = transporter;
