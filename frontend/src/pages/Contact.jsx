import React, { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    alert("Message sent successfully!");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-10">
      <div className="w-11/12 lg:w-4/5 flex flex-col lg:flex-row bg-white shadow-lg overflow-hidden">
        {/* ======== LEFT: CONTACT FORM ======== */}
        <div className="lg:w-1/2 p-10">
          <div className='h-[5rem] flex flex-row items-center gap-2'>
            <h1 className='text-3xl font-semibold'>Contact Us</h1>
            <hr className='w-[50px] border-none h-[2px] bg-gray-700' />
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            <textarea
              name="message"
              placeholder="Message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={5}
              className="border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            <button
              type="submit"
              className="bg-pink-500 text-white py-2 px-4 hover:bg-pink-600 transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* ======== RIGHT: CONTACT INFO ======== */}
        <div className="lg:w-1/2 bg-pink-50 p-10 flex flex-col justify-center gap-6">
          <h3 className="text-2xl font-semibold mb-4">Get in Touch</h3>
          <div>
            <p className="font-medium">Address:</p>
            <p>Sikar(Rajasthan), India</p>
          </div>
          <div>
            <p className="font-medium">Phone:</p>
            <p>+91 93______</p>
          </div>
          <div>
            <p className="font-medium">Email:</p>
            <p>jaisaini4a@gmail.com</p>
          </div>
          <div>
            <p className="font-medium">More Info:</p>
            <p>We are open Monday to Saturday, 10:00 AM - 7:00 PM</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
