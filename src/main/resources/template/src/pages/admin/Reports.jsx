import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function Reports() {
  const [report, setReport] = useState(null);

  useEffect(() => {
    api.get("/api/analytics/admin").then(res => setReport(res.data));
  }, []);

  if (!report) return null;

  return (
    <div>
      <h2>📊 Reports</h2>
      <p>Total Revenue: ₹{report.revenue}</p>
      <p>Total Bookings: {report.bookings}</p>
    </div>
  );
}
