# Clock with Intervals

## Overview

Clock with Intervals is a React-based tool that lets you map out parts of your day using an analog clock. You can add as many time slots as you want, each showing up as a colored slice on the clock face. It's a simple way to see your schedule at a glance or spot patterns in how you spend your time.

![Clock with Intervals Screenshot](https://github.com/Barmagloth/clock_with_intervals/blob/main/Screenshot.jpg)

## Features

- **Real-time Analog Clock**: Display of the current time with moving hour, minute, and second hands
- **Interval Management**: Add, view, and remove time intervals
- **Visual Representation**: Each interval is displayed as a colored sector on the clock face
- **Customizable Colors**: Choose a color for each interval to easily differentiate between them
- **Responsive Design**: Clean and intuitive interface that works on various screen sizes
- **Layered Visualization**: Intervals are displayed with slightly different radiuses to ensure visibility when they overlap

## How to Use

### Adding an Interval

1. In the "Add Interval" form, set the start time using the time picker
2. Set the end time using the time picker
3. Select a color for the interval using the color picker
4. Click the "Add Interval" button

The interval will appear as a colored sector on the clock face and will be added to the intervals list on the right side of the application.

### Removing Intervals

- **Remove a single interval**: Click the "×" button next to the interval in the list
- **Remove all intervals**: Click the "Clear All Intervals" button that appears when at least one interval exists

## Implementation Details

The application is built with React and includes several components:

1. **IntervalSector**: Renders a sector on the clock representing a time interval
2. **IntervalForm**: Provides the interface for adding new intervals
3. **Clock**: Displays the analog clock with hands and interval sectors
4. **PerfectClockApp**: Main component that manages the application state and UI

## Technical Features

- **SVG Graphics**: Uses SVG for rendering the clock sectors with precise angles
- **React Hooks**: Utilizes useState and useEffect for state management and side effects
- **CSS-in-JS**: Styled using JSX styles for component-scoped styling
- **Responsive Design**: Adapts to different screen sizes while maintaining usability
- **Intuitive UI/UX**: Clear visual feedback for user actions with temporary status messages

## Potential Use Cases

- **Time Management**: Visualize your daily schedule
- **Meeting Planner**: Track meeting times throughout the day
- **Shift Scheduling**: Visualize work shifts or availability
- **Activity Tracking**: Monitor time spent on different activities
- **Time Zone Visualization**: Represent business hours or availability across different time zones

## Future Enhancements (maybe)

- Save intervals to local storage for persistence between sessions
- Add interval categories or labels
- Export and import interval configurations
- Add recurring intervals (daily, weekly, etc.)
- Implement drag-and-drop editing of intervals directly on the clock face

## License

This project is open source and available under the MIT License.

---

Created with ❤️ using React.
