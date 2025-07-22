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
  classTemplate1,
  classTemplate2,
  classTemplate3,
  classTemplate4,
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
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    date: "",
    time: "",
    className: "",
    instructor: "",
  });
  const [recipientType, setRecipientType] = useState("user");
  const [location, setLocation] = useState("");
  const [notificationTemplate, setNotificationTemplate] = useState(null);
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      status: "active",
      selected: false,
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      status: "active",
      selected: false,
    },
    {
      id: 3,
      name: "Bob Johnson",
      email: "bob@example.com",
      status: "blocked",
      selected: false,
    },
    {
      id: 4,
      name: "Alice Williams",
      email: "alice@example.com",
      status: "unverified",
      selected: false,
    },
    {
      id: 5,
      name: "Charlie Brown",
      email: "charlie@example.com",
      status: "active",
      selected: false,
    },
  ]);

  const templateMap = {
    "class-1": classTemplate1,
    "class-2": classTemplate2,
    "class-3": classTemplate3,
    "class-4": classTemplate4,
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
          }),
        }}
      />
    );
  };

  const templates = {
    // class: [
    //   {
    //     id: "class-1",
    //     name: "Class Reminder",
    //     description: "Notify students about upcoming classes",
    //     image: classTemplateImg,
    //   },
    //   {
    //     id: "class-2",
    //     name: "Assignment Alert",
    //     description: "Reminder for assignment deadlines",
    //     image: classTemplateImg,
    //   },
    //   {
    //     id: "class-3",
    //     name: "Assignment Alert",
    //     description: "Reminder for assignment deadlines",
    //     image: classTemplateImg,
    //   },
    //   {
    //     id: "class-4",
    //     name: "Assignment Alert",
    //     description: "Reminder for assignment deadlines",
    //     image: classTemplateImg,
    //   },
    // ],
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
        name: "Exam Encouragement",
        description: "Boost morale before tests",
        image: inspirationImage3,
      },
      {
        id: "quote-4",
        name: "Exam Encouragement",
        description: "Boost morale before tests",
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
        name: "Workshop Alert",
        description: "Announce skill-building sessions",
        image: eventImage3,
      },
      {
        id: "event-4",
        name: "Workshop Alert",
        description: "Announce skill-building sessions",
        image: eventImage4,
      },
    ],
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getNotificationTypeName = (type) => {
    switch (type) {
      case "quote":
        return "Inspirational Quote";
      case "event":
        return "Upcoming Event Invitation";
      case "class":
        return "Class Reminder";
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
  });

  const handleSubmit = async (e) => {
    try {
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
          users: ["687f3e3751c6736dcfd51067", "686e1d225bfcc7954a1b0f1c"],
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("Notification created successfully!");
    } catch (error) {
      console.log(error);
    }
  };

  const toggleUserSelection = (id) => {
    setUsers(
      users.map((user) =>
        user.id === id ? { ...user, selected: !user.selected } : user
      )
    );
  };

  const toggleSelectAll = (e) => {
    const isChecked = e.target.checked;
    setUsers(users.map((user) => ({ ...user, selected: isChecked })));
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
          {/* <option value="class">Class Reminder</option> */}
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

      {/* Form and Preview */}
      {selectedTemplate && (
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
                className={formData.className}
                instructor={formData.instructor}
              />
            </div>
          </div>

          {/* Recipient Selection */}
          <div className="card border-0 shadow-sm mt-4">
            <div className="card-body p-4">
              <h5
                className="mb-4 fw-medium"
                style={{ color: "var(--secondary)" }}
              >
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
                    <option value="delhi">Delhi</option>
                    <option value="mumbai">Mumbai</option>
                    <option value="bangalore">Bangalore</option>
                    <option value="hyderabad">Hyderabad</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  onChange={toggleSelectAll}
                  checked={users.every((user) => user.selected)}
                />
              </th>
              <th>Sr.</th>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={user.selected}
                    onChange={() => toggleUserSelection(user.id)}
                  />
                </td>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  {getStatusIcon(user.status)}
                  <span className="ms-2 text-capitalize">{user.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
      >
        <SendIcon className="me-2" />
        Send Notification
      </button>
    </div>
  );
};

export default NotificationCreator;
