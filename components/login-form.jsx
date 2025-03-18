import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { signIn as nextAuthSignIn, useSession } from 'next-auth/react'
import { showToast } from "./ToastComponent"

export function LoginForm({
  className,
  ...props
}) {

  const router = useRouter()
  const { data: session } = useSession();

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await nextAuthSignIn('credentials', {
      email: email,
      password: password,
      redirect: false,
    })
    console.log(res,"evlrnrjknekejner")
    if (!res.error) {
        showToast.success('Login successfully');
      router.push('/')
      // Handle successful sign-in
    } else {
      showToast.error(res.error)
      console.log(res.error, 'this is error')
    }
  }

  useEffect(() => {
    ; (async function () {
      if (session) {
        router.push('/')
      }
    })()
  }, [session])

  return (
    (<form onSubmit={handleSubmit} className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email below to login to your account
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email}
                onChange={(e)=>setEmail(e.target.value)}
                placeholder="m@example.com" required />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
              Forgot your password?
            </a>
          </div>
          <Input id="password" onChange={(e)=>setPassword(e.target.value)}
          value={password}
          type="text" required />
        </div>
        <Button type="submit" className="w-full">
          Login
        </Button>
      </div>
    </form>)
  );
}
