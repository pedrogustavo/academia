import Header from '../../components/Header'
import { useState } from 'react'
import { formatarCpf } from '../../services/support'
import api from '../../services/api'
import { toast } from 'react-toastify'
import './style.css'

function Payments() {
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
    const [students, setStudents] = useState([])

    const [currentStudent, setCurrentStudent] = useState(null)
    const [paymentDate, setPaymentDate] = useState('')
    const [paymentType, setPaymentType] = useState('dinheiro')
    const [paymentValue, setPaymentValue] = useState('')

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
            const response = await api.get('/users')
            const users = response.data.filter(user => (
                user.name.toLowerCase() === name.toLowerCase() && user.cpf === cpf
            ))
            
            if (users.length) {
                toast("Lista de alunos carregada com sucesso!")
                setHasPermission(true)
                loadStudents()
                return
            } else {
                toast.error("Você não tem permissão para acessar essa página")
            }
        } catch (error) {
            setHasPermission(false)
            toast.error("Ocorreu um erro inesperado")
        }
    }

    const loadStudents = async () => {
        try {
            const response = await api.get('/users?role=aluno&_sort=name')
            setStudents(response.data)
            toast("Lista de alunos carregada com sucesso!")
       } catch (error) {
            setStudents([])
        }
    }

    const handleSubmitPayment = async (event) => {
        event.preventDefault()
        const id = event.target.id.value

        const paymentObj = {
            paymentDate,
            paymentType,
            paymentValue
        }
        
        let obj

        if (currentStudent.payment) {
            obj = { ...currentStudent, payment: [...currentStudent.payment, paymentObj] }
        } else {
            obj = { ...currentStudent, payment: [paymentObj]}
        }

        try {
            await api.put('/users/' + id, obj)
            toast("Mensalidade cadastrada")
            loadStudents()
            setCurrentStudent(null)
            setPaymentValue('')
            setPaymentDate('')
        } catch (error) {
            toast.error("Ocorreu um erro inesperado")
        }
    }

    return (
        <div className="user-form-container">
            <Header title="Mensalidades"/>

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
                            <h3>Lista Mensalidade</h3>
                            {students && students.length > 0 
                                ?
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Nome</th>
                                                <th>CPF</th>
                                                <th>Status</th>
                                                <th>Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {students?.map(user => (
                                                <tr key={user.id}>
                                                    <td>{user.name}</td>
                                                    <td>{user.cpf}</td>
                                                    <td>{user.payment ? 'OK' : 'X'}</td>
                                                    <td>
                                                        <button className="btn-edit-user" onClick={() => setCurrentStudent(user)}>Cadastrar mensalidade</button>
                                                        {/* <button className="btn-edit-user" onClick={() => handleEdit(user)}>Editar</button> */}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                : <p>Nenhum usuário cadastrado.</p>
                            }
                        </section>
                        <section id='cadastro-mensalidade'>
                            {currentStudent && (
                                <div>
                                    <h3>Cadastro Mensalidade</h3>
                                    <form onSubmit={handleSubmitPayment}>
                                        <input type="hidden" name="id" value={currentStudent.id} /> 
                                        <br />
                                        <h3 className='student-title-form'>{currentStudent.name}</h3>
                                        <label htmlFor="inputPaymentDate">
                                            <span>Data de Pagamento:</span>
                                            <input 
                                                id="inputPaymentDate"
                                                type="date"
                                                onChange={(event) => setPaymentDate(event.target.value)}
                                                value={paymentDate}
                                                onBlur={event => validateName(event.target, 'paymentDate')}
                                                required
                                            />
                                        </label>
                                        <br/>
                                        <label
                                            htmlFor="paymentType"
                                            className={`${validate.paymentType.isValid ? 'is-valid' : ''} ${(validate.paymentType.isBlur && !validate.paymentType.isValid) ? 'is-invalid' : ''}`}
                                        >
                                            <span>Forma de pagamento:</span>
                                            <select id="paymentType" value={paymentType} onChange={(event) => setPaymentType(event.target.value)} onBlur={event => validateName(event.target, 'paymentType')}>
                                                <option value="dinheiro">Dinheiro</option>
                                                <option value="debito">Cartão Débito</option>
                                                <option value="credito">Cartão Crédito</option>
                                            </select>
                                        </label>
                                        <br/>
                                        <label
                                            htmlFor="paymentValue"
                                            className={`${validate.paymentValue.isValid ? 'is-valid' : ''} ${(validate.paymentValue.isBlur && !validate.paymentValue.isValid) ? 'is-invalid' : ''}`}
                                        >
                                            <span>Valor:</span>
                                            <input
                                                id="paymentValue"
                                                type="number"
                                                onChange={(event) => setPaymentValue(event.target.value)}
                                                value={paymentValue}
                                                onBlur={event => validateName(event.target, 'paymentValue')}
                                                required
                                            />
                                        </label>
                                        <div className="actions">
                                            <button className="btn-edit-user" type="submit" disabled={!validate.paymentValue.isValid && !validate.paymentType.isValid}>Enviar</button>
                                        </div>
                                    </form>
                                </div>
                            )}
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

export default Payments;