import React, { useState } from "react";
import {
  JournalBookmark as ClassIcon,
  ChatQuote as QuoteIcon,
  CalendarEvent as EventIcon,
  Book as BookIcon,
  Person as PersonIcon,
  Calendar as DateIcon,
  Clock as TimeIcon,
  Send as SendIcon,
} from "react-bootstrap-icons";

// Sample template images (replace with your actual image paths)
import classTemplateImg from "./images/class-template.jpg";
import motivationalImage from "./images/motivational-reminder1.jpg";
// import motivationalImage3 from "./images/motivational-reminder2.jpg";
import motivationalImage3 from '.././././../management/Notification/images/motivational-reminder2.jpg'
import motivationalImage2 from "./images/motivational-reminder3.jpg";
// import motivationalImage3 from "./images/motivational-reminder4.jpg";
import eventTemplateImg from "./images/event-template.jpg";
import { reminderTemplate1 } from "./template";
const NotificationCreator = () => {
  const [notificationType, setNotificationType] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    date: "",
    time: "",
    className: "",
    instructor: "",
  });

  const EmailTemplateViewer = () => {
    return (
      <div
        dangerouslySetInnerHTML={{ __html: reminderTemplate1 }}
      />
    );
  };

  const templates = {
    class: [
      {
        id: "class-1",
        name: "Class Reminder",
        description: "Notify students about upcoming classes",
        image: classTemplateImg,
      },
      {
        id: "class-2",
        name: "Assignment Alert",
        description: "Reminder for assignment deadlines",
        image: classTemplateImg,
      },
    ],
    quote: [
      {
        id: "quote-1",
        name: "Daily Motivation",
        description: "Inspire students with positive quotes",
        image: motivationalImage,
      },
      {
        id: "quote-2",
        name: "Exam Encouragement",
        description: "Boost morale before tests",
        image: motivationalImage3,
      },
       {
        id: "quote-3",
        name: "Exam Encouragement",
        description: "Boost morale before tests",
        image: motivationalImage2,
      },
         {
        id: "quote-3",
        name: "Exam Encouragement",
        description: "Boost morale before tests",
        image: motivationalImage2,
      },
    ],
    event: [
      {
        id: "event-1",
        name: "Event Invitation",
        description: "Invite students to special events",
        image: eventTemplateImg,
      },
      {
        id: "event-2",
        name: "Workshop Alert",
        description: "Announce skill-building sessions",
        image: eventTemplateImg,
      },
    ],
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Notification created:", {
      type: notificationType,
      template: selectedTemplate,
      ...formData,
    });
    alert("Notification created successfully!");
  };

  const getIcon = () => {
    switch (notificationType) {
      case "class":
        return <ClassIcon className="text-white me-2" />;
      case "quote":
        return <QuoteIcon className="text-white me-2" />;
      case "event":
        return <EventIcon className="text-white me-2" />;
      default:
        return null;
    }
  };

  return (
    <div className="container py-4" style={{ maxWidth: "1200px" }}>
      <h2 className="mb-4 fw-bold" style={{ color: "var(--secondary)" }}>
        Create New Notification
      </h2>

      {/* Notification Type Selector */}
      {/* Notification Type Selector as Dropdown */}
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
      setFormData({
        title: "",
        message: "",
        date: "",
        time: "",
        className: "",
        instructor: "",
      });
    }}
    style={{ borderColor: "var(--primary)", maxWidth: "300px" }}
  >
    <option value="" disabled selected hidden>
      Select Notification Type...
    </option>
    <option value="class">Class Reminder</option>
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
          <div className="d-flex gap-3 flex-wrap">
            {templates[notificationType].map((template) => (
              <div
                key={template.id}
                onClick={() => setSelectedTemplate(template)}
                className={`position-relative overflow-hidden rounded-3 ${
                  selectedTemplate?.id === template.id
                    ? "border-primary border-2 shadow-sm"
                    : "border"
                }`}
                style={{
                  width: "280px",
                  height: "180px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                <img
                  src={template.image}
                  alt={template.name}
                  className="w-100 h-100 object-fit-cover"
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

      {/* Form and Preview */}
      {selectedTemplate && (
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
                <form onSubmit={handleSubmit}>
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

                  {(notificationType === "class" ||
                    notificationType === "event") && (
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">Date</label>
                        <input
                          type="date"
                          className="form-control"
                          name="date"
                          value={formData.date}
                          onChange={handleInputChange}
                          required
                          style={{ borderColor: "var(--secondary)" }}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Time</label>
                        <input
                          type="time"
                          className="form-control"
                          name="time"
                          value={formData.time}
                          onChange={handleInputChange}
                          required
                          style={{ borderColor: "var(--secondary)" }}
                        />
                      </div>
                    </div>
                  )}

                  {notificationType === "class" && (
                    <>
                      <div className="mb-3">
                        <label className="form-label">Class Name</label>
                        <div className="input-group">
                          <span
                            className="input-group-text"
                            style={{
                              backgroundColor: "var(--accent)",
                              borderColor: "var(--secondary)",
                            }}
                          >
                            <BookIcon style={{ color: "var(--primary)" }} />
                          </span>
                          <input
                            type="text"
                            className="form-control"
                            name="className"
                            value={formData.className}
                            onChange={handleInputChange}
                            required
                            style={{ borderColor: "var(--secondary)" }}
                          />
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Instructor</label>
                        <div className="input-group">
                          <span
                            className="input-group-text"
                            style={{
                              backgroundColor: "var(--accent)",
                              borderColor: "var(--secondary)",
                            }}
                          >
                            <PersonIcon style={{ color: "var(--primary)" }} />
                          </span>
                          <input
                            type="text"
                            className="form-control"
                            name="instructor"
                            value={formData.instructor}
                            onChange={handleInputChange}
                            required
                            style={{ borderColor: "var(--secondary)" }}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <button
                    type="submit"
                    className="btn w-100 py-2 mt-3"
                    style={{
                      backgroundColor: "var(--primary)",
                      color: "white",
                      border: "none",
                    }}
                  >
                    <SendIcon className="me-2" />
                    Send Notification
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Preview Column */}
          <div className="col-lg-6">
          
            <EmailTemplateViewer/>

          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCreator;
