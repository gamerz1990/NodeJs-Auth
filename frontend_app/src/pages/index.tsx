import Link from 'next/link';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const HomePage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [notifications, setNotifications] = useState<string[]>([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    
        if (token) {
          const socket = io("ws://localhost:5000",{
            query:`token=${token}`

          })
                .on('unauthorized', (msg) => {
                console.log(`unauthorized: ${JSON.stringify(msg.data)}`);
                throw new Error(msg.data.type);
                })
    
          socket.on('notification', (message: string) => {
            setNotifications((prevNotifications) => [...prevNotifications, message]);
          });
    
          return () => {
            socket.disconnect();
          };
        }
      }, []);
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="container mx-auto px-6 py-3 flex justify-between items-center">
          <a className="font-bold text-xl text-gray-800">MyApp</a>
          {isLoggedIn ? (
        <div className="text-center">
          <Link href="/profile" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2 transition duration-150 ease-in-out">
            Manage Profile
          </Link>
        </div>
      ) : (
          <div>
            <Link href="/login" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2 transition duration-150 ease-in-out">
              Login
            </Link>
            <Link href="/register" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out">
              Register
            </Link>
          </div>
            )}
        </div>
    
      </nav>

      <header className="bg-gradient-to-r from-blue-400 to-blue-600 text-white text-center py-20 lg:py-32">
        <h1 className="text-4xl lg:text-6xl font-bold mb-4">Welcome to MyApp</h1>
        <p className="text-xl lg:text-2xl">Join us and explore the unlimited possibilities.</p>
      </header>

      <main className="container mx-auto flex-1">
        <section className="text-center py-12">
          <h2 className="text-3xl font-bold text-gray-800">Features</h2>
          <p className="text-gray-600 mt-4">Discover what makes MyApp special.</p>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Cards */}
            <div className="bg-white shadow-lg rounded-lg p-6 hover:scale-105 transition-transform duration-300 ease-in-out">
              <h3 className="text-xl font-semibold mb-2">Notifications: </h3>
              <div className="mt-6">
        {notifications.map((note, index) => (
          <div key={index} className="bg-gray-100 rounded-md p-4 mb-2">
            {note}
          </div>
        ))}
      </div>
            </div>
            {/* Repeat for other features */}
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white text-center py-4">
        <p>Powered by Next.js & Tailwind CSS</p>
      </footer>
    </div>
  );
};

export default HomePage;
