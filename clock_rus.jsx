import { useState, useEffect } from 'react';


// Компонент отображения сектора интервала на часах
const IntervalSector = ({ start, end, color, index }) => {
  // Функция преобразования времени в угол (0-360 градусов)
  const timeToAngle = (timeStr) => {
    if (typeof timeStr !== 'string' || !timeStr.includes(':')) {
      return 0;
    }
    
    const [hours, minutes] = timeStr.split(':').map(Number);
    return ((hours % 12) * 60 + minutes) * 0.5;
  };
  
  // Вычисляем угол начала и конца интервала
  const startAngle = timeToAngle(start);
  let endAngle = timeToAngle(end);
  
  // Если конечный угол меньше начального, добавляем полный круг
  if (endAngle <= startAngle) {
    endAngle += 360;
  }
  
  // Радиусы для внешнего и внутреннего круга сектора
  // Вычисляем разные радиусы для разных интервалов
  const baseOuterRadius = 90;
  const baseInnerRadius = 70;
  
  // Уменьшаем радиусы для каждого следующего интервала
  const decreaseFactor = index * 4;
  const outerRadius = Math.max(baseOuterRadius - decreaseFactor, 75);
  const innerRadius = Math.max(baseInnerRadius - decreaseFactor, 55);
  
  // Преобразуем углы в радианы для расчета координат
  const startRad = ((startAngle - 90) * Math.PI) / 180;
  const endRad = ((endAngle - 90) * Math.PI) / 180;
  
  // Проверяем, является ли интервал полным кругом
  const isFullCircle = Math.abs(endAngle - startAngle) >= 359.9;
  
  // Создаем путь для SVG
  let pathData;
  
  if (isFullCircle) {
    // Для полного круга
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
    // Для обычного сектора
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

// Компонент формы добавления интервала
const IntervalForm = ({ onAddInterval }) => {
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [color, setColor] = useState('#ff0000');
  
  // Простой обработчик клика для добавления интервала
  const handleButtonClick = () => {
    // Проверяем, что поля не пустые
    if (!startTime || !endTime) {
      alert('Пожалуйста, укажите время начала и конца интервала');
      return;
    }
    
    // Вызываем функцию добавления интервала
    onAddInterval({
      start: startTime,
      end: endTime,
      color: color
    });
  };
  
  return (
    <div className="form-container">
      <h3>Добавить интервал</h3>
      
      <div className="form-content">
        <div className="form-group">
          <label>Начало:</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>
        
        <div className="form-group">
          <label>Конец:</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>
        
        <div className="form-group">
          <label>Цвет:</label>
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
          Добавить интервал
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

// Компонент часов с реорганизованной структурой для правильного порядка элементов
const Clock = ({ intervals = [] }) => {
  const [time, setTime] = useState(new Date());
  
  // Обновление времени каждую секунду
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Вычисляем углы для стрелок часов
  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  
  const hourDegrees = ((hours + minutes / 60) / 12) * 360;
  const minuteDegrees = ((minutes + seconds / 60) / 60) * 360;
  const secondDegrees = (seconds / 60) * 360;
  
  return (
    <div className="clock-container">
      {/* Базовый фон циферблата */}
      <div className="clock-background"></div>
      
      {/* Секторы интервалов поверх фона, но под отметками и стрелками */}
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
      
      {/* Отметки часов поверх секторов */}
      <div className="clock-marks">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="hour-mark" style={{transform: `rotate(${i * 30}deg)`}}>
            <div className="mark-line"></div>
          </div>
        ))}
      </div>
      
      {/* Стрелки часов всегда на самом верхнем слое */}
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
          z-index: 1; /* Фон имеет наименьший z-index */
        }
        
        .sectors-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 2; /* Секторы над фоном */
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
          z-index: 3; /* Отметки над секторами */
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
          z-index: 4; /* Стрелки имеют наивысший z-index */
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

// Главный компонент приложения
const PerfectClockApp = () => {
  const [intervals, setIntervals] = useState([]);
  const [message, setMessage] = useState('');
  
  // Функция добавления интервала
  const addInterval = (intervalData) => {
    // Создаем новый интервал с уникальным ID
    const newInterval = {
      ...intervalData,
      id: Date.now()
    };
    
    // Обновляем состояние с новым интервалом
    setIntervals(prevIntervals => [...prevIntervals, newInterval]);
    
    // Устанавливаем сообщение
    setMessage(`Интервал ${intervalData.start}-${intervalData.end} добавлен`);
    
    // Скрываем сообщение через 3 секунды
    setTimeout(() => {
      setMessage('');
    }, 3000);
  };
  
  // Функция удаления интервала
  const removeInterval = (id) => {
    setIntervals(prevIntervals => prevIntervals.filter(interval => interval.id !== id));
    setMessage('Интервал удален');
    
    // Скрываем сообщение через 3 секунды
    setTimeout(() => {
      setMessage('');
    }, 3000);
  };
  
  // Очистка всех интервалов
  const clearAllIntervals = () => {
    setIntervals([]);
    setMessage('Все интервалы удалены');
    
    setTimeout(() => {
      setMessage('');
    }, 3000);
  };
  
  return (
    <div className="clock-app">
      <h2>Часы с интервалами</h2>
      
      <div className="app-container">
        <div className="left-panel">
          {/* Отображение часов */}
          <Clock intervals={intervals} />
          
          {/* Форма добавления интервала */}
          <IntervalForm onAddInterval={addInterval} />
          
          {/* Кнопки управления */}
          <div className="buttons-container">
            {intervals.length > 0 && (
              <button className="clear-button" onClick={clearAllIntervals}>
                Очистить все интервалы
              </button>
            )}
          </div>
        </div>
        
        <div className="right-panel">
          {/* Информационная панель */}
          <div className="info-panel">
            <p>Количество интервалов: <strong>{intervals.length}</strong></p>
          </div>
          
          {/* Отображение сообщения */}
          {message && (
            <div className="message">
              {message}
            </div>
          )}
          
          {/* Список интервалов */}
          <div className="intervals-list">
            <h3>Список интервалов</h3>
            
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
                      title="Удалить интервал"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-intervals">Нет добавленных интервалов</p>
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
