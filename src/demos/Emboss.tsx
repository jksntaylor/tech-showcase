import React from 'react'
import styled from 'styled-components'

const Emboss: React.FC<{}> = () => {
  return <Wrapper>
    <Text>4.8.2022</Text>
  </Wrapper>
}

const Wrapper = styled.section`
  background: #fffcfc;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`

const Text = styled.h1`
  color: rgb(255, 252, 252);
  /* text-shadow: 5px 5px 5px #c2c2c2, -5px -5px rgba(255, 255, 255, 1); */
  filter: drop-shadow(5px 5px 5px black);
  font-size: 15vw;
`

export default Emboss
