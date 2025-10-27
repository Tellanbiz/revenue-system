import { Login } from "@/components/features/users/login"
import { RegisterLayout } from "@/components/features/users/register-layout"

export default function Home() {
  return (
    <RegisterLayout>
      <Login />
    </RegisterLayout>
  )
}
