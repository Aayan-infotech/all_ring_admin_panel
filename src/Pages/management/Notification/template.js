import motivationalImage from "./images/motivational-reminder1.jpg";

export const reminderTemplate1 = `
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
        <h1>Hello, Daksh!</h1>
        <p>Thank you for your interest in our service.</p>
      </div>
    </body>
  </html>
`;
