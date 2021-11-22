import React from "react"
import { Link } from "react-router-dom"
import styled from "styled-components"

const FourOhFour: React.FC<{}> = () => <Wrapper><Back to="/">Back</Back>404: Page Not Found</Wrapper>

const Wrapper = styled.section`
  background: radial-gradient(#2d2d2e, #0c0c0c);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font: 100px Ailerons;
  height: 100vh;
`

const Back = styled(Link)`
  position: absolute;
  top: 100px;
  left: 100px;
  text-decoration: none;
  font-size: 24px;
  color: white;
`

export default FourOhFour
