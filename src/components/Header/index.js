import { NavLink } from "react-router-dom";
import "./style.css";

function Header({ title, active }) {

    const userType = sessionStorage.getItem('userType')

    return (
        <header>
            <h1>LyFit <small>{title}</small></h1>
            <nav>
                <ul>
                    <li className={active === 'users' ? 'active' : ''}>
                        <NavLink to="/students">Alunos</NavLink>
                    </li>
                    {
                        (userType === 'gerente' || userType === 'recepcionista') && (
                            <>
                            <li className={active === 'users' ? 'active' : ''}>
                                <NavLink to="/users">Usuários</NavLink>
                            </li>
                            <li className={active === 'users' ? 'active' : ''}>
                                <NavLink to="/payments">Mensalidades</NavLink>
                            </li>
                            </>
                        )
                    }
                    {userType === 'gerente' && <li className={active === 'employees' ? 'active' : ''}>
                        <NavLink to="/employees">Funcionários</NavLink>
                    </li>}
                    <li>
                        <NavLink to="/">Sair</NavLink>
                    </li>
                </ul>
                <small>Logado como: {userType}</small>
            </nav>
        </header>
    )
}

export default Header;