import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const router = useRouter();

  const handleChange = (e: any) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:5000/api/users/v1/login', credentials);
      localStorage.setItem('token', data.token);
      router.push('/profile');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <input type="email" name="email" placeholder="Email" onChange={handleChange} className="input input-bordered w-full max-w-xs" required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} className="input input-bordered w-full max-w-xs" required />
        <button type="submit" className="btn">Login</button>
      </form>
    </div>
  );
};

export default Login;
