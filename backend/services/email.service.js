// const nodemailer = require('nodemailer');

// const transport = nodemailer.createTransport({
//   host: 'smtp.gmail.com',
//   port: 465,
//   secure: true,
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS,
//   },
// });

// // send mail
// const sendVerifiedEmail = async (code, email) => {
//   await transport.sendMail({
//     from: `"InvoiceHub" <${process.env.SMTP_USER}>`,
//     to: email,
//     subject: 'Verify Your InvoiceHub Account',
//     text: `Your verification code is: ${code}`,

//     html: `
//       <div style="
//         max-width: 500px;
//         margin: auto;
//         padding: 40px 20px;
//         font-family: Arial, sans-serif;
//         background: #f9fafb;
//       ">
//         <div style="
//           background: white;
//           padding: 40px 30px;
//           border-radius: 12px;
//           text-align: center;
//           box-shadow: 0 2px 10px rgba(0,0,0,0.08);
//         ">
//           <table align="center" style="margin: 0 auto 8px;">
//             <tr>
//               <td style="
//                 width: 40px;
//                 height: 40px;
//                 background: #00966d;
//                 border-radius: 12px;
//                 text-align: center;
//                 vertical-align: middle;
//                 color: white;
//                 font-weight: bold;
//                 font-size: 20px;
//               ">IH</td>
//               <td style="padding-left: 10px; text-align: left; vertical-align: middle;">
//                 <p style="margin: 0; color: #111827; font-size: 18px; font-weight: bold;">InvoiceHub</p>
//                 <p style="margin: 2px 0 0; color: #6b7280; font-size: 12px;">Store Billing Manager</p>
//               </td>
//             </tr>
//           </table>

//           <p style="
//             margin-top: 24px;
//             color: #4b5563;
//             font-size: 16px;
//             line-height: 1.6;
//           ">
//             Verify your account using the code below.
//           </p>

//           <div style="
//             margin: 30px 0;
//             font-size: 32px;
//             font-weight: bold;
//             letter-spacing: 8px;
//             color: #00966d;
//           ">
//             ${code}
//           </div>

//           <p style="
//             color: #6b7280;
//             font-size: 14px;
//             line-height: 1.6;
//           ">
//             This code will expire in 10 minutes. If you didn't request this,
//             you can safely ignore this email.
//           </p>

//           <hr style="
//             border: none;
//             border-top: 1px solid #e5e7eb;
//             margin: 30px 0 20px;
//           " />

//           <p style="
//             color: #9ca3af;
//             font-size: 12px;
//             margin: 0;
//           ">
//             &copy; ${new Date().getFullYear()} InvoiceHub. All rights reserved.
//           </p>
//         </div>
//       </div>
//     `,
//   });
// };

// module.exports = sendVerifiedEmail;

const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

// send mail
const sendVerifiedEmail = async (code, email) => {
  await resend.emails.send({
    from: 'InvoiceHub <onboarding@resend.dev>',
    to: email,
    subject: 'Verify Your InvoiceHub Account',
    text: `Your verification code is: ${code}`,

    html: `
      <div style="
        max-width: 500px;
        margin: auto;
        padding: 40px 20px;
        font-family: Arial, sans-serif;
        background: #f9fafb;
      ">
        <div style="
          background: white;
          padding: 40px 30px;
          border-radius: 12px;
          text-align: center;
          box-shadow: 0 2px 10px rgba(0,0,0,0.08);
        ">
          <table align="center" style="margin: 0 auto 8px;">
            <tr>
              <td style="
                width: 40px;
                height: 40px;
                background: #00966d;
                border-radius: 12px;
                text-align: center;
                vertical-align: middle;
                color: white;
                font-weight: bold;
                font-size: 20px;
              ">IH</td>
              <td style="padding-left: 10px; text-align: left; vertical-align: middle;">
                <p style="margin: 0; color: #111827; font-size: 18px; font-weight: bold;">InvoiceHub</p>
                <p style="margin: 2px 0 0; color: #6b7280; font-size: 12px;">Store Billing Manager</p>
              </td>
            </tr>
          </table>

          <p style="
            margin-top: 24px;
            color: #4b5563;
            font-size: 16px;
            line-height: 1.6;
          ">
            Verify your account using the code below.
          </p>

          <div style="
            margin: 30px 0;
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 8px;
            color: #00966d;
          ">
            ${code}
          </div>

          <p style="
            color: #6b7280;
            font-size: 14px;
            line-height: 1.6;
          ">
            This code will expire in 10 minutes. If you didn't request this,
            you can safely ignore this email.
          </p>

          <hr style="
            border: none;
            border-top: 1px solid #e5e7eb;
            margin: 30px 0 20px;
          " />

          <p style="
            color: #9ca3af;
            font-size: 12px;
            margin: 0;
          ">
            &copy; ${new Date().getFullYear()} InvoiceHub. All rights reserved.
          </p>
        </div>
      </div>
    `,
  });
};

module.exports = sendVerifiedEmail;
