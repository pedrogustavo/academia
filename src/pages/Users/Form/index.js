import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import Header from '../../../components/Header'
import api from '../../../services/api'
import './style.css'
import { formatarCpf } from '../../../services/support'
// import CpfCnpj from "@react-br-forms/cpf-cnpj-mask"


function UserForm() {
    const initialValidateField = () => {
        return {
            isValid: false,
            isBlur: false
        }
    }
    const initialValidate = {
        name: initialValidateField(),
        address: initialValidateField(),
        cpf: initialValidateField(),
        email: initialValidateField(),
        phone: initialValidateField(),
        role: initialValidateField(),
        birthDate: initialValidateField()
    }
    const params = useParams()
    const navigate = useNavigate()
    const [user, setUser] = useState({})
    const [address, setAddress] = useState("")
    const [cpf, setCpf] = useState("")
    const [email, setEmail] = useState("")
    const [name, setName] = useState("")
    const [birthDate, setbirthDate] = useState("")
    const [phone, setPhone] = useState("")
    const [role, setRole] = useState("")
    const [validate, setValidate] = useState(initialValidate)

    useEffect(() => {
        if (params?.id !== 'form') {
            loadUser(params?.id)
        }
    }, [params]);

    const loadUser = async function (id) {
        try {
            const response = await api.get(`/users/${id}`)
            const user = response.data
            setUser(user)
            setAddress(user.address)
            setCpf(user.cpf)
            setEmail(user.email)
            setName(user.name)
            setPhone(user?.phone)
            setRole(user.role)
        } catch (error) {
            console.error(error)
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        const newUser = { address, cpf, name, email, phone, role, birthDate }
        const id = parseInt(params?.id)
        if (!isNaN(id)) {
            await api.put(`/users/${params?.id}`, newUser)
        } else {
            await api.post(`/users`, newUser)
        }
        toast.success("Salvando usuário...")
        navigate("/users")
    }

    const handleCancel = () => {
        navigate("/users")
    }

    const validateName = (target, inputName) => {
        const objValidate = { ...validate }
        objValidate[inputName] = {
            isValid: target.validity.valid,
            isBlur: true
        }
        setValidate(objValidate)
    }

    return (
        <div className="user-form-container">
            <Header title="Usuários" />
            <h2>{!!user ? "Editar usuário" : "Novo usuário"}</h2>
            <form onSubmit={handleSubmit}>
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
                    htmlFor="inputBirthDate"
                    className={`${validate.birthDate.isValid ? 'is-valid' : ''} ${(validate.birthDate.isBlur && !validate.birthDate.isValid) ? 'is-invalid' : ''}`}
                >
                    <span>Data de Nascimento:</span>
                    <input 
                        id="inputBirthDate"
                        type="date"
                        onChange={(event) => setbirthDate(event.target.value)}
                        value={birthDate}
                        onBlur={event => validateName(event.target, 'birthDate')}
                        required
                    />
                </label>

                <label
                    htmlFor="inputEmail"
                    className={`${validate.email.isValid ? 'is-valid' : ''} ${(validate.email.isBlur && !validate.email.isValid) ? 'is-invalid' : ''}`}
                >
                    <span>E-Mail:</span>
                    <input
                        id="inputEmail"
                        type="email"
                        minLength={3}
                        onChange={(event) => setEmail(event.target.value)}
                        onBlur={event => validateName(event.target, 'email')}
                        value={email}
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

                <label
                    htmlFor="inputAddress"
                    className={`${validate.address.isValid ? 'is-valid' : ''} ${(validate.address.isBlur && !validate.address.isValid) ? 'is-invalid' : ''}`}
                >
                    <span>Endereço:</span>
                    <input
                        id="inputAddress"
                        type="text"
                        onChange={(event) => setAddress(event.target.value)}
                        value={address}
                        minLength={3}
                        onBlur={event => validateName(event.target, 'address')}
                        required
                    />
                </label>

                <label 
                    htmlFor="inputPhone"
                    className={`${validate.phone.isValid ? 'is-valid' : ''} ${(validate.phone.isBlur && !validate.phone.isValid) ? 'is-invalid' : ''}`}
                >
                    <span>Telefone:</span>
                    <input 
                        id="inputPhone"
                        type="text"
                        onChange={event => setPhone(event.target.value)}
                        onBlur={event => validateName(event.target, 'phone')}
                        value={phone}
                        minLength={8}
                        maxLength={9}
                        required
                    />
                </label>

                <label htmlFor="inputRole">
                    <span>Função:</span>
                    <select id="inputRole" value={role} onChange={(event) => setRole(event.target.value)}>
                        <option></option>
                        <option value="aluno">Aluno</option>
                        <option value="recepcionista">Recepcionista</option>
                        <option value="gerente">Gerente</option>
                    </select>
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