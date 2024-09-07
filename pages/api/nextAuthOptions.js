import Credentials from "next-auth/providers/credentials";
import executeQuery from "./mysql";

export const authOptions = {
  session: {
    strategy: "jwt", // Use JWT for sessions
    maxAge: 30*60, 
  },
  cookies: {
    sessionToken: {
      name: 'next-auth.session-token',
      options: {
        maxAge: 60*60,  //expire time
        path: '/',
      },
    },
  },
  providers: [
    Credentials({
      type: "credentials",
      credentials: {
        code_user: {
          label: "Your Code User",
          type: "text",
          placeholder: "Enter your code user",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
        },
      },
      async authorize(credentials) {
        const { code_user, password } = credentials;
      
        // Verify credentials
        const userQuery = `
            SELECT u.*
            FROM user u
            JOIN groupe g ON u.codegrp_fk = g.codegrp
            WHERE u.code_user = ? 
              AND u.mot_pass = ? 
              AND u.is_actif = 1 
              AND g.is_actif = 1
          `;
        const userResult = await executeQuery(userQuery, [code_user, password]);
      
        if (userResult && userResult.length > 0) {
          const userId = userResult[0].code_user;
      
          // Fetch privileges
          const privilegeQuery = `
            SELECT 
              p.admin,
              p.VALIDATION_FACTURE,
              p.VALIDATION_ACOMPTE,
              p.VALIDATION_PROVISION,
              p.MODIFICATION_PROVISION,
              p.MODIFICATION_FACTURE,
              p.MODIFICATION_ACOMPTE,
              p.SAISIE_FACTURE,
              p.SAISIE_PROVISION,
              p.SAISIE_ACOMPTE,
              p.VALIDATION_BAC,
              p.VALIDATION_BAP,
              p.VALIDATION_BAPT
              
            FROM 
              user u
            JOIN 
              groupe g  ON u.codegrp_fk = g.codegrp
            JOIN 
              previlege p ON g.IDprev_fk = p.IDprev
            WHERE 
              u.code_user = ?
          `;
          const previlegeResult = await executeQuery(privilegeQuery, [userId]);
          
          if (previlegeResult && previlegeResult.length > 0) {
            const user = userResult[0];
            const previleges = previlegeResult[0]; // Assuming there’s only one row of privileges
      
            return {
              id: user.code_user,
              email: user.email,
              username: user.nom,
              previleges, // Add privileges object
              is_actif: user.is_actif,
              ID_struct_fk: user.ID_struct_fk,
            };
          }
        }
      
        return null; // Return null if authentication fails
      }
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.username = user.username;
        token.previleges = user.previleges; // Include privileges in the token
        token.ID_struct_fk = user.ID_struct_fk;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.username = token.username;
        session.user.previleges = token.previleges; // Include privileges in the session
        session.user.ID_struct_fk = token.ID_struct_fk;
      }
      return session;
    },
  },
};
