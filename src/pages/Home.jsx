import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

const Home = () => {
  return (
    <div>
       <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  )
}
export default Home;