import Link from 'next/link';

const Home = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem('token') : null;

  return (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">Welcome to Our App</h1>
      {token ? (
        <>
          <p>You are logged in!</p>
          <Link href="/profile">
            <a className="btn mt-4">View Profile</a>
          </Link>
        </>
      ) : (
        <>
          <Link href="/login">
            <a className="btn">Login</a>
          </Link>
          <Link href="/register">
            <a className="btn mt-4">Register</a>
          </Link>
        </>
      )}
    </div>
  );
};

export default Home;
