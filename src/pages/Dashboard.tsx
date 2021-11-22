import React from "react"
import { Link } from "react-router-dom"
import styled from "styled-components"

import thumbnails from "../assets/thumbnails/exports"

const projectData = [
  {
    name: 'Arc Carousel',
    img: '',
    link: '/arc-carousel'
  },
  {
    name: 'Circle Image Warp',
    img: '',
    link: '/circle-image-warp'
  },
  {
    name: 'Friction Text',
    img: thumbnails.frictionText,
    link: '/friction-text'
  },
  {
    name: 'Fixed Slider',
    img: '',
    link: '/fixed-slider'
  },
  {
    name: 'Glitch Scroll',
    img: '',
    link: '/glitch-scroll'
  },
  {
    name: 'Gooey Noise',
    img: thumbnails.gooeyNoise,
    link: '/gooey-noise'
  },
  {
    name: 'Greenscreen',
    img: thumbnails.greenScreen,
    link: '/greenscreen'
  },
  {
    name: 'Image Spotlight',
    img: '',
    link: '/image-spotlight'
  },
  {
    name: 'Marquee Menu',
    img: '',
    link: '/marquee-menu'
  },
  {
    name: 'Pixel Rivers',
    img: thumbnails.pixelRivers,
    link: '/pixel-rivers'
  },
  {
    name: 'Scroll Down',
    img: '',
    link: '/scroll-down'
  },
  {
    name: 'Skew Text',
    img: '',
    link: '/skew-text'
  },
]

type Project = {
  project: {
    name: string;
    img: string;
    link: string;
  }
}

const ProjectTeaser: React.FC<Project> = ({ project }) => {
  return <Teaser to={project.link} background={project.img}>
    <TeaserTitle>{project.name}</TeaserTitle>
  </Teaser>
}

const Teaser = styled(Link)<{ background: string }>`
  width: 21%;
  height: 8vw;
  min-height: 150px;
  margin-bottom: 2vw;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 25%, rgba(0, 0, 0, 0.7)), url(${props => props.background}) center/cover no-repeat;
  border-radius: 1rem;
  position: relative;
  text-align: center;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  transition: all 300ms ease;
  &:hover {
    box-shadow: 0 0 50px rgba(0, 0, 0, 0.4);
    transform: scale(1.1);
  }
`

const TeaserTitle = styled.h1`
  color: white;
  font: 24px Ailerons;
  letter-spacing: -0.15em;
  margin: auto 0 1rem;
  position: relative;
  z-index: 2;
`

const Dashboard: React.FC<{}> = () => {

  const projects = projectData.map((project, index) => <ProjectTeaser project={project} key={index} />)

  return <Wrapper data-scroll-section>
    <Title>Jackson Taylor Tech ToolKit</Title>
    <Subtitle>A collection of code snippets to be used in projects</Subtitle>
    <Gallery>
      {projects}
    </Gallery>
  </Wrapper>
}

const Wrapper = styled.section`
  height: 100vh;
  overflow: none;
  padding: 5vw;
  background: radial-gradient(#2d2d2e, #0c0c0c);
  position: relative;
  canvas {
    position: absolute;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
  }
`

const Title = styled.h1`
  color: white;
  font: 72px Ailerons;
  text-align: center;
  margin: 0 0 2rem;
`

const Subtitle = styled.h2`
  color: white;
  font: 24px Ailerons;
  letter-spacing: -0.15em;
  text-align: center;
  margin: 0 0 5rem;
`

const Gallery = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  max-width: 1200px;
  margin: 0 auto;
`

export default Dashboard
