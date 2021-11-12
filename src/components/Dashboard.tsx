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
  }
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

const Teaser = styled(Link)``

const GIF = styled.img``

const TeaserTitle = styled.h1``

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

const Wrapper = styled.section``

const Title = styled.h1``

const Subtitle = styled.h2``

const Gallery = styled.div``

export default Dashboard
