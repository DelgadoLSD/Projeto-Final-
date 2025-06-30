import { HeaderContainer, HeaderContent, Button, Buttons} from "./styles";
import { Link } from "react-router-dom";
import LogoAgrineural from '../../assets/logoBranca.png'
// import * as Dialog from '@radix-ui/react-dialog';

export function Header(){
    return(
        <HeaderContainer>
            <HeaderContent>
                <img src={LogoAgrineural} alt="" />
                <Buttons>
                    <Link to={"/login"}>
                        <Button>
                            Login
                        </Button>    
                    </Link>
                    <Link to={"/register"}>
                        <Button>
                            Cadastro
                        </Button>    
                    </Link>
                </Buttons>
            </HeaderContent>
        </HeaderContainer>
    )
}