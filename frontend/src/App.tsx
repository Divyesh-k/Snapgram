import { Route, Routes } from "react-router-dom";
import RootLayout from "./_root/RootLayout";
import AuthLayout from "./_auth/AuthLayout";
import {
  AllUsers,
  CreatePost,
  EditPost,
  Explore,
  Home,
  PostDetails,
  Profile,
  Saved,
  UpdateProfile,
} from "./_root/pages";
import SignIn from "./_auth/forms/SignIn";
import SignUp from "./_auth/forms/SignUp";
import { Toaster } from "./components/ui/toaster";
import { useState } from "react";
import Uiloder from "./components/shared/Uiloder";
import Chat from "./components/Chat/Chat";
import NotFound from "./components/shared/NotFound";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <main className="flex h-screen">
      {isLoading ? (
        <Uiloder onLoadingComplete={handleLoadingComplete} />
      ) : (
        <>
          <Routes>
            {/* public Routes */}

            <Route element={<AuthLayout />}>
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/sign-up" element={<SignUp />} />
            </Route>

            {/* private Routes */}
            <Route element={<RootLayout />}>
              <Route index element={<Home />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/saved" element={<Saved />} />
              <Route path="/all-users" element={<AllUsers />} />
              <Route path="/create-post" element={<CreatePost />} />
              <Route path="/update-post/:id" element={<EditPost />} />
              <Route path="/posts/:id" element={<PostDetails />} />
              <Route path="/profile/:id/*" element={<Profile />} />
              <Route path="/update-profile/:id" element={<UpdateProfile />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/chat/:id" element={<Chat />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>

          <Toaster />
        </>
      )}
    </main>
  );
}

export default App;
