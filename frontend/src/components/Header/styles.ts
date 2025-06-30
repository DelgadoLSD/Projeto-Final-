import styled from 'styled-components'


export const HeaderContainer = styled.header`
    background: ${props => props.theme['verdeTexto']};
    padding: 0.1rem 0;
    justify-content: space-between;
`

export const HeaderContent = styled.div`
    width: 100%;
    max-width: 1120px;
    margin: 0 auto;
    padding: 0 0.8rem;
    display: flex; 
    justify-content: center;
    align-items: center;
    position: relative;

    h1{
        text-align: center;
        font-size: 3rem;
        font-family: 'Times New Roman', Times, serif;
    }

`
export const Buttons = styled.div`
    display: flex;
    position: absolute;
    right: -6rem;
    margin-bottom: 10em;
`

export const Button = styled.button`
    margin-left: 0.8em;
    padding: 0.5em 1em; 
    font-size: 1.1  rem;
    color: ${props => props.theme['black']};
    background-color: ${props => props.theme['white']};
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
    font-family: 'Montserrat', sans-serif;

    &:hover {
    background-color: ${props => props.theme['gray-100']};
    }

`
