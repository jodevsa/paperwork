import React,{useEffect} from "react";
import Loader from "react-loader-spinner";
import styled from "styled-components";

const SpinnerDiv = styled.div`
position: absolute;
left: 50%;
top: 50%;
-webkit-transform: translate(-50%, -50%);
transform: translate(-50%, -50%);
`;


const Spinner = ()=>{
    return (
     <SpinnerDiv>
      <Loader
        type="Grid"
        color="#00BFFF"
        height={100}
        width={100}
      />
      </SpinnerDiv>
    );
}

export default Spinner