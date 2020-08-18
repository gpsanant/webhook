function extractRGB(i) {   
    return {
      r: parseInt(i.substring(1, 3), 16),
      g: parseInt(i.substring(3, 5), 16),
      b: parseInt(i.substring(5), 16),
    };
  }
  
  function combineRGB(r, g, b) {
    return (r << 16) | (g << 8) | b;
  }
  
  export { extractRGB, combineRGB };