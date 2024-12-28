const { promisePool } = require('../config/database1');

class Appointment {
  static async create(appointmentData) {
    try {
      const { name, email, phone, date, time, service, notes } = appointmentData;
      
      // Convert appointment_time from 12-hour format to 24-hour format
    // const convertedTime = convertTo24Hour(time);

      const [result] = await promisePool.query(
        `INSERT INTO appointments 
         (name, email, phone, appointment_date, appointment_time, service, notes) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [name, email, phone, date, time, service, notes]
      );
      
      return { id: result.insertId, ...appointmentData };
    } catch (error) {
      throw new Error(`Error creating appointment: ${error.message}`);
    }
  }

  // Function to convert 12-hour time format to 24-hour format
  static convertTo24Hour(time) {
  const [timePart, modifier] = time.split(' ');
  let [hours, minutes] = timePart.split(':');

  if (modifier === 'PM' && hours !== '12') {
    hours = parseInt(hours, 10) + 12;
  }
  if (modifier === 'AM' && hours === '12') {
    hours = '00';
  }

  return `${hours}:${minutes}:00`; // Return in HH:MM:SS format
  }

  static async findAll() {
    try {
      const [rows] = await promisePool.query(
        'SELECT * FROM appointments ORDER BY appointment_date, appointment_time'
      );
      return rows;
    } catch (error) {
      throw new Error(`Error fetching appointments: ${error.message}`);
    }
  }

  static async findById(id) {
    try {
      const [rows] = await promisePool.query(
        'SELECT * FROM appointments WHERE id = ?',
        [id]
      );
      return rows[0];
    } catch (error) {
      throw new Error(`Error fetching appointment: ${error.message}`);
    }
  }

  static async findByDate(date) {
    try {
      const [rows] = await promisePool.query(
        'SELECT * FROM appointments WHERE appointment_date = ?',
        [date]
      );
      return rows;
    } catch (error) {
      throw new Error(`Error fetching appointments by date: ${error.message}`);
    }
  }

  static async getAvailableSlots(date) {
    try {
      const [bookedSlots] = await promisePool.query(
        'SELECT appointment_time FROM appointments WHERE appointment_date = ?',
        [date]
      );

      // Define all possible time slots
      const allTimeSlots = [
        '09:00:00', '10:00:00', '11:00:00',
        '14:00:00', '15:00:00', '16:00:00'
      ];

      // Filter out booked slots
      const bookedTimes = bookedSlots.map(slot => slot.appointment_time.toString());
      return allTimeSlots.filter(slot => !bookedTimes.includes(slot));
    } catch (error) {
      throw new Error(`Error fetching available slots: ${error.message}`);
    }
  }

  static async update(id, updateData) {
    try {
      const { name, email, phone, date, time, service, notes, status } = updateData;
      
      const [result] = await promisePool.query(
        `UPDATE appointments 
         SET name = ?, email = ?, phone = ?, 
             appointment_date = ?, appointment_time = ?, 
             service = ?, notes = ?, status = ?
         WHERE id = ?`,
        [name, email, phone, date, time, service, notes, status, id]
      );
      
      if (result.affectedRows === 0) {
        throw new Error('Appointment not found');
      }
      
      return { id, ...updateData };
    } catch (error) {
      throw new Error(`Error updating appointment: ${error.message}`);
    }
  }

  static async updateStatus(id, status) {
    try {
      const [result] = await promisePool.query(
        'UPDATE appointments SET status = ? WHERE id = ?',
        [status, id]
      );
      
      if (result.affectedRows === 0) {
        throw new Error('Appointment not found');
      }
      
      return { id, status };
    } catch (error) {
      throw new Error(`Error updating appointment status: ${error.message}`);
    }
  }

  static async delete(id) {
    try {
      const [result] = await promisePool.query(
        'DELETE FROM appointments WHERE id = ?',
        [id]
      );
      
      if (result.affectedRows === 0) {
        throw new Error('Appointment not found');
      }
      
      return true;
    } catch (error) {
      throw new Error(`Error deleting appointment: ${error.message}`);
    }
  }

  static async countByStatus(status) {
    try {
      const [rows] = await promisePool.query(
        'SELECT COUNT(*) as count FROM appointments WHERE status = ?',
        [status]
      );
      return rows[0].count;
    } catch (error) {
      throw new Error(`Error counting appointments: ${error.message}`);
    }
  }

  static async findUpcoming() {
    try {
      const [rows] = await promisePool.query(
        `SELECT * FROM appointments 
         WHERE appointment_date >= CURDATE() 
         ORDER BY appointment_date, appointment_time 
         LIMIT 10`
      );
      return rows;
    } catch (error) {
      throw new Error(`Error fetching upcoming appointments: ${error.message}`);
    }
  }
}

module.exports = Appointment;