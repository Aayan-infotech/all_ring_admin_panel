
import React, { useState, useEffect } from "react";
import {
  ChatQuote as QuoteIcon,
  CalendarEvent as EventIcon,
  Send as SendIcon,
  CheckCircleFill as ActiveIcon,
  XCircleFill as BlockedIcon,
  QuestionCircleFill as UnverifiedIcon,
  ChevronLeft,
  ChevronRight
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
    const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
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

 
 useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://98.85.246.54:5010/api/location/getAllLocations"
        );
        // locations are in response.data.data
        setLocations(Array.isArray(response.data.data) ? response.data.data : []);
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

const users = Array.isArray(response.data.users) ? response.data.users : [];

const recipientsWithSelection = users.map((recipient) => ({
  ...recipient,
  selected: false,
  status: recipient.accountStatus || "active", // You can also use user_status here
}));

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

  // Filter recipients based on selected location
// Safe filtering
const filteredRecipients = recipients.filter(recipient => {
  if (!location) return true;
  
  const recipientLocation = recipient?.location;
  if (!recipientLocation) return false;
  
  if (typeof recipientLocation === 'object') {
    return recipientLocation?.location === location;
  }
  
  return recipientLocation === location;
});

// Pagination logic
const indexOfLastItem = currentPage * itemsPerPage;
const indexOfFirstItem = indexOfLastItem - itemsPerPage;
const currentItems = filteredRecipients.slice(indexOfFirstItem, indexOfLastItem);
const totalPages = Math.ceil(filteredRecipients.length / itemsPerPage);


  const paginate = (pageNumber) => setCurrentPage(pageNumber);
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
// Safely handle location rendering
const getLocationName = (loc) => {
  if (!loc || typeof loc !== 'object') return loc || "N/A";
  return loc.location || "N/A";
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
      recipients.map(recipient => ({
        ...recipient,
        selected: filteredRecipients.some(fr => fr._id === recipient._id) ? isChecked : recipient.selected
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

    const notificationData = {
      notificationType: getNotificationTypeName(notificationType),
      template: selectedTemplate
        ? getTemplateName(selectedTemplate.id)
        : "template1",
      title: formData?.title,
      message: formData?.message,
      html: htmlContent,
      users: selectedUserIds,
    };

    // Add classId if this is an event notification
    if (notificationType === "event" && selectedEvent) {
      notificationData.classId = selectedEvent._id;
    }

    const res = await axios.post(
      "http://98.85.246.54:5010/api/notification/send",
      notificationData,
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
    alert("Error creating notification: " + (error.response?.data?.message || error.message));
  }
};
  // const handleSubmit = async (e) => {
  //   try {
  //     const selectedUserIds = recipients
  //       .filter((recipient) => recipient.selected)
  //       .map((recipient) => recipient.id || recipient._id);

  //     if (selectedUserIds.length === 0) {
  //       alert("Please select at least one recipient");
  //       return;
  //     }

  //     const res = await axios.post(
  //       "http://98.85.246.54:5010/api/notification/send",
  //       {
  //         notificationType: getNotificationTypeName(notificationType),
  //         template: selectedTemplate
  //           ? getTemplateName(selectedTemplate.id)
  //           : "template1",
  //         title: `${formData?.title}`,
  //         message: `${formData?.message}`,
  //         html: htmlContent,
  //         users: selectedUserIds,
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("token")}`,
  //         },
  //       }
  //     );
  //     if (res.status === 201) {
  //       alert("Notification created successfully!");
  //       setFormData({
  //         title: "",
  //         message: "",
  //         date: "",
  //         time: "",
  //       });
  //       setSelectedEvent(null);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

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
          {/* <div className="row mb-4">
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
        disabled={loading}
      >
        <option value="">All Locations</option>
        {locations.map((loc) => (
          <option key={loc._id} value={loc.location}>
            {loc.location}
          </option>
        ))}
      </select>
      {loading && <p>Loading locations...</p>}
    </div>
          </div> */}
<div className="row mb-4">
  <div className="col-md-6">
    <label className="form-label">Recipient Type</label>
    <div className="d-flex gap-2">
      {['user', 'mentor', 'instructor'].map((type) => (
        <button
          key={type}
          type="button"
          className={`btn ${recipientType === type ? 'active-recipient' : 'inactive-recipient'}`}
          onClick={() => setRecipientType(type)}
          style={{
            textTransform: 'capitalize',
            flex: 1,
          }}
        >
          {type}
        </button>
      ))}
    </div>
  </div>
  
  <div className="col-md-6">
    <label className="form-label">Location</label>
    <select
      className="form-select"
      value={location}
      onChange={(e) => setLocation(e.target.value)}
      style={{ borderColor: "var(--secondary)" }}
      disabled={loading}
    >
      <option value="">All Locations</option>
      {locations.map((loc) => (
        <option key={loc._id} value={loc.location}>
          {loc.location}
        </option>
      ))}
    </select>
    {loading && <p>Loading locations...</p>}
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
    filteredRecipients.length > 0 &&
    filteredRecipients.every(r => r.selected)
  }
/>
                      </th>
                      {/* <th>ID</th> */}
                      <th>Name</th>
                      <th>Email</th>
                      {recipientType !== "user" && <th>Specialization</th>}
                      <th>Location</th>
                      <th>Status</th>
                    </tr>
                  </thead>

<tbody>
  {currentItems.length > 0 ? (
    currentItems.map((recipient, index) => (
      <tr key={recipient._id || index}>
        <td>
          <input
            type="checkbox"
            checked={recipient.selected || false}
            onChange={() => toggleUserSelection(recipient._id)}
          />
        </td>
        <td>{recipient.name || "N/A"}</td>
        <td>{recipient.email || "N/A"}</td>
        {recipientType !== "user" && (
          <td>{recipient.specialization || recipient.expertise || "N/A"}</td>
        )}
        <td>{getLocationName(recipient.location)}</td>
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
    <td colSpan={recipientType !== "user" ? 6 : 5} className="text-center">
  No {recipientType}s found{location ? ` in ${location}` : ''}
</td>
    </tr>
  )}
</tbody>

                </table>
              </div>
               {filteredRecipients.length > itemsPerPage && (
        <div className="d-flex justify-content-center mt-3">
          <nav aria-label="Page navigation">
            <ul className="pagination">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft />
                </button>
              </li>
              
              {Array.from({ length: totalPages }, (_, i) => (
                <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => paginate(i + 1)}
                    style={{
                      backgroundColor: currentPage === i + 1 ? 'var(--primary)' : '',
                      color: currentPage === i + 1 ? 'white' : 'var(--secondary)'
                    }}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}
              
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight />
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}
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
