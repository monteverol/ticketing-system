import React from "react";

const AnimatedCounter = ({ value, duration = 4000 }) => {
  const [count, setCount] = React.useState(0);
  
  React.useEffect(() => {
    let start = 0;
    const end = parseInt(value);
    if (start === end) return;
    
    const timer = setInterval(() => {
      start += Math.ceil(end / (duration / 50));
      if (start > end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 50);
    
    return () => clearInterval(timer);
  }, [value, duration]);
  
  return <span>{count}</span>;
};

export default AnimatedCounter