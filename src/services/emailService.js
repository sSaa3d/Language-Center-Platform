import transporter from "../config/email.js";

export const sendEnrollmentEmail = async (studentData, courseData) => {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: "S.Eladdouli@aui.ma",
    subject: `📝 New Enrollment Request: ${studentData.firstName} ${studentData.lastName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">📝 New Enrollment Request</h1>
          <p style="font-size: 18px; margin: 10px 0;">A new student has submitted an enrollment request</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin-top: 20px;">
          <h2 style="color: #28a745; margin-top: 0;">👤 Student Information</h2>
          <div style="background: white; padding: 20px; border-radius: 6px; border-left: 4px solid #28a745;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
              <div>
                <p><strong>Name:</strong> ${studentData.firstName} ${
      studentData.lastName
    }</p>
                <p><strong>Email:</strong> ${studentData.email}</p>
                <p><strong>Phone:</strong> ${studentData.phone}</p>
              </div>
              <div>
                <p><strong>Age:</strong> ${studentData.age}</p>
                <p><strong>Level:</strong> ${studentData.studentLevel}</p>
                <p><strong>Comment:</strong> ${studentData.comment || "—"}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin-top: 20px;">
          <h2 style="color: #007bff; margin-top: 0;">📚 Course Information</h2>
          <div style="background: white; padding: 20px; border-radius: 6px; border-left: 4px solid #007bff;">
            <h3 style="margin-top: 0; color: #333;">${courseData?.title}</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
              <div>
                <p><strong>Level:</strong> ${courseData?.level}</p>
                <p><strong>Instructor:</strong> ${
                  courseData?.instructor || "TBA"
                }</p>
                <p><strong>Term:</strong> ${courseData?.term} ${
      courseData?.year
    }</p>
              </div>
              <div>
                <p><strong>Duration:</strong> ${courseData?.duration}</p>
                <p><strong>Location:</strong> ${
                  courseData?.location || "TBA"
                }</p>
                <p><strong>Meeting Time:</strong> ${
                  courseData?.meetingTime || "TBA"
                }</p>
              </div>
            </div>
          </div>
        </div>
        
        <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin-top: 20px; border-left: 4px solid #28a745;">
          <h3 style="color: #28a745; margin-top: 0;">⚡ Quick Action</h3>
          <p style="color: #555; margin-bottom: 15px;">
            Review and manage this enrollment request from the admin dashboard.
          </p>
          <a href="${
            process.env.FRONTEND_URL || "http://localhost:8080"
          }/admin/requests" 
             target="_blank" 
             style="display: inline-block; background: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
            📋 View All Requests
          </a>
        </div>
        
        <div style="text-align: center; margin-top: 30px; color: #666; font-size: 14px;">
          <p>Best regards,<br>Language Center</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(
      `Enrollment email sent to S.Eladdouli@aui.ma for ${studentData.firstName} ${studentData.lastName}`
    );
    return true;
  } catch (emailErr) {
    console.error("Failed to send enrollment email:", emailErr);
    return false;
  }
};

// Send approval notification to student
export const sendApprovalEmail = async (
  requestData,
  courseData,
  comment = ""
) => {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: requestData.email,
    subject: `🎉 Enrollment Approved: ${courseData.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">🎉 Congratulations!</h1>
          <p style="font-size: 18px; margin: 10px 0;">
            ${
              comment
                ? '<span style="color:#007bff;font-weight:bold;">You were assigned to a different course</span><br/>'
                : ""
            }
            Your enrollment request has been approved!
          </p>
        </div>
        
        <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin-top: 20px;">
          <h2 style="color: #28a745; margin-top: 0;">📚 Course Details</h2>
          <div style="background: white; padding: 20px; border-radius: 6px; border-left: 4px solid #28a745;">
            <h3 style="margin-top: 0; color: #333;">${courseData.title}</h3>
            <p><strong>Level:</strong> ${courseData.level}</p>
            <p><strong>Duration:</strong> ${courseData.duration}</p>
            <p><strong>Term:</strong> ${courseData.term} ${courseData.year}</p>
            <p><strong>Start Date:</strong> ${courseData.startDate}</p>
            <p><strong>End Date:</strong> ${courseData.endDate}</p>
            <p><strong>Location:</strong> ${courseData.location || "TBA"}</p>
            <p><strong>Meeting Time:</strong> ${
              courseData.meetingTime || "TBA"
            }</p>
            ${
              courseData.instructor
                ? `<p><strong>Instructor:</strong> ${courseData.instructor}</p>`
                : ""
            }
          </div>
        </div>
        ${
          comment
            ? `
        <div style="background: #f0f4ff; padding: 20px; border-radius: 8px; margin-top: 20px; border-left: 4px solid #007bff;">
          <h3 style="color: #007bff; margin-top: 0;">Comment</h3>
          <p style="color: #333;">${comment}</p>
        </div>
        `
            : ""
        }
        <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin-top: 20px; border-left: 4px solid #28a745;">
          <h3 style="color: #28a745; margin-top: 0;">✅ What's Next?</h3>
          <ul style="color: #555;">
            <li>You are now officially enrolled in the course</li>
            <li>Check your email for any additional course materials</li>
            <li>Prepare for the course start date: <strong>${
              courseData.startDate
            }</strong></li>
            <li>If you have any questions, please contact the course instructor</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin-top: 30px; color: #666; font-size: 14px;">
          <p>Best regards,<br>Language Center</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(
      `Approval email sent to ${requestData.email} for course ${courseData.title}`
    );
    return true;
  } catch (emailErr) {
    console.error("Failed to send approval email:", emailErr);
    return false;
  }
};

// Send rejection notification to student
export const sendRejectionEmail = async (requestData, courseData) => {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: requestData.email,
    subject: `📋 Enrollment Update: ${courseData.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); color: white; padding: 30px; border-radius: 10px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">📋 Enrollment Update</h1>
          <p style="font-size: 18px; margin: 10px 0;">Your enrollment request has been reviewed</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin-top: 20px;">
          <h2 style="color: #dc3545; margin-top: 0;">📚 Course Information</h2>
          <div style="background: white; padding: 20px; border-radius: 6px; border-left: 4px solid #dc3545;">
            <h3 style="margin-top: 0; color: #333;">${courseData.title}</h3>
            <p><strong>Level:</strong> ${courseData.level}</p>
            <p><strong>Duration:</strong> ${courseData.duration}</p>
            <p><strong>Term:</strong> ${courseData.term} ${courseData.year}</p>
          </div>
        </div>
        
        <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin-top: 20px; border-left: 4px solid #ffc107;">
          <h3 style="color: #856404; margin-top: 0;">⚠️ Status Update</h3>
          <p style="color: #856404; margin-bottom: 15px;">
            Unfortunately, your enrollment request for <strong>${courseData.title}</strong> has been rejected.
          </p>
          <p style="color: #856404;">
            This could be due to various reasons such as course capacity, level mismatch, or other administrative considerations.
          </p>
        </div>
        
        <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin-top: 20px; border-left: 4px solid #28a745;">
          <h3 style="color: #28a745; margin-top: 0;">💡 What You Can Do</h3>
          <ul style="color: #555;">
            <li>Check other available courses that match your level</li>
            <li>Consider courses with different schedules or locations</li>
            <li>Contact us if you have any questions about the decision</li>
            <li>You can submit new enrollment requests for other courses</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin-top: 30px; color: #666; font-size: 14px;">
          <p>Best regards,<br>Language Center</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(
      `Rejection email sent to ${requestData.email} for course ${courseData.title}`
    );
    return true;
  } catch (emailErr) {
    console.error("Failed to send rejection email:", emailErr);
    return false;
  }
};
