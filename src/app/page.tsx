// "use client";

// export default function Home() {
//   const handleLogin = () => {
//     // Redirect to OAuth login
//     window.location.href = '/api/auth/login';
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen">
//       <h1 className="text-2xl font-bold">YouTube Playlists</h1>
//       <button
//         className="mt-4 px-6 py-2 bg-blue-500 text-white rounded"
//         onClick={handleLogin}
//       >
//         Log in with Google
//       </button>
//     </div>
//   );
// }

"use client";

export default function Home() {
  const handleLogin = () => {
    // Redirect to OAuth login
    window.location.href = "/api/auth/login";
  };

  const handleSignup = () => {
    // Redirect to OAuth signup
    window.location.href = "/api/auth/signup";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">YouTube Playlists</h1>
      <div className="mt-4 flex gap-4">
        <button
          className="px-6 py-2 bg-blue-500 text-white rounded"
          onClick={handleLogin}
        >
          Log in with Google
        </button>
        <button
          className="px-6 py-2 bg-green-500 text-white rounded"
          onClick={handleSignup}
        >
          Sign up with Google
        </button>
      </div>
    </div>
  );
}
