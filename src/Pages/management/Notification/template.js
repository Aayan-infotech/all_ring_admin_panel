
import classTemplateImg from "./images/class-template.jpg";
import motivationalImage from "./images/motivational-reminder1.jpg";
import motivationalImage1 from "./images/motivational-reminder2.jpg";
import motivationalImage2 from "./images/motivational-reminder3.jpg";
import motivationalImage3 from "./images/motivational-reminder4.jpg";
import eventTemplateImg from "./images/event-template.jpg";

// Class Templates
// Class Reminder Template 1 (Professional Academic Design)
export const classTemplate1 = ({ title, message, date, time, className, instructor }) => `
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
        <p style="color: #7f8c8d; margin-top: 5px;">${className || "Course Name"}</p>
      </div>
      
      <div style="background: #f8f9fa; border-radius: 10px; padding: 20px; margin-bottom: 25px;">
        <p style="margin: 0 0 15px 0; color: #555; line-height: 1.5;">${message || "This is a reminder about your upcoming class session."}</p>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
          <div>
            <p style="margin: 0 0 5px 0; font-size: 12px; color: #7f8c8d;">DATE</p>
            <p style="margin: 0; font-weight: 600; color: #2c3e50;">${date || "Not specified"}</p>
          </div>
          <div>
            <p style="margin: 0 0 5px 0; font-size: 12px; color: #7f8c8d;">TIME</p>
            <p style="margin: 0; font-weight: 600; color: #2c3e50;">${time || "Not specified"}</p>
          </div>
          <div>
            <p style="margin: 0 0 5px 0; font-size: 12px; color: #7f8c8d;">INSTRUCTOR</p>
            <p style="margin: 0; font-weight: 600; color: #2c3e50;">${instructor || "Not specified"}</p>
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
export const classTemplate2 = ({ title, message, date, time, className, instructor }) => `
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
          <h2 style="margin: 0; color: #2c3e50; font-size: 22px;">${title || "Class Notification"}</h2>
          <p style="margin: 5px 0 0 0; color: #7f8c8d; font-size: 14px;">${className || "Course"}</p>
        </div>
      </div>
      
      <div style="margin-bottom: 25px;">
        <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">${message || "Important information about your upcoming class."}</p>
        
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
            <p style="margin: 0; font-weight: 600; color: #2c3e50;">${date || "TBD"}</p>
          </div>
          <div style="
            background: #f8f9fa;
            border-radius: 8px;
            padding: 12px;
          ">
            <p style="margin: 0 0 5px 0; font-size: 12px; color: #7f8c8d;">TIME</p>
            <p style="margin: 0; font-weight: 600; color: #2c3e50;">${time || "TBD"}</p>
          </div>
        </div>
        
        <div style="
          background: #f8f9fa;
          border-radius: 8px;
          padding: 12px;
        ">
          <p style="margin: 0 0 5px 0; font-size: 12px; color: #7f8c8d;">INSTRUCTOR</p>
          <p style="margin: 0; font-weight: 600; color: #2c3e50;">${instructor || "Not assigned"}</p>
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
export const classTemplate3 = ({ title, message, date, time, className, instructor }) => `
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
        <h2 style="margin: 0 0 10px 0; color: #2c3e50; font-size: 24px;">${title || "Class Reminder"}</h2>
        <p style="margin: 0; color: #7f8c8d; font-size: 14px;">${className || "Course"}</p>
      </div>
      
      <div style="margin-bottom: 30px;">
        <p style="color: #555; line-height: 1.6; margin-bottom: 25px;">${message || "Don't forget about your upcoming class."}</p>
        
        <div style="
          display: flex;
          justify-content: space-between;
          margin-bottom: 15px;
          padding-bottom: 15px;
          border-bottom: 1px solid #eee;
        ">
          <span style="color: #7f8c8d; font-size: 14px;">Date</span>
          <span style="font-weight: 500; color: #2c3e50;">${date || "Not scheduled"}</span>
        </div>
        
        <div style="
          display: flex;
          justify-content: space-between;
          margin-bottom: 15px;
          padding-bottom: 15px;
          border-bottom: 1px solid #eee;
        ">
          <span style="color: #7f8c8d; font-size: 14px;">Time</span>
          <span style="font-weight: 500; color: #2c3e50;">${time || "Not scheduled"}</span>
        </div>
        
        <div style="
          display: flex;
          justify-content: space-between;
        ">
          <span style="color: #7f8c8d; font-size: 14px;">Instructor</span>
          <span style="font-weight: 500; color: #2c3e50;">${instructor || "Not assigned"}</span>
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
export const classTemplate4 = ({ title, message, date, time, className, instructor }) => `
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
        ">${message || "A friendly reminder about your upcoming class session."}</p>
        
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
export const eventTemplate1 = ({ title, message, date, time }) => `
  <!DOCTYPE html>
  <html>
    <head>
      <title>Event Invitation</title>
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
          
          <h1 style="color: #9b59b6; margin-top: 0;">${
            title || "You're Invited!"
          }</h1>
          <p style="font-size: 16px; color: #555; margin-bottom: 25px;">
            ${message || "We'd love for you to join us for this special event."}
          </p>
          
          <div style="background-color: #f3e6ff;
                      padding: 15px;
                      border-radius: 8px;
                      margin-bottom: 25px;">
            <div style="font-size: 18px; font-weight: bold; color: #8e44ad;">
              <div style="margin-bottom: 8px;">📅 ${
                date || "Date not specified"
              }</div>
              <div>⏰ ${time || "Time not specified"}</div>
            </div>
          </div>
          
          <div style="display: flex; justify-content: center; gap: 15px;">
            <a href="#" style="background-color: #9b59b6;
                              color: white;
                              padding: 12px 25px;
                              text-decoration: none;
                              border-radius: 30px;
                              font-weight: bold;">
              Accept
            </a>
            <a href="#" style="background-color: #ecf0f1;
                              color: #7f8c8d;
                              padding: 12px 25px;
                              text-decoration: none;
                              border-radius: 30px;
                              font-weight: bold;">
              Decline
            </a>
          </div>
        </div>
      </div>
    </body>
  </html>
`;

export const eventTemplate2 = ({ title, message, date, time }) => `
  <!DOCTYPE html>
  <html>
    <head>
      <title>Workshop Announcement</title>
      <style>
        body { margin: 0; padding: 0; font-family: 'Roboto', sans-serif; }
      </style>
    </head>
    <body>
      <div style="background-image: url('https://img.freepik.com/free-vector/gradient-network-connection-background_23-2148872918.jpg');
                  background-size: cover;
                  height: 600px;
                  position: relative;">
        <div style="position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 80%;
                    max-width: 600px;
                    background: rgba(255,255,255,0.9);
                    padding: 30px;
                    border-radius: 10px;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
          
          <div style="text-align: center; margin-bottom: 25px;">
            <h2 style="color: #2c3e50; margin-bottom: 10px;">${
              title || "Workshop Announcement"
            }</h2>
            <div style="width: 50px; height: 3px; background: #3498db; margin: 0 auto;"></div>
          </div>
          
          <p style="font-size: 16px; line-height: 1.6; color: #34495e;">
            ${
              message ||
              "Join us for an exciting workshop to enhance your skills!"
            }
          </p>
          
          <div style="background-color: #f8f9fa;
                      padding: 20px;
                      border-radius: 8px;
                      margin: 25px 0;
                      border-left: 4px solid #3498db;">
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
              <span style="width: 80px; font-weight: bold;">Date:</span>
              <span>${date || "Not specified"}</span>
            </div>
            <div style="display: flex; align-items: center;">
              <span style="width: 80px; font-weight: bold;">Time:</span>
              <span>${time || "Not specified"}</span>
            </div>
          </div>
          
          <div style="text-align: center;">
            <a href="#" style="display: inline-block;
                              background: linear-gradient(to right, #3498db, #2c3e50);
                              color: white;
                              padding: 12px 30px;
                              text-decoration: none;
                              border-radius: 30px;
                              font-weight: bold;
                              margin-top: 15px;
                              box-shadow: 0 4px 8px rgba(52, 152, 219, 0.3);">
              Register Now
            </a>
          </div>
        </div>
      </div>
    </body>
  </html>
`;

export const eventTemplate3 = ({
  title,
  message,
  date,
  time,
  className,
  instructor,
}) => `
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
    ">EVENT INVITATION</h1>
    
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
      ">${title}</h5>
      <p style="
        font-size: 18px;
        color: #fff;
        margin-bottom: 10px;
        letter-spacing: 1px;
      ">TIME & ACCOMMODATION</p>
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
        ">00:00</p>
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
        ">DD/MM/YYYY</p>
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
      ">VENUE</p>
      <p style="
        font-size: 18px;
        color: #000;
        font-weight: bold;
      ">LOCATION NAME</p>
    </div>
    
    <div style="
      background-color: #4CAF50;
      color: white;
      padding: 15px;
      border-radius: 8px;
      font-size: 20px;
      font-weight: bold;
    ">
      PRICE: $3500
    </div>
  </div>
</div>
    </body>
  </html>
  `;

export const eventTemplate4 = ({
  title,
  message,
  date,
  time,
  className,
  instructor,
}) => `
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
      ">EXCLUSIVE EVENT</h1>
      <p style="
        margin: 10px 0 0;
        font-size: 16px;
        opacity: 0.9;
        letter-spacing: 0.5px;
      ">You're Cordially Invited</p>
    </div>
    
    <!-- Event Details -->
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
          ">June 15, 2024</p>
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
          ">7:00 PM</p>
        </div>
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
          font-size: 20px;
          font-weight: 600;
          color: #333;
        ">Grand Ballroom</p>
        <p style="
          margin: 5px 0 0;
          font-size: 16px;
          color: #666;
        ">123 Luxury Avenue, Metropolis</p>
      </div>
      
      <!-- Dress Code -->
      <div style="
        background: #f9f9f9;
        border-radius: 12px;
        padding: 15px;
        margin-bottom: 25px;
      ">
        <p style="
          margin: 0 0 5px;
          font-size: 14px;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 1px;
        ">Dress Code</p>
        <p style="
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: #764ba2;
        ">Black Tie Optional</p>
      </div>
      
      <!-- Price -->
      <div style="
        background: linear-gradient(135deg, #ff9a9e 0%, #e83561 100%);
        border-radius: 12px;
        padding: 15px;
        text-align: center;
      ">
        <p style="
          margin: 0;
          font-size: 14px;
          color: rgba(255,255,255,0.9);
          text-transform: uppercase;
          letter-spacing: 1px;
        ">Ticket Price</p>
        <p style="
          margin: 5px 0 0;
          font-size: 28px;
          font-weight: 700;
          color: white;
        ">$3500</p>
      </div>
    </div>
    
    <!-- Footer -->
    <div style="
      background: #f9f9f9;
      padding: 20px;
      text-align: center;
      font-size: 14px;
      color: #888;
    ">
      <p style="margin: 0;">RSVP by June 1st • Limited Seats Available</p>
    </div>
  </div>
</div>
</div>
    </body>
  </html>
`;

// Quote Templates (same as before)
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
    <div style="background-image: url('${motivationalImage}');background-size:contain;background-repeat:no-repeat;height:600px">
    <div style="padding-left:140px;padding-top:30px;">
       <h3>${title || "Default Title"}</h3>
        <p>${message || "Thank you for your interest in our service."}</p>
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
    <div style="background-image: url('${motivationalImage1}');background-size:contain;background-repeat:no-repeat;height:600px">
    <div style="padding-left:140px;padding-top:30px;">
        <h3>${title || "Default Title"}</h3>
        <p>${message || "Thank you for your interest in our service."}</p>
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
    <div style="background-image: url('${motivationalImage2}');background-size:contain;background-repeat:no-repeat;height:600px">
    <div style="padding-left:140px;padding-top:30px;">
        <h3>${title || "Default Title"}</h3>
        <p>${message || "Thank you for your interest in our service."}</p>
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
    <div style="padding-left:140px;padding-top:30px;">
        <h3>${title || "Default Title"}</h3>
        <p>${message || "Thank you for your interest in our service."}</p>
      </div>
      </div>
    </body>
  </html>
`;
