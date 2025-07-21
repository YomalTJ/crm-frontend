import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Samurdhi Department",
  description: "This is Signin Page Samurdhi Department",
};

export default function SignIn() {
  return <SignInForm />;
}
