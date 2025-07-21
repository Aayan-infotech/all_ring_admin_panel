// import motivationalImage from "./images/motivational-reminder1.jpg";
// import motivationalImage1 from "./images/motivational-reminder2.jpg";
// import motivationalImage2 from "./images/motivational-reminder3.jpg";
// import motivationalImage3 from "./images/motivational-reminder4.jpg";

// export const reminderTemplate1 = ({ title }) => `
//   <!DOCTYPE html>
//   <html>
//     <head>
//       <title>Email Template</title>
//       <style>
//         body { font-family: Arial, sans-serif; }
//         .container { max-width: 600px; margin: 0 auto; }
//       </style>
//     </head>
//     <body>
//     <div style="background-image: url('${motivationalImage}');background-size:contain;background-repeat:no-repeat;height:600px">
//     <div style="padding-left:140px;padding-top:30px;">
//        <h3>${title || "Default Title"}</h1>
//         <p>Thank you for your interest in our service. sfsfdsd fsfsdf sdfsdfsd sdfsfsd</p>
//         </div>
//       </div>
//     </body>
//   </html>
// `;

// export const reminderTemplate2 = ({ title }) => `
//   <!DOCTYPE html>
//   <html>
//     <head>
//       <title>Email Template</title>
//       <style>
//         body { font-family: Arial, sans-serif; }
//         .container { max-width: 600px; margin: 0 auto; }
//       </style>
//     </head>
//     <body>
//     <div style="background-image: url('${motivationalImage1}');background-size:contain;background-repeat:no-repeat;height:600px">
//         <h1>Hello, Daksh!</h1>
//         <p>Thank you for your interest in our service.</p>
//       </div>
//     </body>
//   </html>
// `;

// export const reminderTemplate3 = ({ title }) => `
//   <!DOCTYPE html>
//   <html>
//     <head>
//       <title>Email Template</title>
//       <style>
//         body { font-family: Arial, sans-serif; }
//         .container { max-width: 600px; margin: 0 auto; }
//       </style>
//     </head>
//     <body>
//     <div style="background-image: url('${motivationalImage2}');background-size:contain;background-repeat:no-repeat;height:600px">
//         <h1>Hello, Daksh!</h1>
//         <p>Thank you for your interest in our service.</p>
//       </div>
//     </body>
//   </html>
// `;

// export const reminderTemplate4 = ({ title }) => `
//   <!DOCTYPE html>
//   <html>
//     <head>
//       <title>Email Template</title>
//       <style>
//         body { font-family: Arial, sans-serif; }
//         .container { max-width: 600px; margin: 0 auto; }
//       </style>
//     </head>
//     <body>
//     <div style="background-image: url('${motivationalImage3}');background-size:contain;background-repeat:no-repeat;height:600px">
//         <h1>Hello, Daksh!</h1>
//         <p>Thank you for your interest in our service.</p>
//       </div>
//     </body>
//   </html>
// `;

// // export const reminderTemplate5 = `
// //   <!DOCTYPE html>
// //   <html>
// //     <head>
// //       <title>Email Template</title>
// //       <style>
// //         body { font-family: Arial, sans-serif; }
// //         .container { max-width: 600px; margin: 0 auto; }
// //       </style>
// //     </head>
// //     <body>
// //     <div style="background-image: url('${motivationalImage3}');background-size:contain;background-repeat:no-repeat;height:600px">
// //         <h1>Hello, Daksh!</h1>
// //         <p>Thank you for your interest in our service.</p>
// //       </div>
// //     </body>
// //   </html>
// // `;
import classTemplateImg from "./images/class-template.jpg";
import motivationalImage from "./images/motivational-reminder1.jpg";
import motivationalImage1 from "./images/motivational-reminder2.jpg";
import motivationalImage2 from "./images/motivational-reminder3.jpg";
import motivationalImage3 from "./images/motivational-reminder4.jpg";
import eventTemplateImg from "./images/event-template.jpg";

// Class Templates
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
      <title>Class Notification</title>
      <style>
        body { 
          font-family: 'Arial', sans-serif;
          margin: 0;
          padding: 0;
        }
        .content {
          padding: 40px;
          color: #333;
        }
      </style>
    </head>
    <body>
      <div style="background-image: url('https://img.freepik.com/free-vector/hand-painted-watercolor-background_23-2149005676.jpg');
                  background-size: cover;
                  height: 600px;
                  position: relative;">
        <div class="content" style="background-color: rgba(255,255,255,0.85);
                                    position: absolute;
                                    top: 50%;
                                    left: 50%;
                                    transform: translate(-50%, -50%);
                                    width: 80%;
                                    border-radius: 15px;
                                    padding: 30px;
                                    box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
          <h2 style="color: #2c3e50; border-bottom: 2px solid #3498db; 
                     padding-bottom: 10px; margin-top: 0;">${
                       title || "Class Reminder"
                     }</h2>
          <p style="font-size: 16px; line-height: 1.6;">${
            message || "This is a reminder about your upcoming class."
          }</p>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin-top: 20px;">
            <div style="display: flex; margin-bottom: 8px;">
              <span style="font-weight: bold; width: 120px;">Class:</span>
              <span>${className || "Not specified"}</span>
            </div>
            <div style="display: flex; margin-bottom: 8px;">
              <span style="font-weight: bold; width: 120px;">Instructor:</span>
              <span>${instructor || "Not specified"}</span>
            </div>
            <div style="display: flex; margin-bottom: 8px;">
              <span style="font-weight: bold; width: 120px;">Date:</span>
              <span>${date || "Not specified"}</span>
            </div>
            <div style="display: flex;">
              <span style="font-weight: bold; width: 120px;">Time:</span>
              <span>${time || "Not specified"}</span>
            </div>
          </div>
          
          <div style="margin-top: 25px; text-align: center;">
            <a href="#" style="background-color: #3498db; color: white; 
                              padding: 10px 20px; text-decoration: none; 
                              border-radius: 5px; display: inline-block;">
              Join Class
            </a>
          </div>
        </div>
      </div>
    </body>
  </html>
`;

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
      <title>Assignment Alert</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
      </style>
    </head>
    <body>
      <div style="background-image: url('https://img.freepik.com/free-vector/gradient-stationary-background_23-2149430426.jpg');
                  background-size: cover;
                  height: 600px;
                  position: relative;">
        <div style="position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 80%;
                    background: white;
                    padding: 30px;
                    border-radius: 10px;
                    box-shadow: 0 0 20px rgba(0,0,0,0.1);">
          <h2 style="color: #e74c3c; margin-top: 0;">${
            title || "Assignment Deadline"
          }</h2>
          <p style="font-size: 16px; color: #555;">${
            message ||
            "This is a reminder about your upcoming assignment deadline."
          }</p>
          
          <div style="margin-top: 25px;">
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
              <span style="width: 100px; font-weight: bold;">Class:</span>
              <span>${className || "Not specified"}</span>
            </div>
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
              <span style="width: 100px; font-weight: bold;">Due Date:</span>
              <span>${date || "Not specified"} at ${
  time || "Not specified"
}</span>
            </div>
            <div style="display: flex; align-items: center;">
              <span style="width: 100px; font-weight: bold;">Instructor:</span>
              <span>${instructor || "Not specified"}</span>
            </div>
          </div>
          
          <div style="margin-top: 30px; text-align: center;">
            <div style="display: inline-block;
                        background: linear-gradient(135deg, #e74c3c, #c0392b);
                        color: white;
                        padding: 12px 25px;
                        border-radius: 30px;
                        font-weight: bold;
                        box-shadow: 0 4px 8px rgba(231, 76, 60, 0.3);">
              Submit Assignment
            </div>
          </div>
        </div>
      </div>
    </body>
  </html>
`;

export const classTemplate3 = ({
  title,
  message,
  date,
  time,
  instructor,
}) => `<!DOCTYPE html>
<html>

<body>
<div style="
  font-family: 'Segoe UI', Roboto, sans-serif;
  background-color: #f5f7fa;
  padding: 25px;
  max-width: 500px;
  margin: 20px auto;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
">
  <!-- Header Section -->
  <div style="
    background: linear-gradient(135deg, #e83561 0%, #00d2ff 100%);
    color: white;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 20px;
    text-align: center;
  ">
    <h1 style="
      margin: 0;
      font-size: 22px;
      font-weight: 600;
      letter-spacing: 0.5px;
    ">{{title}}</h1>
    <p style="
      margin: 8px 0 0;
      font-size: 14px;
      opacity: 0.9;
    ">Class Reminder</p>
  </div>
  
  <!-- Message Content -->
  <div style="
    background: white;
    padding: 18px;
    border-radius: 8px;
    margin-bottom: 20px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  ">
    <p style="
      margin: 0;
      color: #555;
      line-height: 1.5;
      font-size: 15px;
    ">{{message}}</p>
  </div>
  
  <!-- Details Grid -->
  <div style="
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    margin-bottom: 20px;
  ">
    <!-- Date -->
    <div style="
      background: #f8f9fa;
      padding: 12px;
      border-radius: 6px;
    ">
      <p style="
        margin: 0 0 4px;
        font-size: 12px;
        color: #7f8c8d;
        text-transform: uppercase;
      ">Date</p>
      <p style="
        margin: 0;
        font-size: 16px;
        color: #2c3e50;
        font-weight: 500;
      ">{{date}}</p>
    </div>
    
    <!-- Time -->
    <div style="
      background: #f8f9fa;
      padding: 12px;
      border-radius: 6px;
    ">
      <p style="
        margin: 0 0 4px;
        font-size: 12px;
        color: #7f8c8d;
        text-transform: uppercase;
      ">Time</p>
      <p style="
        margin: 0;
        font-size: 16px;
        color: #2c3e50;
        font-weight: 500;
      ">{{time}}</p>
    </div>
    
    <!-- Class Name -->
    <div style="
      background: #f8f9fa;
      padding: 12px;
      border-radius: 6px;
    ">
      <p style="
        margin: 0 0 4px;
        font-size: 12px;
        color: #7f8c8d;
        text-transform: uppercase;
      ">Class</p>
      <p style="
        margin: 0;
        font-size: 16px;
        color: #2c3e50;
        font-weight: 500;
      ">{{classname}}</p>
    </div>
    
    <!-- Instructor -->
    <div style="
      background: #f8f9fa;
      padding: 12px;
      border-radius: 6px;
    ">
      <p style="
        margin: 0 0 4px;
        font-size: 12px;
        color: #7f8c8d;
        text-transform: uppercase;
      ">Instructor</p>
      <p style="
        margin: 0;
        font-size: 16px;
        color: #2c3e50;
        font-weight: 500;
      ">{{instructor}}</p>
    </div>
  </div>
  
  <!-- Footer -->
  <div style="
    text-align: center;
    font-size: 12px;
    color: #95a5a6;
    padding-top: 15px;
    border-top: 1px solid #ecf0f1;
  ">
    <p style="margin: 0;">Please arrive 5 minutes before class starts</p>
  </div>
</div>
</body>

</html>
`;

export const classTemplate4 = ({
  title,
  message,
  date,
  time,
  instructor,
}) => `
<!DOCTYPE html>
<html>
<body>
<div style="
  font-family: 'Arial', sans-serif;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 25px;
  max-width: 450px;
  margin: 0 auto;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
">
  <!-- Header -->
  <div style="text-align: center; margin-bottom: 5px;">
    <p style="
      margin: 0;
      color: #666666;
      font-size: 12px;
      letter-spacing: 2px;
      text-transform: uppercase;
    ">{{class Name}}</p>
  </div>
  
  <!-- Main Title -->
  <h1 style="
    margin: 0 0 20px 0;
    padding: 0;
    color: #333333;
    font-size: 22px;
    text-align: center;
    text-transform: uppercase;
    font-weight: 600;
  ">{{title}}</h1>
 
  
  <!-- Content Box -->
  <div style="
    background-color: #f9f9f9;
    border-radius: 6px;
    padding: 18px;
    margin-bottom: 20px;
  ">
  <div style="display:flex;flex-direction:row;justify-content:space-between">
    <p style="
      margin: 0;
      color: #555555;
      line-height: 1.5;
      font-size: 14px;
      text-align: center;
    ">{{Date}}</p>
     <p style="
      margin: 0;
      color: #555555;
      line-height: 1.5;
      font-size: 14px;
      text-align: center;
    ">{{time}}</p>
    </div>
  </div>
  
  <!-- Time Section -->

  
   <div style="
    background-color: #003865;
    border-radius: 6px;
    padding: 12px;
    margin-bottom: 15px;
    text-align: center;
  ">
    <p style="
      margin: 0;
      color: #fff;
      font-weight: bold;
      font-size: 15px;
    ">{{Instructor}}</p>
  </div>
  
  
    <div style="
    background-color: #e83561;
    border-radius: 6px;
    padding: 12px;
    margin-bottom: 15px;
    text-align: center;
  ">
    <p style="
      margin: 0;
      color: #fff;
      font-weight: bold;
      font-size: 15px;
    ">{{Message}}</p>
  </div>
  <!-- Additional Text -->
  
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
