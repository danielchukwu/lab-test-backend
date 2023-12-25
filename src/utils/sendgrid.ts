import sgMail, { MailDataRequired } from "@sendgrid/mail";
import env from "dotenv";

env.config();

sgMail.setApiKey(process.env.SG_API_KEY!);

type mailMsgProp = { to: string | string[]; templateId: string };

export function mailMsg({ to, templateId }: mailMsgProp) {
  return {
    to: to,
    from: {
      name: "DevTest",
      email: process.env.SG_FROM_EMAIL!,
    },
    templateId: templateId,
    dynamicTemplateData: {
      name: "00chukwudaniel@gmail.com",
    },
  };
}

// use case example (using `sgMail` api)
const sendMail = async () => {
  try {
    const result = await sgMail.send(
      mailMsg({to: "00chukwudaniel@gmail.com", templateId: process.env.SG_WELCOME_TEMPLATE_ID!})
    );
  } catch (error: any) {
    console.error(error);

    if (error.response) {
      console.error(error.response.body);
    }
  }
};
