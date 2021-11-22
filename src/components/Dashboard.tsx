import React from "react"
import { Link } from "react-router-dom"
import styled from "styled-components"

const projectData = [
  {
    name: 'Circle Image Warp',
    gif: '',
    link: '/circle-image-warp'
  },
  {
    name: 'Friction Text',
    gif: '',
    link: '/friction-text'
  },
  {
    name: 'Fixed Slider',
    gif: '',
    link: '/fixed-slider'
  },
  {
    name: 'Glitch Scroll',
    gif: '',
    link: '/glitch-scroll'
  },
  {
    name: 'Gooey Noise',
    gif: '',
    link: '/gooey-noise'
  },
  {
    name: 'Greenscreen',
    gif: '',
    link: '/greenscreen'
  },
  {
    name: 'Image Spotlight',
    gif: '',
    link: '/image-spotlight'
  },
  {
    name: 'Marquee Menu',
    gif: '',
    link: '/marquee-menu'
  },
  {
    name: 'Pixel Rivers',
    gif: '',
    link: '/pixel-rivers'
  },
  {
    name: 'Project Carousel',
    gif: '',
    link: '/project-carousel'
  },
  {
    name: 'Scroll Down',
    gif: '',
    link: '/scroll-down'
  },
  {
    name: 'Skew Text',
    gif: '',
    link: '/skew-text'
  },

]

type Project = {
  project: {
    name: string;
    gif: string;
    link: string;
  }
}

const ProjectTeaser: React.FC<Project> = ({ project }) => {
  return <Teaser to={project.link}>
    <GIF src={project.gif} />
    <TeaserTitle>{project.name}</TeaserTitle>
  </Teaser>
}

const Teaser = styled(Link)`
  width: 21%;
  height: 8vw;
  margin-bottom: 2vw;
  background: black;
  border-radius: 1rem;
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

const GIF = styled.img``

const TeaserTitle = styled.h1`
  color: white;
  font: 24px Ailerons;
  letter-spacing: -0.15em;
  margin-top: auto;
`

const Dashboard: React.FC<{}> = () => {

  const projects = projectData.map((project, index) => <ProjectTeaser project={project} key={index} />)

  return <Wrapper data-scroll-section>
    <Title>Jackson Taylor Tech Showcase</Title>
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
