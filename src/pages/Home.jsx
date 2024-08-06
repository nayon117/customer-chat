import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
       <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>

      <div>
        <Link to='/admin-messages'>Admin</Link>
      </div>
    </div>
  )
}
export default Home;