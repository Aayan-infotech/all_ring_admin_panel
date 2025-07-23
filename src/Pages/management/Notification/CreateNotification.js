// import React, { useState, useEffect } from "react";
// import {
//   ChatQuote as QuoteIcon,
//   CalendarEvent as EventIcon,
//   Send as SendIcon,
//   CheckCircleFill as ActiveIcon,
//   XCircleFill as BlockedIcon,
//   QuestionCircleFill as UnverifiedIcon,
// } from "react-bootstrap-icons";
// import axios from "axios";
// import motivationalImage4 from "./images/motivational-reminder4.jpg";
// import eventImage1 from "./images/event-template1.png";
// import eventImage2 from "./images/event-template2.png";
// import eventImage3 from "./images/event-template3.png";
// import eventImage4 from "./images/event-template4.png";
// import inspirationImage1 from "./images/inspirationImage1.png";
// import inspirationImage2 from "./images/inspirationImage2.png";
// import inspirationImage3 from "./images/inspirationImage1.png";

// import {
//   eventTemplate1,
//   eventTemplate2,
//   eventTemplate3,
//   eventTemplate4,
//   reminderTemplate1,
//   reminderTemplate2,
//   reminderTemplate3,
//   reminderTemplate4,
// } from "./template";

// const NotificationCreator = () => {
//   const [notificationType, setNotificationType] = useState("quote");
//   const [selectedTemplate, setSelectedTemplate] = useState(null);

// const [locations, setLocations] = useState([]);
// const [recipients, setRecipients] = useState([]);
// const [loading, setLoading] = useState(false);
// const [recipientType, setRecipientType] = useState("user");
// const [location, setLocation] = useState("");
//   const [selectedEvent, setSelectedEvent] = useState(null);
//   const [upcomingEvents, setUpcomingEvents] = useState([]);
//   const [loadingEvents, setLoadingEvents] = useState(false);
//   const [formData, setFormData] = useState({
//     title: "",
//     message: "",
//     date: "",
//     time: "",
//     className: "",
//     instructor: "",
//     location: "",
//     // sessions: "",
//   });

//   const [users, setUsers] = useState([
//     {
//       id: 1,
//       name: "John Doe",
//       email: "john@example.com",
//       status: "active",
//       selected: false,
//     },
//     {
//       id: 2,
//       name: "Jane Smith",
//       email: "jane@example.com",
//       status: "active",
//       selected: false,
//     },
//     {
//       id: 3,
//       name: "Bob Johnson",
//       email: "bob@example.com",
//       status: "blocked",
//       selected: false,
//     },
//     {
//       id: 4,
//       name: "Alice Williams",
//       email: "alice@example.com",
//       status: "unverified",
//       selected: false,
//     },
//     {
//       id: 5,
//       name: "Charlie Brown",
//       email: "charlie@example.com",
//       status: "active",
//       selected: false,
//     },
//   ]);

//   useEffect(() => {
//     if (notificationType === "event") {
//       fetchUpcomingEvents();
//     }
//   }, [notificationType]);

//     // Fetch all locations when component mounts
//   useEffect(() => {
// // Update the fetchLocations function
// const fetchLocations = async () => {
//   try {
//     setLoading(true);
//     const response = await fetch('http://98.85.246.54:5010/api/location/getAllLocations');
//     const data = await response.json();
//     // Make sure the response is an array
//     setLocations(Array.isArray(data) ? data : []);
//   } catch (error) {
//     console.error('Error fetching locations:', error);
//     setLocations([]); // Set to empty array if error occurs
//   } finally {
//     setLoading(false);
//   }
// };
//     fetchLocations();
//   }, []);

//   // Fetch recipients based on recipientType and location
//   useEffect(() => {
//  // Update the fetchRecipients function
// const fetchRecipients = async () => {
//   if (!recipientType) return;

//   try {
//     setLoading(true);
//     let url = `http://98.85.246.54:5010/api/admin/getRegister/${recipientType}`;

//     if (location) {
//       url += `?location=${location}`;
//     }

//     const response = await fetch(url);
//     const data = await response.json();
//     // Make sure the response is an array
//     setRecipients(Array.isArray(data) ? data : []);
//   } catch (error) {
//     console.error(`Error fetching ${recipientType}s:`, error);
//     setRecipients([]); // Set to empty array if error occurs
//   } finally {
//     setLoading(false);
//   }
// };

//     fetchRecipients();
//   }, [recipientType, location]);
//   const fetchUpcomingEvents = async () => {
//     try {
//       setLoadingEvents(true);
//       // Replace this with your actual API endpoint for events
//       const response = await axios.get(
//         "http://98.85.246.54:5010/api/AdminClasses/getAllUpcomingClasses", // Adjust this endpoint
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );
//       setUpcomingEvents(response.data.data || []);
//       setLoadingEvents(false);
//     } catch (error) {
//       console.error("Error fetching upcoming events:", error);
//       setLoadingEvents(false);
//     }
//   };

//   const templateMap = {
//     "quote-1": reminderTemplate1,
//     "quote-2": reminderTemplate2,
//     "quote-3": reminderTemplate3,
//     "quote-4": reminderTemplate4,
//     "event-1": eventTemplate1,
//     "event-2": eventTemplate2,
//     "event-3": eventTemplate3,
//     "event-4": eventTemplate4,
//   };
//   const EmailTemplateViewer = ({
//     templateId,
//     title,
//     message,
//     date,
//     time,
//     className,
//     instructor,
//     location,
//     // sessions,
//   }) => {
//     const templateFunction = templateMap[templateId] || reminderTemplate1;
//     return (
//       <div
//         dangerouslySetInnerHTML={{
//           __html: templateFunction({
//             title,
//             message,
//             date,
//             time,
//             className,
//             instructor,
//             location,
//             // sessions,
//           }),
//         }}
//       />
//     );
//   };

//   const templates = {
//     quote: [
//       {
//         id: "quote-1",
//         name: "Daily Motivation",
//         description: "Inspire students with positive quotes",
//         image: inspirationImage1,
//       },
//       {
//         id: "quote-2",
//         name: "Exam Encouragement",
//         description: "Boost morale before tests",
//         image: inspirationImage2,
//       },
//       {
//         id: "quote-3",
//         name: "Weekly Inspiration",
//         description: "Motivational quotes for the week",
//         image: inspirationImage3,
//       },
//       {
//         id: "quote-4",
//         name: "Success Tips",
//         description: "Tips for academic success",
//         image: motivationalImage4,
//       },
//     ],
//     event: [
//       {
//         id: "event-1",
//         name: "Event Invitation",
//         description: "Invite students to special events",
//         image: eventImage1,
//       },
//       {
//         id: "event-2",
//         name: "Workshop Alert",
//         description: "Announce skill-building sessions",
//         image: eventImage2,
//       },
//       {
//         id: "event-3",
//         name: "Seminar Notification",
//         description: "Information about upcoming seminars",
//         image: eventImage3,
//       },
//       {
//         id: "event-4",
//         name: "Conference Reminder",
//         description: "Reminder for important conferences",
//         image: eventImage4,
//       },
//     ],
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };
//   const handleEventChange = (e) => {
//     const eventId = e.target.value;
//     const selected = upcomingEvents.find((event) => event._id === eventId);
//     setSelectedEvent(selected);

//     if (selected) {
//       // Get first session details
//       const firstSession = selected.sessions?.[0] || {};

//       // Format date if available
//       const formattedDate = firstSession.date
//         ? new Date(firstSession.date).toLocaleDateString("en-US", {
//             weekday: "long",
//             year: "numeric",
//             month: "long",
//             day: "numeric",
//           })
//         : selected.startDate
//         ? new Date(selected.startDate).toLocaleDateString("en-US", {
//             weekday: "long",
//             year: "numeric",
//             month: "long",
//             day: "numeric",
//           })
//         : "Not specified";

//       // Format time if available
//       const formattedTime =
//         firstSession.startTime && firstSession.endTime
//           ? `${firstSession.startTime} - ${firstSession.endTime}`
//           : "Not specified";

//       // Get instructor name
//       const instructorName =
//         selected.Instructor?.name || "Instructor not assigned";

//       // Get location
//       const locationName =
//         selected.location?.location || "Location to be announced";

//       setFormData({
//         title: selected.title || "Class Invitation",
//         message:
//           selected.theme ||
//           selected.description ||
//           `Join us for this special class`,
//         date: formattedDate,
//         time: formattedTime,
//         className: selected.title || "Class details coming soon",
//         instructor: instructorName,
//         location: locationName,
//         // sessions: selected.sessions || [],
//       });
//     }
//   };

//   const getNotificationTypeName = (type) => {
//     switch (type) {
//       case "quote":
//         return "Inspirational Quote";
//       case "event":
//         return "Upcoming Event Invitation";
//       default:
//         return type;
//     }
//   };

//   const getTemplateName = (templateId) => {
//     const templateNumber = templateId.split("-")[1];
//     return `template${templateNumber}`;
//   };
//   const templateFunction = templateMap[selectedTemplate?.id || "quote-1"];
//   const htmlContent = templateFunction({
//     title: formData.title,
//     message: formData.message,
//     date: formData.date,
//     time: formData.time,
//     className: formData.className,
//     instructor: formData.instructor,
//     location: formData.location,
//     // sessions: formData.sessions,
//   });

//   const handleSubmit = async (e) => {
//     try {
//       const res = await axios.post(
//         "http://98.85.246.54:5010/api/notification/send",
//         {
//           notificationType: getNotificationTypeName(notificationType),
//           template: selectedTemplate
//             ? getTemplateName(selectedTemplate.id)
//             : "template1",
//           title: `${formData?.title}`,
//           message: `${formData?.message}`,
//           html: htmlContent,
//           users: ["687f3e3751c6736dcfd51067", "686e1d225bfcc7954a1b0f1c"],
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );
//       if (res.status === 201) {
//         alert("Notification created successfully!");
//         setFormData({
//           title: "",
//           message: "",
//           date: "",
//           time: "",
//         });
//         setSelectedEvent(null);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const toggleUserSelection = (id) => {
//     setUsers(
//       users.map((user) =>
//         user.id === id ? { ...user, selected: !user.selected } : user
//       )
//     );
//   };

//   const toggleSelectAll = (e) => {
//     const isChecked = e.target.checked;
//     setUsers(users.map((user) => ({ ...user, selected: isChecked })));
//   };

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case "active":
//         return <ActiveIcon className="text-success" />;
//       case "blocked":
//         return <BlockedIcon className="text-danger" />;
//       case "unverified":
//         return <UnverifiedIcon className="text-warning" />;
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="container py-4" style={{ maxWidth: "1200px" }}>
//       <h2 className="mb-4 fw-bold" style={{ color: "var(--secondary)" }}>
//         Create New Notification
//       </h2>

//       {/* Notification Type Selector */}
//       <div className="mb-4">
//         <label className="form-label small text-muted mb-2">
//           SELECT NOTIFICATION TYPE
//         </label>
//         <select
//           className="form-select"
//           value={notificationType}
//           onChange={(e) => {
//             const selected = e.target.value;
//             setNotificationType(selected);
//             setSelectedTemplate(null);
//             setSelectedEvent(null);
//             setFormData({
//               title: "",
//               message: "",
//               date: "",
//               time: "",
//             });
//           }}
//           style={{ borderColor: "var(--primary)", maxWidth: "300px" }}
//         >
//           <option value="" disabled selected hidden>
//             Select Notification Type...
//           </option>
//           <option value="quote">Inspirational Quote</option>
//           <option value="event">Upcoming Event Invitation</option>
//         </select>
//       </div>

//       {/* Template Selection */}
//       {notificationType && (
//         <div className="mb-4">
//           <label className="form-label small text-muted mb-2">
//             CHOOSE A TEMPLATE
//           </label>
//           <div className="row">
//             {templates[notificationType].map((template) => (
//               <div
//                 key={template.id}
//                 onClick={() => setSelectedTemplate(template)}
//                 className={`col-3 mx-2${
//                   selectedTemplate?.id === template.id
//                     ? "border-primary border-2 shadow-sm"
//                     : "border"
//                 }`}
//               >
//                 <img
//                   src={template.image}
//                   alt={template.name}
//                   className="w-100 h-100 object-fit-cover"
//                   style={{ maxHeight: "150px", cursor: "pointer" }}
//                 />

//                 {selectedTemplate?.id === template.id && (
//                   <div className="position-absolute top-0 end-0 m-2 bg-primary rounded-circle p-1">
//                     <svg
//                       width="20"
//                       height="20"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       <path
//                         d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z"
//                         fill="white"
//                       />
//                     </svg>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Event Selection and Preview */}
//       {selectedTemplate && notificationType === "event" && (
//         <>
//           <div className="row g-4">
//             {/* Event Selection Column */}
//             <div className="col-lg-6">
//               <div className="card border-0 shadow-sm">
//                 <div className="card-body p-4">
//                   <h5
//                     className="mb-4 fw-medium"
//                     style={{ color: "var(--secondary)" }}
//                   >
//                     Select Event
//                   </h5>
//                   {loadingEvents ? (
//                     <div className="text-center">
//                       <div
//                         className="spinner-border text-primary"
//                         role="status"
//                       >
//                         <span className="visually-hidden">Loading...</span>
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="mb-3">
//                       <label className="form-label">Upcoming Events</label>
//                       <select
//                         className="form-select"
//                         value={selectedEvent?._id || ""}
//                         onChange={handleEventChange}
//                         style={{ borderColor: "var(--secondary)" }}
//                       >
//                         <option value="">Select an event...</option>
//                         {upcomingEvents.map((event) => (
//                           <option key={event._id} value={event._id}>
//                             {event.eventName || event.title} - {event.date} at{" "}
//                             {event.time}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Preview Column */}
//             <div className="col-lg-6">
//               <EmailTemplateViewer
//                 templateId={selectedTemplate?.id}
//                 title={formData.title}
//                 message={formData.message}
//                 date={formData.date}
//                 time={formData.time}
//                 className={formData.className}
//                 instructor={formData.instructor}
//                 location={formData.location}
//                 // sessions={formData.sessions}
//               />
//             </div>
//           </div>

//           {/* Recipient Selection */}
//           {/* <div className="card border-0 shadow-sm mt-4">
//             <div className="card-body p-4">
//               <h5
//                 className="mb-4 fw-medium"
//                 style={{ color: "var(--secondary)" }}
//               >
//                 Recipient Selection
//               </h5>
//               <div className="row mb-4">
//                 <div className="col-md-6">
//                   <label className="form-label">Recipient Type</label>
//                   <select
//                     className="form-select"
//                     value={recipientType}
//                     onChange={(e) => setRecipientType(e.target.value)}
//                     style={{ borderColor: "var(--secondary)" }}
//                   >
//                     <option value="user">User</option>
//                     <option value="mentor">Mentor</option>
//                     <option value="instructor">Instructor</option>
//                   </select>
//                 </div>
//                 <div className="col-md-6">
//                   <label className="form-label">Location</label>
//                   <select
//                     className="form-select"
//                     value={location}
//                     onChange={(e) => setLocation(e.target.value)}
//                     style={{ borderColor: "var(--secondary)" }}
//                   >
//                     <option value="">All Locations</option>
//                     <option value="delhi">Delhi</option>
//                     <option value="mumbai">Mumbai</option>
//                     <option value="bangalore">Bangalore</option>
//                     <option value="hyderabad">Hyderabad</option>
//                   </select>
//                 </div>
//               </div>
//             </div>
//           </div> */}
//            <div className="card border-0 shadow-sm mt-4">
//       <div className="card-body p-4">
//         <h5 className="mb-4 fw-medium" style={{ color: "var(--secondary)" }}>
//           Recipient Selection
//         </h5>
//         <div className="row mb-4">
//           <div className="col-md-6">
//             <label className="form-label">Recipient Type</label>
//             <select
//               className="form-select"
//               value={recipientType}
//               onChange={(e) => setRecipientType(e.target.value)}
//               style={{ borderColor: "var(--secondary)" }}
//             >
//               <option value="user">User</option>
//               <option value="mentor">Mentor</option>
//               <option value="instructor">Instructor</option>
//             </select>
//           </div>
//           <div className="col-md-6">
//             <label className="form-label">Location</label>
//           <select
//   className="form-select"
//   value={location}
//   onChange={(e) => setLocation(e.target.value)}
//   style={{ borderColor: "var(--secondary)" }}
// >
//   <option value="">All Locations</option>
//   {Array.isArray(locations) && locations.map((loc) => (
//     <option key={loc.id || loc._id} value={loc.name || loc.location}>
//       {loc.name || loc.location}
//     </option>
//   ))}
// </select>
//           </div>
//         </div>

//         {/* Recipients Table */}
//         {loading ? (
//           <div className="text-center py-4">
//             <div className="spinner-border text-primary" role="status">
//               <span className="visually-hidden">Loading...</span>
//             </div>
//           </div>
//         ) : (
//           <div className="mt-4">
//             <h6 className="mb-3">{recipientType.charAt(0).toUpperCase() + recipientType.slice(1)} List</h6>
//             <div className="table-responsive">
//               <table className="table table-striped table-hover">
//                 <thead>
//                   <tr>
//                     <th>ID</th>
//                     <th>Name</th>
//                     <th>Email</th>
//                     {recipientType !== 'user' && <th>Specialization</th>}
//                     <th>Location</th>
//                   </tr>
//                 </thead>
//             <tbody>
//   {Array.isArray(recipients) && recipients.length > 0 ? (
//     recipients.map((recipient, index) => (
//       <tr key={recipient.id || recipient._id || index}>
//         <td>{recipient.id || recipient._id || index + 1}</td>
//         <td>{recipient.name || recipient.fullName || 'N/A'}</td>
//         <td>{recipient.email || 'N/A'}</td>
//         {recipientType !== 'user' && (
//           <td>{recipient.specialization || recipient.expertise || 'N/A'}</td>
//         )}
//         <td>{recipient.location || 'N/A'}</td>
//       </tr>
//     ))
//   ) : (
//     <tr>
//       <td colSpan={recipientType !== 'user' ? 5 : 4} className="text-center">
//         No {recipientType}s found
//       </td>
//     </tr>
//   )}
// </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//         </>
//       )}

//       {/* For quote notifications */}
//       {selectedTemplate && notificationType === "quote" && (
//         <>
//           <div className="row g-4">
//             {/* Form Column */}
//             <div className="col-lg-6">
//               <div className="card border-0 shadow-sm">
//                 <div className="card-body p-4">
//                   <h5
//                     className="mb-4 fw-medium"
//                     style={{ color: "var(--secondary)" }}
//                   >
//                     Notification Details
//                   </h5>
//                   <form>
//                     <div className="mb-3">
//                       <label className="form-label">Title</label>
//                       <input
//                         type="text"
//                         className="form-control"
//                         name="title"
//                         value={formData.title}
//                         onChange={handleInputChange}
//                         required
//                         style={{ borderColor: "var(--secondary)" }}
//                       />
//                     </div>

//                     <div className="mb-3">
//                       <label className="form-label">Message</label>
//                       <textarea
//                         className="form-control"
//                         name="message"
//                         rows="4"
//                         value={formData.message}
//                         onChange={handleInputChange}
//                         required
//                         style={{ borderColor: "var(--secondary)" }}
//                       ></textarea>
//                     </div>
//                   </form>
//                 </div>
//               </div>
//             </div>

//             {/* Preview Column */}
//             <div className="col-lg-6">
//               <EmailTemplateViewer
//                 templateId={selectedTemplate?.id}
//                 title={formData.title}
//                 message={formData.message}
//                 date={formData.date}
//                 time={formData.time}
//               />
//             </div>
//           </div>

//           {/* Recipient Selection */}
//           <div className="card border-0 shadow-sm mt-4">
//             <div className="card-body p-4">
//               <h5
//                 className="mb-4 fw-medium"
//                 style={{ color: "var(--secondary)" }}
//               >
//                 Recipient Selection
//               </h5>
//               <div className="row mb-4">
//                 <div className="col-md-6">
//                   <label className="form-label">Recipient Type</label>
//                   <select
//                     className="form-select"
//                     value={recipientType}
//                     onChange={(e) => setRecipientType(e.target.value)}
//                     style={{ borderColor: "var(--secondary)" }}
//                   >
//                     <option value="user">User</option>
//                     <option value="mentor">Mentor</option>
//                     <option value="instructor">Instructor</option>
//                   </select>
//                 </div>
//                 <div className="col-md-6">
//                   <label className="form-label">Location</label>
//                   <select
//                     className="form-select"
//                     value={location}
//                     onChange={(e) => setLocation(e.target.value)}
//                     style={{ borderColor: "var(--secondary)" }}
//                   >
//                     <option value="">All Locations</option>
//                     <option value="delhi">Delhi</option>
//                     <option value="mumbai">Mumbai</option>
//                     <option value="bangalore">Bangalore</option>
//                     <option value="hyderabad">Hyderabad</option>
//                   </select>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </>
//       )}

//       <div className="table-responsive">
//         <table className="table table-hover">
//           <thead>
//             <tr>
//               <th>
//                 <input
//                   type="checkbox"
//                   onChange={toggleSelectAll}
//                   checked={users.every((user) => user.selected)}
//                 />
//               </th>
//               <th>Sr.</th>
//               <th>Name</th>
//               <th>Email</th>
//               <th>Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.map((user, index) => (
//               <tr key={user.id}>
//                 <td>
//                   <input
//                     type="checkbox"
//                     checked={user.selected}
//                     onChange={() => toggleUserSelection(user.id)}
//                   />
//                 </td>
//                 <td>{index + 1}</td>
//                 <td>{user.name}</td>
//                 <td>{user.email}</td>
//                 <td>
//                   {getStatusIcon(user.status)}
//                   <span className="ms-2 text-capitalize">{user.status}</span>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <button
//         type="button"
//         onClick={handleSubmit}
//         className="btn w-100 py-2 mt-3"
//         style={{
//           backgroundColor: "var(--primary)",
//           color: "white",
//           border: "none",
//         }}
//         disabled={notificationType === "event" && !selectedEvent}
//       >
//         <SendIcon className="me-2" />
//         Send Notification
//       </button>
//     </div>
//   );
// };

// export default NotificationCreator;
import React, { useState, useEffect } from "react";
import {
  ChatQuote as QuoteIcon,
  CalendarEvent as EventIcon,
  Send as SendIcon,
  CheckCircleFill as ActiveIcon,
  XCircleFill as BlockedIcon,
  QuestionCircleFill as UnverifiedIcon,
} from "react-bootstrap-icons";
import axios from "axios";
import motivationalImage4 from "./images/motivational-reminder4.jpg";
import eventImage1 from "./images/event-template1.png";
import eventImage2 from "./images/event-template2.png";
import eventImage3 from "./images/event-template3.png";
import eventImage4 from "./images/event-template4.png";
import inspirationImage1 from "./images/inspirationImage1.png";
import inspirationImage2 from "./images/inspirationImage2.png";
import inspirationImage3 from "./images/inspirationImage1.png";

import {
  eventTemplate1,
  eventTemplate2,
  eventTemplate3,
  eventTemplate4,
  reminderTemplate1,
  reminderTemplate2,
  reminderTemplate3,
  reminderTemplate4,
} from "./template";

const NotificationCreator = () => {
  const [notificationType, setNotificationType] = useState("quote");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [locations, setLocations] = useState([]);
  const [recipients, setRecipients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recipientType, setRecipientType] = useState("user");
  const [location, setLocation] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    date: "",
    time: "",
    className: "",
    instructor: "",
    location: "",
  });

  useEffect(() => {
    if (notificationType === "event") {
      fetchUpcomingEvents();
    }
  }, [notificationType]);

  // Fetch all locations when component mounts
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://98.85.246.54:5010/api/location/getAllLocations"
        );
        setLocations(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching locations:", error);
        setLocations([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLocations();
  }, []);

  // Fetch recipients based on recipientType and location
  useEffect(() => {
    const fetchRecipients = async () => {
      if (!recipientType) return;

      try {
        setLoading(true);

        // Get token from localStorage (or your preferred storage)
        const token = localStorage.getItem("adminToken"); // Adjust key if needed
        console.log(token, ".....");
        if (!token) {
          console.error("Token not found.");
          return;
        }

        let url = `http://98.85.246.54:5010/api/admin/getRegister/${recipientType}`;

        if (location) {
          url += `?location=${location}`;
        }

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const recipientsWithSelection = Array.isArray(response.data)
          ? response.data.map((recipient) => ({
              ...recipient,
              selected: false,
              status: "active", // Default status
            }))
          : [];
        setRecipients(recipientsWithSelection);
      } catch (error) {
        console.error(`Error fetching ${recipientType}s:`, error);
        setRecipients([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipients();
  }, [recipientType, location]);

  const fetchUpcomingEvents = async () => {
    try {
      setLoadingEvents(true);
      const response = await axios.get(
        "http://98.85.246.54:5010/api/AdminClasses/getAllUpcomingClasses",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setUpcomingEvents(response.data.data || []);
      setLoadingEvents(false);
    } catch (error) {
      console.error("Error fetching upcoming events:", error);
      setLoadingEvents(false);
    }
  };

  const templateMap = {
    "quote-1": reminderTemplate1,
    "quote-2": reminderTemplate2,
    "quote-3": reminderTemplate3,
    "quote-4": reminderTemplate4,
    "event-1": eventTemplate1,
    "event-2": eventTemplate2,
    "event-3": eventTemplate3,
    "event-4": eventTemplate4,
  };

  const EmailTemplateViewer = ({
    templateId,
    title,
    message,
    date,
    time,
    className,
    instructor,
    location,
  }) => {
    const templateFunction = templateMap[templateId] || reminderTemplate1;
    return (
      <div
        dangerouslySetInnerHTML={{
          __html: templateFunction({
            title,
            message,
            date,
            time,
            className,
            instructor,
            location,
          }),
        }}
      />
    );
  };

  const templates = {
    quote: [
      {
        id: "quote-1",
        name: "Daily Motivation",
        description: "Inspire students with positive quotes",
        image: inspirationImage1,
      },
      {
        id: "quote-2",
        name: "Exam Encouragement",
        description: "Boost morale before tests",
        image: inspirationImage2,
      },
      {
        id: "quote-3",
        name: "Weekly Inspiration",
        description: "Motivational quotes for the week",
        image: inspirationImage3,
      },
      {
        id: "quote-4",
        name: "Success Tips",
        description: "Tips for academic success",
        image: motivationalImage4,
      },
    ],
    event: [
      {
        id: "event-1",
        name: "Event Invitation",
        description: "Invite students to special events",
        image: eventImage1,
      },
      {
        id: "event-2",
        name: "Workshop Alert",
        description: "Announce skill-building sessions",
        image: eventImage2,
      },
      {
        id: "event-3",
        name: "Seminar Notification",
        description: "Information about upcoming seminars",
        image: eventImage3,
      },
      {
        id: "event-4",
        name: "Conference Reminder",
        description: "Reminder for important conferences",
        image: eventImage4,
      },
    ],
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEventChange = (e) => {
    const eventId = e.target.value;
    const selected = upcomingEvents.find((event) => event._id === eventId);
    setSelectedEvent(selected);

    if (selected) {
      const firstSession = selected.sessions?.[0] || {};
      const formattedDate = firstSession.date
        ? new Date(firstSession.date).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : selected.startDate
        ? new Date(selected.startDate).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "Not specified";

      const formattedTime =
        firstSession.startTime && firstSession.endTime
          ? `${firstSession.startTime} - ${firstSession.endTime}`
          : "Not specified";

      const instructorName =
        selected.Instructor?.name || "Instructor not assigned";

      const locationName =
        selected.location?.location || "Location to be announced";

      setFormData({
        title: selected.title || "Class Invitation",
        message:
          selected.theme ||
          selected.description ||
          `Join us for this special class`,
        date: formattedDate,
        time: formattedTime,
        className: selected.title || "Class details coming soon",
        instructor: instructorName,
        location: locationName,
      });
    }
  };

  const getNotificationTypeName = (type) => {
    switch (type) {
      case "quote":
        return "Inspirational Quote";
      case "event":
        return "Upcoming Event Invitation";
      default:
        return type;
    }
  };

  const getTemplateName = (templateId) => {
    const templateNumber = templateId.split("-")[1];
    return `template${templateNumber}`;
  };

  const templateFunction = templateMap[selectedTemplate?.id || "quote-1"];
  const htmlContent = templateFunction({
    title: formData.title,
    message: formData.message,
    date: formData.date,
    time: formData.time,
    className: formData.className,
    instructor: formData.instructor,
    location: formData.location,
  });

  const toggleUserSelection = (id) => {
    setRecipients(
      recipients.map((recipient) =>
        (recipient.id || recipient._id) === id
          ? { ...recipient, selected: !recipient.selected }
          : recipient
      )
    );
  };

  const toggleSelectAll = (e) => {
    const isChecked = e.target.checked;
    setRecipients(
      recipients.map((recipient) => ({
        ...recipient,
        selected: isChecked,
      }))
    );
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <ActiveIcon className="text-success" />;
      case "blocked":
        return <BlockedIcon className="text-danger" />;
      case "unverified":
        return <UnverifiedIcon className="text-warning" />;
      default:
        return null;
    }
  };

  const handleSubmit = async (e) => {
    try {
      const selectedUserIds = recipients
        .filter((recipient) => recipient.selected)
        .map((recipient) => recipient.id || recipient._id);

      if (selectedUserIds.length === 0) {
        alert("Please select at least one recipient");
        return;
      }

      const res = await axios.post(
        "http://98.85.246.54:5010/api/notification/send",
        {
          notificationType: getNotificationTypeName(notificationType),
          template: selectedTemplate
            ? getTemplateName(selectedTemplate.id)
            : "template1",
          title: `${formData?.title}`,
          message: `${formData?.message}`,
          html: htmlContent,
          users: selectedUserIds,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.status === 201) {
        alert("Notification created successfully!");
        setFormData({
          title: "",
          message: "",
          date: "",
          time: "",
        });
        setSelectedEvent(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container py-4" style={{ maxWidth: "1200px" }}>
      <h2 className="mb-4 fw-bold" style={{ color: "var(--secondary)" }}>
        Create New Notification
      </h2>

      {/* Notification Type Selector */}
      <div className="mb-4">
        <label className="form-label small text-muted mb-2">
          SELECT NOTIFICATION TYPE
        </label>
        <select
          className="form-select"
          value={notificationType}
          onChange={(e) => {
            const selected = e.target.value;
            setNotificationType(selected);
            setSelectedTemplate(null);
            setSelectedEvent(null);
            setFormData({
              title: "",
              message: "",
              date: "",
              time: "",
            });
          }}
          style={{ borderColor: "var(--primary)", maxWidth: "300px" }}
        >
          <option value="" disabled selected hidden>
            Select Notification Type...
          </option>
          <option value="quote">Inspirational Quote</option>
          <option value="event">Upcoming Event Invitation</option>
        </select>
      </div>

      {/* Template Selection */}
      {notificationType && (
        <div className="mb-4">
          <label className="form-label small text-muted mb-2">
            CHOOSE A TEMPLATE
          </label>
          <div className="row">
            {templates[notificationType].map((template) => (
              <div
                key={template.id}
                onClick={() => setSelectedTemplate(template)}
                className={`col-3 mx-2${
                  selectedTemplate?.id === template.id
                    ? "border-primary border-2 shadow-sm"
                    : "border"
                }`}
              >
                <img
                  src={template.image}
                  alt={template.name}
                  className="w-100 h-100 object-fit-cover"
                  style={{ maxHeight: "150px", cursor: "pointer" }}
                />

                {selectedTemplate?.id === template.id && (
                  <div className="position-absolute top-0 end-0 m-2 bg-primary rounded-circle p-1">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z"
                        fill="white"
                      />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Event Selection and Preview */}
      {selectedTemplate && notificationType === "event" && (
        <>
          <div className="row g-4">
            {/* Event Selection Column */}
            <div className="col-lg-6">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                  <h5
                    className="mb-4 fw-medium"
                    style={{ color: "var(--secondary)" }}
                  >
                    Select Event
                  </h5>
                  {loadingEvents ? (
                    <div className="text-center">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-3">
                      <label className="form-label">Upcoming Events</label>
                      <select
                        className="form-select"
                        value={selectedEvent?._id || ""}
                        onChange={handleEventChange}
                        style={{ borderColor: "var(--secondary)" }}
                      >
                        <option value="">Select an event...</option>
                        {upcomingEvents.map((event) => (
                          <option key={event._id} value={event._id}>
                            {event.eventName || event.title} - {event.date} at{" "}
                            {event.time}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Preview Column */}
            <div className="col-lg-6">
              <EmailTemplateViewer
                templateId={selectedTemplate?.id}
                title={formData.title}
                message={formData.message}
                date={formData.date}
                time={formData.time}
                className={formData.className}
                instructor={formData.instructor}
                location={formData.location}
              />
            </div>
          </div>
        </>
      )}

      {/* For quote notifications */}
      {selectedTemplate && notificationType === "quote" && (
        <>
          <div className="row g-4">
            {/* Form Column */}
            <div className="col-lg-6">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                  <h5
                    className="mb-4 fw-medium"
                    style={{ color: "var(--secondary)" }}
                  >
                    Notification Details
                  </h5>
                  <form>
                    <div className="mb-3">
                      <label className="form-label">Title</label>
                      <input
                        type="text"
                        className="form-control"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        style={{ borderColor: "var(--secondary)" }}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Message</label>
                      <textarea
                        className="form-control"
                        name="message"
                        rows="4"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        style={{ borderColor: "var(--secondary)" }}
                      ></textarea>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Preview Column */}
            <div className="col-lg-6">
              <EmailTemplateViewer
                templateId={selectedTemplate?.id}
                title={formData.title}
                message={formData.message}
                date={formData.date}
                time={formData.time}
              />
            </div>
          </div>
        </>
      )}

      {/* Recipient Selection */}
      <div className="card border-0 shadow-sm mt-4">
        <div className="card-body p-4">
          <h5 className="mb-4 fw-medium" style={{ color: "var(--secondary)" }}>
            Recipient Selection
          </h5>
          <div className="row mb-4">
            <div className="col-md-6">
              <label className="form-label">Recipient Type</label>
              <select
                className="form-select"
                value={recipientType}
                onChange={(e) => setRecipientType(e.target.value)}
                style={{ borderColor: "var(--secondary)" }}
              >
                <option value="user">User</option>
                <option value="mentor">Mentor</option>
                <option value="instructor">Instructor</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label">Location</label>
              <select
                className="form-select"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                style={{ borderColor: "var(--secondary)" }}
              >
                <option value="">All Locations</option>
                {Array.isArray(locations) &&
                  locations.map((loc) => (
                    <option
                      key={loc.id || loc._id}
                      value={loc.name || loc.location}
                    >
                      {loc.name || loc.location}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Recipients Table */}
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="mt-4">
              <h6 className="mb-3">
                {recipientType.charAt(0).toUpperCase() + recipientType.slice(1)}{" "}
                List
              </h6>
              <div className="table-responsive">
                <table className="table table-striped table-hover">
                  <thead>
                    <tr>
                      <th>
                        <input
                          type="checkbox"
                          onChange={toggleSelectAll}
                          checked={
                            recipients.length > 0 &&
                            recipients.every((r) => r.selected)
                          }
                        />
                      </th>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      {recipientType !== "user" && <th>Specialization</th>}
                      <th>Location</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recipients.length > 0 ? (
                      recipients.map((recipient, index) => (
                        <tr key={recipient.id || recipient._id || index}>
                          <td>
                            <input
                              type="checkbox"
                              checked={recipient.selected || false}
                              onChange={() =>
                                toggleUserSelection(
                                  recipient.id || recipient._id
                                )
                              }
                            />
                          </td>
                          <td>{recipient.id || recipient._id || index + 1}</td>
                          <td>
                            {recipient.name || recipient.fullName || "N/A"}
                          </td>
                          <td>{recipient.email || "N/A"}</td>
                          {recipientType !== "user" && (
                            <td>
                              {recipient.specialization ||
                                recipient.expertise ||
                                "N/A"}
                            </td>
                          )}
                          <td>{recipient.location || "N/A"}</td>
                          <td>
                            {getStatusIcon(recipient.status || "active")}
                            <span className="ms-2 text-capitalize">
                              {recipient.status || "active"}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={recipientType !== "user" ? 7 : 6}
                          className="text-center"
                        >
                          No {recipientType}s found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        className="btn w-100 py-2 mt-3"
        style={{
          backgroundColor: "var(--primary)",
          color: "white",
          border: "none",
        }}
        disabled={notificationType === "event" && !selectedEvent}
      >
        <SendIcon className="me-2" />
        Send Notification
      </button>
    </div>
  );
};

export default NotificationCreator;
