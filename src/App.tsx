import styled from 'styled-components'
import Scroll from './utils/Scroll';

import FrictionTextWrapper from './projects/FrictionText';

import './App.css';

function App() {
  return <>
    <Scroll />
    <Wrapper className="smooth-scroll">
      <FrictionTextWrapper/>
    </Wrapper>
  </>
}

const Wrapper = styled.main`
  background: #020307;
  ::-webkit-scrollbar {
    display: none;
  }
`

export default App;
