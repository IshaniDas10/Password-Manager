function AuthHeader() {
  return (
    <div className="flex flex-col items-center mb-8">
      <div className="bg-gray-950 rounded-2xl p-4 mb-2">
        <img
          src="/logo.png"
          alt="Passly - Password Manager"
          className="w-64 sm:w-72 object-contain"
        />
      </div>
      <p className="text-gray-500 dark:text-gray-400 text-sm">
        Passwords. Simplified. Security. Amplified.
      </p>
    </div>
  );
}

export default AuthHeader;