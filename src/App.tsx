import { MotionConfig } from 'framer-motion';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Marquee } from './components/Marquee';
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
        <div className="band-clip">
          <Marquee
            items={[
              'Thai food',
              'Home cooked',
              'Good vibes',
              'BYOB',
              'Fully licensed bar',
              'Groups & birthdays',
              'Tooting SW17',
            ]}
          />
        </div>
        <Story />
        <Menu />
        <div className="band-clip">
          <Marquee
            tone="pink"
            tilt={1.5}
            reverse
            items={['Bring a bottle', 'Or grab a draught', 'Spice to taste', 'Share everything']}
          />
        </div>
        <Drinks />
        <Groups />
        <Visit />
      </main>
      <Footer />
    </MotionConfig>
  );
}
