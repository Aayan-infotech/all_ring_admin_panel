import classTemplateImg from "./images/class-template.jpg";
import motivationalImage from "./images/motivational-reminder1.jpg";
import motivationalImage1 from "./images/motivational-reminder2.jpg";
import motivationalImage2 from "./images/motivational-reminder3.jpg";
import motivationalImage3 from "./images/motivational-reminder4.jpg";
import eventTemplateImg from "./images/event-template.jpg";

// Class Templates
// Class Reminder Template 1 (Professional Academic Design)
export const classTemplate1 = ({
  title,
  message,
  date,
  time,
  className,
  instructor,
}) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');
    body { margin: 0; padding: 0; font-family: 'Poppins', sans-serif; }
  </style>
</head>
<body>
  <div style="
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    height: 600px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  ">
    <div style="
      background: white;
      border-radius: 15px;
      width: 100%;
      max-width: 500px;
      padding: 30px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    ">
      <div style="text-align: center; margin-bottom: 25px;">
        <div style="
          background: #667eea;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 15px;
        ">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM16 13H13V16C13 16.55 12.55 17 12 17C11.45 17 11 16.55 11 16V13H8C7.45 13 7 12.55 7 12C7 11.45 7.45 11 8 11H11V8C11 7.45 11.45 7 12 7C12.55 7 13 7.45 13 8V11H16C16.55 11 17 11.45 17 12C17 12.55 16.55 13 16 13Z" fill="white"/>
          </svg>
        </div>
        <h2 style="margin: 0; color: #2c3e50;">${title || "Class Reminder"}</h2>
        <p style="color: #7f8c8d; margin-top: 5px;">${
          className || "Course Name"
        }</p>
      </div>
      
      <div style="background: #f8f9fa; border-radius: 10px; padding: 20px; margin-bottom: 25px;">
        <p style="margin: 0 0 15px 0; color: #555; line-height: 1.5;">${
          message || "This is a reminder about your upcoming class session."
        }</p>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
          <div>
            <p style="margin: 0 0 5px 0; font-size: 12px; color: #7f8c8d;">DATE</p>
            <p style="margin: 0; font-weight: 600; color: #2c3e50;">${
              date || "Not specified"
            }</p>
          </div>
          <div>
            <p style="margin: 0 0 5px 0; font-size: 12px; color: #7f8c8d;">TIME</p>
            <p style="margin: 0; font-weight: 600; color: #2c3e50;">${
              time || "Not specified"
            }</p>
          </div>
          <div>
            <p style="margin: 0 0 5px 0; font-size: 12px; color: #7f8c8d;">INSTRUCTOR</p>
            <p style="margin: 0; font-weight: 600; color: #2c3e50;">${
              instructor || "Not specified"
            }</p>
          </div>
          <div>
            <p style="margin: 0 0 5px 0; font-size: 12px; color: #7f8c8d;">LOCATION</p>
            <p style="margin: 0; font-weight: 600; color: #2c3e50;">Online</p>
          </div>
        </div>
      </div>
      
      <div style="text-align: center;">
        <a href="#" style="
          display: inline-block;
          background: #667eea;
          color: white;
          text-decoration: none;
          padding: 12px 30px;
          border-radius: 30px;
          font-weight: 600;
          transition: all 0.3s;
        ">Join Class</a>
      </div>
    </div>
  </div>
</body>
</html>
`;

// Class Reminder Template 2 (Modern Card Design)
export const classTemplate2 = ({
  title,
  message,
  date,
  time,
  className,
  instructor,
}) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap');
    body { margin: 0; padding: 0; font-family: 'Open Sans', sans-serif; }
  </style>
</head>
<body>
  <div style="
    background: url('https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80') no-repeat center center;
    background-size: cover;
    height: 600px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  ">
    <div style="
      background: rgba(255,255,255,0.95);
      border-radius: 12px;
      width: 100%;
      max-width: 500px;
      padding: 30px;
      box-shadow: 0 15px 35px rgba(0,0,0,0.1);
      border: 1px solid rgba(255,255,255,0.2);
      backdrop-filter: blur(5px);
    ">
      <div style="display: flex; align-items: center; margin-bottom: 20px;">
        <div style="
          background: #e74c3c;
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 15px;
        ">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V8H19V19Z" fill="white"/>
            <path d="M17 12H7V10H17V12ZM13 16H7V14H13V16Z" fill="white"/>
          </svg>
        </div>
        <div>
          <h2 style="margin: 0; color: #2c3e50; font-size: 22px;">${
            title || "Class Notification"
          }</h2>
          <p style="margin: 5px 0 0 0; color: #7f8c8d; font-size: 14px;">${
            className || "Course"
          }</p>
        </div>
      </div>
      
      <div style="margin-bottom: 25px;">
        <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">${
          message || "Important information about your upcoming class."
        }</p>
        
        <div style="
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
          margin-bottom: 20px;
        ">
          <div style="
            background: #f8f9fa;
            border-radius: 8px;
            padding: 12px;
          ">
            <p style="margin: 0 0 5px 0; font-size: 12px; color: #7f8c8d;">DATE</p>
            <p style="margin: 0; font-weight: 600; color: #2c3e50;">${
              date || "TBD"
            }</p>
          </div>
          <div style="
            background: #f8f9fa;
            border-radius: 8px;
            padding: 12px;
          ">
            <p style="margin: 0 0 5px 0; font-size: 12px; color: #7f8c8d;">TIME</p>
            <p style="margin: 0; font-weight: 600; color: #2c3e50;">${
              time || "TBD"
            }</p>
          </div>
        </div>
        
        <div style="
          background: #f8f9fa;
          border-radius: 8px;
          padding: 12px;
        ">
          <p style="margin: 0 0 5px 0; font-size: 12px; color: #7f8c8d;">INSTRUCTOR</p>
          <p style="margin: 0; font-weight: 600; color: #2c3e50;">${
            instructor || "Not assigned"
          }</p>
        </div>
      </div>
      
      <div style="display: flex; justify-content: space-between;">
        <a href="#" style="
          display: inline-block;
          background: #e74c3c;
          color: white;
          text-decoration: none;
          padding: 12px 25px;
          border-radius: 8px;
          font-weight: 600;
          transition: all 0.3s;
        ">View Details</a>
        
        <a href="#" style="
          display: inline-block;
          background: #3498db;
          color: white;
          text-decoration: none;
          padding: 12px 25px;
          border-radius: 8px;
          font-weight: 600;
          transition: all 0.3s;
        ">Join Class</a>
      </div>
    </div>
  </div>
</body>
</html>
`;

// Class Reminder Template 3 (Minimalist Design)
export const classTemplate3 = ({
  title,
  message,
  date,
  time,
  className,
  instructor,
}) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
    body { margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
  </style>
</head>
<body>
  <div style="
    background-color: #f5f7fa;
    height: 600px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  ">
    <div style="
      background: white;
      border-radius: 12px;
      width: 100%;
      max-width: 500px;
      padding: 30px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.05);
    ">
      <div style="text-align: center; margin-bottom: 30px;">
        <h2 style="margin: 0 0 10px 0; color: #2c3e50; font-size: 24px;">${
          title || "Class Reminder"
        }</h2>
        <p style="margin: 0; color: #7f8c8d; font-size: 14px;">${
          className || "Course"
        }</p>
      </div>
      
      <div style="margin-bottom: 30px;">
        <p style="color: #555; line-height: 1.6; margin-bottom: 25px;">${
          message || "Don't forget about your upcoming class."
        }</p>
        
        <div style="
          display: flex;
          justify-content: space-between;
          margin-bottom: 15px;
          padding-bottom: 15px;
          border-bottom: 1px solid #eee;
        ">
          <span style="color: #7f8c8d; font-size: 14px;">Date</span>
          <span style="font-weight: 500; color: #2c3e50;">${
            date || "Not scheduled"
          }</span>
        </div>
        
        <div style="
          display: flex;
          justify-content: space-between;
          margin-bottom: 15px;
          padding-bottom: 15px;
          border-bottom: 1px solid #eee;
        ">
          <span style="color: #7f8c8d; font-size: 14px;">Time</span>
          <span style="font-weight: 500; color: #2c3e50;">${
            time || "Not scheduled"
          }</span>
        </div>
        
        <div style="
          display: flex;
          justify-content: space-between;
        ">
          <span style="color: #7f8c8d; font-size: 14px;">Instructor</span>
          <span style="font-weight: 500; color: #2c3e50;">${
            instructor || "Not assigned"
          }</span>
        </div>
      </div>
      
      <div style="text-align: center;">
        <a href="#" style="
          display: inline-block;
          width: 100%;
          background: #2c3e50;
          color: white;
          text-decoration: none;
          padding: 14px;
          border-radius: 8px;
          font-weight: 500;
          transition: all 0.3s;
        ">View Class Details</a>
      </div>
    </div>
  </div>
</body>
</html>
`;

// Class Reminder Template 4 (Elegant Design)
export const classTemplate4 = ({
  title,
  message,
  date,
  time,
  className,
  instructor,
}) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=Roboto:wght@300;400;500&display=swap');
    body { margin: 0; padding: 0; }
  </style>
</head>
<body>
  <div style="
    background: url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80') no-repeat center center;
    background-size: cover;
    height: 600px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  ">
    <div style="
      background: rgba(255,255,255,0.9);
      border-radius: 5px;
      width: 100%;
      max-width: 500px;
      padding: 40px;
      box-shadow: 0 30px 60px rgba(0,0,0,0.1);
      border: 1px solid rgba(255,255,255,0.2);
    ">
      <div style="text-align: center; margin-bottom: 30px;">
        <h2 style="
          margin: 0 0 10px 0;
          color: #2c3e50;
          font-size: 28px;
          font-family: 'Playfair Display', serif;
          font-weight: 600;
        ">${title || "Class Reminder"}</h2>
        <p style="
          margin: 0;
          color: #7f8c8d;
          font-family: 'Roboto', sans-serif;
          font-size: 14px;
          letter-spacing: 1px;
          text-transform: uppercase;
        ">${className || "Academic Course"}</p>
      </div>
      
      <div style="
        margin-bottom: 30px;
        font-family: 'Roboto', sans-serif;
      ">
        <p style="
          color: #555;
          line-height: 1.8;
          margin-bottom: 25px;
          font-size: 15px;
        ">${
          message || "A friendly reminder about your upcoming class session."
        }</p>
        
        <div style="
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 25px;
        ">
          <div>
            <p style="
              margin: 0 0 5px 0;
              color: #7f8c8d;
              font-size: 12px;
              text-transform: uppercase;
              letter-spacing: 1px;
            ">Date</p>
            <p style="
              margin: 0;
              color: #2c3e50;
              font-weight: 500;
              font-size: 16px;
            ">${date || "Not scheduled"}</p>
          </div>
          <div>
            <p style="
              margin: 0 0 5px 0;
              color: #7f8c8d;
              font-size: 12px;
              text-transform: uppercase;
              letter-spacing: 1px;
            ">Time</p>
            <p style="
              margin: 0;
              color: #2c3e50;
              font-weight: 500;
              font-size: 16px;
            ">${time || "Not scheduled"}</p>
          </div>
          <div>
            <p style="
              margin: 0 0 5px 0;
              color: #7f8c8d;
              font-size: 12px;
              text-transform: uppercase;
              letter-spacing: 1px;
            ">Instructor</p>
            <p style="
              margin: 0;
              color: #2c3e50;
              font-weight: 500;
              font-size: 16px;
            ">${instructor || "Not assigned"}</p>
          </div>
          <div>
            <p style="
              margin: 0 0 5px 0;
              color: #7f8c8d;
              font-size: 12px;
              text-transform: uppercase;
              letter-spacing: 1px;
            ">Location</p>
            <p style="
              margin: 0;
              color: #2c3e50;
              font-weight: 500;
              font-size: 16px;
            ">Virtual Classroom</p>
          </div>
        </div>
      </div>
      
      <div style="text-align: center;">
        <a href="#" style="
          display: inline-block;
          background: #2c3e50;
          color: white;
          text-decoration: none;
          padding: 12px 30px;
          border-radius: 30px;
          font-family: 'Roboto', sans-serif;
          font-weight: 500;
          letter-spacing: 1px;
          transition: all 0.3s;
        ">Join Class Session</a>
      </div>
    </div>
  </div>
</body>
</html>
`;
// Event Templates
// Updated Event Templates
export const eventTemplate1 = ({ title, message, date, time, className, instructor, location, sessions }) => `
  <!DOCTYPE html>
  <html>
    <head>
      <title>Class Invitation</title>
      <style>
        body { margin: 0; padding: 0; font-family: 'Arial', sans-serif; }
      </style>
    </head>
    <body>
      <div style="background-image: url('https://img.freepik.com/free-vector/gradient-purple-background_52683-66476.jpg');
                  background-size: cover;
                  height: 600px;
                  position: relative;">
        <div style="position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 80%;
                    max-width: 500px;
                    background: white;
                    padding: 30px;
                    border-radius: 15px;
                    text-align: center;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
          
          <h1 style="color: #9b59b6; margin-top: 0;">${title || "You're Invited!"}</h1>
          <p style="font-size: 16px; color: #555; margin-bottom: 25px;">
            ${message || "We'd love for you to join us for this special class."}
          </p>
          
          <div style="background-color: #f3e6ff;
                      padding: 15px;
                      border-radius: 8px;
                      margin-bottom: 15px;">
            <div style="font-size: 18px; font-weight: bold; color: #8e44ad;">
              <div style="margin-bottom: 8px;">📅 ${date || "Date not specified"}</div>
              <div>⏰ ${time || "Time not specified"}</div>
            </div>
          </div>

          <div style="background-color: #f3e6ff;
                      padding: 15px;
                      border-radius: 8px;
                      margin-bottom: 15px;
                      text-align: left;">
            <div style="font-size: 16px; color: #333;">
              <div style="margin-bottom: 8px;"><strong>Class:</strong> ${className || "Not specified"}</div>
              <div style="margin-bottom: 8px;"><strong>Instructor:</strong> ${instructor || "Not specified"}</div>
              <div style="margin-bottom: 8px;"><strong>Location:</strong> ${location || "Not specified"}</div>
              ${sessions && sessions.length > 0 ? `
                <div style="margin-top: 10px;">
                  <strong>Upcoming Sessions:</strong>
                  <ul style="padding-left: 20px; margin-top: 5px;">
                    ${sessions.slice(0, 3).map(session => `
                      <li>${new Date(session.date).toLocaleDateString()} at ${session.startTime}</li>
                    `).join('')}
                    ${sessions.length > 3 ? `<li>...and ${sessions.length - 3} more</li>` : ''}
                  </ul>
                </div>
              ` : ''}
            </div>
          </div>
        </div>
      </div>
    </body>
  </html>
`;

export const eventTemplate2 = ({ title, message, date, time, className, instructor, location }) => `
  <!DOCTYPE html>
  <html>
    <head>
      <title>Class Announcement</title>
      <style>
        body { margin: 0; padding: 0; font-family: 'Roboto', sans-serif; }
      </style>
    </head>
    <body>

        <div style="margin:auto;
                    width: 80%;
                    max-width: 600px;
                    background: rgba(255,255,255,0.9);
                    padding: 30px;
                    border-radius: 10px;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
          
          <div style="text-align: center; margin-bottom: 25px;">
            <h2 style="color: #2c3e50; margin-bottom: 10px;">${title || "Class Announcement"}</h2>
            <div style="width: 50px; height: 3px; background: #3498db; margin: 0 auto;"></div>
          </div>
          
          <p style="font-size: 16px; line-height: 1.6; color: #34495e;">
            ${message || "Join us for an exciting class to enhance your skills!"}
          </p>
          
          <div style="background-color: #f8f9fa;
                      padding: 20px;
                      border-radius: 8px;
                      margin: 25px 0;
                      border-left: 4px solid #3498db;">
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
              <span style="width: 80px; font-weight: bold;">Class:</span>
              <span>${className || "Not specified"}</span>
            </div>
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
              <span style="width: 80px; font-weight: bold;">Instructor:</span>
              <span>${instructor || "Not specified"}</span>
            </div>
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
              <span style="width: 80px; font-weight: bold;">Date:</span>
              <span>${date || "Not specified"}</span>
            </div>
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
              <span style="width: 80px; font-weight: bold;">Time:</span>
              <span>${time || "Not specified"}</span>
            </div>
            <div style="display: flex; align-items: center;">
              <span style="width: 80px; font-weight: bold;">Location:</span>
              <span>${location || "Not specified"}</span>
            </div>
          </div>
        </div>
      
    </body>
  </html>
`;

export const eventTemplate3 = ({ title, message, date, time, className, instructor, location, sessions }) => `
  <!DOCTYPE html>
  <html>
  <body>
    <div style="
  font-family: Arial, sans-serif;
  background-color: #f5f5f5;
  padding: 40px;
  text-align: center;
">
  <div style="
    background-color: black;
    border-radius: 15px;
    padding: 30px;
    max-width: 500px;
    margin: 0 auto;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  ">
    <h1 style="
      color: #fff;
      font-size: 28px;
      font-weight: bold;
      margin-bottom: 30px;
      letter-spacing: 2px;
      text-transform: uppercase;
    ">CLASS INVITATION</h1>
    
    <div style="
      margin-bottom: 25px;
      border-top: 2px solid #eee;
      padding-top: 25px;
    ">
      <h5 style="
        font-size: 18px;
        color: #fff;
        margin-bottom: 10px;
        letter-spacing: 1px;
      ">${title || "Class Title"}</h5>
      <p style="
        font-size: 18px;
        color: #fff;
        margin-bottom: 10px;
        letter-spacing: 1px;
      ">CLASS DETAILS</p>
    </div>
    
    <div style="
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
    ">
      <div style="text-align: left;">
        <p style="
          font-size: 16px;
          color: #fff;
          margin-bottom: 8px;
        ">TIME</p>
        <p style="
          font-size: 18px;
          color: #fff;
          font-weight: bold;
        ">${time || "Not specified"}</p>
      </div>
      
      <div style="text-align: right;">
        <p style="
          font-size: 16px;
          color: #fff;
          margin-bottom: 8px;
        ">DATE</p>
        <p style="
          font-size: 18px;
          color: #fff;
          font-weight: bold;
        ">${date || "Not specified"}</p>
      </div>
    </div>

    <div style="
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
    ">
      <div style="text-align: left;">
        <p style="
          font-size: 16px;
          color: #fff;
          margin-bottom: 8px;
        ">CLASS</p>
        <p style="
          font-size: 18px;
          color: #fff;
          font-weight: bold;
        ">${className || "Not specified"}</p>
      </div>
      
      <div style="text-align: right;">
        <p style="
          font-size: 16px;
          color: #fff;
          margin-bottom: 8px;
        ">INSTRUCTOR</p>
        <p style="
          font-size: 18px;
          color: #fff;
          font-weight: bold;
        ">${instructor || "Not specified"}</p>
      </div>
    </div>
    
    <div style="
      background-color: #f9f9f9;
      border-radius: 10px;
      padding: 15px;
      margin-bottom: 25px;
    ">
      <p style="
        font-size: 16px;
        color: #000;
        margin-bottom: 5px;
      ">Location</p>
      <p style="
        font-size: 18px;
        color: #000;
        font-weight: bold;
      ">${location || "Not specified"}</p>
    </div>

    ${sessions && sessions.length > 0 ? `
    <div style="
      background-color: #f9f9f9;
      border-radius: 10px;
      padding: 15px;
      margin-bottom: 25px;
      text-align: left;
    ">
      <p style="
        font-size: 16px;
        color: #000;
        margin-bottom: 5px;
        font-weight: bold;
      ">Upcoming Sessions:</p>
      <ul style="padding-left: 20px; margin-top: 5px;">
        ${sessions.slice(0, 3).map(session => `
          <li style="margin-bottom: 5px;">
            ${new Date(session.date).toLocaleDateString()} - ${session.startTime} to ${session.endTime}
          </li>
        `).join('')}
        ${sessions.length > 3 ? `<li>...and ${sessions.length - 3} more sessions</li>` : ''}
      </ul>
    </div>
    ` : ''}
  </div>
</div>
    </body>
  </html>
`;

export const eventTemplate4 = ({ title, message, date, time, className, instructor, location, sessions }) => `
  <!DOCTYPE html>
  <html>
    <body>
<div style="
  font-family: 'Helvetica Neue', Arial, sans-serif;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%);
  padding: 40px 20px;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
">
  <div style="
    background: white;
    border-radius: 20px;
    overflow: hidden;
    width: 100%;
    max-width: 500px;
    box-shadow: 0 15px 30px rgba(0,0,0,0.1);
    position: relative;
  ">
    <!-- Header with gradient -->
    <div style="
      background: linear-gradient(135deg, #e83561 0%, #003865 100%);
      padding: 30px;
      color: white;
      text-align: center;
    ">
      <h1 style="
        margin: 0;
        font-size: 32px;
        font-weight: 700;
        letter-spacing: 1px;
      ">${title || "Class Title"}</h1>
      <p style="
        margin: 10px 0 0;
        font-size: 16px;
        opacity: 0.9;
        letter-spacing: 0.5px;
      ">You're Cordially Invited</p>
    </div>
    
    <!-- Class Details -->
    <div style="padding: 30px;">
      <!-- Date/Time -->
      <div style="
        display: flex;
        justify-content: space-between;
        margin-bottom: 25px;
        padding-bottom: 25px;
        border-bottom: 1px solid #f0f0f0;
      ">
        <div>
          <p style="
            margin: 0 0 5px;
            font-size: 14px;
            color: #888;
            text-transform: uppercase;
            letter-spacing: 1px;
          ">Date</p>
          <p style="
            margin: 0;
            font-size: 20px;
            font-weight: 600;
            color: #333;
          ">${date || "Not specified"}</p>
        </div>
        <div>
          <p style="
            margin: 0 0 5px;
            font-size: 14px;
            color: #888;
            text-transform: uppercase;
            letter-spacing: 1px;
          ">Time</p>
          <p style="
            margin: 0;
            font-size: 20px;
            font-weight: 600;
            color: #333;
          ">${time || "Not specified"}</p>
        </div>
      </div>
      
      <!-- Class Info -->
      <div style="margin-bottom: 25px;">
        <p style="
          margin: 0 0 5px;
          font-size: 14px;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 1px;
        ">Class Name</p>
        <p style="
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: #333;
        ">${className || "Not specified"}</p>
      </div>

      <!-- Instructor -->
      <div style="margin-bottom: 25px;">
        <p style="
          margin: 0 0 5px;
          font-size: 14px;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 1px;
        ">Instructor</p>
        <p style="
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: #333;
        ">${instructor || "Not specified"}</p>
      </div>

      <!-- Location -->
      <div style="margin-bottom: 25px;">
        <p style="
          margin: 0 0 5px;
          font-size: 14px;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 1px;
        ">Location</p>
        <p style="
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: #333;
        ">${location || "Not specified"}</p>
      </div>

      ${sessions && sessions.length > 0 ? `
      <!-- Sessions -->
      <div style="margin-bottom: 25px;">
        <p style="
          margin: 0 0 10px;
          font-size: 14px;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 1px;
        ">Upcoming Sessions</p>
        <div style="
          background-color: #f8f9fa;
          border-radius: 8px;
          padding: 15px;
        ">
          ${sessions.slice(0, 3).map(session => `
            <div style="
              display: flex;
              justify-content: space-between;
              margin-bottom: 10px;
              padding-bottom: 10px;
              border-bottom: 1px solid #eee;
            ">
              <span style="font-weight: 500;">${new Date(session.date).toLocaleDateString()}</span>
              <span>${session.startTime} - ${session.endTime}</span>
            </div>
          `).join('')}
          ${sessions.length > 3 ? `
            <div style="text-align: center; color: #666; font-size: 14px;">
              + ${sessions.length - 3} more sessions
            </div>
          ` : ''}
        </div>
      </div>
      ` : ''}
      
      <!-- Message -->
      <div style="margin-bottom: 25px;">
        <p style="
          margin: 0 0 5px;
          font-size: 14px;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 1px;
        ">Message</p>
        <p style="
          margin: 5px 0 0;
          font-size: 16px;
          color: #666;
        ">${message || "Not specified"}</p>
      </div>
    </div>
  </div>
</div>
</div>
    </body>
  </html>
`;

export const reminderTemplate1 = ({ title, message }) => `
  <!DOCTYPE html>
  <html>
    <head>
      <title>Email Template</title>
      <style>
        body { font-family: Arial, sans-serif; }
        .container { max-width: 600px; margin: 0 auto; }
      </style>
    </head>
    <body>
    <div style="background-color: #eee; height: 100vh; width: 100%;">
  <div style="max-width: 1200px; margin: 0 auto; padding: 20px 0; height: 100%;">
    <div style="display: flex; justify-content: center; align-items: center; height: 100%;">
      <div style="width: 100%; max-width: 800px;margin:30px">
        <div style="background-color: white; border-radius: 15px;">
          <div style="padding: 40px;">

            <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px;">
              <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-quotes/bulb.webp"
                alt="Bulb" width="100" style="display: block; margin: 0 auto;">
            </div>

            <div style="text-align: center; margin-bottom: 0;">
              <div style="margin-bottom: 20px;">
               <div style="font-size: 0.875em; color: #6c757d; margin-bottom: 0;">
                ${title || "Default Title"}
              </div>
                <p style="padding-bottom: 20px; margin: 0;">
                  <i style="font-style: italic; color: #0d6efd;">"</i>
                  <span style="font-size: 1.25em; font-style: italic; display: inline-block; line-height: 1.5;">${
                    message || "Thank you for your interest in our service."
                  }</span>
                  <i style="font-style: italic; color: #0d6efd;">"</i>
                </p>
              </div>
             
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</div>
    </body>
  </html>
`;

export const reminderTemplate2 = ({ title, message }) => `
  <!DOCTYPE html>
  <html>
    <head>
      <title>Email Template</title>
      <style>
        body { font-family: Arial, sans-serif; }
        .container { max-width: 600px; margin: 0 auto; }
      </style>
    </head>
    <body>
    <div style="background-color: #f5f5f5; padding: 30px 0; font-family: Arial, sans-serif;">
  <div style="max-width: 600px; margin:auto 20px ; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.1);max-height:400px;height:100%">
    <!-- Header -->
    <div style="background: #e83561; padding: 20px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 24px;">${
        title || "Default Title"
      }</h1>
    </div>
    
    <!-- Content -->
    <div style="padding: 30px;">
      <div style="font-size: 16px; line-height: 1.6; color: #333;">
       ${message || "Thank you for your interest in our service."}
      </div>
    </div>
    
  </div>
</div>
    </body>
  </html>
`;

export const reminderTemplate3 = ({ title, message }) => `
  <!DOCTYPE html>
  <html>
    <head>
      <title>Email Template</title>
      <style>
        body { font-family: Arial, sans-serif; }
        .container { max-width: 600px; margin: 0 auto; }
      </style>
    </head>
    <body>
    <div style="background-color: #f5f5f5; font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0;flex-direction: column;gap;30px">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-quote" viewBox="0 0 16 16">
  <path d="M12 12a1 1 0 0 0 1-1V8.558a1 1 0 0 0-1-1h-1.388q0-.527.062-1.054.093-.558.31-.992t.559-.683q.34-.279.868-.279V3q-.868 0-1.52.372a3.3 3.3 0 0 0-1.085.992 4.9 4.9 0 0 0-.62 1.458A7.7 7.7 0 0 0 9 7.558V11a1 1 0 0 0 1 1zm-6 0a1 1 0 0 0 1-1V8.558a1 1 0 0 0-1-1H4.612q0-.527.062-1.054.094-.558.31-.992.217-.434.559-.683.34-.279.868-.279V3q-.868 0-1.52.372a3.3 3.3 0 0 0-1.085.992 4.9 4.9 0 0 0-.62 1.458A7.7 7.7 0 0 0 3 7.558V11a1 1 0 0 0 1 1z"/>
</svg>
    <div style="background-color: white;  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); width: 80%; max-width: 250px;height:350px; padding: 30px; text-align: center; position: relative;display:flex;align-items:center;justify-content:center;flex-direction:column">
        <div style="font-size: 22px; color: #222; margin-bottom: 30px; font-weight: bold;">${
          title || "Default Title"
        }</div>
        <div style="font-size: 18px; font-weight: bold; color: #333; margin-bottom: 20px; line-height: 1.4;">${
          message || "Thank you for your interest in our service."
        }</div>
       
    </div>
</div>
    </body>
  </html>
`;

export const reminderTemplate4 = ({ title, message }) => `
  <!DOCTYPE html>
  <html>
    <head>
      <title>Email Template</title>
      <style>
        body { font-family: Arial, sans-serif; }
        .container { max-width: 600px; margin: 0 auto; }
      </style>
    </head>
    <body>
    <div style="background-image: url('${motivationalImage3}');background-size:contain;background-repeat:no-repeat;height:600px">
    <div style="padding-left:120px;padding-top:160px;max-width:400px">
        <h3>${title || "Default Title"}</h3>
        <p>${message || "Thank you for your interest in our service."}</p>
      </div>
      </div>
    </body>
  </html>
`;
