import React, { useState, useEffect } from "react";
import {
  ChatQuote as QuoteIcon,
  CalendarEvent as EventIcon,
  Send as SendIcon,
  CheckCircleFill as ActiveIcon,
  XCircleFill as BlockedIcon,
  QuestionCircleFill as UnverifiedIcon,
  ChevronLeft,
  ChevronRight,
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
  // Color variables
  const colors = {
    primary: "#e83561",
    secondary: "#003865",
    accent: "#ffedf0",
    textPrimary: "#000000",
    success: "#28a745",
    danger: "#dc3545",
    warning: "#ffc107",
    info: "#17a2b8",
  };

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
  const [statusFilter, setStatusFilter] = useState("all");
  const [sending, setSending] = useState(false);
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
          "http://localhost:5010/api/location/getAllLocations"
        );
        setLocations(
          Array.isArray(response.data.data) ? response.data.data : []
        );
      } catch (error) {
        console.error("Error fetching locations:", error);
        setLocations([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLocations();
  }, []);

  useEffect(() => {
    const fetchRecipients = async () => {
      if (!recipientType) return;

      try {
        setLoading(true);
        const token = localStorage.getItem("adminToken");

        let url = `http://localhost:5010/api/admin/getRegister/${recipientType}`;

        // Add location filter if an event is selected and has a location
        const eventLocation = selectedEvent?.location?.location;
        if (notificationType === "event" && eventLocation) {
          url += `?location=${eventLocation}`;
        } else if (location) {
          url += `?location=${location}`;
        }

        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const users = Array.isArray(response.data.users)
          ? response.data.users
          : [];
        setRecipients(
          users.map((user) => ({
            ...user,
            selected: false,
            status: user.accountStatus || "active",
          }))
        );
      } catch (error) {
        console.error(`Error fetching ${recipientType}s:`, error);
        setRecipients([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipients();
  }, [recipientType, location, notificationType, selectedEvent]);

  const filteredRecipients = recipients.filter((recipient) => {
    // Location filter
    const locationMatch =
      !location ||
      recipient?.location?.location === location ||
      recipient.location === location;

    // Status filter
    const statusMatch =
      statusFilter === "all" || (recipient.status || "active") === statusFilter;

    return locationMatch && statusMatch;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRecipients.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredRecipients.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const fetchUpcomingEvents = async () => {
    try {
      setLoadingEvents(true);
      const response = await axios.get(
        "http://localhost:5010/api/AdminClasses/getAllUpcomingClasses",
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
        style={{
          height: "70vh", 
        }}
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

  const getLocationName = (loc) => {
    if (!loc || typeof loc !== "object") return loc || "N/A";
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
      recipients.map((recipient) => ({
        ...recipient,
        selected: filteredRecipients.some((fr) => fr._id === recipient._id)
          ? isChecked
          : recipient.selected,
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

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return colors.success;
      case "blocked":
        return colors.danger;
      case "unverified":
        return colors.warning;
      default:
        return colors.info;
    }
  };

  const handleSubmit = async (e) => {
    try {
      setSending(true);

      if (notificationType === "event" && recipientType === "mentor") {
        alert("Class invitations cannot be sent to mentors");
        return;
      }

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

      if (notificationType === "event" && selectedEvent) {
        notificationData.classId = selectedEvent._id;
      }

      const res = await axios.post(
        "http://localhost:5010/api/notification/send",
        notificationData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.status === 201) {
        alert("Notification created successfully!");
        // Reset all form states
        setFormData({
          title: "",
          message: "",
          date: "",
          time: "",
          className: "",
          instructor: "",
          location: "",
        });
        setSelectedEvent(null);
        setSelectedTemplate(null);
        setRecipients(recipients.map((r) => ({ ...r, selected: false })));
        setCurrentPage(1);
      }
    } catch (error) {
      console.log(error);
      alert(
        "Error creating notification: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="container py-4" style={{ maxWidth: "1200px" }}>
      <h2 className="mb-4 fw-bold" style={{ color: colors.secondary }}>
        Create New Notification
      </h2>

      {/* Notification Type Selector */}
      <div className="mb-4">
        <label
          className="form-label fw-bold mb-2"
          style={{ color: colors.secondary }}
        >
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
              className: "",
              instructor: "",
              location: "",
            });
          }}
          style={{
            borderColor: colors.primary,
            maxWidth: "300px",
            color: colors.textPrimary,
          }}
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
          <label
            className="form-label fw-bold mb-3"
            style={{ color: colors.secondary }}
          >
            CHOOSE A TEMPLATE
          </label>
          <div className="d-flex flex-wrap gap-3">
            {templates[notificationType].map((template) => (
              <div
                key={template.id}
                onClick={() => setSelectedTemplate(template)}
                className={`card border-2 ${
                  selectedTemplate?.id === template.id
                    ? "border-primary"
                    : "border-light"
                } shadow-sm`}
                style={{
                  width: "180px",
                  cursor: "pointer",
                  transition: "all 0.3s",
                  transform:
                    selectedTemplate?.id === template.id
                      ? "scale(1.02)"
                      : "none",
                  backgroundColor: colors.accent,
                }}
              >
                <img
                  src={template.image}
                  alt={template.name}
                  className="card-img-top"
                  style={{ height: "120px", objectFit: "cover" }}
                />
                <div className="card-body p-2">
                  <h6
                    className="card-title mb-1"
                    style={{ color: colors.textPrimary }}
                  >
                    {template.name}
                  </h6>
                  <p
                    className="card-text small"
                    style={{ color: colors.secondary }}
                  >
                    {template.description}
                  </p>
                </div>
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
              <div
                className="card border-0 shadow-sm"
                style={{ backgroundColor: colors.accent }}
              >
                <div className="card-body p-4">
                  <h5
                    className="mb-4 fw-bold"
                    style={{ color: colors.secondary }}
                  >
                    Select Event
                  </h5>
                  {loadingEvents ? (
                    <div className="text-center">
                      <div
                        className="spinner-border"
                        style={{ color: colors.primary }}
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-3">
                      <label
                        className="form-label fw-bold"
                        style={{ color: colors.secondary }}
                      >
                        Upcoming Events
                      </label>
                      <select
                        className="form-select"
                        value={selectedEvent?._id || ""}
                        onChange={handleEventChange}
                        style={{
                          borderColor: colors.secondary,
                          color: colors.textPrimary,
                        }}
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
              <div
                className="card border-0 shadow-sm"
                style={{ backgroundColor: colors.accent }}
              >
                <div className="card-body p-4">
                  <h5
                    className="mb-4 fw-bold"
                    style={{ color: colors.secondary }}
                  >
                    Notification Details
                  </h5>
                  <form>
                    <div className="mb-3">
                      <label
                        className="form-label fw-bold"
                        style={{ color: colors.secondary }}
                      >
                        Title
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        style={{
                          borderColor: colors.secondary,
                          color: colors.textPrimary,
                        }}
                      />
                    </div>

                    <div className="mb-3">
                      <label
                        className="form-label fw-bold"
                        style={{ color: colors.secondary }}
                      >
                        Message
                      </label>
                      <textarea
                        className="form-control"
                        name="message"
                        rows="4"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        style={{
                          borderColor: colors.secondary,
                          color: colors.textPrimary,
                        }}
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
      <div
        className="card border-0 shadow-sm mt-4"
        style={{ backgroundColor: colors.accent }}
      >
        <div className="card-body p-4">
          <h5 className="mb-4 fw-bold" style={{ color: colors.secondary }}>
            Recipient Selection
          </h5>

          <div className="row mb-4">
            <div className="col-md-6">
              <label
                className="form-label fw-bold"
                style={{ color: colors.secondary }}
              >
                Recipient Type
              </label>
              <div className="d-flex gap-2">
                {/* {['user', 'mentor', 'instructor'].map((type) => ( */}
                {["user", "instructor"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    className={`btn ${recipientType === type ? "active" : ""}`}
                    onClick={() => setRecipientType(type)}
                    style={{
                      textTransform: "capitalize",
                      flex: 1,
                      backgroundColor:
                        recipientType === type ? colors.primary : "transparent",
                      color:
                        recipientType === type ? "white" : colors.textPrimary,
                      border: `1px solid ${colors.primary}`,
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="col-md-3">
              <label
                className="form-label fw-bold"
                style={{ color: colors.secondary }}
              >
                Location
              </label>
              <select
                className="form-select"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                style={{
                  borderColor: colors.secondary,
                  color: colors.textPrimary,
                }}
                disabled={loading}
              >
                <option value="">All Locations</option>
                {locations.map((loc) => (
                  <option key={loc._id} value={loc.location}>
                    {loc.location}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <label
                className="form-label fw-bold"
                style={{ color: colors.secondary }}
              >
                Status
              </label>
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  borderColor: colors.secondary,
                  color: colors.textPrimary,
                }}
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="blocked">Blocked</option>
                <option value="unverified">Unverified</option>
              </select>
            </div>
          </div>

          {/* Recipients Table */}
          {loading ? (
            <div className="text-center py-4">
              <div
                className="spinner-border"
                style={{ color: colors.primary }}
                role="status"
              >
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="mt-4">
              <h6 className="mb-3 fw-bold" style={{ color: colors.secondary }}>
                {recipientType.charAt(0).toUpperCase() + recipientType.slice(1)}{" "}
                List
                {location && ` (Filtered by location: ${location})`}
              </h6>
              <div className="table-responsive">
                <table className="table table-striped table-hover">
                  <thead>
                    <tr
                      style={{
                        backgroundColor: colors.primary,
                        color: "white",
                      }}
                    >
                      <th>
                        <input
                          type="checkbox"
                          onChange={toggleSelectAll}
                          checked={
                            filteredRecipients.length > 0 &&
                            filteredRecipients.every((r) => r.selected)
                          }
                        />
                      </th>
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
                              onChange={() =>
                                toggleUserSelection(recipient._id)
                              }
                            />
                          </td>
                          <td style={{ color: colors.textPrimary }}>
                            {recipient.name || "N/A"}
                          </td>
                          <td style={{ color: colors.textPrimary }}>
                            {recipient.email || "N/A"}
                          </td>
                          {recipientType !== "user" && (
                            <td style={{ color: colors.textPrimary }}>
                              {recipient.specialization ||
                                recipient.expertise ||
                                "N/A"}
                            </td>
                          )}
                          <td style={{ color: colors.textPrimary }}>
                            {getLocationName(recipient.location)}
                          </td>
                          <td>
                            <span
                              className="badge"
                              style={{
                                backgroundColor: getStatusColor(
                                  recipient.status || "active"
                                ),
                                color: "white",
                              }}
                            >
                              {getStatusIcon(recipient.status || "active")}
                              <span className="ms-2 text-capitalize">
                                {recipient.status || "active"}
                              </span>
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={recipientType !== "user" ? 6 : 5}
                          className="text-center"
                          style={{ color: colors.textPrimary }}
                        >
                          No {recipientType}s found
                          {location ? ` in ${location}` : ""}
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
                      <li
                        className={`page-item ${
                          currentPage === 1 ? "disabled" : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => paginate(currentPage - 1)}
                          disabled={currentPage === 1}
                          style={{
                            color: colors.secondary,
                            borderColor: colors.secondary,
                          }}
                        >
                          <ChevronLeft />
                        </button>
                      </li>

                      {Array.from({ length: totalPages }, (_, i) => (
                        <li
                          key={i + 1}
                          className={`page-item ${
                            currentPage === i + 1 ? "active" : ""
                          }`}
                        >
                          <button
                            className="page-link"
                            onClick={() => paginate(i + 1)}
                            style={{
                              backgroundColor:
                                currentPage === i + 1
                                  ? colors.primary
                                  : "transparent",
                              color:
                                currentPage === i + 1
                                  ? "white"
                                  : colors.secondary,
                              borderColor: colors.secondary,
                            }}
                          >
                            {i + 1}
                          </button>
                        </li>
                      ))}

                      <li
                        className={`page-item ${
                          currentPage === totalPages ? "disabled" : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => paginate(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          style={{
                            color: colors.secondary,
                            borderColor: colors.secondary,
                          }}
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
          backgroundColor: colors.primary,
          color: "white",
          border: "none",
        }}
        disabled={(notificationType === "event" && !selectedEvent) || sending}
      >
        {sending ? (
          <span
            className="spinner-border spinner-border-sm me-2"
            role="status"
            aria-hidden="true"
          ></span>
        ) : (
          <SendIcon className="me-2" />
        )}
        Send Notification
      </button>
    </div>
  );
};

export default NotificationCreator;
