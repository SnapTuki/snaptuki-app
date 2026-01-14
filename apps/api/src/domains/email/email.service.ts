import { Client } from "@microsoft/microsoft-graph-client";
import { ClientSecretCredential } from "@azure/identity";
import "isomorphic-fetch";

export class EmailService {
  private graphClient: Client;

  constructor() {
    const credential = new ClientSecretCredential(
      process.env.AZURE_TENANT_ID!,
      process.env.AZURE_CLIENT_ID!,
      process.env.AZURE_CLIENT_SECRET!
    );

    this.graphClient = Client.initWithMiddleware({
      authProvider: {
        getAccessToken: async () => {
          const token = await credential.getToken("https://graph.microsoft.com/.default");
          return token?.token!;
        },
      },
    });
  }

  async sendVerificationEmail(to: string, code: string) {
    console.log("Sending Email")
    await this.graphClient
      .api(`/users/${process.env.MAIL_FROM_ADDRESS}/sendMail`)
      .post({
        message: {
          subject: "Verify your email",
          body: {
            contentType: "HTML",
            content: `
              <p>Your verification code:</p>
              <h2>${code}</h2>
              <p>This code expires in 10 minutes.</p>
            `,
          },
          toRecipients: [
            {
              emailAddress: { address: to },
            },
          ],
        },
        saveToSentItems: true,
      });

      console.log("Email sent")
  }
}
