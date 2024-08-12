import '../../assets/StyleSheets/NavigationDots.css';

const NavigationDots = ({ activeIndex }) => {
    return (
      <div className="dots-container">
        {[0, 1, 2].map((index) => (
          <span key={index} className={`dot ${activeIndex === index ? 'active' : ''}`}></span>
        ))}
      </div>
    );
  };
  
  export default NavigationDots;