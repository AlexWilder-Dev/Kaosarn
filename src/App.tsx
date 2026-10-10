import { MotionConfig } from 'framer-motion';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Story } from './components/Story';
import { Menu } from './components/Menu';
import { Drinks } from './components/Drinks';
import { Groups } from './components/Groups';
import { Visit } from './components/Visit';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#menu">
        Skip to the menu
      </a>
      <Header />
      <main>
        <Hero />
        <Story />
        <Menu />
        <Drinks />
        <Groups />
        <Visit />
      </main>
      <Footer />
    </MotionConfig>
  );
}
