import nodemailer from 'nodemailer';

// type MailerType = {
//   to: string
//   subject: string
//   text: string
//   html?: string
// }

export const sendMail = async (data) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.NODEMAILER_USER, // Your email address
      pass: process.env.NODEMAILER_PASS, // Your Google App Password or account password if less secure apps is enabled
    },
  });

  try {
    const res = await transporter.sendMail({
      from: `JS Transportation <${process.env.NODEMAILER_USER}>`,
      to: data.to,
      subject: data.subject,
      text: data.text,
      html: data.html
    })

    return res
  } catch (error) {
    return error
  }
}

export const sendVerifyEmail = async (to, token) => {
  const html = `
    <div>
        <h3>JS Transportation</h3>
        <h3>Verification Code:</h3>
        <h1>${token}</h1>
        <p>Enter the following verification code when prompted.</p>
    </div>`

  const payload = {
    to: to,
    subject: `${token} is your verification code`,
    text: `${token} is your verification code`,
    html: html
  }
  return await sendMail(payload)
}