import axios from "axios";

export const getCanvasCourseBySisId = async (sisId, token) => {
  const url = `https://canvas.aui.ma/api/v1/courses/sis_course_id:${sisId}`;
  const response = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
