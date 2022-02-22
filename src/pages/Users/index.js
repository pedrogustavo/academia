import { useEffect, useState, useCallback } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Header from '../../components/Header'
import api from '../../services/api'
import './style.css'

function Users() {
    const navigate = useNavigate()
    const [users, setUsers] = useState([])
    const [filterValue, setFilterValue] = useState('')
    const [filterSelect, setFilterSelect] = useState('name')
    const userType = sessionStorage.getItem('userType')

    const loadUsers = useCallback(async () => {
        try {
            const response = await api.get('/users');
            setUsers(response.data)
        } catch (error) {
            setUsers([])
        }
    }, [])

    const canEdit = (role) => {
        const typesAllowed = ['recepcionista', 'gerente']
        if (typesAllowed.includes(userType)) {
            if (userType === 'recepcionista' && role === 'gerente') return false
            return true
        }
        return false
    }

    const canRemove = () => {
        const typesAllowed = ['gerente']
        return typesAllowed.includes(userType)
    }

    useEffect(() => loadUsers(), [loadUsers])

    const handleRemove = async (user) => {
        if (!window.confirm("Confirmar exclusão?")) return
        toast.info("Excluindo...")
        await api.delete(`/users/${user.id}`)
        handleFilter()
    }

    const handleEdit = (user) => {
        navigate(`/users/${user.id}`)
    }

    const handleFilter = async () => {
        const response = await api.get('/users')
        let filterResult = []
        filterResult = response.data.filter(user => (
            user[filterSelect] && user[filterSelect].toLowerCase().includes(filterValue)
        ))
        setUsers(filterResult)
    }

    return (
        <div className="users-container">
            <Header title="Usuários" />
            <h2>Lista de usuários <small><NavLink to="/users/form">Incluir novo</NavLink></small></h2>
            <div className='filtro'>
                <p>Filtro</p>
                <select value={filterSelect} onChange={(event) => setFilterSelect(event.target.value)}>
                    <option value="name">Nome</option>
                    <option value="cpf">CPF</option>
                    <option value="address">Endereço</option>
                    <option value="birthDate">Data de Nascimento</option>
                    <option value="email">Email</option>
                    <option value="phone">Telefone</option>
                </select>

                <input id="inputFilter" type="text" value={filterValue} onChange={(event) => setFilterValue(event.target.value)} />
                <button type="button" onClick={handleFilter}>Filtrar</button>
            </div>
            {users && users.length > 0 
                ?
                    <table>
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>CPF</th>
                                <th>Email</th>
                                <th>Tipo de usuário</th>
                                <th>Endereço</th>
                                <th>Data de Nascimento</th>
                                <th>Telefone</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users?.map(user => (
                                <tr key={user.id}>
                                    <td>{user.name}</td>
                                    <td>{user.cpf}</td>
                                    <td>{user.email}</td>
                                    <td>{user.role}</td>
                                    <td>{user.address}</td>
                                    <td>{user.birthDate}</td>
                                    <td>{user.phone}</td>
                                    <td>
                                        {canRemove(user.role) &&<button className="btn-remove-user" onClick={() => handleRemove(user)}>Excluir</button>}
                                        {/* {(userType === 'recepcionista' && user.role !== 'gerente') && <button className="btn-edit-user" onClick={() => handleEdit(user)}>Editar</button>} */}
                                        {canEdit(user.role) && <button className="btn-edit-user" onClick={() => handleEdit(user)}>Editar</button>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                : <p>Nenhum usuário encontrado.</p>
            }
        </div>
    )
}

export default Users;