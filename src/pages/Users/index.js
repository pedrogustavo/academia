import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
import Header from '../../components/Header';
import api from '../../services/api';
import './style.css'

function Users() {
    const navigate = useNavigate()
    const [users, setUsers] = useState([])

    const loadUsers = async () => {
        try {
            const response = await api.get('/users');
            setUsers(response.data)
        } catch (error) {
            setUsers([])
        }
    }

    useEffect(() => {
        loadUsers()
    }, [])

    // const handleRemove = async (user) => {
    //     if (!window.confirm("Confirmar exclusão?")) return;
    //     toast.info("Excluindo...")
    //     await api.delete(`/users/${user.id}`);
    //     loadUsers();
    // }

    const handleEdit = (user) => {
        navigate(`/users/${user.id}`)
    }

    return (
        <div className="users-container">
            <Header title="Usuários" />
            <h2>Lista de usuários <small><NavLink to="/users/form">Incluir novo</NavLink></small></h2>
            {users && users.length > 0 
                ?
                    <table>
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>CPF</th>
                                <th>Email</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users?.map(user => (
                                <tr key={user.id}>
                                    <td>{user.name}</td>
                                    <td>{user.cpf}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        {/* <button className="btn-remove-user" onClick={() => handleRemove(user)}>Excluir</button> */}
                                        <button className="btn-edit-user" onClick={() => handleEdit(user)}>Editar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                : <p>Nenhum usuário cadastrado.</p>
            }
        </div>
    )
}

export default Users;