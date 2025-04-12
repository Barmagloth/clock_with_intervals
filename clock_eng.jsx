import { useState, useEffect } from 'react';

// Component for displaying interval sector on the clock
const IntervalSector = ({ start, end, color, index }) => {
  // Function to convert time to angle (0-360 degrees)
  const timeToAngle = (timeStr) => {
    if (typeof timeStr !== 'string' || !timeStr.includes(':')) {
      return 0;
    }
    
    const [hours, minutes] = timeStr.split(':').map(Number);
    return ((hours % 12) * 60 + minutes) * 0.5;
  };
  
  // Calculate start and end angles of the interval
  const startAngle = timeToAngle(start);
  let endAngle = timeToAngle(end);
  
  // If end angle is less than start angle, add a full circle
  if (endAngle <= startAngle) {
    endAngle += 360;
  }
  
  // Radii for outer and inner circle of the sector
  // Calculate different radii for different intervals
  const baseOuterRadius = 90;
  const baseInnerRadius = 70;
  
  // Decrease radii for each subsequent interval
  const decreaseFactor = index * 4;
  const outerRadius = Math.max(baseOuterRadius - decreaseFactor, 75);
  const innerRadius = Math.max(baseInnerRadius - decreaseFactor, 55);
  
  // Convert angles to radians for coordinate calculations
  const startRad = ((startAngle - 90) * Math.PI) / 180;
  const endRad = ((endAngle - 90) * Math.PI) / 180;
  
  // Check if the interval is a full circle
  const isFullCircle = Math.abs(endAngle - startAngle) >= 359.9;
  
  // Create path for SVG
  let pathData;
  
  if (isFullCircle) {
    // For a full circle
    pathData = [
      `M ${100 + outerRadius} ${100}`,
      `A ${outerRadius} ${outerRadius} 0 1 1 ${100 - outerRadius} ${100}`,
      `A ${outerRadius} ${outerRadius} 0 1 1 ${100 + outerRadius} ${100}`,
      `L ${100 + innerRadius} ${100}`,
      `A ${innerRadius} ${innerRadius} 0 1 0 ${100 - innerRadius} ${100}`,
      `A ${innerRadius} ${innerRadius} 0 1 0 ${100 + innerRadius} ${100}`,
      'Z'
    ].join(' ');
  } else {
    // For a regular sector
    pathData = [
      `M ${100 + outerRadius * Math.cos(startRad)} ${100 + outerRadius * Math.sin(startRad)}`,
      `A ${outerRadius} ${outerRadius} 0 ${endAngle - startAngle > 180 ? 1 : 0} 1 ${100 + outerRadius * Math.cos(endRad)} ${100 + outerRadius * Math.sin(endRad)}`,
      `L ${100 + innerRadius * Math.cos(endRad)} ${100 + innerRadius * Math.sin(endRad)}`,
      `A ${innerRadius} ${innerRadius} 0 ${endAngle - startAngle > 180 ? 1 : 0} 0 ${100 + innerRadius * Math.cos(startRad)} ${100 + innerRadius * Math.sin(startRad)}`,
      'Z'
    ].join(' ');
  }
  
  return (
    <svg width="200" height="200" style={{position: "absolute", top: 0, left: 0}}>
      <path d={pathData} fill={color} stroke="#333" strokeWidth="1" fillOpacity="0.7" />
    </svg>
  );
};

// Interval form component
const IntervalForm = ({ onAddInterval }) => {
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [color, setColor] = useState('#ff0000');
  
  // Simple click handler for adding an interval
  const handleButtonClick = () => {
    // Check that fields are not empty
    if (!startTime || !endTime) {
      alert('Please specify start and end time for the interval');
      return;
    }
    
    // Call the function to add an interval
    onAddInterval({
      start: startTime,
      end: endTime,
      color: color
    });
  };
  
  return (
    <div className="form-container">
      <h3>Add Interval</h3>
      
      <div className="form-content">
        <div className="form-group">
          <label>Start:</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>
        
        <div className="form-group">
          <label>End:</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>
        
        <div className="form-group">
          <label>Color:</label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </div>
        
        <button 
          type="button" 
          className="add-button"
          onClick={handleButtonClick}
        >
          Add Interval
        </button>
      </div>
      
      <style jsx>{`
        .form-container {
          background-color: #f5f5f5;
          padding: 15px;
          border-radius: 8px;
          margin-top: 30px;
          margin-bottom: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        h3 {
          margin-top: 0;
          color: #333;
          margin-bottom: 15px;
        }
        
        .form-content {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        
        .form-group {
          display: flex;
          align-items: center;
        }
        
        label {
          width: 70px;
          font-weight: bold;
        }
        
        input {
          flex-grow: 1;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        
        .add-button {
          background-color: #4CAF50;
          color: white;
          border: none;
          padding: 10px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
          width: 100%;
          margin-top: 10px;
        }
        
        .add-button:hover {
          background-color: #45a049;
        }
      `}</style>
    </div>
  );
};

// Clock component with reorganized structure for correct element ordering
const Clock = ({ intervals = [] }) => {
  const [time, setTime] = useState(new Date());
  
  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Calculate angles for clock hands
  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  
  const hourDegrees = ((hours + minutes / 60) / 12) * 360;
  const minuteDegrees = ((minutes + seconds / 60) / 60) * 360;
  const secondDegrees = (seconds / 60) * 360;
  
  return (
    <div className="clock-container">
      {/* Basic clock face background */}
      <div className="clock-background"></div>
      
      {/* Interval sectors above the background but below markings and hands */}
      <div className="sectors-container">
        {intervals.map((interval, index) => (
          <div key={interval.id} className="interval-sector">
            <IntervalSector
              start={interval.start}
              end={interval.end}
              color={interval.color}
              index={index}
            />
          </div>
        ))}
      </div>
      
      {/* Clock markings above sectors */}
      <div className="clock-marks">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="hour-mark" style={{transform: `rotate(${i * 30}deg)`}}>
            <div className="mark-line"></div>
          </div>
        ))}
      </div>
      
      {/* Clock hands always on the topmost layer */}
      <div className="hands-container">
        <div className="hand hour-hand" style={{transform: `rotate(${hourDegrees}deg)`}} />
        <div className="hand minute-hand" style={{transform: `rotate(${minuteDegrees}deg)`}} />
        <div className="hand second-hand" style={{transform: `rotate(${secondDegrees}deg)`}} />
        <div className="center-dot" />
      </div>
      
      <style jsx>{`
        .clock-container {
          position: relative;
          width: 200px;
          height: 200px;
          margin: 0 auto;
        }
        
        .clock-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: 2px solid #333;
          border-radius: 50%;
          background-color: #f8f8f8;
          z-index: 1; /* Background has the lowest z-index */
        }
        
        .sectors-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 2; /* Sectors above background */
        }
        
        .interval-sector {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
        }
        
        .clock-marks {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 3; /* Markings above sectors */
        }
        
        .hour-mark {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        
        .mark-line {
          position: absolute;
          top: 10px;
          left: 50%;
          width: 2px;
          height: 10px;
          margin-left: -1px;
          background-color: #333;
        }
        
        .hands-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 4; /* Hands have the highest z-index */
        }
        
        .hand {
          position: absolute;
          bottom: 50%;
          left: 50%;
          transform-origin: 50% 100%;
          background-color: #333;
        }
        
        .hour-hand {
          height: 30%;
          width: 4px;
          margin-left: -2px;
          border-radius: 4px;
        }
        
        .minute-hand {
          height: 40%;
          width: 2px;
          margin-left: -1px;
          border-radius: 2px;
        }
        
        .second-hand {
          height: 45%;
          width: 1px;
          margin-left: -0.5px;
          background-color: #f44336;
        }
        
        .center-dot {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 10px;
          height: 10px;
          margin-left: -5px;
          margin-top: -5px;
          background-color: #333;
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
};

// Main application component
const PerfectClockApp = () => {
  const [intervals, setIntervals] = useState([]);
  const [message, setMessage] = useState('');
  
  // Function to add interval
  const addInterval = (intervalData) => {
    // Create a new interval with unique ID
    const newInterval = {
      ...intervalData,
      id: Date.now()
    };
    
    // Update state with the new interval
    setIntervals(prevIntervals => [...prevIntervals, newInterval]);
    
    // Set message
    setMessage(`Interval ${intervalData.start}-${intervalData.end} added`);
    
    // Hide message after 3 seconds
    setTimeout(() => {
      setMessage('');
    }, 3000);
  };
  
  // Function to remove interval
  const removeInterval = (id) => {
    setIntervals(prevIntervals => prevIntervals.filter(interval => interval.id !== id));
    setMessage('Interval removed');
    
    // Hide message after 3 seconds
    setTimeout(() => {
      setMessage('');
    }, 3000);
  };
  
  // Clear all intervals
  const clearAllIntervals = () => {
    setIntervals([]);
    setMessage('All intervals removed');
    
    setTimeout(() => {
      setMessage('');
    }, 3000);
  };
  
  return (
    <div className="clock-app">
      <h2>Clock with Intervals</h2>
      
      <div className="app-container">
        <div className="left-panel">
          {/* Display clock */}
          <Clock intervals={intervals} />
          
          {/* Interval form */}
          <IntervalForm onAddInterval={addInterval} />
          
          {/* Control buttons */}
          <div className="buttons-container">
            {intervals.length > 0 && (
              <button className="clear-button" onClick={clearAllIntervals}>
                Clear All Intervals
              </button>
            )}
          </div>
        </div>
        
        <div className="right-panel">
          {/* Information panel */}
          <div className="info-panel">
            <p>Number of intervals: <strong>{intervals.length}</strong></p>
          </div>
          
          {/* Message display */}
          {message && (
            <div className="message">
              {message}
            </div>
          )}
          
          {/* Intervals list */}
          <div className="intervals-list">
            <h3>Intervals List</h3>
            
            {intervals.length > 0 ? (
              <div className="intervals-container">
                {intervals.map((interval, index) => (
                  <div key={interval.id} className="interval-item">
                    <div className="color-sample" style={{backgroundColor: interval.color}} />
                    <div className="interval-info">
                      <span className="interval-number">#{index + 1}</span>
                      <span className="interval-time">{interval.start} - {interval.end}</span>
                    </div>
                    <button 
                      className="remove-button"
                      onClick={() => removeInterval(interval.id)}
                      title="Remove interval"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-intervals">No intervals added</p>
            )}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .clock-app {
          font-family: Arial, sans-serif;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        
        h2 {
          text-align: center;
          color: #333;
          margin-bottom: 20px;
        }
        
        .app-container {
          display: flex;
          gap: 20px;
        }
        
        .left-panel {
          flex: 1;
        }
        
        .right-panel {
          flex: 1;
        }
        
        .buttons-container {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 15px;
        }
        
        .clear-button {
          background-color: #f44336;
          color: white;
          border: none;
          padding: 10px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
          transition: background-color 0.2s;
        }
        
        .clear-button:hover {
          background-color: #d32f2f;
        }
        
        .info-panel {
          background-color: #f0f8ff;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .message {
          padding: 10px;
          background-color: #e8f5e9;
          border-left: 4px solid #4CAF50;
          margin-bottom: 20px;
          animation: fadeIn 0.3s ease-in-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .intervals-list {
          background-color: white;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 15px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        h3 {
          margin-top: 0;
          color: #333;
          margin-bottom: 15px;
        }
        
        .intervals-container {
          max-height: 300px;
          overflow-y: auto;
        }
        
        .interval-item {
          display: flex;
          align-items: center;
          padding: 10px;
          margin-bottom: 8px;
          background-color: #f5f5f5;
          border-radius: 4px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          transition: background-color 0.2s;
        }
        
        .interval-item:hover {
          background-color: #f0f0f0;
        }
        
        .color-sample {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          margin-right: 10px;
          border: 1px solid #ddd;
          box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }
        
        .interval-info {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }
        
        .interval-number {
          font-size: 12px;
          color: #777;
        }
        
        .interval-time {
          font-weight: bold;
        }
        
        .remove-button {
          background-color: #f44336;
          color: white;
          border: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 16px;
          transition: background-color 0.2s;
        }
        
        .remove-button:hover {
          background-color: #d32f2f;
        }
        
        .no-intervals {
          color: #999;
          text-align: center;
          font-style: italic;
          padding: 15px 0;
        }
      `}</style>
    </div>
  );
};

export default PerfectClockApp;
