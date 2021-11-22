import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import styled from 'styled-components'
import Scroll from './utils/Scroll';
import './App.css';

import Dashboard from './components/Dashboard';

import CircleImageWarp from './components/CircleImageWarp';
import FrictionTextWrapper from './components/FrictionText';
import FixedSlider from './components/FixedSlider';
import GlitchScroll from './components/GlitchScroll';
import GooeyNoise from './components/GooeyNoise';
import GreenScreen from './components/GreenScreen';
import ImageSpotlight from './components/ImageSpotlight';
import MarqueeHoverMenu from './components/MarqueeHoverMenu';
import ProjectCarousel from './components/ScrollCarousel';
import ScrollDown from './components/ScrollDown';
import SkewText from './components/SkewText';
import PixelRivers from './components/PixelRivers';

function App() {
  return <>
    <Scroll />
    <Wrapper className="smooth-scroll" data-scroll-wrapper>
      <Router>
        <Switch>
          <Route path="/" exact>
            <Dashboard />
          </Route>
          <Route path="/circle-image-warp">
            <CircleImageWarp />
          </Route>
          <Route path="/friction-text">
            <FrictionTextWrapper />
          </Route>
          <Route path="/fixed-slider">
            <FixedSlider />
          </Route>
          <Route path="/glitch-scroll">
            <GlitchScroll />
          </Route>
          <Route path="/gooey-noise">
            <GooeyNoise />
          </Route>
          <Route path="/greenscreen">
            <GreenScreen />
          </Route>
          <Route path="/image-spotlight">
            <ImageSpotlight />
          </Route>
          <Route path="/marquee-menu">
            <MarqueeHoverMenu />
          </Route>
          <Route path="/pixel-rivers">
            <PixelRivers />
          </Route>
          <Route path="/scroll-carousel">
            <ProjectCarousel />
          </Route>
          <Route path="/scroll-down">
            <ScrollDown />
          </Route>
          <Route path="/skew-text">
            <SkewText />
          </Route>
        </Switch>
      </Router>
    </Wrapper>
  </>
}

const Wrapper = styled.main``

export default App;
