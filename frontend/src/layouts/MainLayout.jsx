import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import TrailerModal from '../components/TrailerModal/TrailerModal';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-[var(--color-cinema-black)] flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <TrailerModal />
    </div>
  );
};

export default MainLayout;
