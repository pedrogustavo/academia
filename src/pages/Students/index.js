import Header from '../../components/Header'
import { useEffect, useState } from 'react'
// import { useNavigate } from 'react-router-dom'
import api from '../../services/api'
import './style.css'
import { toast } from 'react-toastify';

function Students() {
    // const navigate = useNavigate()
    const [users, setUsers] = useState([])
    const userType = sessionStorage.getItem('userType')

    const loadUsers = async () => {
        try {
            const response = await api.get('/users?role=aluno')
            setUsers(response.data)
            if (userType === 'aluno') {
                toast.error('Você não possui acesso a alguns dados')
            } else {
                toast("Lista de alunos carregada com sucesso!")
            }
        } catch (error) {
            setUsers([])
        }
    }

    const canSeeField = () => {
        if (userType === 'aluno') return false
        return true
    }

    useEffect(() => {
        loadUsers()
    }, [])

    // const handleEdit = (user) => {
    //     navigate(`/users/${user.id}`)
    // }

    return (
        <div className="users-container">
            <Header title="Alunos" />
            <h2>Lista de Alunos</h2>
            {users && users.length > 0 
                ?
                    <table>
                        <thead>
                            <tr>
                                <th>Nome</th>
                                {canSeeField() && <th>CPF</th>}
                                {canSeeField() && <th>Email</th>}
                                {/* <th>Ações</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {users?.map(user => (
                                <tr key={user.id}>
                                    <td>{user.name}</td>
                                    {canSeeField() && <td>{user.cpf}</td>}
                                    {canSeeField() && <td>{user.email}</td>}
                                    {/* <td>
                                        <button className="btn-remove-user" onClick={() => handleRemove(user)}>Excluir</button>
                                        <button className="btn-edit-user" onClick={() => handleEdit(user)}>Editar</button>
                                    </td> */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                : <p>Nenhum usuário cadastrado.</p>
            }
        </div>
    )
}

export default Students