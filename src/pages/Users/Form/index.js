import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Header from '../../../components/Header';
import api from '../../../services/api';
import './style.css'

function UserForm() {
    const params = useParams()
    const navigate = useNavigate()
    const [user, setUser] = useState({});
    const [address, setAddress] = useState("");
    const [cpf, setCpf] = useState("");
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [role, setRole] = useState("");

    useEffect(() => {
        if (params?.id) {
            loadUser(params?.id);
        }
    }, [params]);

    const loadUser = async function (id) {
        const response = await api.get(`/users/${id}`);
        const user = response.data.user;
        setUser(user);
        setAddress(user.address);
        setCpf(user.cpf);
        setEmail(user.email);
        setName(user.name);
        setPhone(user.phone);
        setRole(user.role);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const newUser = { address, cpf, name, email, phone, role }
        const id = parseInt(params?.id)
        if (!isNaN(id)) {
            await api.put(`/users/${params?.id}`, newUser);
        } else {
            await api.post(`/users`, newUser);
        }
        toast.success("Salvando usuário...")
        navigate("/users")
    }

    const handleCancel = () => {
        navigate("/users")
    }

    return (
        <div className="user-form-container">
            <Header title="Usuários" />
            <h2>{!!user ? "Editar usuário" : "Novo usuário"}</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="inputName">
                    <span>Nome:</span>
                    <input id="inputName" type="text" onChange={(event) => setName(event.target.value)} value={name} />
                </label>

                <label htmlFor="inputEmail">
                    <span>E-Mail:</span>
                    <input id="inputEmail" type="text" onChange={(event) => setEmail(event.target.value)} value={email} />
                </label>

                <label htmlFor="inputCPF">
                    <span>CPF:</span>
                    <input id="inputCPF" type="text" onChange={(event) => setCpf(event.target.value)} value={cpf} />
                </label>

                <label htmlFor="inputAddress">
                    <span>Endereço:</span>
                    <input id="inputAddress" type="text" onChange={(event) => setAddress(event.target.value)} value={address} />
                </label>

                <label htmlFor="inputPhone">
                    <span>Telefone:</span>
                    <input id="inputPhone" type="text" onChange={(event) => setPhone(event.target.value)} value={phone} />
                </label>

                <label htmlFor="inputRole">
                    <span>Função:</span>
                    <input id="inputRole" type="text" onChange={(event) => setRole(event.target.value)} value={role} />
                </label>

                <div className="actions">
                    <button type="button" onClick={handleCancel}>Cancelar</button>
                    <button type="submit">Enviar</button>
                </div>
            </form>
        </div>
    )
}

export default UserForm;