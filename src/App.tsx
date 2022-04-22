import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import styled from 'styled-components'
import Scroll from './utils/Scroll';
import './styles/App.css';

import Dashboard  from './pages/Dashboard';
import FourOhFour from './pages/404';

import Billboard from './demos/Billboard';
import FrictionText from './demos/FrictionText';
import GooeyNoise   from './demos/GooeyNoise';
import GreenScreen  from './demos/GreenScreen';
import HexGallery from './demos/HexGallery';
import MuseumScene from './demos/MuseumScene';
import NeonCanyon from './demos/NeonCanyon';
import PixelRivers  from './demos/PixelRivers';
import Ripples from './demos/Ripples';
import Transmission from './demos/Transmission';
import WavySunrise from './demos/WavySunrise';

function App() {
  return <>
    {/* <Scroll /> */}
    <Wrapper className="smooth-scroll" data-scroll-wrapper>
      <Router>
        <Switch>
          <Route path="/" exact          render={() => <Dashboard />      } />
          <Route path="/billboard"       render={() => <Billboard />      } />
          <Route path="/friction-text"   render={() => <FrictionText/>    } />
          <Route path="/gooey-noise"     render={() => <GooeyNoise/>      } />
          <Route path="/greenscreen"     render={() => <GreenScreen/>     } />
          <Route path="/hex-gallery"     render={() => <HexGallery />     } />
          <Route path="/museum-scene"    render={() => <MuseumScene />    } />
          <Route path="/neon-canyon"     render={() => <NeonCanyon />    } />
          <Route path="/pixel-rivers"    render={() => <PixelRivers />    } />
          <Route path="/ripples"         render={() => <Ripples />        } />
          <Route path="/transmission"    render={() => <Transmission/>    } />
          <Route path="/wavy-sunrise"    render={() => <WavySunrise/>    } />
          <Route path="/"                render={() => <FourOhFour />     } />
        </Switch>
      </Router>
    </Wrapper>
  </>
}

const Wrapper = styled.main`
  width: 100vw;
  min-height: 100vh;
`

export default App;
