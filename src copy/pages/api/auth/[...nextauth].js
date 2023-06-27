import NextAuth from 'next-auth';
import CognitoProvider from 'next-auth/providers/cognito';

const { BigQuery } = require('@google-cloud/bigquery');

export default NextAuth({
  providers: [
    CognitoProvider({
      clientId: process.env.COGNITO_ID,
      clientSecret: process.env.COGNITO_SECRET,
      issuer: process.env.COGNITO_ISSUER,
    }),
  ],
  jwt: {
    encryption: true,
  },
  secret: process.env.JWT_SECRET,
  callbacks: {
    async signIn({ user }) {
      try {
        const bigquery = new BigQuery();

        const query = `
        SELECT
          *
        FROM
          vw-vwm-bi-anagp-p-evalpro-l44.STG_${process.env.AMBIENTE_PROD}.TB_USUARIOS_PLATAFORMA
        WHERE
          E_MAIL='${user.email}'
          AND ESTATUS = "Activo"
          AND SISTEMA = "VW"
      `;

        const options = {
          query,
          location: 'EU',
        };
        const [job] = await bigquery.createQueryJob(options);

        const [rows] = await job.getQueryResults();

        return rows?.length > 0;
      } catch (e) {
        console.log(e);
        return false;
      }
    },
    async jwt({ token, account }) {
      const copiaToken = { ...token };
      if (account?.accessToken) {
        copiaToken.accessToken = account.accessToken;
      }

      if (copiaToken.email) {
        const bigquery = new BigQuery();

        const query = `
          SELECT
            USER_NAME,
            FULL_NAME,
            ROLES
          FROM
            vw-vwm-bi-anagp-p-evalpro-l44.STG_${process.env.AMBIENTE_PROD}.TB_USUARIOS_PLATAFORMA
          WHERE
            E_MAIL='${copiaToken.email}'
            AND ESTATUS = "Activo"
            AND SISTEMA = "${process.env.NEXT_PUBLIC_SISTEMA}"
          `;

        const options = {
          query,
          location: 'EU',
        };
        try {
          const [job] = await bigquery.createQueryJob(options);

          const [rows] = await job.getQueryResults();
          copiaToken.roles = rows[0].ROLES;
          copiaToken.user_name = rows[0].USER_NAME;
          copiaToken.full_name = rows[0].FULL_NAME;
        } catch (e) {
          console.log(e);
          copiaToken.roles = [];
        }
      }

      return copiaToken;
    },
    async session({ session, token }) {
      const copiaSession = { ...session };
      if (token?.accessToken) {
        copiaSession.accessToken = token.accessToken;
      }
      if (token?.roles || token?.roles === 0) {
        copiaSession.user.roles = token.roles;
        copiaSession.user.user_name = token.user_name;
        copiaSession.user.full_name = token.full_name;
        delete copiaSession.user.name;
        delete copiaSession.user.image;
      }

      return copiaSession;
    },
  },
});
