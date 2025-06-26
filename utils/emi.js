function calculateEMI(P, R, N) {
    return (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
  }
  module.exports = calculateEMI;