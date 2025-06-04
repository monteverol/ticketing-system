// controllers/analyticsController.js
import { sequelize, Ticket, User } from '../models/index.js';
import { QueryTypes } from 'sequelize';

// map your DB statuses to human labels + chart colors
const STATUS_META = {
  pending:        { label: 'Open',         color: '#ef4444' },
  processing:     { label: 'In Progress',  color: '#f59e0b' },
  resolved:       { label: 'Resolved',     color: '#10b981' },
  unresolved:     { label: 'Closed',       color: '#6b7280' },
  pending_approval: { label: 'Pending Approval', color: '#ef4444' },
  viewed:         { label: 'Viewed',       color: '#3b82f6' },
};

export const getDepartmentAnalytics = async (req, res) => {
  try {
    // 1) Total tickets
    const totalRow = await sequelize.query(
      `SELECT COUNT(*)::int AS count FROM tickets`,
      { type: QueryTypes.SELECT }
    );
    const total = totalRow[0].count;

    // 2) By status
    const rawStatus = await sequelize.query(
      `SELECT status, COUNT(*)::int AS count
         FROM tickets
        GROUP BY status`,
      { type: QueryTypes.SELECT }
    );
    const status = rawStatus.map(r => {
      const meta = STATUS_META[r.status] || { label: r.status, color: '#6b7280' };
      return { status: meta.label, count: r.count, color: meta.color };
    });

    // 3) By department + staff count
    const rawDept = await sequelize.query(
      `SELECT responding_department AS department, COUNT(*)::int AS count
         FROM tickets
        GROUP BY responding_department`,
      { type: QueryTypes.SELECT }
    );
    const rawStaff = await sequelize.query(
      `SELECT department, COUNT(*)::int AS staff
         FROM users
        GROUP BY department`,
      { type: QueryTypes.SELECT }
    );
    const department = rawDept.map(d => {
      const staffRec = rawStaff.find(s => s.department === d.department);
      return {
        department: d.department,
        count: d.count,
        staff: staffRec ? staffRec.staff : 0
      };
    });

    // 4) Trends for last 6 months
    const rawTrends = await sequelize.query(
      `SELECT
         to_char(date_trunc('month',"createdAt"), 'Mon') AS month,
         COUNT(*)::int AS tickets,
         SUM( (status='resolved')::int )::int AS resolved
       FROM tickets
       WHERE "createdAt" >= date_trunc('month', CURRENT_DATE) - INTERVAL '5 months'
       GROUP BY date_trunc('month',"createdAt")
       ORDER BY date_trunc('month',"createdAt")`,
      { type: QueryTypes.SELECT }
    );
    const trends = rawTrends.map(r => ({
      month:    r.month,
      tickets:  r.tickets,
      resolved: r.resolved
    }));

    // 5) Metrics: avg resolution time, satisfaction rate, staff usage
    const avgRow = await sequelize.query(
      `SELECT AVG(EXTRACT(EPOCH FROM ("updatedAt"-"createdAt"))/3600)::numeric(10,1) AS avg_hours
         FROM tickets
        WHERE status='resolved'`,
      { type: QueryTypes.SELECT }
    );
    const avgResolutionTime = `${avgRow[0].avg_hours} hours`;

    const resolvedCount = rawStatus.find(r => r.status === 'resolved')?.count || 0;
    const satisfactionRate = `${((resolvedCount / total)*100).toFixed(1)}%`;

    const activeStaffRow = await sequelize.query(
      `SELECT COUNT(DISTINCT user_id)::int AS count FROM tickets`,
      { type: QueryTypes.SELECT }
    );
    const totalStaffRow = await sequelize.query(
      `SELECT COUNT(*)::int AS count FROM users`,
      { type: QueryTypes.SELECT }
    );
    const metrics = {
      avgResolutionTime,
      satisfactionRate,
      activeStaff: activeStaffRow[0].count,
      totalStaff:  totalStaffRow[0].count
    };

    return res.json({ total, status, department, trends, metrics });
  } catch (err) {
    console.error("Analytics fetch failed:", err);
    return res.status(500).json({ error: "Failed to fetch analytics" });
  }
};
