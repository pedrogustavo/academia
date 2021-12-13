import { NavLink } from "react-router-dom";
import "./style.css";

function Header({ title, active }) {
    return (
        <header>
            <h1>LyFit <small>{title}</small></h1>
            <nav>
                <ul>
                    <li className={active === 'users' && 'active'}>
                        <NavLink to="/users">Usuários</NavLink>
                    </li>
                    <li className={active === 'users' && 'active'}>
                        <NavLink to="/students">Alunos</NavLink>
                    </li>
                    <li className={active === 'users' && 'active'}>
                        <NavLink to="/payments">Mensalidades</NavLink>
                    </li>
                </ul>
            </nav>
        </header>
    )
}

export default Header;