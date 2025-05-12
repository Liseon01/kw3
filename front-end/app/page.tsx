import LoginForm from "@/components/login-form"

export default function Home() {
  // In a real application, you would check if the user is authenticated
  // For demo purposes, we'll just redirect to the login page
  return <LoginForm />
}
