import NextAuth from "next-auth/next";
import { authOptions } from "../nextAuthOptions";

export default NextAuth(authOptions)