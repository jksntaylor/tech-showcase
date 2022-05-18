// @ts-nocheck
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import styled from 'styled-components'
// import Scroll from './utils/Scroll';
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
import Folio22Floor from './demos/Folio22Floor';
import MerchStore from './demos/MerchStore';

function App() {
  return <>
    {/* <Scroll /> */}
    <Wrapper className="smooth-scroll" data-scroll-wrapper>
      <BrowserRouter>
        <Routes>
          <Route path="/"             element={<Dashboard />}    />
          <Route path="merch-store"   element={<MerchStore />}   />
          <Route path="billboard"     element={<Billboard />}    />
          <Route path="friction-text" element={<FrictionText/>}  />
          <Route path="folio22-floor" element={<Folio22Floor />} />
          <Route path="gooey-noise"   element={<GooeyNoise/>}    />
          <Route path="greenscreen"   element={<GreenScreen/>}   />
          <Route path="hex-gallery"   element={<HexGallery />}   />
          <Route path="museum-scene"  element={<MuseumScene />}  />
          <Route path="neon-canyon"   element={<NeonCanyon />}   />
          <Route path="pixel-rivers"  element={<PixelRivers />}  />
          <Route path="ripples"       element={<Ripples />}      />
          <Route path="transmission"  element={<Transmission/>}  />
          <Route path="wavy-sunrise"  element={<WavySunrise/>}   />
          <Route path="/"             element={<FourOhFour />}   />
        </Routes>
      </BrowserRouter>
    </Wrapper>
  </>
}

const Wrapper = styled.main`
  width: 100vw;
  min-height: 100vh;
`

export default App;
