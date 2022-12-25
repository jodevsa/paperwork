import React from 'react'
import {IconType} from 'react-icons/lib'
import styled from 'styled-components'
import {colors} from './constants'

const Container = styled.button`
    width: 60px;
    height: 60px;
    background-color: ${colors.darkGray};
    border-radius: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0;
    padding: 0;
    border: 0;
`

export type IconButtonProps = {
    icon: IconType
}

export const IconButton: React.FC<IconButtonProps> = ({icon: Icon}) => (
    <Container>
        <Icon color="white" size={30} />
    </Container>
)
