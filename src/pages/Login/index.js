import './style.css';
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import api from '../../services/api'


function Login() {
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
        const response = await api.get('/login')
        const loginUsers = response.data.filter(user => user.name === username && user.password === password)
        if (loginUsers.length) {
          sessionStorage.setItem('userType', loginUsers[0].userType)
          toast.success("Sucesso!")
          navigate("/students")
        } else {
          toast("Login e senha não confere!")
        }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="login-container">
      <header className="login-header">
        <h1>LyFit</h1>
      </header>
      <form onSubmit={handleLogin}>
      <input name="username" type="text" placeholder="Nome do usuário"
        value={username} onChange={(event) => setUsername(event.target.value)} />
      <input name="password" type="password" placeholder="Senha"
        value={password} onChange={(event) => setPassword(event.target.value)} />
      <button type="submit">Entrar</button>
      </form>
    </div>
  );
}

export default Login;
