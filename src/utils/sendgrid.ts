import sgMail, { MailDataRequired } from '@sendgrid/mail';
import env from 'dotenv';

env.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

const msg: (to: string, subject: string, text: string) => MailDataRequired = (to, subject, text) => ({
  to: to,  
  from: {
    name: 'DevTest',
    email: process.env.SENDGRID_FROM_EMAIL!,
  },
  templateId: process.env.SENDGRID_TEMPLATE_ID!,
  dynamicTemplateData: {
    name: '00chukwudaniel@gmail.com'
  }
});

export const sendMail = async () => {
  try {
    const result = await sgMail.send(msg('00chukwudaniel@gmail.com', 'Reset your password', 'A request was made to change the password for 00chukwudaniel@gmail.com. If you didn’t intend to change your password you can ignore this email to leave it unchanged.'));
    console.log('Mail sent successfully:', result);
  } catch (error: any) {
    console.error(error);

    if (error.response) {
      console.error(error.response.body)
    }
  }
}

sendMail();