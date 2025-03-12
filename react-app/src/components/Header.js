import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  
  const handleLogoClick = () => {
    navigate('/');
  };
  
  return (
    <header>
      <div className="header-container">
        <div className="logo" onClick={handleLogoClick}>Chic Nest</div>
      </div>
    </header>
  );
};

export default Header; 