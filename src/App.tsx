import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import styled from 'styled-components'
import Scroll from './utils/Scroll';
import './App.css';

import Dashboard from './components/Dashboard';
import FrictionTextWrapper from './components/FrictionText';
import FixedSlider from './components/FixedSlider';
import GlitchScroll from './components/GlitchScroll';
import GreenScreen from './components/GreenScreen';
import ImageSpotlight from './components/ImageSpotlight';
import MarqueeHoverMenu from './components/MarqueeHoverMenu';
import ProjectCarousel from './components/ProjectCarousel';
import ScrollDown from './components/ScrollDown';
import SkewText from './components/SkewText';

function App() {
  return <>
    <Scroll />
    <Wrapper className="smooth-scroll">
      <Router>
        <Switch>
          <Route path="/" exact component={Dashboard} />
          <Route path="/fixed-slider" component={FixedSlider} />
          <Route path="/friction-text" component={FrictionTextWrapper} />
          <Route path="/glitch-scroll" component={GlitchScroll} />
          <Route path="/greenscreen" component={GreenScreen} />
          <Route path="/image-spotlight" component={ImageSpotlight} />
          <Route path="/marquee-menu" component={MarqueeHoverMenu} />
          <Route path="/project-carousel" component={ProjectCarousel} />
          <Route path="/scroll-down" component={ScrollDown} />
          <Route path="/skew-text" component={SkewText} />
        </Switch>
      </Router>
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
