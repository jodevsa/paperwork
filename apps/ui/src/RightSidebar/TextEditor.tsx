import React, {useRef, useState} from 'react'
import styled from 'styled-components'
import useOnClickOutside from 'use-onclickoutside'
import {SketchPicker} from 'react-color'
import {Label} from '../ui/Typography'

const Color = styled.div`
    width: 60px;
    height: 60px;
    border-radius: 15px;
`

const Popover = styled.div`
    position: absolute;
    top: 5px;
    left: 0;
`

