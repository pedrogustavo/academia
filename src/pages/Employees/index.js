import Header from '../../components/Header'
import { useState } from 'react'
import { formatarCpf } from '../../services/support'
import api from '../../services/api'
import { toast } from 'react-toastify'
import './style.css'

function Employees () {
    const initialValidateField = () => ({ isValid: false, isBlur: false })
    const initialValidate = { 
        name: initialValidateField(),
        cpf: initialValidateField(),
        paymentDate: initialValidateField(),
        paymentType: initialValidateField(),
        paymentValue: initialValidateField()
    }

    const [hasPermission, setHasPermission] = useState(false)
    const [validate, setValidate] = useState(initialValidate)
    const [cpf, setCpf] = useState('')
    const [name, setName] = useState('')
    const [employees, setEmployees] = useState([])

    const validateName = (target, inputName) => {
        const objValidate = { ...validate }
        if (inputName === 'paymentValue') {
            objValidate[inputName] = {
                isValid: target.value > 20,
                isBlur: true
            }
        } else if (inputName === 'paymentType') {
            objValidate[inputName] = {
                isValid: target.value === 'dinheiro',
                isBlur: true
            }
            if (target.value !== 'dinheiro') {
                toast.error("O meio de pagamento não está habilitado")
            }
        } else {
            objValidate[inputName] = {
                isValid: target.validity.valid,
                isBlur: true
            }
        }
        setValidate(objValidate)
    }

    const handleSubmitValidateUser = async (event) => {
        event.preventDefault()
        try {
            const response = await api.get('/login')
            const users = response.data.filter(user => {
                if (user.userType === 'gerente') {
                    return user.name.toLowerCase() === name.toLowerCase() && user.cpf === cpf
                }
                return false
            })
            
            if (users.length) {
                toast("Lista de alunos carregada com sucesso!")
                setHasPermission(true)
                loadEmployees()
                return
            } else {
                toast.error("Você não tem permissão para acessar essa página")
            }
        } catch (error) {
            setHasPermission(false)
            toast.error("Ocorreu um erro inesperado")
        }
    }

    const loadEmployees = async () => {
        try {
            const response = await api.get('/users?role=funcionario&_sort=name')
            setEmployees(response.data)
            toast("Lista de funcionários carregada com sucesso!")
       } catch (error) {
            setEmployees([])
        }
    }

    return (
        <div className="user-form-container">
            <Header title="Funcionários"/>

            {!hasPermission && (
                <div className='controle-de-acesso'>
                    <h2>Insira seus dados</h2>
                    <form onSubmit={handleSubmitValidateUser}>
                        <label
                            htmlFor="inputName"
                            className={`${validate.name.isValid ? 'is-valid' : ''} ${(validate.name.isBlur && !validate.name.isValid) ? 'is-invalid' : ''}`}
                        >
                            <span>Nome:</span>
                            <input 
                                id="inputName"
                                type="text"
                                onChange={(event) => setName(event.target.value)}
                                value={name}
                                minLength={3}
                                required
                                onBlur={event => validateName(event.target, 'name')}
                            />
                        </label>
                        <label 
                            htmlFor="inputCPF"
                            className={`${validate.cpf.isValid ? 'is-valid' : ''} ${(validate.cpf.isBlur && !validate.cpf.isValid) ? 'is-invalid' : ''}`}
                        >
                            <span>CPF:</span>
                            <input
                                id="inputCPF"
                                type="text"
                                onChange={(event) => setCpf(formatarCpf(event.target.value))}
                                onBlur={event => validateName(event.target, 'cpf')}
                                value={cpf}
                                maxLength={14}
                                minLength={14}
                                required
                            />
                        </label>
                        <div className="actions">
                            <button type="submit">Enviar</button>
                        </div>
                    </form>
                </div>
                )
            }
            
            <div className='users-container-grid'>
                {hasPermission 
                    ? (
                        <>
                        <section id='listagem-mensalidade'>
                            <h3>Lista funcionários</h3>
                            {employees && employees.length > 0 
                                ?
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Nome</th>
                                                <th>CPF</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {employees?.map(user => (
                                                <tr key={user.id}>
                                                    <td>{user.name}</td>
                                                    <td>{user.cpf}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                : <p>Nenhum usuário encontrado.</p>
                            }
                        </section>
                        </>
                    )
                    : (
                        <>
                        :(
                        </>
                    )
                }
            </div>
        </div>
    )
}

export default Employees