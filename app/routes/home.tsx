// import type { Route } from './+types/home'

// export const meta = ({}: Route.MetaArgs) => {
export const meta = () => {
  return [
    { title: 'JobStash' },
    { name: 'description', content: 'Crypto Native Jobs' },
  ]
}

const Home = () => {
  return <p>Hello, JobStash!</p>
}

export default Home
